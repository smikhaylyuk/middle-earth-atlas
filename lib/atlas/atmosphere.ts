import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export function createAtmosphere(scene:THREE.Scene,camera:THREE.PerspectiveCamera,renderer:THREE.WebGLRenderer,mobile:boolean,excludeAO:THREE.Object3D[]){
  const skyUniforms={uZenith:{value:new THREE.Color('#749da8')},uHorizon:{value:new THREE.Color('#dce0c9')},uSun:{value:new THREE.Vector3(-.7,.55,.3).normalize()},uWarm:{value:0}};
  const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:skyUniforms,vertexShader:'varying vec3 vSky;void main(){vSky=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`
    varying vec3 vSky;uniform vec3 uZenith,uHorizon,uSun;uniform float uWarm;
    void main(){vec3 direction=normalize(vSky);float elevation=max(direction.y,0.);vec3 col=mix(uHorizon,uZenith,pow(elevation,.45));float sun=max(0.,dot(direction,uSun));col+=vec3(1.,.65,.28)*pow(sun,18.)*(.035+uWarm*.08);gl_FragColor=vec4(col,1.);}
  `});
  const sky=new THREE.Mesh(new THREE.SphereGeometry(650,24,12),skyMat);sky.renderOrder=-10;sky.userData.excludeAO=true;scene.add(sky);
  const size=renderer.getSize(new THREE.Vector2());
  const target=new THREE.WebGLRenderTarget(size.x*renderer.getPixelRatio(),size.y*renderer.getPixelRatio(),{type:THREE.HalfFloatType,samples:mobile?2:4});
  const composer=new EffectComposer(renderer,target),renderPass=new RenderPass(scene,camera);
  composer.addPass(renderPass);
  const ao=new SSAOPass(scene,camera,size.x,size.y,mobile?12:20);ao.kernelRadius=2.5;ao.minDistance=.0008;ao.maxDistance=.018;
  const hidden=[sky,...excludeAO];const renderAO=ao.render.bind(ao);
  ao.render=(r,w,b,dt,mask)=>{const visibility=hidden.map(o=>o.visible);hidden.forEach(o=>{o.visible=false;});try{renderAO(r,w,b,dt,mask);}finally{hidden.forEach((o,i)=>{o.visible=visibility[i];});}};
  composer.addPass(ao);
  const grade=new ShaderPass({uniforms:{tDiffuse:{value:null},uWarm:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`
    uniform sampler2D tDiffuse;uniform float uWarm;varying vec2 vUv;
    void main(){vec3 col=texture2D(tDiffuse,vUv).rgb;float lum=dot(col,vec3(.2126,.7152,.0722));col=mix(vec3(lum),col,1.035);col*=mix(vec3(.98,1.,1.015),vec3(1.055,1.,.94),uWarm);float edge=dot(vUv-.5,vUv-.5);col*=1.-smoothstep(.11,.52,edge)*.15;gl_FragColor=vec4(col,1.);}
  `});
  composer.addPass(grade);const output=new OutputPass();composer.addPass(output);
  const resize=(width:number,height:number)=>{composer.setSize(width,height);const scale=Math.min(1,(mobile?640:1080)/Math.max(width,height));ao.setSize(Math.round(width*scale),Math.round(height*scale));};
  resize(size.x,size.y);
  return {render:()=>{ao.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(camera.projectionMatrix);ao.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(camera.projectionMatrixInverse);composer.render();},resize,lighting:(golden:boolean)=>{skyUniforms.uZenith.value.set(golden?'#879ea2':'#749da8');skyUniforms.uHorizon.value.set(golden?'#e4c99f':'#dce0c9');skyUniforms.uWarm.value=golden?1:0;grade.uniforms.uWarm.value=golden?1:0;skyUniforms.uSun.value.set(-.7,golden?.32:.55,.3).normalize();},dispose:()=>{ao.dispose();grade.dispose();output.dispose();renderPass.dispose();composer.dispose();}};
}
