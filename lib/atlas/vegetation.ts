import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { fbm, height, noise, places, riverX, seeded } from './terrain';

// Small alpha-tested leaf clusters give the trees an irregular, light-catching silhouette.
// The textures are procedural material masks; the trees remain volumetric geometry.
function foliageTexture(pine:boolean) {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const ctx=canvas.getContext('2d')!,rand=seeded(pine?68:29);
  ctx.clearRect(0,0,256,256);
  if(pine){
    ctx.strokeStyle='#a0ae85';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(128,246);ctx.bezierCurveTo(130,165,118,90,128,12);ctx.stroke();
    for(let i=0;i<24;i++){
      const y=25+i*8.5,spread=10+i*3.2;
      for(const side of [-1,1]){
        const ex=128+side*spread,ey=y+15;ctx.strokeStyle='#b5bea0';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(128,y+11);ctx.lineTo(ex,ey);ctx.stroke();
        for(let j=0;j<14;j++){
          const t=j/14,x=128+side*spread*t,yy=y+11+4*t;
          ctx.strokeStyle=`rgb(${145+rand()*70},${157+rand()*65},${130+rand()*62})`;
          ctx.lineWidth=1.1+rand();ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+side*(8+rand()*9),yy-8-rand()*12);ctx.stroke();
          ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+side*(5+rand()*6),yy+6+rand()*8);ctx.stroke();
        }
      }
    }
  }else{
    for(let i=0;i<145;i++){
      const a=rand()*Math.PI*2,r=Math.sqrt(rand())*98,x=128+Math.cos(a)*r,y=128+Math.sin(a)*r*.83;
      const c=155+rand()*95;ctx.fillStyle=`rgb(${c*.94},${c},${c*.83})`;ctx.save();ctx.translate(x,y);ctx.rotate(a+rand());
      ctx.beginPath();ctx.ellipse(0,0,4+rand()*4,7+rand()*7,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#d4dbc177';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(0,6);ctx.stroke();ctx.restore();
    }
  }
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}
function pineGeometry(){
  const parts:THREE.BufferGeometry[]=[];
  for(let tier=0;tier<7;tier++){
    const y=.9+tier*.44,r=1.12-tier*.127;
    for(let branch=0;branch<5;branch++){
      const angle=branch*Math.PI*2/5+tier*2.4;
      const plane=new THREE.PlaneGeometry(r*1.12,r*1.9,1,2);plane.translate(0,r*.66,0);
      plane.rotateX(-Math.PI*.37);plane.rotateY(angle);plane.translate(0,y,0);parts.push(plane);
    }
  }
  const result=mergeGeometries(parts)!;parts.forEach(p=>p.dispose());return result;
}
function oakGeometry(){
  const parts:THREE.BufferGeometry[]=[],rand=seeded(849);
  for(let i=0;i<18;i++){
    const angle=i*2.4,r=.2+rand()*.9,plane=new THREE.PlaneGeometry(1.6,1.45);
    plane.rotateX((rand()-.5)*Math.PI);plane.rotateY(angle);plane.rotateZ((rand()-.5)*.6);
    plane.translate(Math.cos(angle)*r,2+rand()*1.45,Math.sin(angle)*r);parts.push(plane);
  }
  const result=mergeGeometries(parts)!;parts.forEach(p=>p.dispose());return result;
}
export function createVegetation(scene:THREE.Scene,mobile:boolean,roadCurve:THREE.CatmullRomCurve3) {
  const rand=seeded(117),color=new THREE.Color(),dummy=new THREE.Object3D();
  const road=roadCurve.getPoints(250);
  const sites:{x:number;z:number;h:number;s:number;pine:boolean;autumn:boolean}[]=[];
  for(let attempt=0;attempt<(mobile?15500:24500);attempt++){
    const x=-164+rand()*335,z=-142+rand()*275,h=height(x,z),cluster=fbm(x*.045,z*.045);
    if(cluster<.44||rand()>.77||h>31||Math.abs(x-riverX(z))<2.7)continue;
    if(places.some(p=>Math.hypot(x-p.x,z-p.z)<(p.id==='bree'?10.5:p.id==='rivendell'?7.7:5.5)))continue;
    if(Math.hypot(height(x+1,z)-height(x-1,z),height(x,z+1)-height(x,z-1))>2.35)continue;
    if(road.some(p=>(x-p.x)**2+(z-p.z)**2<1.65))continue;
    if(x<15&&z>0&&cluster<.58&&rand()>.24)continue;
    sites.push({x,z,h,s:.67+rand()*.9,pine:h>18||z<-58||rand()<.18,autumn:x>48&&x<99&&z>-53&&z<33});
  }
  const pineMap=foliageTexture(true),oakMap=foliageTexture(false),wind={value:0};
  const makeMaterial=(map:THREE.Texture)=>{
    const material=new THREE.MeshStandardMaterial({map,alphaTest:.38,roughness:.92,side:THREE.DoubleSide,color:'#ffffff'});
    material.alphaToCoverage=true;
    material.onBeforeCompile=shader=>{
      shader.uniforms.uWind=wind;
      shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nuniform float uWind;').replace('#include <begin_vertex>',`#include <begin_vertex>
        float sway=sin(uWind*.68+instanceMatrix[3].x*.21+instanceMatrix[3].z*.13+position.y*.9);
        transformed.x+=sway*.045*max(0.,position.y-.7);
      `);
      shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
        reflectedLight.indirectDiffuse += diffuseColor.rgb * .045;
      `);
    };return material;
  };
  const pineMat=makeMaterial(pineMap),oakMat=makeMaterial(oakMap);pineMat.alphaTest=.24;oakMat.alphaTest=.3;
  const trunkMat=new THREE.MeshStandardMaterial({color:'#584632',roughness:1});
  const trunkGeo=new THREE.CylinderGeometry(.045,.13,3.4,5);trunkGeo.translate(0,1.7,0);
  const trunks=new THREE.InstancedMesh(trunkGeo,trunkMat,sites.length);
  sites.forEach((t,i)=>{dummy.position.set(t.x,t.h-.06,t.z);dummy.scale.setScalar(t.s);dummy.rotation.set(0,rand()*6.28,0);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);});
  trunks.castShadow=true;trunks.receiveShadow=true;scene.add(trunks);
  const foliage:THREE.InstancedMesh[]=[];
  for(const pine of [true,false]){
    const selected=sites.filter(t=>t.pine===pine),mesh=new THREE.InstancedMesh(pine?pineGeometry():oakGeometry(),pine?pineMat:oakMat,selected.length);
    selected.forEach((t,i)=>{
      dummy.position.set(t.x,t.h,t.z);dummy.rotation.set((rand()-.5)*.1,rand()*6.28,(rand()-.5)*.1);dummy.scale.set(t.s,t.s*(.86+rand()*.35),t.s);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
      if(t.autumn)color.set('#9b772c').lerp(new THREE.Color('#d6ad4b'),rand()*.8);
      else color.set(pine?'#365643':'#4d6a39').lerp(new THREE.Color(pine?'#627253':'#829350'),rand()*.75);
      color.multiplyScalar(.82+rand()*.3);mesh.setColorAt(i,color);
    });
    mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.excludeAO=true;scene.add(mesh);foliage.push(mesh);
  }
  // A low understorey fills the edges of the woods, leaving roads and clearings open.
  const shrubGeo=oakGeometry();shrubGeo.scale(.32,.25,.32);
  const shrubSites=sites.filter((_,i)=>i%4===0),shrubs=new THREE.InstancedMesh(shrubGeo,oakMat,shrubSites.length);
  shrubSites.forEach((t,i)=>{dummy.position.set(t.x+1,t.h,t.z+.7);dummy.scale.setScalar(.8+noise(t.x,t.z)*.8);dummy.rotation.set(0,rand()*6.28,0);dummy.updateMatrix();shrubs.setMatrixAt(i,dummy.matrix);shrubs.setColorAt(i,new THREE.Color(t.autumn?'#92733d':'#627341'));});
  shrubs.receiveShadow=true;shrubs.userData.excludeAO=true;scene.add(shrubs);foliage.push(shrubs);
  return {foliage,update:(time:number)=>{wind.value=time;},dispose:()=>{pineMap.dispose();oakMap.dispose();},treeCount:sites.length};
}
