/* =====================================================================
   CRESTMOOR · start
   ===================================================================== */
{const pv=document.getElementById('pav');pv.getContext('2d').drawImage(portrait(ETHAN,92,'ethan'),0,0);}
NPCS.forEach(spawnNPC);
tp(S.pos[0],S.pos[1]);
function newGame(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}S=fresh();tp(S.pos[0],S.pos[1]);P.yaw=Math.PI;P.face=0;NPCS.forEach(n=>{n.ov=null;spawnNPC(n);});PEDS.forEach(pedSpawn);
 playIntro(()=>arrivalScene());}
let hasSave=false;try{hasSave=!!localStorage.getItem(SAVE_KEY);}catch(e){}
if(hasSave)pick('Thuê Phòng · Crestmoor','Bạn có một bản lưu ở Crestmoor.',[['Tiếp tục bản lưu',load],['Chơi mới từ đầu (Chương 1)',newGame]]);
else newGame();
requestAnimationFrame(tick);
