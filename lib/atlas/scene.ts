import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createVegetation } from './vegetation';
import { createAtmosphere } from './atmosphere';
import { loadSurfaceTextures, terrainMaterial, weatherStone } from './materials';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { clamp, fbm, height, noise, places, riverX, riverY, seeded, smooth, type LightMode, type PlaceId } from './terrain';

export type AtlasScene = { focus:(id:PlaceId)=>void; overview:()=>void; lighting:(mode:LightMode)=>void; showRoute:(visible:boolean)=>void; zoom:(factor:number)=>void; center:()=>void; dispose:()=>void };
export async function createAtlasScene(container:HTMLDivElement, labels:(HTMLButtonElement|null)[], compass:SVGSVGElement|null):Promise<AtlasScene> {
  const textures=await loadSurfaceTextures();
  const mobile=container.clientWidth<650, reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,mobile?1.5:1.8));
  renderer.setSize(container.clientWidth,container.clientHeight);
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.03;
  renderer.domElement.setAttribute('aria-label','3D terrain of Eriador. Drag to orbit, scroll to zoom, or use the named place buttons.');
  renderer.domElement.setAttribute('role','img');
  container.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color('#d0d9c9');scene.fog=new THREE.Fog('#d0d9c9',165,465);
  const camera=new THREE.PerspectiveCamera(mobile?50:37,container.clientWidth/container.clientHeight,.3,800);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.065;controls.minDistance=24;controls.maxDistance=350;
  controls.maxPolarAngle=Math.PI*.395;controls.minPolarAngle=.3;controls.panSpeed=.75;controls.rotateSpeed=.45;controls.zoomSpeed=.8;
  controls.screenSpacePanning=false;
  const sun=new THREE.DirectionalLight('#ffedc5',3.45);sun.position.set(-95,110,65);sun.castShadow=true;
  sun.shadow.mapSize.set(mobile?2048:4096,mobile?2048:4096);
  Object.assign(sun.shadow.camera,{left:-185,right:185,top:165,bottom:-165,near:1,far:450});
  sun.shadow.bias=-.0002;sun.shadow.normalBias=.18;sun.shadow.radius=3;scene.add(sun);
  const ambient=new THREE.HemisphereLight('#b7d4df','#394537',1.15);scene.add(ambient);
  const bounce=new THREE.DirectionalLight('#c1d0c4',.45);bounce.position.set(70,50,-100);scene.add(bounce);
  const random=seeded(117), color=new THREE.Color();
  const landGeo=new THREE.PlaneGeometry(440,370,mobile?360:500,mobile?303:420);landGeo.rotateX(-Math.PI/2);
  const positions=landGeo.attributes.position, colors=new Float32Array(positions.count*3);
  for(let i=0;i<positions.count;i++) {
    const x=positions.getX(i),z=positions.getZ(i),h=height(x,z);positions.setY(i,h);
    const slope=Math.hypot(height(x+.5,z)-height(x-.5,z),height(x,z+.5)-height(x,z-.5));
    const lush=fbm(x*.055+23,z*.055+19);
    color.set('#668045').lerp(new THREE.Color('#a2a360'),smooth(.3,.75,lush)*.54);
    color.lerp(new THREE.Color('#566647'),smooth(9,27,h)*.3);
    const rock=smooth(.65,1.7,slope)*smooth(11,26,h);
    color.lerp(new THREE.Color('#8d989b'),rock*.9);
    color.lerp(new THREE.Color('#c4c4ae'),smooth(30,46,h)*.5);
    color.lerp(new THREE.Color('#e0e2d4'),smooth(43,53,h+noise(x*.28,z*.28)*7));
    color.multiplyScalar(.89+noise(x*.8,z*.8)*.2);
    colors[i*3]=color.r;colors[i*3+1]=color.g;colors[i*3+2]=color.b;
  }
  landGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));landGeo.computeVertexNormals();
  const landMat=terrainMaterial(textures);
  const land=new THREE.Mesh(landGeo,landMat);land.receiveShadow=true;scene.add(land);

  // A continuous river ribbon follows the valley carved into the same height field.
  const waterPositions:number[]=[],waterIndices:number[]=[];
  for(let i=0;i<=420;i++) {
    const z=-185+i*370/420,x=riverX(z),w=1.55+.5*noise(z*.08,3),y=riverY(z);
    waterPositions.push(x-w,y,z,x+w,y,z);
    if(i<420){const a=i*2;waterIndices.push(a,a+1,a+2,a+1,a+3,a+2);}
  }
  const waterGeo=new THREE.BufferGeometry();waterGeo.setAttribute('position',new THREE.Float32BufferAttribute(waterPositions,3));waterGeo.setIndex(waterIndices);waterGeo.computeVertexNormals();
  const waterTime={value:0};
  const waterMat=new THREE.MeshStandardMaterial({color:'#397d7b',roughness:.18,metalness:.25,transparent:true,opacity:.95,side:THREE.DoubleSide});
  waterMat.onBeforeCompile=shader=>{
    shader.uniforms.uTime=waterTime;
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWater;').replace('#include <begin_vertex>','#include <begin_vertex>\nvWater=position;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform float uTime;varying vec3 vWater;').replace('#include <color_fragment>',`#include <color_fragment>
      float wave=sin(vWater.z*4.+sin(vWater.x*2.3)+uTime*.8)*sin(vWater.x*8.+vWater.z*1.4-uTime*.5);
      float current=sin(vWater.z*1.7-uTime*1.6+sin(vWater.x*4.));
      diffuseColor.rgb+=vec3(.11,.17,.17)*pow(max(0.,wave),7.);
      diffuseColor.rgb+=vec3(.045,.075,.07)*pow(max(0.,current),15.);
    `);
  };
  scene.add(new THREE.Mesh(waterGeo,waterMat));

  const roadPoints=[[-115,36],[-87,24],[-68,17],[-47,19],[-26,15],[-5,24],[19,24],[42,15],[58,6],[68,-8],[80,-20]];
  const roadCurve=new THREE.CatmullRomCurve3(roadPoints.map(([x,z])=>new THREE.Vector3(x,0,z)));
  const roadPos:number[]=[],roadIdx:number[]=[],routePoints:THREE.Vector3[]=[];
  for(let i=0;i<=800;i++){
    const t=i/800,p=roadCurve.getPoint(t),tangent=roadCurve.getTangent(t),width=.42;
    for(const side of [-1,1]){const x=p.x+tangent.z*width*side,z=p.z-tangent.x*width*side;roadPos.push(x,height(x,z)+.075,z);}
    routePoints.push(new THREE.Vector3(p.x,height(p.x,p.z)+.32,p.z));
    if(i<800){const a=i*2;roadIdx.push(a,a+2,a+1,a+1,a+2,a+3);}
  }
  const roadGeo=new THREE.BufferGeometry();roadGeo.setAttribute('position',new THREE.Float32BufferAttribute(roadPos,3));roadGeo.setIndex(roadIdx);roadGeo.computeVertexNormals();
  const roadMat=new THREE.MeshStandardMaterial({color:'#b5a278',roughness:1,side:THREE.DoubleSide});
  const road=new THREE.Mesh(roadGeo,roadMat);road.receiveShadow=true;scene.add(road);
  const routeGeo=new THREE.BufferGeometry().setFromPoints(routePoints.slice(104));
  const routeMat=new THREE.LineDashedMaterial({color:'#e9c776',dashSize:.65,gapSize:.65,transparent:true,opacity:.88,depthTest:true});
  const routeLine=new THREE.Line(routeGeo,routeMat);routeLine.computeLineDistances();scene.add(routeLine);

  const vegetation=createVegetation(scene,mobile,roadCurve);

  // All architecture is original, built here and merged by material.
  const stone=weatherStone(new THREE.MeshStandardMaterial({color:'#a7aa99',roughness:.93}),textures.cliff);
  const lightStone=weatherStone(new THREE.MeshStandardMaterial({color:'#e6dfc5',roughness:.85}),textures.cliff);
  const plaster=new THREE.MeshStandardMaterial({color:'#d1bb89',roughness:1});
  const timber=new THREE.MeshStandardMaterial({color:'#534b34',roughness:1});
  const roof=new THREE.MeshStandardMaterial({color:'#665e46',roughness:1});
  const elvenRoof=new THREE.MeshStandardMaterial({color:'#758766',roughness:.73,metalness:.05});
  const gold=new THREE.MeshStandardMaterial({color:'#b1a067',roughness:.5,metalness:.3});
  const windows=new THREE.MeshStandardMaterial({color:'#f4cc77',emissive:'#db973d',emissiveIntensity:.55,roughness:.6});
  const batches=new Map<THREE.Material,THREE.BufferGeometry[]>();
  function part(geometry:THREE.BufferGeometry,material:THREE.Material,x:number,y:number,z:number,rx=0,ry=0,rz=0){
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.rotation.set(rx,ry,rz);mesh.updateMatrix();geometry.applyMatrix4(mesh.matrix);
    const normalized=geometry.index?geometry.toNonIndexed():geometry;
    if(normalized!==geometry)geometry.dispose();
    if(!batches.has(material))batches.set(material,[]);batches.get(material)!.push(normalized);
  }
  function box(w:number,h:number,d:number,mat:THREE.Material,x:number,y:number,z:number,ry=0){part(new THREE.BoxGeometry(w,h,d),mat,x,y,z,0,ry);}
  function cylinder(rt:number,rb:number,h:number,mat:THREE.Material,x:number,y:number,z:number,n=12){part(new THREE.CylinderGeometry(rt,rb,h,n),mat,x,y,z);}
  function beam(start:THREE.Vector3,end:THREE.Vector3,radius:number,mat:THREE.Material){const delta=end.clone().sub(start),geo=new THREE.CylinderGeometry(radius,radius,delta.length(),6);const rotation=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());geo.applyQuaternion(rotation);const middle=start.clone().add(end).multiplyScalar(.5);part(geo,mat,middle.x,middle.y,middle.z);}
  function gable(w:number,h:number,d:number,mat:THREE.Material,x:number,y:number,z:number,ry=0){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(0,h);s.lineTo(w/2,0);s.closePath();const geo=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,steps:1});geo.translate(0,0,-d/2);part(geo,mat,x,y,z,0,ry);}
  function arch(w:number,h:number,thick:number,depth:number,mat:THREE.Material,x:number,y:number,z:number,ry=0){
    const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(-w/2,h-w/2);s.absarc(0,h-w/2,w/2,Math.PI,0,true);s.lineTo(w/2,0);s.lineTo(w/2-thick,0);s.lineTo(w/2-thick,h-w/2);s.absarc(0,h-w/2,w/2-thick,0,Math.PI,false);s.lineTo(-w/2+thick,0);s.closePath();const geo=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:12});geo.translate(0,0,-depth/2);part(geo,mat,x,y,z,0,ry);
  }
  function house(x:number,z:number,s:number,angle:number,inn=false){
    const y=height(x,z),w=1.7*s,d=2.3*s,h=1.45*s;
    box(w,h,d,plaster,x,y+h/2,z,angle);gable(w*1.14,s,d*1.13,roof,x,y+h,z,angle);
    const local=(dx:number,dz:number)=>[x+Math.cos(angle)*dx+Math.sin(angle)*dz,z-Math.sin(angle)*dx+Math.cos(angle)*dz];
    for(const dx of [-w*.43,0,w*.43]){const [a,b]=local(dx,d*.505);box(.095*s,h,.07*s,timber,a,y+h/2,b,angle);}
    for(const dy of [.16,h*.62,h-.07]){const [a,b]=local(0,d*.507);box(w,.085*s,.07*s,timber,a,y+dy,b,angle);}
    for(const dx of [-w*.23,w*.23]){const[a,b]=local(dx,d*.52);box(.24*s,.34*s,.035*s,windows,a,y+h*.73,b,angle);}
    const [doorX,doorZ]=local(0,d*.525);box(.35*s,.73*s,.05*s,timber,doorX,y+.36*s,doorZ,angle);
    for(const side of [-1,1]){
      const [a,b]=local(side*w*.4,d*.525),[c,e]=local(0,d*.525);
      beam(new THREE.Vector3(a,y+h+.04,b),new THREE.Vector3(c,y+h+s*.9,e),.035*s,timber);
      const [u,v]=local(side*w*.505,0);box(.05*s,.42*s,.36*s,windows,u,y+h*.64,v,angle);
    }
    const [stepX,stepZ]=local(0,d*.65);box(.68*s,.13*s,.4*s,stone,stepX,y+.05,stepZ,angle);
    const[a,b]=local(-w*.29,0);box(.32*s,1.1*s,.4*s,stone,a,y+h+.6*s,b,angle);
    if(inn){const[a,b]=local(w*.65,d*.48);box(.075*s,1.8*s,.075*s,timber,a,y+1.1*s,b);box(.55*s,.4*s,.07*s,gold,a-.2*s,y+1.7*s,b);}
  }
  // Bree: irregular lanes, a larger inn, a low defensive ring.
  for(let i=0;i<24;i++){const a=i*2.39996,r=2.4+Math.sqrt(i/24)*5.3;house(-87+Math.cos(a)*r,24+Math.sin(a)*r,.58+random()*.42,Math.atan2(Math.cos(a),Math.sin(a))+.25);}
  house(-87,24,1.65,.18,true);
  for(let i=0;i<52;i++){const a=i/52*Math.PI*2;if(i===10||i===11||i===35||i===36)continue;const x=-87+Math.cos(a)*9.2,z=24+Math.sin(a)*9.2;box(1.13,.72,.5,stone,x,height(x,z)+.36,z,-a+Math.PI/2);}
  // Amon Sûl: a broken crown, with a stair and scattered masonry.
  const wx=-24,wz=-7,wy=23.7;
  cylinder(3.25,3.6,.6,stone,wx,wy+.05,wz,32);
  cylinder(2.85,3.12,.25,lightStone,wx,wy+.42,wz,32);
  for(let i=0;i<23;i++){if(i===5||i===6||i===15)continue;const a=i/23*Math.PI*2,x=wx+Math.cos(a)*2.72,z=wz+Math.sin(a)*2.72,h=.6+random()*1.25;box(.73,h,.56,stone,x,wy+.5+h/2,z,-a+Math.PI/2);if(i%3===0){cylinder(.24,.31,h+1.3,lightStone,x,wy+.5+(h+1.3)/2,z,8);box(.65,.2,.66,stone,x,wy+h+1.9,z,a);}}
  for(let i=0;i<7;i++)box(1.15,.2,1.0,stone,wx,wy+.45-i*.24,wz+3.0+i*.44);
  for(let i=0;i<16;i++){const a=random()*6.28,r=1+random()*3;part(new THREE.DodecahedronGeometry(.18+random()*.28,0),stone,wx+Math.cos(a)*r,wy+.62,wz+Math.sin(a)*r,random(),random());}
  arch(1.7,2.6,.28,.48,stone,wx-1.6,wy+.5,wz-1.5,-.55);
  for(let i=0;i<26;i++){const a=random()*6.28,r=3+random()*5,x=wx+Math.cos(a)*r,z=wz+Math.sin(a)*r;box(.3+random()*.5,.16+random()*.3,.25+random()*.4,stone,x,height(x,z)+.12,z,a);}
  part(new THREE.CylinderGeometry(.24,.3,2.1,8),lightStone,wx+1.1,wy+.79,wz+.3,0,0,Math.PI*.49);
  // Rivendell: elevated terraces, slender galleries, copper-green roofs and a river bridge.
  const rx=80,rz=-20,ry=10.3;
  cylinder(6.4,7.3,1.1,stone,rx,ry-.35,rz,9);cylinder(5.8,6.5,.35,lightStone,rx,ry+.35,rz,9);
  function pavilion(x:number,z:number,s:number,tall=false){
    const y=ry+.55,h=(tall?4.4:2.1)*s;
    cylinder(1.4*s,1.6*s,.4*s,lightStone,x,y,z,8);
    for(let k=0;k<8;k++){const a=k/8*Math.PI*2; cylinder(.075*s,.105*s,h,lightStone,x+Math.cos(a)*1.15*s,y+h/2,z+Math.sin(a)*1.15*s,7);}
    cylinder(1.6*s,1.6*s,.18*s,lightStone,x,y+h,z,8);
    const profile=[new THREE.Vector2(1.95*s,0),new THREE.Vector2(1.58*s,.19*s),new THREE.Vector2(.95*s,.65*s),new THREE.Vector2(.38*s,1.28*s),new THREE.Vector2(.08*s,1.95*s)];
    part(new THREE.LatheGeometry(profile,16),elvenRoof,x,y+h+.05*s,z);
    cylinder(.025*s,.085*s,1.1*s,gold,x,y+h+2.15*s,z,6);
    cylinder(.55*s,.55*s,h*.65,plaster,x,y+h*.34,z,8);
    for(let k=0;k<8;k++){const a=k/8*Math.PI*2;arch(.68*s,1.2*s,.065*s,.1*s,lightStone,x+Math.cos(a)*1.12*s,y+h-1.21*s,z+Math.sin(a)*1.12*s,-a+Math.PI/2);}
    cylinder(1.58*s,1.58*s,.075*s,gold,x,y+h+.07*s,z,16);
  }
  pavilion(81,-23,1.4,true);pavilion(76,-20,.9);pavilion(82,-16,.8);pavilion(85,-21,.8,true);
  box(6.0,1.9,2,lightStone,80,ry+1.5,-19);gable(2.3,1.3,6.6,elvenRoof,80,ry+2.5,-19,Math.PI/2);
  for(let i=0;i<7;i++)arch(.55,1.6,.075,.14,gold,77.5+i*.82,ry+.55,-17.97);
  for(let i=0;i<6;i++){box(.3,.68,.04,windows,77.8+i*.83,ry+1.45,-17.91);}
  for(const side of [-1,1]){for(let i=0;i<13;i++)cylinder(.035,.045,.62,lightStone,rx-5.3+i*.83,ry+.9,rz+side*4.6,6);box(10.9,.085,.11,gold,rx-.2,ry+1.24,rz+side*4.6);}
  for(let i=0;i<10;i++)box(2.5,.22,.65,lightStone,75.8-i*.42,ry+.43-i*.23,-19.5);
  const bx=riverX(-19.5),bz=-19.5,by=riverY(bz);
  arch(7.4,3.8,.6,1.45,lightStone,bx,by-.25,bz);box(8.7,.3,1.65,lightStone,bx,by+3.7,bz);
  for(const side of [-1,1]){box(8.7,.18,.12,gold,bx,by+4.33,bz+side*.72);for(let i=0;i<14;i++)box(.07,.6,.07,lightStone,bx-4.15+i*.64,by+4,bz+side*.72);}
  for(let i=0;i<9;i++)box(1.3,.2,1.62,stone,bx-4.35-i*.52,by+3.6-i*.25,bz);
  // River boulders and high outcrops catch the low sun.
  for(let i=0;i<180;i++){const z=-120+random()*245,x=riverX(z)+(random()<.5?-1:1)*(2.0+random()*2),s=.25+random()*.65;part(new THREE.DodecahedronGeometry(s,0),stone,x,height(x,z)+s*.3,z,random(),random(),random());}
  for(const [mat,geometries] of batches){const merged=mergeGeometries(geometries,false);if(merged){const mesh=new THREE.Mesh(merged,mat);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);}geometries.forEach(g=>g.dispose());}

  // Soft, low mist gives the valley depth without obscuring the map.
  const fogCanvas=document.createElement('canvas');fogCanvas.width=fogCanvas.height=128;
  const ctx=fogCanvas.getContext('2d')!;const gradient=ctx.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(234,238,218,.28)');gradient.addColorStop(.5,'rgba(234,238,218,.11)');gradient.addColorStop(1,'rgba(234,238,218,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const fogTexture=new THREE.CanvasTexture(fogCanvas),mistMat=new THREE.SpriteMaterial({map:fogTexture,transparent:true,opacity:.52,depthWrite:false,color:'#e3e8d3'});
  const mists:THREE.Sprite[]=[];for(let i=0;i<12;i++){const sprite=new THREE.Sprite(mistMat);sprite.position.set(25+random()*90,10+random()*8,-100+random()*140);sprite.scale.set(38+random()*28,7+random()*4,1);scene.add(sprite);mists.push(sprite);}
  const atmosphere=createAtmosphere(scene,camera,renderer,mobile,vegetation.foliage);

  let animation:{from:THREE.Vector3,to:THREE.Vector3,fromTarget:THREE.Vector3,toTarget:THREE.Vector3,start:number,duration:number}|null=null;
  let detailFrame=false,frameOffset=0;
  const overviewTarget=new THREE.Vector3(3,7,-12);
  const overviewOffset=()=>container.clientWidth<650?new THREE.Vector3(10,190,235):new THREE.Vector3(27,137,180).multiplyScalar(Math.min(1.45,Math.max(1,1.45/camera.aspect)));
  function fly(target:THREE.Vector3,position:THREE.Vector3){
    if(reduced){camera.position.copy(position);controls.target.copy(target);controls.update();return;}
    animation={from:camera.position.clone(),to:position,fromTarget:controls.target.clone(),toTarget:target,start:performance.now(),duration:1700};
  }
  function overview(){
    detailFrame=false;
    const narrow=container.clientWidth<650;
    const target=overviewTarget.clone();if(narrow)target.set(-3,6,-20);
    fly(target,target.clone().add(overviewOffset()));
  }
  controls.target.copy(overviewTarget);camera.position.copy(overviewTarget).add(overviewOffset());controls.update();
  const cancelAnimation=()=>{animation=null;};controls.addEventListener('start',cancelAnimation);
  const focus=(id:PlaceId)=>{detailFrame=true;const p=places.find(p=>p.id===id)!;const target=new THREE.Vector3(p.x,height(p.x,p.z)+2,p.z);const offset=new THREE.Vector3(...p.camera);if(container.clientWidth<650)offset.multiplyScalar(1.18);fly(target,target.clone().add(offset));};
  const lighting=(mode:LightMode)=>{
    const golden=mode==='golden';sun.color.set(golden?'#ffd291':'#ffedc5');sun.intensity=golden?3.85:3.45;sun.position.set(golden?-120:-95,golden?58:110,golden?80:65);
    ambient.color.set(golden?'#c4ceda':'#b7d4df');ambient.intensity=golden?1.05:1.15;
    scene.background=new THREE.Color(golden?'#d9c7a9':'#d0d9c9');(scene.fog as THREE.Fog).color.copy(scene.background);renderer.toneMappingExposure=golden?1.02:1.03;
    windows.emissiveIntensity=golden?1.5:.55;atmosphere.lighting(golden);renderer.shadowMap.needsUpdate=true;
  };
  const resize=()=>{const w=container.clientWidth,h=container.clientHeight;camera.aspect=w/h;camera.fov=w<650?50:37;camera.updateProjectionMatrix();renderer.setSize(w,h);atmosphere.resize(w,h);};
  const observer=new ResizeObserver(resize);observer.observe(container);
  const projected=new THREE.Vector3();let raf=0,lastFrame=0,disposed=false;
  const tick=(now:number)=>{
    if(disposed)return;raf=requestAnimationFrame(tick);if(document.hidden)return;
    const dt=Math.min((now-lastFrame)/1000,.05);lastFrame=now;
    const desiredOffset=detailFrame&&container.clientWidth<650?.19:0;
    frameOffset=reduced?desiredOffset:THREE.MathUtils.damp(frameOffset,desiredOffset,5,dt);
    if(frameOffset>.001)camera.setViewOffset(container.clientWidth,container.clientHeight,0,container.clientHeight*frameOffset,container.clientWidth,container.clientHeight);
    else if(camera.view?.enabled)camera.clearViewOffset();
    if(animation){const t=clamp((now-animation.start)/animation.duration,0,1),e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;camera.position.lerpVectors(animation.from,animation.to,e);controls.target.lerpVectors(animation.fromTarget,animation.toTarget,e);if(t===1)animation=null;}
    controls.update();
    controls.target.x=clamp(controls.target.x,-125,145);controls.target.z=clamp(controls.target.z,-115,115);
    camera.position.y=Math.max(camera.position.y,height(camera.position.x,camera.position.z)+8);
    if(!reduced){waterTime.value+=dt;vegetation.update(waterTime.value);mists.forEach((m,i)=>{m.position.x+=dt*.045*(i%2?1:-1);});}
    for(let i=0;i<places.length;i++){
      const p=places[i],label=labels[i];if(!label)continue;
      projected.set(p.x,height(p.x,p.z)+(p.id==='rivendell'?10:p.id==='bree'?6:6),p.z).project(camera);
      const visible=projected.z<1&&projected.z>-1&&Math.abs(projected.x)<1.2&&Math.abs(projected.y)<1.15;
      label.style.visibility=visible?'visible':'hidden';label.style.transform=`translate(${(projected.x*.5+.5)*container.clientWidth}px,${(-projected.y*.5+.5)*container.clientHeight}px) translate(-50%,-100%)`;
    }
    if(compass)compass.style.transform=`rotate(${-controls.getAzimuthalAngle()*180/Math.PI}deg)`;
    atmosphere.render();
  };
  atmosphere.render();raf=requestAnimationFrame(tick);
  return {focus,overview,lighting,center:()=>{detailFrame=false;},showRoute:v=>{routeLine.visible=v;},zoom:factor=>{animation=null;const offset=camera.position.clone().sub(controls.target);offset.setLength(clamp(offset.length()*factor,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);controls.update();},dispose:()=>{
    disposed=true;cancelAnimationFrame(raf);observer.disconnect();controls.removeEventListener('start',cancelAnimation);controls.dispose();atmosphere.dispose();
    const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();scene.traverse(obj=>{if(obj instanceof THREE.Mesh||obj instanceof THREE.Line||obj instanceof THREE.Sprite){if('geometry'in obj)geometries.add(obj.geometry);(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());vegetation.dispose();textures.meadow.dispose();textures.cliff.dispose();fogTexture.dispose();sun.shadow.map?.dispose();renderer.dispose();renderer.domElement.remove();
  }};
}
