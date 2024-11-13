(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(9316)}])},9316:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return Z}});var o=n(5893),r=n(9008),a=n.n(r),i=n(7294),s=n(3910),l=n(463),c=n(7424),u=n(7854),d=n(214),m=n(9477),h=e=>{let{orbitRadius:t,orbitSpeed:n,size:r,moonColor:a,link:l,label:c}=e,d=(0,i.useRef)(null),[m,h]=(0,i.useState)(!1);return(0,s.F)(e=>{let{clock:o}=e,r=o.getElapsedTime();d.current&&(d.current.position.x=Math.cos(r*n)*t,d.current.position.z=Math.sin(r*n)*t)}),(0,o.jsxs)("mesh",{ref:d,onClick:()=>{l&&window.open(l,"_blank")},onPointerOver:e=>{e.stopPropagation(),h(!0),document.body.style.cursor="pointer"},onPointerOut:e=>{e.stopPropagation(),h(!1),document.body.style.cursor="auto"},children:[(0,o.jsx)("sphereGeometry",{args:[r,16,16]}),(0,o.jsx)("meshStandardMaterial",{color:a}),m&&c&&(0,o.jsx)(u.V,{distanceFactor:10,position:[0,r+.3,0],style:{background:"rgba(0, 0, 0, 0.6)",padding:"3px 6px",borderRadius:"4px",color:"white",whiteSpace:"nowrap",pointerEvents:"none",fontSize:"0.8rem"},children:(0,o.jsx)("span",{children:c})})]})};let p=e=>{let{color:t,size:n,intensity:r=.3,isSelected:a=!1}=e,l=(0,i.useRef)(null);return(0,s.F)(e=>{let{clock:t}=e;if(l.current){let e=t.getElapsedTime();l.current.uniforms.intensity.value=a?1.1*r:r*(1+.1*Math.sin(2*e))}}),(0,o.jsxs)("mesh",{scale:[1.1,1.1,1.1],children:[(0,o.jsx)("sphereGeometry",{args:[n,32,32]}),(0,o.jsx)("shaderMaterial",{ref:l,transparent:!0,vertexShader:"\n  varying vec3 vNormal;\n  void main() {\n    vNormal = normalize(normalMatrix * normal);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n",fragmentShader:"\n  uniform vec3 glowColor;\n  uniform float intensity;\n  varying vec3 vNormal;\n  void main() \n  {\n    float glow = dot(vNormal, vec3(0.0, 0.0, 1.0));\n    glow = pow(glow, intensity);\n    gl_FragColor = vec4(glowColor * glow, 1.0);\n  }\n",uniforms:{glowColor:{value:new m.Color(t)},intensity:{value:r}},blending:m.AdditiveBlending,side:m.DoubleSide})]})},x=(0,i.forwardRef)((e,t)=>{let{planetColor:n,size:r,index:a,onSelectPlanet:l,selected:c,link:u,label:d,description:x,orbitRadius:f,orbitSpeed:g,rings:v,rotationSpeed:b=.01,moons:y,logoTexturePath:j,startAngle:S=0}=e,M=(0,i.useRef)(null),[P,_]=(0,i.useState)(!1),C=(0,s.H)(m.TextureLoader,j||"/textures/transparent.png"),w=(0,i.useMemo)(()=>new m.ShaderMaterial({uniforms:{glowColor:{value:new m.Color(n)}},vertexShader:"\nvarying vec3 vNormal;\nvoid main() {\n    vNormal = normalize(normalMatrix * normal);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"\nvarying vec3 vNormal;\nuniform vec3 glowColor;\nvoid main() {\n    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);\n    gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.6;\n}\n",blending:m.AdditiveBlending,side:m.BackSide,transparent:!0}),[n]),F=(0,i.useRef)(null);(0,s.F)(e=>{let{clock:t}=e,n=t.getElapsedTime();if(F.current){let e=n*g+S;F.current.position.x=f*Math.cos(e),F.current.position.z=f*Math.sin(e),F.current.rotation.y+=b,M.current&&(M.current.position.copy(F.current.position),M.current.rotation.copy(F.current.rotation)),k.current&&(k.current.rotation.y+=.01)}});let k=(0,i.useRef)(null);return(0,i.useEffect)(()=>{console.log("Planet ".concat(a," selected: ").concat(c))},[c,a]),(0,i.useEffect)(()=>{c?document.body.style.cursor="pointer":P||(document.body.style.cursor="auto")},[P,c]),(0,o.jsxs)("group",{children:[(0,o.jsxs)("mesh",{ref:M,scale:[1.18,1.18,1.18],children:[(0,o.jsx)("sphereGeometry",{args:[r,64,64]}),(0,o.jsx)("primitive",{object:w,attach:"material"})]}),(0,o.jsxs)("mesh",{ref:e=>{F.current=e,"function"==typeof t?t(e):t&&(t.current=e)},onClick:()=>{l(a,{position:[0,0,0],link:u,label:d,description:x,orbitRadius:f,orbitSpeed:g,planetColor:n,rings:v,size:r,rotationSpeed:b,moons:y,logoTexturePath:j})},onPointerOver:e=>{e.stopPropagation(),setTimeout(()=>_(!0),50),document.body.style.cursor="pointer"},onPointerOut:e=>{e.stopPropagation(),setTimeout(()=>_(!1),50),c||(document.body.style.cursor="auto")},scale:[1,1,1],children:[(0,o.jsx)("sphereGeometry",{args:[r,64,64]}),(0,o.jsx)("meshStandardMaterial",{color:n}),c&&(0,o.jsx)(p,{color:n,size:r,intensity:.4,isSelected:c}),null==v?void 0:v.map((e,t)=>(0,o.jsxs)("mesh",{rotation:new m.Euler(e.inclination||0,0,0),children:[(0,o.jsx)("ringGeometry",{args:[r*(e.innerScale||1.1),r*(e.outerScale||1.3),64]}),(0,o.jsx)("meshStandardMaterial",{color:e.color,side:m.DoubleSide,transparent:!0,opacity:1,alphaMap:new m.TextureLoader().load("/textures/ring-alpha.jpg")})]},t)),y&&y.map((e,t)=>(0,o.jsx)(h,{...e},"moon-".concat(t))),(P||c)&&j&&(0,o.jsxs)("mesh",{ref:k,position:[0,r+.65,0],rotation:[0,0,0],scale:[.8,.8,.8],children:[(0,o.jsx)("planeGeometry",{args:[1,1]}),(0,o.jsx)("meshBasicMaterial",{map:C,transparent:!0,side:m.DoubleSide})]})]})]})});x.displayName="EnhancedPlanet";let f=(0,i.forwardRef)((e,t)=>{let{size:n=1.1,color:r="#FDB813",glowIntensity:a=.2,rotationSpeed:l=.001,emissiveIntensity:c=.25}=e,u=(0,i.useRef)(null),d=new m.ShaderMaterial({uniforms:{glowColor:{value:new m.Color(r)}},vertexShader:"\nvarying vec3 vNormal;\nvoid main() {\n    vNormal = normalize(normalMatrix * normal);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",fragmentShader:"\nvarying vec3 vNormal;\nuniform vec3 glowColor;\nvoid main() {\n    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);\n    gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.6;\n}\n",blending:m.AdditiveBlending,side:m.BackSide,transparent:!0});return(0,s.F)(e=>{var n;let{clock:o}=e,r=o.getElapsedTime();t&&"function"!=typeof t&&t.current&&(t.current.rotation.y+=l);let a=null===(n=u.current)||void 0===n?void 0:n.material;(null==a?void 0:a.uniforms)&&(a.uniforms.intensity.value=.5+.5*Math.abs(Math.sin(r)))}),(0,o.jsxs)("group",{children:[(0,o.jsx)("pointLight",{color:r,intensity:1.25,distance:2e3,decay:.7}),(0,o.jsxs)("mesh",{scale:[1.08,1.08,1.08],children:[(0,o.jsx)("sphereGeometry",{args:[n,64,64]}),(0,o.jsx)("primitive",{object:d,attach:"material"})]}),(0,o.jsxs)("mesh",{ref:t,children:[(0,o.jsx)("sphereGeometry",{args:[n,64,64]}),(0,o.jsx)("meshStandardMaterial",{color:r,emissive:r,emissiveIntensity:c,roughness:.76,metalness:.3})]}),(0,o.jsxs)("mesh",{ref:u,scale:1.07*n,children:[(0,o.jsx)("sphereGeometry",{args:[n,32,32]}),(0,o.jsx)("shaderMaterial",{transparent:!0,vertexShader:"\n  varying vec3 vNormal;\n  varying vec3 vPositionNormal;\n  \n  void main() {\n    vNormal = normalize(normalMatrix * normal);\n    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n",fragmentShader:"\n  uniform vec3 glowColor;\n  uniform float intensity;\n  varying vec3 vNormal;\n  varying vec3 vPositionNormal;\n  \n  void main() {\n    float strength = pow(0.6 - dot(vNormal, vPositionNormal), 3.0);\n    gl_FragColor = vec4(glowColor, strength * intensity);\n  }\n",uniforms:{glowColor:{value:new m.Color(r)},intensity:{value:a}},blending:m.AdditiveBlending,side:m.DoubleSide})]})]})});f.displayName="Sun";var g=e=>{let{position:t,color:n,size:r=1,duration:a=1,particleCount:l=20}=e,c=(0,i.useRef)(null),u=(0,i.useRef)([]),d=(0,i.useRef)(Date.now());return(0,i.useEffect)(()=>{if(!c.current)return;let e=c.current;for(let o=0;o<l;o++){let o=new m.BufferGeometry,a=new Float32Array([0,0,0]);o.setAttribute("position",new m.BufferAttribute(a,3));let i=new m.Mesh(new m.SphereGeometry(.05*r,8,8),new m.MeshStandardMaterial({color:new m.Color(n),emissive:new m.Color(n),emissiveIntensity:.5,transparent:!0,opacity:1})),s=Math.random()*Math.PI*2,l=Math.random()*Math.PI,c=new m.Vector3(Math.sin(l)*Math.cos(s),Math.sin(l)*Math.sin(s),Math.cos(l)).multiplyScalar(.1*r);i.position.copy(t),e.add(i),u.current.push({mesh:i,velocity:c,startTime:Date.now()})}return()=>{u.current.forEach(t=>{e.remove(t.mesh)}),u.current=[]}},[t,n,r,l]),(0,s.F)(()=>{let e=Date.now();if((e-d.current)/1e3>a){c.current&&(u.current.forEach(e=>{var t;null===(t=c.current)||void 0===t||t.remove(e.mesh)}),u.current=[]);return}u.current.forEach(t=>{t.mesh.position.add(t.velocity),t.velocity.y-=.001;let n=(e-t.startTime)/1e3;t.mesh.material instanceof m.MeshStandardMaterial&&(t.mesh.material.opacity=1-n/a),t.mesh.scale.setScalar(1-n/a*.5)})}),(0,o.jsx)("group",{ref:c})},v=n(8773);let b=e=>{let{size:t,speed:n,orbitRadius:r,orbitCenter:a,color:l}=e,c=(0,i.useRef)(null),u=(0,i.useRef)(null),d=(0,i.useMemo)(()=>Math.random()*Math.PI*2,[]),m=(0,i.useMemo)(()=>(Math.random()-.5)*2.2,[]);return(0,s.F)(e=>{let{clock:t}=e;if(!c.current)return;let o=d+t.getElapsedTime()*n;c.current.position.x=a.x+Math.cos(o)*r,c.current.position.y=a.y+m,c.current.position.z=a.z+Math.sin(o)*r,c.current.rotation.x+=.01,c.current.rotation.y+=.01}),(0,o.jsxs)("mesh",{ref:c,children:[(0,o.jsx)("icosahedronGeometry",{args:[t,0]}),(0,o.jsx)("meshStandardMaterial",{ref:u,color:l,roughness:.95,metalness:.2,transparent:!0,opacity:1})]})},y=e=>{let{planetPositions:t,planetSizes:n,onCollision:r}=e,a=(0,i.useMemo)(()=>{let e=["#A88F6B","#C4B08C","#A9A9A9","#D3D3D3"];return Array.from({length:350}).map(()=>({id:(0,v.Z)(),size:.07*Math.random()+.001,speed:.5*Math.random()+.1,orbitRadius:.28>Math.random()?5*Math.random()+2:2.5*Math.random()+9,orbitCenter:new m.Vector3(0,0,0),color:e[Math.floor(Math.random()*e.length)]}))},[350]);return(0,o.jsx)("group",{children:a.map(e=>(0,o.jsx)(b,{size:e.size,speed:e.speed,orbitRadius:e.orbitRadius,orbitCenter:e.orbitCenter,planetPositions:t,planetSizes:n,onCollision:r,color:e.color},e.id))})};var j=n(2132),S=n(6182),M=e=>{let{color:t,size:n,meshRef:r,opacity:a}=e,l=(0,i.useRef)(null),c=(0,i.useRef)(new Float32Array(75)),u=(0,i.useRef)(new Float32Array(25)),d=(0,i.useRef)(new Float32Array(25));return(0,s.F)(()=>{var e;if(!(null===(e=l.current)||void 0===e?void 0:e.parent)||!r.current)return;let{x:t,y:o,z:i}=r.current.position;for(let e=24;e>0;e--)c.current[3*e]=c.current[(e-1)*3],c.current[3*e+1]=c.current[(e-1)*3+1],c.current[3*e+2]=c.current[(e-1)*3+2],u.current[e]=.3*Math.pow(1-e/25,2)*a,d.current[e]=.9*n*Math.pow(1-e/25,.5);if(c.current[0]=t,c.current[1]=o,c.current[2]=i,u.current[0]=.4*a,d.current[0]=1.1*n,l.current){let e=l.current.geometry;e.attributes.position.array=c.current,e.attributes.position.needsUpdate=!0,e.attributes.opacity&&(e.attributes.opacity.array=u.current,e.attributes.opacity.needsUpdate=!0),e.attributes.scale&&(e.attributes.scale.array=d.current,e.attributes.scale.needsUpdate=!0)}}),(0,o.jsxs)("points",{ref:l,children:[(0,o.jsxs)("bufferGeometry",{children:[(0,o.jsx)("bufferAttribute",{attach:"attributes-position",count:25,array:c.current,itemSize:3}),(0,o.jsx)("bufferAttribute",{attach:"attributes-opacity",count:25,array:u.current,itemSize:1}),(0,o.jsx)("bufferAttribute",{attach:"attributes-scale",count:25,array:d.current,itemSize:1})]}),(0,o.jsx)("shaderMaterial",{transparent:!0,depthWrite:!1,blending:m.AdditiveBlending,vertexShader:"\n          attribute float opacity;\n          attribute float scale;\n          varying float vOpacity;\n          void main() {\n            vOpacity = opacity;\n            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n            gl_Position = projectionMatrix * mvPosition;\n            gl_PointSize = scale * 15.0 * (300.0 / -mvPosition.z);\n          }\n        ",fragmentShader:"\n          varying float vOpacity;\n          uniform vec3 uColor;\n          void main() {\n            float d = length(gl_PointCoord - vec2(0.5));\n            float strength = smoothstep(0.5, 0.1, d);\n            vec3 glowColor = mix(uColor, vec3(1.0), 0.3);\n            gl_FragColor = vec4(glowColor, vOpacity * strength);\n          }\n        ",uniforms:{uColor:{value:t}}})]})},P=e=>{let{onRemove:t}=e,n=(0,i.useRef)(null),r=(0,i.useRef)(),a=.15+.06*Math.random(),l=(0,i.useMemo)(()=>["#00ffff","#ff00ff","#FF7F11","#ff3366","#66ff33","#B8B3E9","#B8B3E9","#F87666","6EFAFB","BEEE62","CD9FCC","93FF96","B2FFA8"],[]),c=(0,i.useMemo)(()=>l[Math.floor(Math.random()*l.length)],[l]),u=(0,i.useMemo)(()=>{let e=8*Math.random(),t=2*Math.random()*Math.PI,n=Math.acos(2*Math.random()-1);return new m.Vector3(e*Math.sin(n)*Math.cos(t),e*Math.sin(n)*Math.sin(t),e*Math.cos(n))},[]),d=(0,i.useMemo)(()=>{let e=2*Math.random()*Math.PI,t=Math.acos(2*Math.random()-1),n=50*Math.sin(t)*Math.cos(e),o=50*Math.sin(t)*Math.sin(e),r=50*Math.cos(t);return new m.Vector3(n,o,r)},[]);(0,i.useEffect)(()=>{n.current&&n.current.position.copy(d)},[d]),(0,i.useEffect)(()=>{let e=u.clone().sub(d).normalize(),t=m.MathUtils.degToRad(6*Math.random()-3),n=new m.Vector3(.9,.1*Math.random()-.05,.2*Math.random()-.1).normalize();e.applyAxisAngle(n,t),r.current=e.multiplyScalar(.4*Math.random()+.04)},[d,u]);let[h,p]=(0,i.useState)(1);return(0,i.useEffect)(()=>{let e=setTimeout(()=>{p(0);let e=setTimeout(()=>{t()},1e3);return()=>clearTimeout(e)},15e3);return()=>clearTimeout(e)},[t]),(0,s.F)(()=>{n.current&&r.current&&n.current.position.add(r.current)}),(0,o.jsxs)("group",{children:[(0,o.jsxs)("mesh",{ref:n,children:[(0,o.jsx)("sphereGeometry",{args:[a,32,32]}),(0,o.jsx)("meshStandardMaterial",{color:new m.Color(c),transparent:!0,opacity:h})]}),(0,o.jsx)(M,{color:new m.Color(c),size:a,meshRef:n,orbitRadius:10,orbitSpeed:.025,opacity:h})]})};(0,s.e)({OrbitControls:j.z,TransformControls:S.Ys});var _=e=>{let{onSelectPlanet:t,selectedPlanet:n}=e,[r,a]=(0,i.useState)([]),s=(0,i.useRef)([]),l=(0,i.useMemo)(()=>[{position:[0,0,0],link:"https://fretboardx.com",label:"Fretboard-x",description:"explore()",orbitRadius:2.33,orbitSpeed:.775,planetColor:"#B7D3F2",size:.29,rotationSpeed:.02,moons:[{orbitRadius:.55,orbitSpeed:3.25,size:.12,moonColor:"#B7D3F2",link:"https://github.com/RidwanSharkar/Fretboard-2.0",label:"Fretboard-2.0"}],logoTexturePath:"/textures/Fretboardx_logo.png"},{position:[0,0,0],link:"https://www.linkedin.com/in/ridwansharkar",label:"LinkedIn",description:"connect()",orbitRadius:3.6,orbitSpeed:.4,planetColor:"#4FB8FF",size:.37,rotationSpeed:.01,rings:[{color:"#00FFFF",innerScale:1.3,outerScale:1.45,inclination:-Math.PI/3}],logoTexturePath:"/textures/LinkedIn_logo.svg"},{position:[0,0,0],link:"https://github.com/RidwanSharkar",label:"GitHub",description:"collaborate()",orbitRadius:6.3,orbitSpeed:.125,startAngle:0,planetColor:"#8980F5",rings:[{color:"#FFAAEE",innerScale:1.25,outerScale:1.4,inclination:0},{color:"#FFAAEE",innerScale:1.5,outerScale:1.825,inclination:Math.PI/2}],size:.525,rotationSpeed:.01,moons:[{orbitRadius:1.05,orbitSpeed:2.25,size:.11,moonColor:"#F9B9F2",link:"https://github.com/RidwanSharkar/Predictive-Analysis-of-MMA-Fights",label:"Predictive Analysis"},{orbitRadius:1.35,orbitSpeed:1.5,size:.1625,moonColor:"#FFAAEE",link:"https://github.com/RidwanSharkar/Pharmacological-Compound-Classifier",label:"Compound Classifier"},{orbitRadius:1.67,orbitSpeed:2.2,size:.13,moonColor:"#D295BF",link:"https://github.com/RidwanSharkar/Arbitrage-Better",label:"MMA Arbitrager"}],logoTexturePath:"/textures/Github_logo.svg"},{position:[0,0,0],link:"https://github.com/RidwanSharkar/The-Nutrimancers-Codex",label:"The Nutrimancer's Codex - Vol. II",description:"unknown()",orbitRadius:6.3,orbitSpeed:.125,startAngle:Math.PI,planetColor:"#84DCC6",rings:[{color:"#7EE081",innerScale:1.25,outerScale:1.6,inclination:Math.PI/4.5}],size:.325,rotationSpeed:.01,logoTexturePath:"/textures/Nutrimancer_logo.svg"},{position:[0,0,0],link:"https://instagram.com/ridwansharkar/?hl=en",label:"Instagram",description:"carveWood()",orbitRadius:8.3,orbitSpeed:.2,planetColor:"#F4ACB7",rings:[{color:"#F694C1",innerScale:1.4,outerScale:2.25,inclination:-Math.PI/2.3}],size:.4,rotationSpeed:.001,moons:[{orbitRadius:1.1,orbitSpeed:1.8,size:.175,moonColor:"#E8E9ED",link:"https://www.artstation.com/ridwansharkar",label:"Art Station"}],logoTexturePath:"/textures/Instagram_logo.svg"},{position:[0,0,0],link:"https://mythos.store",label:"Mythos.store",description:"browse(), buy()",orbitRadius:10,orbitSpeed:.285,planetColor:"#2DE1FC",rings:[{color:"#2DE1FC",innerScale:1.3,outerScale:1.75,inclination:-Math.PI}],size:.333,rotationSpeed:.01,moons:[{orbitRadius:.8,orbitSpeed:3,size:.1,moonColor:"#a6b5b7",link:"https://www.facebook.com/mythoscarver/",label:"Facebook"}],logoTexturePath:"/textures/Mythos_logo.png"},{position:[0,0,0],link:"https://open.spotify.com/user/1268486981",label:"Spotify",description:"getPlaylists()",orbitRadius:4.7,orbitSpeed:.47,planetColor:"#F9B9F2",rings:[{color:"white",innerScale:1.2,outerScale:1.5,inclination:Math.PI/2}],size:.225,rotationSpeed:.02,logoTexturePath:"/textures/Spotify_logo.svg"}],[]);(0,i.useEffect)(()=>{s.current=l.map(()=>i.createRef())},[l.length,l]);let[c,u]=(0,i.useState)([]);(0,i.useEffect)(()=>{let e=setInterval(()=>{u(e=>[...e,Date.now()])},15e3);return()=>clearInterval(e)},[]);let d=e=>{u(t=>t.filter(t=>t!==e))};return(0,o.jsxs)(i.Suspense,{fallback:null,children:[(0,o.jsx)(f,{}),(0,o.jsx)(y,{planetPositions:(()=>{let e=[];return s.current.forEach(t=>{if(t.current){let n=new m.Vector3;t.current.getWorldPosition(n),e.push(n.clone())}else e.push(new m.Vector3(0,0,0))}),e})(),planetSizes:l.map(e=>e.size),onCollision:(e,t)=>{if(s.current[e].current){a(e=>e.filter(e=>e.id!==Date.now()));let n={position:t.clone(),color:l[e].planetColor,id:Date.now()};a(e=>[...e,n]),setTimeout(()=>{a(e=>e.filter(e=>e.id!==n.id))},1e3)}}}),l.map((e,t)=>(0,o.jsxs)("mesh",{"rotation-x":Math.PI/2,children:[(0,o.jsx)("ringGeometry",{args:[e.orbitRadius,e.orbitRadius+.05,64]}),(0,o.jsx)("meshBasicMaterial",{color:"#ffffff",opacity:.08,transparent:!0,side:m.DoubleSide})]},"orbit-".concat(t))),r.map(e=>(0,o.jsxs)("mesh",{position:e.position,children:[(0,o.jsx)("sphereGeometry",{args:[.1,16,16]}),(0,o.jsx)("meshBasicMaterial",{color:e.color})]},e.id)),l.map((e,r)=>(0,o.jsx)(x,{...e,index:r,onSelectPlanet:t,selected:(null==n?void 0:n.index)===r,collisionTriggered:!1,ref:s.current[r]},r)),c.map(e=>(0,o.jsx)(P,{onRemove:()=>d(e)},e)),r.map(e=>(0,o.jsx)(g,{position:e.position,color:e.color,size:.5,duration:1,particleCount:30},e.id))]})};let C=()=>{let{camera:e,size:t}=(0,s.D)();return i.useEffect(()=>{t.width<768?e.position.set(0,15,20):e.position.set(0,20,25)},[t,e]),null};var w=e=>{let{onSelectPlanet:t,selectedPlanet:n}=e;return(0,o.jsxs)(l.Xz,{camera:{position:[0,20,25],fov:60},className:"w-full h-full",children:[(0,o.jsx)(C,{}),(0,o.jsx)("ambientLight",{intensity:.3}),(0,o.jsx)("pointLight",{position:[0,0,0],intensity:1,color:"#FDB813"}),(0,o.jsx)(c.t,{radius:100,depth:100,count:4e3,factor:4,saturation:0,fade:!0}),(0,o.jsx)(i.Suspense,{fallback:(0,o.jsx)(u.V,{center:!0,children:"Loading..."}),children:(0,o.jsx)(_,{onSelectPlanet:t,selectedPlanet:n})}),(0,o.jsx)(d.z,{enableZoom:!0,minDistance:5,maxDistance:30,enablePan:!1,zoomSpeed:.15,enableDamping:!0,dampingFactor:.4})]})},F=n(3709),k=n.n(F),N=n(5480),I=n(3114),R=n(5675),E=n.n(R);let T=e=>"".concat(Math.round(21100*e).toLocaleString()," miles"),B=(e,t)=>{var n;return"".concat((null===(n=({"Fretboard-x":66775,LinkedIn:49250,GitHub:21510,"The Nutrimancer's Codex - Vol. II":21510,Instagram:48990,"Mythos.store":117225,Spotify:62670})[t])||void 0===n?void 0:n.toLocaleString())||0," mph")},z=e=>"".concat((1e8*e).toExponential(2)," miles"),A=e=>"".concat({"Fretboard-x":420,LinkedIn:69,GitHub:11.8,"The Nutrimancer's Codex - Vol. II":378.4,Instagram:-41.7,"Mythos.store":-359.7,Spotify:42.9}[e]||0,"\xb0F"),D=e=>{var t;return(null===(t=({"#B7D3F2":"• [N<sub>2</sub>] Nitrogen (74%)\n• [O<sub>2</sub>] Oxygen (25%)\n• [Ar] Argon (1%)","#4FB8FF":"• [N<sub>2</sub>] Nitrogen (80%)\n• [CH<sub>4</sub>] Methane (15%)\n• [H<sub>2</sub>] Hydrogen (5%)","#8980F5":"• [H<sub>2</sub>] Hydrogen (68%)\n• [He] Helium (3%)\n• [CH<sub>4</sub>] Methane (1%)","#84DCC6":"• [CO<sub>2</sub>] Carbon Dioxide (88%)\n• [N<sub>2</sub>] Nitrogen (10%)\n• [Ar] Argon (2%)","#F4ACB7":"• [SO<sub>2</sub>] Sulfur Dioxide (80%)\n• [CO<sub>2</sub>] Carbon Dioxide (15%)\n• [He] Helium (5%)","#2DE1FC":"• [He] Helium (60%)\n• [H<sub>2</sub>] Hydrogen (30%)\n• [CH<sub>4</sub>] Methane (10%)","#F9B9F2":"• [CO<sub>2</sub>] Carbon Dioxide (60%)\n• [H<sub>2</sub>] Hydrogen (25%)\n• [Ne] Neon (10%)\n• [TiO<sub>2</sub>] Titanium Dioxide (5%)"})[e])||void 0===t?void 0:t.split("\n").map(e=>'<div style="margin-left: 1rem">'.concat(e,"</div>")).join(""))||"Unknown composition"},G=e=>{let t={"Fretboard-x":14e23,LinkedIn:17e24,GitHub:57e25,"The Nutrimancer's Codex - Vol. II":15e24,Instagram:23e25,"Mythos.store":98e24,Spotify:12e23}[e];return t?"".concat(t.toExponential(2)," lbs"):"Unknown mass"},H=e=>{let{moons:t}=e;return(0,o.jsxs)(N.E.div,{className:k().moonStatsPanel,initial:{opacity:0,x:-20,y:-20},animate:{opacity:1,x:0,y:0},exit:{opacity:0,x:-20,y:-20},transition:{duration:.5},children:[(0,o.jsx)("h3",{className:"".concat(k().statsTitle," ").concat(t.some(e=>"The Nutrimancer's Codex - Vol. II"===e.label)?k().nutrimancerTitle:""),children:"Satellites:"}),(0,o.jsx)("div",{className:k().moonGrid,children:t.map((e,t)=>(0,o.jsxs)("div",{className:k().moonRow,children:[(0,o.jsxs)("div",{className:k().moonInfo,children:[(0,o.jsx)("span",{className:k().moonName,children:e.label||"Unknown Moon"}),(0,o.jsxs)("span",{className:k().moonSize,children:["Diameter: ",T(e.size)]})]}),(0,o.jsx)("a",{href:e.link,target:"_blank",rel:"noopener noreferrer",className:k().moonButton,children:"Visit"})]},t))})]})},V=(e,t)=>{let n={"Fretboard-x":14e23,LinkedIn:17e24,GitHub:57e25,"The Nutrimancer's Codex - Vol. II":15e24,Instagram:23e25,"Mythos.store":18e24,Spotify:12e23}[e];if(!n)return"Unknown";let o=21100*t/2*1609.344;return"".concat((.45359237*n*66743e-15/(o*o)).toFixed(2)," m/s\xb2")};var L=e=>{let{planet:t,onClose:n}=e,[r,a]=(0,i.useState)(!1),s=(0,i.useRef)(null);return(0,i.useEffect)(()=>{if(a(!0),s.current){let e=s.current.getBoundingClientRect().height;document.documentElement.style.setProperty("--stats-panel-height","".concat(e,"px"))}},[]),(0,o.jsx)(I.M,{children:r&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("div",{className:k().overlay,onClick:()=>{a(!1),setTimeout(n,500)}}),(0,o.jsxs)("div",{className:k().panelsContainer,children:[(0,o.jsxs)(N.E.div,{className:k().statsPanel,initial:{opacity:0,x:-20,y:-20},animate:{opacity:1,x:0,y:0},exit:{opacity:0,x:-20,y:-20},transition:{duration:.5},ref:s,children:[(0,o.jsxs)("h3",{className:"".concat(k().statsTitle," ").concat("The Nutrimancer's Codex - Vol. II"===t.label?k().nutrimancerTitle:""),children:["{ ",t.label," }"]}),(0,o.jsxs)("div",{className:"".concat(k().statsGrid," text-sm"),children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("span",{children:"Mass:"})," ",(0,o.jsx)("span",{children:G(t.label)})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("span",{children:"Diameter:"})," ",(0,o.jsx)("span",{children:T(t.size)})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("span",{children:"Orbital Speed:"})," ",(0,o.jsx)("span",{children:B(t.orbitSpeed,t.label)})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("span",{children:"Orbital Radius:"})," ",(0,o.jsx)("span",{children:z(t.orbitRadius)})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("span",{children:"Surface Gravity:"})," ",(0,o.jsx)("span",{children:V(t.label,t.size)})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("span",{children:"Mean Temperature:"})," ",(0,o.jsx)("span",{children:A(t.label)})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("span",{children:"Emission Spectrum:"}),(0,o.jsx)("div",{dangerouslySetInnerHTML:{__html:D(t.planetColor)}})]})]})]}),t.moons&&t.moons.length>0&&(0,o.jsx)(H,{moons:t.moons})]}),(0,o.jsxs)(N.E.div,{className:k().infoPanel,initial:{opacity:0,y:-20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.5},children:[(0,o.jsxs)("div",{className:k().infoPanelContent,children:[(0,o.jsx)("div",{className:k().planetIcon,children:(0,o.jsx)(E(),{src:t.logoTexturePath||"/textures/transparent.png",alt:"".concat(t.label," icon"),width:42,height:42,className:k().planetIconImage})}),(0,o.jsxs)("div",{children:[(0,o.jsx)("h2",{className:"The Nutrimancer's Codex - Vol. II"===t.label?k().nutrimancerTitle:"",children:t.label}),(0,o.jsx)("p",{children:t.description||"No description available."})]})]}),(0,o.jsx)("a",{href:t.link,target:"_blank",rel:"noopener noreferrer",className:k().infoButton,children:"Visit"})]})]})})},O=e=>{let{content:t}=e,[n,r]=(0,i.useState)(!1);return(0,i.useEffect)(()=>{r(!0)},[]),(0,o.jsx)(I.M,{children:n&&(0,o.jsx)(N.E.div,{className:k().fixedBottomLeftPanel,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:20},transition:{duration:.5},children:t})})},U=n(4810),W=n.n(U);let Q=[{id:1,name:"⌬",src:"/audio/track1.MP3"},{id:2,name:"❅",src:"/audio/track2.MP3"},{id:3,name:"♨",src:"/audio/track3.MP3"},{id:4,name:"⚘",src:"/audio/track4.MP3"},{id:5,name:"☯",src:"/audio/track5.MP3"}];var X=e=>{let{src:t}=e,n=(0,i.useRef)(null),[r,a]=(0,i.useState)(!1),[s,l]=(0,i.useState)(!0),[c,u]=(0,i.useState)(.5),[d,m]=(0,i.useState)({id:0,name:"Custom Track",src:t}),h=e=>{m(e),a(!1),n.current&&n.current.load()};return(0,o.jsxs)("div",{className:W().audioContainer,children:[(0,o.jsx)("div",{className:W().trackButtons,children:Q.map(e=>(0,o.jsx)("button",{onClick:()=>h(e),className:"".concat(W().trackButton," ").concat(d.id===e.id?W().activeTrack:""),children:e.name},e.id))}),(0,o.jsxs)("div",{className:W().audioPlayer,children:[(0,o.jsx)("button",{onClick:()=>{n.current&&(r?n.current.pause():n.current.play().catch(e=>{console.error("Failed to play audio:",e)}),a(!r))},className:W().playPauseButton,children:r?"⏸️":"▶️"}),(0,o.jsx)("button",{onClick:()=>{n.current&&(n.current.muted=!s,l(!s))},className:W().muteButton,children:s?"\uD83D\uDD07":"\uD83D\uDD0A"}),(0,o.jsx)("input",{type:"range",min:"0",max:"1",step:"0.01",value:c,onChange:e=>{let t=parseFloat(e.target.value);u(t),n.current&&(n.current.volume=t)},className:W().volumeSlider}),(0,o.jsx)("audio",{ref:n,src:d.src,controls:!1})]})]})},Z=()=>{let[e,t]=(0,i.useState)(null);return(0,o.jsxs)("div",{className:"w-screen h-screen bg-gray-900 relative",children:[(0,o.jsxs)(a(),{children:[(0,o.jsx)("title",{children:"Planetfolio"}),(0,o.jsx)("meta",{name:"description",content:"Ridwan Sharkar Landing Page"}),(0,o.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,o.jsx)(w,{onSelectPlanet:(e,n)=>{t(t=>(null==t?void 0:t.index)===e?null:{index:e,planet:n})},selectedPlanet:e}),e&&(0,o.jsx)(L,{planet:e.planet,onClose:()=>{t(null)}}),(0,o.jsx)(O,{content:(0,o.jsx)("div",{children:(0,o.jsx)(X,{src:"/audio/track3.MP3"})})})]})}},3709:function(e){e.exports={infoPanel:"InfoPanel_infoPanel__GYtAp",fixedBottomLeftPanel:"InfoPanel_fixedBottomLeftPanel__cWTEt",overlay:"InfoPanel_overlay__QRjEz",infoButton:"InfoPanel_infoButton__FAHu9",statsPanel:"InfoPanel_statsPanel__V1Ppa",statsGrid:"InfoPanel_statsGrid__Oert5",linkPanel:"InfoPanel_linkPanel__Z74lQ",iconLink:"InfoPanel_iconLink__8Sg2Q",infoPanelContent:"InfoPanel_infoPanelContent__VgXsX",planetIcon:"InfoPanel_planetIcon__LJHWM",moonStatsPanel:"InfoPanel_moonStatsPanel__A3YPH",moonGrid:"InfoPanel_moonGrid__ldecS",moonRow:"InfoPanel_moonRow__TsA7b",moonInfo:"InfoPanel_moonInfo__EiQIL",moonName:"InfoPanel_moonName__RLtMD",moonSize:"InfoPanel_moonSize__Ieo8G",moonButton:"InfoPanel_moonButton__OMnEO",panelsContainer:"InfoPanel_panelsContainer__1v057",statsTitle:"InfoPanel_statsTitle__xO1kW",nutrimancerTitle:"InfoPanel_nutrimancerTitle__OeQUt"}},4810:function(e){e.exports={audioContainer:"SoundPlayer_audioContainer__fKcfU",trackButtons:"SoundPlayer_trackButtons__Jlu8q",trackButton:"SoundPlayer_trackButton__ZnoyF",activeTrack:"SoundPlayer_activeTrack__LihFP",audioPlayer:"SoundPlayer_audioPlayer__Coblk",playPauseButton:"SoundPlayer_playPauseButton__PyRAk",muteButton:"SoundPlayer_muteButton__CpKjf",volumeSlider:"SoundPlayer_volumeSlider__urkx9"}}},function(e){e.O(0,[737,7,888,774,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);