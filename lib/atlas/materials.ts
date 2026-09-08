import { assetPath } from './asset-path';
import * as THREE from 'three';
export async function loadSurfaceTextures(){
  const loader=new THREE.TextureLoader();
  const [meadow,cliff]=await Promise.all([loader.loadAsync(assetPath('/textures/highland-meadow.jpg')),loader.loadAsync(assetPath('/textures/weathered-cliff.jpg'))]);
  for(const t of [meadow,cliff]){t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;}
  return {meadow,cliff};
}
const commonNoise=`
  float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float grainNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);}
`;
export function terrainMaterial(textures:{meadow:THREE.Texture;cliff:THREE.Texture}){
  const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.96});
  material.onBeforeCompile=shader=>{
    shader.uniforms.uMeadow={value:textures.meadow};shader.uniforms.uCliff={value:textures.cliff};
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vTerrain; varying vec3 vTerrainNormal;').replace('#include <begin_vertex>','#include <begin_vertex>\nvTerrain=position;vTerrainNormal=normal;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
      varying vec3 vTerrain; varying vec3 vTerrainNormal;
      uniform sampler2D uMeadow; uniform sampler2D uCliff;
      ${commonNoise}
      vec3 stoneSample(vec2 uv){return mix(texture2D(uCliff,uv).rgb,texture2D(uCliff,uv*.73+vec2(.37,.62)).rgb,.35);}
    `).replace('#include <color_fragment>',`#include <color_fragment>
      vec3 terrainN=normalize(vTerrainNormal);
      vec3 weights=pow(abs(terrainN),vec3(4.));weights/=max(dot(weights,vec3(1.)),.0001);
      vec3 grass=mix(texture2D(uMeadow,vTerrain.xz*.19).rgb,texture2D(uMeadow,vTerrain.xz*.073+vec2(.31,.67)).rgb,.27);
      vec3 stone=stoneSample(vTerrain.zy*.11)*weights.x+stoneSample(vTerrain.xz*.095)*weights.y+stoneSample(vTerrain.xy*.11)*weights.z;
      float cliff=smoothstep(.19,.62,1.-abs(terrainN.y))*smoothstep(8.,20.,vTerrain.y);
      cliff=max(cliff,smoothstep(24.,44.,vTerrain.y)*.75);
      float snow=smoothstep(43.,57.,vTerrain.y+grainNoise(vTerrain.xz*.35)*5.)*smoothstep(.32,.83,terrainN.y);
      vec3 surface=mix(vec3(.57)+grass*3.7,vec3(.32)+stone*2.4,cliff);
      diffuseColor.rgb*=mix(surface,vec3(1.15),snow);
      float shade=grainNoise(vTerrain.xz*.035+vec2(8.4,4.2));
      diffuseColor.rgb*=.85+.23*smoothstep(.2,.75,shade);
      float detailHeight=mix(dot(grass,vec3(.333)),dot(stone,vec3(.333)),cliff);
    `).replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
      vec3 surfacePosition=-vViewPosition;
      vec3 q0=dFdx(surfacePosition),q1=dFdy(surfacePosition);
      vec3 r1=cross(q1,normal),r2=cross(normal,q0);
      float det=dot(q0,r1);
      vec3 gradient=sign(det)*(dFdx(detailHeight)*r1+dFdy(detailHeight)*r2);
      normal=normalize(max(abs(det),.000001)*normal-gradient*mix(.095,.27,cliff));
    `);
  };return material;
}
export function weatherStone(material:THREE.MeshStandardMaterial,texture:THREE.Texture){
  material.onBeforeCompile=shader=>{
    shader.uniforms.uMasonry={value:texture};
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vMasonry; varying vec3 vMasonryNormal;').replace('#include <begin_vertex>','#include <begin_vertex>\nvMasonry=position;vMasonryNormal=normal;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vMasonry;varying vec3 vMasonryNormal;uniform sampler2D uMasonry;').replace('#include <color_fragment>',`#include <color_fragment>
      vec3 w=pow(abs(normalize(vMasonryNormal)),vec3(4.));w/=max(dot(w,vec3(1.)),.0001);
      vec3 masonry=texture2D(uMasonry,vMasonry.zy*.5).rgb*w.x+texture2D(uMasonry,vMasonry.xz*.5).rgb*w.y+texture2D(uMasonry,vMasonry.xy*.5).rgb*w.z;
      diffuseColor.rgb*=.59+masonry*1.75;
    `);
  };return material;
}
