(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,o,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return t(3408)}])},3408:function(e,o,t){"use strict";t.r(o),t.d(o,{default:function(){return S}});var r=t(5893),n=t(9008),i=t.n(n),a=t(7294),s=t(3910),l=t(463),c=t(7424),d=t(7854),u=t(398),p=t(9477),h=e=>{let{orbitRadius:o,orbitSpeed:t,size:n,moonColor:i,link:l,label:c}=e,u=(0,a.useRef)(null),[p,h]=(0,a.useState)(!1);return(0,s.F)(e=>{let{clock:r}=e,n=r.getElapsedTime();u.current&&(u.current.position.x=Math.cos(n*t)*o,u.current.position.z=Math.sin(n*t)*o)}),(0,r.jsxs)("mesh",{ref:u,onClick:()=>{l&&window.open(l,"_blank")},onPointerOver:e=>{e.stopPropagation(),h(!0),document.body.style.cursor="pointer"},onPointerOut:e=>{e.stopPropagation(),h(!1),document.body.style.cursor="auto"},children:[(0,r.jsx)("sphereGeometry",{args:[n,16,16]}),(0,r.jsx)("meshStandardMaterial",{color:i}),p&&c&&(0,r.jsx)(d.V,{distanceFactor:10,position:[0,n+.3,0],style:{background:"rgba(0, 0, 0, 0.6)",padding:"3px 6px",borderRadius:"4px",color:"white",whiteSpace:"nowrap",pointerEvents:"none",fontSize:"0.8rem"},children:(0,r.jsx)("span",{children:c})})]})},m=e=>{let{orbitRadius:o,orbitSpeed:t,planetColor:n,rings:i,size:l,index:c,onCollision:u,rotationSpeed:m=.01,moons:b,link:x,label:f,logoTexturePath:g}=e,v=(0,a.useRef)(null),[S,y]=(0,a.useState)(!1),w=(0,s.H)(p.TextureLoader,g||"/textures/transparent.png");(0,s.F)(e=>{let{clock:r}=e,n=r.getElapsedTime();v.current&&(v.current.position.x=Math.cos(n*t)*o,v.current.position.z=Math.sin(n*t)*o,v.current.rotation.y+=m,.1>v.current.position.length()&&u(c))});let j=(0,a.useRef)(null);return(0,s.F)(()=>{j.current&&(j.current.rotation.y+=.01)}),(0,r.jsxs)("mesh",{ref:v,onClick:()=>{x&&window.open(x,"_blank")},onPointerOver:e=>{e.stopPropagation(),y(!0),document.body.style.cursor="pointer"},onPointerOut:e=>{e.stopPropagation(),y(!1),document.body.style.cursor="auto"},children:[(0,r.jsx)("sphereGeometry",{args:[l,64,64]}),(0,r.jsx)("meshStandardMaterial",{color:n}),i&&i.map((e,o)=>(0,r.jsxs)("mesh",{rotation:new p.Euler(e.inclination||0,0,0),children:[(0,r.jsx)("ringGeometry",{args:[l*(e.innerScale||1.1),l*(e.outerScale||1.3),32]}),(0,r.jsx)("meshStandardMaterial",{color:e.color,side:p.DoubleSide,transparent:!0,opacity:.8})]},o)),b&&b.map((e,o)=>(0,r.jsx)(h,{...e},"moon-".concat(o))),S&&g&&(0,r.jsxs)("mesh",{ref:j,position:[0,l+.5,0],rotation:[0,0,0],scale:[.7,.7,.7],children:[(0,r.jsx)("planeGeometry",{args:[1,1]}),(0,r.jsx)("meshBasicMaterial",{map:w,transparent:!0,side:p.DoubleSide})]}),S&&(0,r.jsx)(d.V,{distanceFactor:10,position:[0,l+1.5,0],style:{background:"rgba(0, 0, 0, 0.6)",padding:"5px 10px",borderRadius:"4px",color:"white",whiteSpace:"nowrap",pointerEvents:"none"},children:(0,r.jsx)("span",{children:f})})]})};let b=(0,a.forwardRef)((e,o)=>{let{size:t=1.1,color:n="#FDB813",glowIntensity:i=.2,rotationSpeed:l=.001,emissiveIntensity:c=.7}=e,d=a.useRef(null);return(0,s.F)(e=>{var r,n;let{clock:i}=e,a=i.getElapsedTime();if(o&&"function"!=typeof o&&o.current){o.current.rotation.y+=l;let e=o.current.position,r=2*t;null===(n=o.current.parent)||void 0===n||n.traverse(t=>{if(t instanceof p.Mesh&&t!==o.current&&t!==d.current){let o=t.position.distanceTo(e);if(o<r){let n=t.position.clone().sub(e).normalize(),i=t.userData.physicsState;(null==i?void 0:i.velocity)&&i.velocity.add(n.multiplyScalar(.5*(1-o/r)))}}})}let s=null===(r=d.current)||void 0===r?void 0:r.material;(null==s?void 0:s.uniforms)&&(s.uniforms.intensity.value=1+.1*Math.sin(a))}),(0,r.jsxs)("group",{children:[(0,r.jsxs)("mesh",{ref:o,children:[(0,r.jsx)("sphereGeometry",{args:[t,64,64]}),(0,r.jsx)("meshStandardMaterial",{color:n,emissive:n,emissiveIntensity:c,roughness:.7,metalness:.3})]}),(0,r.jsxs)("mesh",{ref:d,scale:1.01*t,children:[(0,r.jsx)("sphereGeometry",{args:[t,32,32]}),(0,r.jsx)("shaderMaterial",{transparent:!0,vertexShader:"\n  varying vec3 vNormal;\n  varying vec3 vPositionNormal;\n  \n  void main() {\n    vNormal = normalize(normalMatrix * normal);\n    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n",fragmentShader:"\n  uniform vec3 glowColor;\n  uniform float intensity;\n  varying vec3 vNormal;\n  varying vec3 vPositionNormal;\n  \n  void main() {\n    float strength = pow(0.6 - dot(vNormal, vPositionNormal), 3.0);\n    gl_FragColor = vec4(glowColor, strength * intensity);\n  }\n",uniforms:{glowColor:{value:new p.Color(n)},intensity:{value:i}},blending:p.AdditiveBlending,side:p.DoubleSide})]})]})});b.displayName="Sun";var x=e=>{let{position:o,color:t}=e,n=(0,a.useRef)([]),i=(0,a.useRef)(Date.now());return(0,a.useEffect)(()=>{n.current=Array.from({length:50},()=>{let e=new p.Mesh(new p.SphereGeometry(.1,8,8),new p.MeshBasicMaterial({color:new p.Color(t),transparent:!0}));return e.position.copy(o),e.userData.velocity=new p.Vector3((Math.random()-.5)*.5,(Math.random()-.5)*.5,(Math.random()-.5)*.5),e})},[o,t]),(0,s.F)(()=>{let e=(Date.now()-i.current)/1e3;n.current.forEach(o=>{o.position.add(o.userData.velocity),o.userData.velocity.multiplyScalar(.98),o.material.opacity=Math.max(0,1-e),o.scale.multiplyScalar(.98)})}),(0,r.jsx)("group",{children:n.current.map((e,o)=>(0,r.jsx)("primitive",{object:e},o))})},f=()=>{let[e,o]=(0,a.useState)([]),t=[{position:[0,0,0],link:"https://www.linkedin.com/in/RidwanSharkar",label:"LinkedIn",orbitRadius:2.75,orbitSpeed:.75,planetColor:"#60AFFF",size:.4,rotationSpeed:.02,logoTexturePath:"/textures/Linkedin_logo.svg"},{position:[0,0,0],link:"https://github.com/RidwanSharkar",label:"GitHub",orbitRadius:5,orbitSpeed:.1,planetColor:"#0d1117",rings:[{color:"#73ced4",innerScale:1.1,outerScale:1.3,inclination:0},{color:"#d2fbfd",innerScale:1.4,outerScale:1.6,inclination:Math.PI/2}],size:.4,rotationSpeed:.01,moons:[{orbitRadius:1,orbitSpeed:2,size:.18,moonColor:"#d2fbfd",link:"https://fretboardx.com",label:"Fretboard Explorer"},{orbitRadius:1.38,orbitSpeed:1.5,size:.12,moonColor:"#3ad8ff",link:"http://nimbusweatherapp.com",label:"Nimbus Weather"},{orbitRadius:1.75,orbitSpeed:.9,size:.15,moonColor:"#80FF72",link:"https://github.com/RidwanSharkar/Pharmacological-Compound-Classifier.com",label:"Compound Classifier"},{orbitRadius:2.1,orbitSpeed:.1,size:.11,moonColor:"#f0a5ab",link:"https://github.com/RidwanSharkar/Arbitrage-Better",label:"MMA Arbitrager"}],logoTexturePath:"/textures/Github_logo.svg"},{position:[0,0,0],link:"https://instagram.com/ridwansharkar/?hl=en",label:"Instagram",orbitRadius:8,orbitSpeed:.2,planetColor:"#BDA0BC",rings:[{color:"#BAD29F",innerScale:1.1,outerScale:1.4,inclination:-Math.PI/6}],size:.5,rotationSpeed:.03,moons:[{orbitRadius:1.2,orbitSpeed:2.5,size:.16,moonColor:"#EAC4D5",link:"https://https://www.artstation.com/ridwansharkar",label:"Art Station"}],logoTexturePath:"/textures/Instagram_logo.svg"},{position:[0,0,0],link:"https://mythos.store",label:"Art Portfolio",orbitRadius:10,orbitSpeed:.3,planetColor:"#fec99e",rings:[{color:"#ffe7ce",innerScale:1.1,outerScale:1.4,inclination:-Math.PI/3}],size:.4,rotationSpeed:.01,moons:[{orbitRadius:1,orbitSpeed:4,size:.15,moonColor:"#53F4FF",link:"https://www.facebook.com/MythosCarver/",label:"Facebook"}],logoTexturePath:"/textures/Mythos_logo.jpg"}],n=e=>{let r=t[e],n=Date.now(),i={position:new p.Vector3(Math.cos(n*r.orbitSpeed)*r.orbitRadius,0,Math.sin(n*r.orbitSpeed)*r.orbitRadius),color:r.planetColor,id:n};o(e=>[...e,i]),setTimeout(()=>{o(e=>e.filter(e=>e.id!==i.id))},2e3)};return(0,r.jsxs)(a.Suspense,{fallback:null,children:[" ",(0,r.jsx)(b,{}),t.map((e,o)=>(0,r.jsxs)("mesh",{"rotation-x":Math.PI/2,children:[(0,r.jsx)("ringGeometry",{args:[e.orbitRadius,e.orbitRadius+.05,64]}),(0,r.jsx)("meshBasicMaterial",{color:"#ffffff",opacity:.1,transparent:!0,side:p.DoubleSide})]},"orbit-".concat(o))),t.map((e,o)=>(0,r.jsx)(m,{...e,index:o,onCollision:n},o)),e.map(e=>(0,r.jsx)(x,{position:e.position,color:e.color},e.id))]})};let g=()=>{let{camera:e,size:o}=(0,s.D)();return a.useEffect(()=>{o.width<768?e.position.set(0,15,20):e.position.set(0,20,25)},[o,e]),null};var v=()=>(0,r.jsxs)(l.Xz,{camera:{position:[0,20,25],fov:60},children:[(0,r.jsx)(g,{}),(0,r.jsx)("ambientLight",{intensity:.2}),(0,r.jsx)("pointLight",{position:[0,0,0],intensity:1,color:"#FDB813"}),(0,r.jsx)(c.t,{radius:100,depth:50,count:5e3,factor:4,saturation:0,fade:!0}),(0,r.jsxs)(a.Suspense,{fallback:(0,r.jsx)(d.V,{center:!0,children:"Loading..."}),children:[(0,r.jsx)(f,{})," "]}),(0,r.jsx)(u.z,{enableZoom:!0,minDistance:15,maxDistance:40,enablePan:!1})]}),S=()=>(0,r.jsxs)("div",{className:"w-screen h-screen bg-gray-900",children:[(0,r.jsxs)(i(),{children:[(0,r.jsx)("title",{children:"Portalfolio"}),(0,r.jsx)("meta",{name:"description",content:"My personal portalfolio with 3D portal animations"}),(0,r.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,r.jsx)(v,{})]})}},function(e){e.O(0,[737,838,888,774,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);