(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,t,o){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return o(8440)}])},8440:function(e,t,o){"use strict";o.r(t),o.d(t,{default:function(){return A}});var n=o(5893),r=o(9008),i=o.n(r),a=o(7294),s=o(3910),l=o(463),c=o(7424),u=o(7854),d=o(214),m=o(9477),p=e=>{let{orbitRadius:t,orbitSpeed:o,size:r,moonColor:i,link:l,label:c}=e,d=(0,a.useRef)(null),[m,p]=(0,a.useState)(!1);return(0,s.F)(e=>{let{clock:n}=e,r=n.getElapsedTime();d.current&&(d.current.position.x=Math.cos(r*o)*t,d.current.position.z=Math.sin(r*o)*t)}),(0,n.jsxs)("mesh",{ref:d,onClick:()=>{l&&window.open(l,"_blank")},onPointerOver:e=>{e.stopPropagation(),p(!0),document.body.style.cursor="pointer"},onPointerOut:e=>{e.stopPropagation(),p(!1),document.body.style.cursor="auto"},children:[(0,n.jsx)("sphereGeometry",{args:[r,16,16]}),(0,n.jsx)("meshStandardMaterial",{color:i}),m&&c&&(0,n.jsx)(u.V,{distanceFactor:10,position:[0,r+.3,0],style:{background:"rgba(0, 0, 0, 0.6)",padding:"3px 6px",borderRadius:"4px",color:"white",whiteSpace:"nowrap",pointerEvents:"none",fontSize:"0.8rem"},children:(0,n.jsx)("span",{children:c})})]})};let h=e=>{let{color:t,size:o,intensity:r=.3,isSelected:i=!1}=e,l=(0,a.useRef)(null);return(0,s.F)(e=>{let{clock:t}=e;if(l.current){let e=t.getElapsedTime();l.current.uniforms.intensity.value=i?1.1*r:r*(1+.1*Math.sin(2*e))}}),(0,n.jsxs)("mesh",{scale:[1.1,1.1,1.1],children:[(0,n.jsx)("sphereGeometry",{args:[o,32,32]}),(0,n.jsx)("shaderMaterial",{ref:l,transparent:!0,vertexShader:"\n  varying vec3 vNormal;\n  void main() {\n    vNormal = normalize(normalMatrix * normal);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n",fragmentShader:"\n  uniform vec3 glowColor;\n  uniform float intensity;\n  varying vec3 vNormal;\n  void main() \n  {\n    float glow = dot(vNormal, vec3(0.0, 0.0, 1.0));\n    glow = pow(glow, intensity);\n    gl_FragColor = vec4(glowColor * glow, 1.0);\n  }\n",uniforms:{glowColor:{value:new m.Color(t)},intensity:{value:r}},blending:m.AdditiveBlending,side:m.DoubleSide})]})},f=(0,a.forwardRef)((e,t)=>{let{planetColor:o,size:r,index:i,onSelectPlanet:l,selected:c,link:u,label:d,description:f,orbitRadius:x,orbitSpeed:g,rings:v,rotationSpeed:y=.01,moons:b,logoTexturePath:j}=e,S=(0,a.useRef)(null),[w,M]=(0,a.useState)(!1),P=(0,s.H)(m.TextureLoader,j||"/textures/transparent.png"),C=(0,a.useMemo)(()=>new m.ShaderMaterial({uniforms:{glowColor:{value:new m.Color(o)}},vertexShader:"\nvarying vec3 vNormal;\nvoid main() {\n    vNormal = normalize(normalMatrix * normal);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"\nvarying vec3 vNormal;\nuniform vec3 glowColor;\nvoid main() {\n    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);\n    gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.6;\n}\n",blending:m.AdditiveBlending,side:m.BackSide,transparent:!0}),[o]),_=(0,a.useRef)(null);(0,s.F)(e=>{let{clock:t}=e,o=t.getElapsedTime();_.current&&(_.current.position.x=Math.cos(o*g)*x,_.current.position.z=Math.sin(o*g)*x,_.current.rotation.y+=y,S.current&&(S.current.position.copy(_.current.position),S.current.rotation.copy(_.current.rotation)),k.current&&(k.current.rotation.y+=.01))});let k=(0,a.useRef)(null);return(0,a.useEffect)(()=>{console.log("Planet ".concat(i," selected: ").concat(c))},[c,i]),(0,a.useEffect)(()=>{c?document.body.style.cursor="pointer":w||(document.body.style.cursor="auto")},[w,c]),(0,n.jsxs)("group",{children:[(0,n.jsxs)("mesh",{ref:S,scale:[1.18,1.18,1.18],children:[(0,n.jsx)("sphereGeometry",{args:[r,64,64]}),(0,n.jsx)("primitive",{object:C,attach:"material"})]}),(0,n.jsxs)("mesh",{ref:e=>{_.current=e,"function"==typeof t?t(e):t&&(t.current=e)},onClick:()=>{l(i,{position:[0,0,0],link:u,label:d,description:f,orbitRadius:x,orbitSpeed:g,planetColor:o,rings:v,size:r,rotationSpeed:y,moons:b,logoTexturePath:j})},onPointerOver:e=>{e.stopPropagation(),setTimeout(()=>M(!0),50),document.body.style.cursor="pointer"},onPointerOut:e=>{e.stopPropagation(),setTimeout(()=>M(!1),50),c||(document.body.style.cursor="auto")},scale:[1,1,1],children:[(0,n.jsx)("sphereGeometry",{args:[r,64,64]}),(0,n.jsx)("meshStandardMaterial",{color:o}),c&&(0,n.jsx)(h,{color:o,size:r,intensity:.4,isSelected:c}),null==v?void 0:v.map((e,t)=>(0,n.jsxs)("mesh",{rotation:new m.Euler(e.inclination||0,0,0),children:[(0,n.jsx)("ringGeometry",{args:[r*(e.innerScale||1.1),r*(e.outerScale||1.3),64]}),(0,n.jsx)("meshStandardMaterial",{color:e.color,side:m.DoubleSide,transparent:!0,opacity:1,alphaMap:new m.TextureLoader().load("/textures/ring-alpha.jpg")})]},t)),b&&b.map((e,t)=>(0,n.jsx)(p,{...e},"moon-".concat(t))),(w||c)&&j&&(0,n.jsxs)("mesh",{ref:k,position:[0,r+.65,0],rotation:[0,0,0],scale:[.6,.6,.6],children:[(0,n.jsx)("planeGeometry",{args:[1,1]}),(0,n.jsx)("meshBasicMaterial",{map:P,transparent:!0,side:m.DoubleSide})]})]})]})});f.displayName="EnhancedPlanet";let x=(0,a.forwardRef)((e,t)=>{let{size:o=1.1,color:r="#FDB813",glowIntensity:i=.2,rotationSpeed:l=.001,emissiveIntensity:c=.25}=e,u=(0,a.useRef)(null),d=new m.ShaderMaterial({uniforms:{glowColor:{value:new m.Color(r)}},vertexShader:"\nvarying vec3 vNormal;\nvoid main() {\n    vNormal = normalize(normalMatrix * normal);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"\nvarying vec3 vNormal;\nuniform vec3 glowColor;\nvoid main() {\n    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);\n    gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.6;\n}\n",blending:m.AdditiveBlending,side:m.BackSide,transparent:!0});return(0,s.F)(e=>{var o;let{clock:n}=e,r=n.getElapsedTime();t&&"function"!=typeof t&&t.current&&(t.current.rotation.y+=l);let i=null===(o=u.current)||void 0===o?void 0:o.material;(null==i?void 0:i.uniforms)&&(i.uniforms.intensity.value=.5+.5*Math.abs(Math.sin(r)))}),(0,n.jsxs)("group",{children:[(0,n.jsx)("pointLight",{color:r,intensity:1.25,distance:2e3,decay:.7}),(0,n.jsxs)("mesh",{scale:[1.08,1.08,1.08],children:[(0,n.jsx)("sphereGeometry",{args:[o,64,64]}),(0,n.jsx)("primitive",{object:d,attach:"material"})]}),(0,n.jsxs)("mesh",{ref:t,children:[(0,n.jsx)("sphereGeometry",{args:[o,64,64]}),(0,n.jsx)("meshStandardMaterial",{color:r,emissive:r,emissiveIntensity:c,roughness:.76,metalness:.3})]}),(0,n.jsxs)("mesh",{ref:u,scale:1.07*o,children:[(0,n.jsx)("sphereGeometry",{args:[o,32,32]}),(0,n.jsx)("shaderMaterial",{transparent:!0,vertexShader:"\n  varying vec3 vNormal;\n  varying vec3 vPositionNormal;\n  \n  void main() {\n    vNormal = normalize(normalMatrix * normal);\n    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n",fragmentShader:"\n  uniform vec3 glowColor;\n  uniform float intensity;\n  varying vec3 vNormal;\n  varying vec3 vPositionNormal;\n  \n  void main() {\n    float strength = pow(0.6 - dot(vNormal, vPositionNormal), 3.0);\n    gl_FragColor = vec4(glowColor, strength * intensity);\n  }\n",uniforms:{glowColor:{value:new m.Color(r)},intensity:{value:i}},blending:m.AdditiveBlending,side:m.DoubleSide})]})]})});x.displayName="Sun";var g=e=>{let{position:t,color:o,size:r=1,duration:i=1,particleCount:l=20}=e,c=(0,a.useRef)(null),u=(0,a.useRef)([]),d=(0,a.useRef)(Date.now());return(0,a.useEffect)(()=>{if(!c.current)return;let e=c.current;for(let n=0;n<l;n++){let n=new m.BufferGeometry,i=new Float32Array([0,0,0]);n.setAttribute("position",new m.BufferAttribute(i,3));let a=new m.Mesh(new m.SphereGeometry(.05*r,8,8),new m.MeshStandardMaterial({color:new m.Color(o),emissive:new m.Color(o),emissiveIntensity:.5,transparent:!0,opacity:1})),s=Math.random()*Math.PI*2,l=Math.random()*Math.PI,c=new m.Vector3(Math.sin(l)*Math.cos(s),Math.sin(l)*Math.sin(s),Math.cos(l)).multiplyScalar(.1*r);a.position.copy(t),e.add(a),u.current.push({mesh:a,velocity:c,startTime:Date.now()})}return()=>{u.current.forEach(t=>{e.remove(t.mesh)}),u.current=[]}},[t,o,r,l]),(0,s.F)(()=>{let e=Date.now();if((e-d.current)/1e3>i){c.current&&(u.current.forEach(e=>{var t;null===(t=c.current)||void 0===t||t.remove(e.mesh)}),u.current=[]);return}u.current.forEach(t=>{t.mesh.position.add(t.velocity),t.velocity.y-=.001;let o=(e-t.startTime)/1e3;t.mesh.material instanceof m.MeshStandardMaterial&&(t.mesh.material.opacity=1-o/i),t.mesh.scale.setScalar(1-o/i*.5)})}),(0,n.jsx)("group",{ref:c})},v=o(8773);let y=e=>{let{size:t,speed:o,orbitRadius:r,orbitCenter:i,color:l}=e,c=(0,a.useRef)(null),u=(0,a.useRef)(null),d=(0,a.useMemo)(()=>Math.random()*Math.PI*2,[]),m=(0,a.useMemo)(()=>(Math.random()-.5)*2.2,[]);return(0,s.F)(e=>{let{clock:t}=e;if(!c.current)return;let n=d+t.getElapsedTime()*o;c.current.position.x=i.x+Math.cos(n)*r,c.current.position.y=i.y+m,c.current.position.z=i.z+Math.sin(n)*r,c.current.rotation.x+=.01,c.current.rotation.y+=.01}),(0,n.jsxs)("mesh",{ref:c,children:[(0,n.jsx)("icosahedronGeometry",{args:[t,0]}),(0,n.jsx)("meshStandardMaterial",{ref:u,color:l,roughness:.95,metalness:.2,transparent:!0,opacity:1})]})},b=e=>{let{planetPositions:t,planetSizes:o,onCollision:r}=e,i=(0,a.useMemo)(()=>{let e=["#A88F6B","#C4B08C","#A9A9A9","#D3D3D3"];return Array.from({length:400}).map(()=>({id:(0,v.Z)(),size:.07*Math.random()+.001,speed:.5*Math.random()+.1,orbitRadius:.28>Math.random()?5*Math.random()+2:2.5*Math.random()+9,orbitCenter:new m.Vector3(0,0,0),color:e[Math.floor(Math.random()*e.length)]}))},[400]);return(0,n.jsx)("group",{children:i.map(e=>(0,n.jsx)(y,{size:e.size,speed:e.speed,orbitRadius:e.orbitRadius,orbitCenter:e.orbitCenter,planetPositions:t,planetSizes:o,onCollision:r,color:e.color},e.id))})};var j=o(2132),S=o(6182);(0,s.e)({OrbitControls:j.z,TransformControls:S.Ys});var w=e=>{let{onSelectPlanet:t,selectedPlanet:o}=e,[r,i]=(0,a.useState)([]),s=(0,a.useRef)([]),l=(0,a.useMemo)(()=>[{position:[0,0,0],link:"https://fretboardx.com",label:"Fretboard-x",description:"explore()",orbitRadius:2.1,orbitSpeed:1.1,planetColor:"#e88d96",size:.22,rotationSpeed:.02,logoTexturePath:"/textures/Fretboardx_logo.png"},{position:[0,0,0],link:"https://www.linkedin.com/in/ridwansharkar",label:"LinkedIn",description:"connect()",orbitRadius:3.25,orbitSpeed:.6,planetColor:"#4FB8FF",size:.325,rotationSpeed:.01,rings:[{color:"#00FFFF",innerScale:1.3,outerScale:1.45,inclination:-Math.PI/3}],logoTexturePath:"/textures/LinkedIn_logo.svg"},{position:[0,0,0],link:"https://github.com/RidwanSharkar",label:"GitHub",description:"collaborate()",orbitRadius:5.33,orbitSpeed:.15,planetColor:"#8980F5",rings:[{color:"#FFAAEE",innerScale:1.25,outerScale:1.4,inclination:0},{color:"#FFAAEE",innerScale:1.5,outerScale:1.825,inclination:Math.PI/2}],size:.385,rotationSpeed:.01,moons:[{orbitRadius:.9,orbitSpeed:2.25,size:.11,moonColor:"#E3C0D3",link:"https://github.com/RidwanSharkar/Predictive-Analysis-of-MMA-Fights",label:"Predictive Analysis"},{orbitRadius:1.25,orbitSpeed:1.5,size:.1625,moonColor:"#FFAAEE",link:"https://github.com/RidwanSharkar/Pharmacological-Compound-Classifier",label:"Compound Classifier"},{orbitRadius:1.62,orbitSpeed:2.2,size:.13,moonColor:"#D295BF",link:"https://github.com/RidwanSharkar/Arbitrage-Better",label:"MMA Arbitrager"}],logoTexturePath:"/textures/Github_logo.svg"},{position:[0,0,0],link:"https://instagram.com/ridwansharkar/?hl=en",label:"Instagram",description:"carveWood()",orbitRadius:8,orbitSpeed:.2,planetColor:"#AFE3C0",rings:[{color:"#7EE081",innerScale:1.4,outerScale:2.25,inclination:-Math.PI/2.3}],size:.35,rotationSpeed:.001,moons:[{orbitRadius:1.2,orbitSpeed:2,size:.125,moonColor:"#91F5AD",link:"https://www.artstation.com/ridwansharkar",label:"Art Station"}],logoTexturePath:"/textures/Instagram_logo.svg"},{position:[0,0,0],link:"https://mythos.store",label:"Mythos.store",description:"browse()",orbitRadius:10,orbitSpeed:.3,planetColor:"#2DE1FC",rings:[{color:"#2DE1FC",innerScale:1.3,outerScale:1.75,inclination:-Math.PI}],size:.28,rotationSpeed:.01,moons:[{orbitRadius:.9,orbitSpeed:4,size:.1,moonColor:"#a6b5b7",link:"https://www.facebook.com/mythoscarver/",label:"Facebook"}],logoTexturePath:"/textures/Mythos_logo.png"}],[]);return(0,a.useEffect)(()=>{s.current=l.map(()=>a.createRef())},[l.length,l]),(0,n.jsxs)(a.Suspense,{fallback:null,children:[(0,n.jsx)(x,{}),(0,n.jsx)(b,{planetPositions:(()=>{let e=[];return s.current.forEach(t=>{if(t.current){let o=new m.Vector3;t.current.getWorldPosition(o),e.push(o.clone())}else e.push(new m.Vector3(0,0,0))}),e})(),planetSizes:l.map(e=>e.size),onCollision:(e,t)=>{if(s.current[e].current){i(e=>e.filter(e=>e.id!==Date.now()));let o={position:t.clone(),color:l[e].planetColor,id:Date.now()};i(e=>[...e,o]),setTimeout(()=>{i(e=>e.filter(e=>e.id!==o.id))},1e3)}}}),l.map((e,t)=>(0,n.jsxs)("mesh",{"rotation-x":Math.PI/2,children:[(0,n.jsx)("ringGeometry",{args:[e.orbitRadius,e.orbitRadius+.05,64]}),(0,n.jsx)("meshBasicMaterial",{color:"#ffffff",opacity:.08,transparent:!0,side:m.DoubleSide})]},"orbit-".concat(t))),r.map(e=>(0,n.jsxs)("mesh",{position:e.position,children:[(0,n.jsx)("sphereGeometry",{args:[.1,16,16]}),(0,n.jsx)("meshBasicMaterial",{color:e.color})]},e.id)),l.map((e,r)=>(0,n.jsx)(f,{...e,index:r,onSelectPlanet:t,selected:(null==o?void 0:o.index)===r,collisionTriggered:!1,ref:s.current[r]},r)),r.map(e=>(0,n.jsx)(g,{position:e.position,color:e.color,size:.5,duration:1,particleCount:30},e.id))]})};let M=()=>{let{camera:e,size:t}=(0,s.D)();return a.useEffect(()=>{t.width<768?e.position.set(0,15,20):e.position.set(0,20,25)},[t,e]),null};var P=e=>{let{onSelectPlanet:t,selectedPlanet:o}=e;return(0,n.jsxs)(l.Xz,{camera:{position:[0,20,25],fov:60},className:"w-full h-full",children:[(0,n.jsx)(M,{}),(0,n.jsx)("ambientLight",{intensity:.4}),(0,n.jsx)("pointLight",{position:[0,0,0],intensity:1,color:"#FDB813"}),(0,n.jsx)(c.t,{radius:100,depth:60,count:6e3,factor:4,saturation:0,fade:!0}),(0,n.jsx)(a.Suspense,{fallback:(0,n.jsx)(u.V,{center:!0,children:"Loading..."}),children:(0,n.jsx)(w,{onSelectPlanet:t,selectedPlanet:o})}),(0,n.jsx)(d.z,{enableZoom:!0,minDistance:5,maxDistance:30,enablePan:!1,zoomSpeed:.15,enableDamping:!0,dampingFactor:.4})]})},C=o(3709),_=o.n(C),k=o(3114),F=o(5480),E=e=>{let{planet:t,onClose:o}=e,[r,i]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{i(!0)},[]),(0,n.jsx)(k.M,{children:r&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("div",{className:_().overlay,onClick:()=>{i(!1),setTimeout(o,500)}}),(0,n.jsxs)(F.E.div,{className:_().infoPanel,initial:{opacity:0,y:-20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.5},children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("h2",{children:t.label}),(0,n.jsx)("p",{children:t.description||"No description available."})]}),(0,n.jsx)("a",{href:t.link,target:"_blank",rel:"noopener noreferrer",className:_().infoButton,children:"Visit"})]})]})})},R=e=>{let{content:t}=e,[o,r]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{r(!0)},[]),(0,n.jsx)(k.M,{children:o&&(0,n.jsx)(F.E.div,{className:_().fixedBottomLeftPanel,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:20},transition:{duration:.5},children:t})})},N=o(4810),z=o.n(N),D=e=>{let{src:t}=e,o=(0,a.useRef)(null),[r,i]=(0,a.useState)(!1),[s,l]=(0,a.useState)(!0),[c,u]=(0,a.useState)(.5);return(0,n.jsxs)("div",{className:z().audioPlayer,children:[(0,n.jsx)("button",{onClick:()=>{o.current&&(r?o.current.pause():o.current.play().catch(e=>{console.error("Failed to play audio:",e)}),i(!r))},className:z().playPauseButton,children:r?"⏸️":"▶️"}),(0,n.jsx)("button",{onClick:()=>{o.current&&(o.current.muted=!s,l(!s))},className:z().muteButton,children:s?"\uD83D\uDD07":"\uD83D\uDD0A"}),(0,n.jsx)("input",{type:"range",min:"0",max:"1",step:"0.01",value:c,onChange:e=>{let t=parseFloat(e.target.value);u(t),o.current&&(o.current.volume=t)},className:z().volumeSlider}),(0,n.jsx)("audio",{ref:o,src:t,controls:!1})]})},A=()=>{let[e,t]=(0,a.useState)(null);return(0,n.jsxs)("div",{className:"w-screen h-screen bg-gray-900 relative",children:[(0,n.jsxs)(i(),{children:[(0,n.jsx)("title",{children:"Planetfolio"}),(0,n.jsx)("meta",{name:"description",content:"Ridwan Sharkar Landing Page"}),(0,n.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,n.jsx)(P,{onSelectPlanet:(e,o)=>{t(t=>(null==t?void 0:t.index)===e?null:{index:e,planet:o})},selectedPlanet:e}),e&&(0,n.jsx)(E,{planet:e.planet,onClose:()=>{t(null)}}),(0,n.jsx)(R,{content:(0,n.jsx)("div",{children:(0,n.jsx)(D,{src:"/audio/Brown.MP3"})})})]})}},3709:function(e){e.exports={infoPanel:"InfoPanel_infoPanel__GYtAp",fixedBottomLeftPanel:"InfoPanel_fixedBottomLeftPanel__cWTEt",overlay:"InfoPanel_overlay__QRjEz",infoButton:"InfoPanel_infoButton__FAHu9"}},4810:function(e){e.exports={audioPlayer:"SoundPlayer_audioPlayer__Coblk",playPauseButton:"SoundPlayer_playPauseButton__PyRAk",muteButton:"SoundPlayer_muteButton__CpKjf",volumeSlider:"SoundPlayer_volumeSlider__urkx9"}}},function(e){e.O(0,[737,549,888,774,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);