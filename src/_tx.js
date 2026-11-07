function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;t.encoding=THREE.sRGBEncoding;return t;}
function speck(g,w,h,n,cols,s=2,a=.25){for(let i=0;i<n;i++){g.fillStyle=cols[i%cols.length];g.globalAlpha=Math.random()*a;g.fillRect(Math.random()*w,Math.random()*h,s,s);}g.globalAlpha=1;}
const TX={
 facade:canvasTex(256,256,(g,w,h)=>{g.fillStyle='#c9d2cd';g.fillRect(0,0,w,h);speck(g,w,h,2500,['#9aa6a0','#e8eee9'],3,.3);
  g.fillStyle='rgba(0,0,0,.06)';for(let y=0;y<h;y+=32)g.fillRect(0,y,w,1);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(0,0,w,6);}),
 siding:canvasTex(256,256,(g,w,h)=>{for(let y=0;y<h;y+=16){g.fillStyle=y/16%2?'#d8b878':'#cfae6c';g.fillRect(0,y,w,16);g.fillStyle='rgba(80,50,20,.35)';g.fillRect(0,y+14,w,2);}speck(g,w,h,800,['#6b4a20']);}),
 brick:canvasTex(256,256,(g,w,h)=>{g.fillStyle='#d8d0c4';g.fillRect(0,0,w,h);const bh=32,bw=64;
  for(let y=0;y<h;y+=bh)for(let x=-(y/bh%2)*bw/2;x<w;x+=bw){const v=Math.random()*30;g.fillStyle=`rgb(${120+v},${70+v*.6},${55+v*.4})`;g.fillRect(x+2,y+2,bw-4,bh-4);}speck(g,w,h,1800,['#000','#fff']);}),
 plaster:canvasTex(256,256,(g,w,h)=>{g.fillStyle='#f4f1ea';g.fillRect(0,0,w,h);speck(g,w,h,2500,['#b8b0a0','#fff'],3);
  g.fillStyle='rgba(0,0,0,.08)';g.fillRect(0,h-36,w,36);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,h-38,w,3);}),
 wood:canvasTex(256,256,(g,w,h)=>{const pw=32;for(let x=0;x<w;x+=pw){const v=Math.random()*25;g.fillStyle=`rgb(${168+v},${118+v},${72+v*.6})`;g.fillRect(x,0,pw,h);
  for(let i=0;i<12;i++){g.strokeStyle=`rgba(80,45,20,${Math.random()*.25})`;g.beginPath();const xx=x+Math.random()*pw;g.moveTo(xx,0);g.bezierCurveTo(xx+4,h/3,xx-4,h*2/3,xx,h);g.stroke();}
  g.fillStyle='rgba(60,35,15,.6)';g.fillRect(x,0,1.5,h);g.fillRect(x,Math.random()*h,pw,1.5);}}),
 tile:canvasTex(256,256,(g,w,h)=>{const s=64;for(let y=0;y<h;y+=s)for(let x=0;x<w;x+=s){g.fillStyle=((x+y)/s)%2?'#e9e4d8':'#d5dcd8';g.fillRect(x,y,s,s);}
  g.strokeStyle='rgba(90,90,90,.4)';g.lineWidth=2;for(let i=0;i<=w;i+=s){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.moveTo(0,i);g.lineTo(w,i);g.stroke();}speck(g,w,h,1000,['#000','#fff']);}),
 carpet:canvasTex(128,128,(g,w,h)=>{g.fillStyle='#8f7a6a';g.fillRect(0,0,w,h);speck(g,w,h,4000,['#5d4a3c','#b59a85','#7a6555'],1.5,.35);}),
 concrete:canvasTex(256,256,(g,w,h)=>{g.fillStyle='#a7a9a6';g.fillRect(0,0,w,h);speck(g,w,h,4000,['#6e706c','#d0d2cf'],3);g.strokeStyle='rgba(60,60,60,.3)';g.strokeRect(1,1,w-2,h-2);}),
 grass:canvasTex(256,256,(g,w,h)=>{g.fillStyle='#69a043';g.fillRect(0,0,w,h);for(let i=0;i<3500;i++){const v=Math.random();g.strokeStyle=v<.5?'#548a33':v<.8?'#86ba58':'#467a2a';g.globalAlpha=.6;
  const x=Math.random()*w,y=Math.random()*h;g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd(-2,2),y-rnd(3,7));g.stroke();}g.globalAlpha=1;}),
 sand:canvasTex(256,256,(g,w,h)=>{g.fillStyle='#e2b98a';g.fillRect(0,0,w,h);speck(g,w,h,6000,['#c99a68','#f1d3ab','#b88a5a'],2,.5);}),
 asphalt:canvasTex(256,256,(g,w,h)=>{g.fillStyle='#55575a';g.fillRect(0,0,w,h);speck(g,w,h,6000,['#3a3c3f','#77797c'],2,.5);}),
 paving:canvasTex(256,256,(g,w,h)=>{g.fillStyle='#8d877c';g.fillRect(0,0,w,h);const s=64;
  for(let y=0;y<h;y+=s/2)for(let x=-(y/(s/2)%2)*s/2;x<w;x+=s){const v=Math.random()*24;g.fillStyle=`rgb(${176+v},${170+v},${158+v})`;g.fillRect(x+2,y+2,s-4,s/2-4);}}),
 stone:canvasTex(256,256,(g,w,h)=>{g.fillStyle='#8f8f8a';g.fillRect(0,0,w,h);for(let i=0;i<40;i++){const v=Math.random()*40;g.fillStyle=`rgb(${150+v},${150+v},${145+v})`;
  const x=Math.random()*w,y=Math.random()*h,r=14+Math.random()*20;g.beginPath();g.ellipse(x,y,r,r*.7,0,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.3)';g.stroke();}}),
 pillar:canvasTex(128,128,(g,w,h)=>{const s=32;for(let y=0;y<h;y+=s)for(let x=0;x<w;x+=s){const v=Math.random()*20;g.fillStyle=`rgb(${205+v},${178+v},${120+v})`;g.fillRect(x+2,y+2,s-4,s-4);}}),
 window:canvasTex(128,128,(g,w,h)=>{g.fillStyle='#f2f2ee';g.fillRect(0,0,w,h);const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#2d4a66');gr.addColorStop(.6,'#4f7ea6');gr.addColorStop(1,'#2a3d52');
  g.fillStyle=gr;g.fillRect(8,8,w-16,h-16);g.fillStyle='#f2f2ee';g.fillRect(w/2-3,8,6,h-16);g.fillRect(8,h/2-3,w-16,6);g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.moveTo(12,40);g.lineTo(40,12);g.lineTo(52,12);g.lineTo(12,52);g.fill();}),
 roofflat:canvasTex(128,128,(g,w,h)=>{g.fillStyle='#9a9c98';g.fillRect(0,0,w,h);speck(g,w,h,3000,['#6a6c68','#c0c2be'],2,.5);}),
 shingle:canvasTex(256,256,(g,w,h)=>{const rh=24,sw=32;for(let y=0;y<h;y+=rh)for(let x=-(y/rh%2)*sw/2;x<w;x+=sw){const v=Math.random()*20;
  g.fillStyle=`rgb(${110+v},${100+v},${92+v})`;g.fillRect(x+1,y,sw-2,rh-2);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+1,y+rh-5,sw-2,3);}}),
 bluemetal:canvasTex(128,128,(g,w,h)=>{g.fillStyle='#2f4a7a';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=16){g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x,0,3,h);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+12,0,2,h);}}),
 metal:canvasTex(128,128,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,0);gr.addColorStop(0,'#8a959e');gr.addColorStop(.5,'#c3cbd1');gr.addColorStop(1,'#7d8890');g.fillStyle=gr;g.fillRect(0,0,w,h);}),
 crate:canvasTex(128,128,(g,w,h)=>{g.fillStyle='#a87b4a';g.fillRect(0,0,w,h);g.strokeStyle='#6d4a26';g.lineWidth=10;g.strokeRect(5,5,w-10,h-10);g.beginPath();g.moveTo(8,8);g.lineTo(w-8,h-8);g.stroke();}),
 chalk:canvasTex(256,128,(g,w,h)=>{g.fillStyle='#24453a';g.fillRect(0,0,w,h);g.fillStyle='rgba(255,255,255,.8)';g.font='20px monospace';g.fillText('LỊCH SỬ VERMONT',12,40);g.fillText('Bài 4: Năm 1791',12,80);}),
 water:canvasTex(128,128,(g,w,h)=>{g.fillStyle='#3fb6e0';g.fillRect(0,0,w,h);for(let i=0;i<60;i++){g.strokeStyle='rgba(255,255,255,.35)';g.beginPath();const x=Math.random()*w,y=Math.random()*h;g.moveTo(x,y);g.quadraticCurveTo(x+8,y-4,x+16,y);g.stroke();}}),
 lane:canvasTex(128,128,(g,w,h)=>{g.fillStyle='#9fd9c0';g.fillRect(0,0,w,h);speck(g,w,h,800,['#7fc0a6','#c0eedd']);}),
};
