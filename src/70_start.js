/* =====================================================================
   MAPLE HOLLOW · start
   ===================================================================== */
AVS.pastor={k:'m',age:62,skin:'#e8c0a0',hair:'#e4e4e4',hairHi:'#ffffff',hs:'swept',eye:'#5a6a7a',lip:'#a8645c',lines:2,outfit:'suit',oc:'#1a1a1a',oc2:'#262626',tie:'#f4f4f4',kind:1,bg:['#6a5a44','#1a140e']};
{const pv=document.getElementById('pav');pv.getContext('2d').drawImage(portrait(LEO,92,'leo'),0,0);}
NPCS.forEach(spawnNPC);
tp(S.pos[0],S.pos[1]);
const INTRO=['Maple Hollow, Vermont. Dân số 2.300. Một con phố chính, một nhà thờ trắng, một hồ nước giữa công viên và rất nhiều lá phong đỏ.',
 'Bạn là Leo, 19 tuổi, vừa xuống xe buýt với một chiếc ba lô. Từ hôm nay bạn sống với Dì Celine, người giám hộ của bạn.',
 'Thị trưởng Richard Lang điều hành thị trấn bằng nụ cười và nội quy: giờ giới nghiêm 23:00, cấm tụ tập, cấm "gây phiền". Cảnh sát Simon thuộc lòng từng điều.',
 'Chủ nhật này là Ngày Hội Thành Lập. Hội đồng sẽ bỏ phiếu cho dự án "Hollow Commons" của Thị trưởng: san phẳng công viên Town Green và nhà thờ để xây trung tâm thương mại.',
 'Cách chơi: WASD hoặc cần điều khiển để đi, kéo màn hình để xoay, E để nói chuyện và tương tác, C để cúi. Ở khu NHÂN VIÊN, KHU CẤM hay ngoài đường sau 23:00, nếu cảnh sát hoặc nhân viên thấy bạn thì thanh RẮC RỐI sẽ tăng.',
 'Nhà Dì Celine ở ngay sau trạm xe buýt, có hàng rào trắng. Đi thôi.'];
let hasSave=false;try{hasSave=!!localStorage.getItem(SAVE_KEY);}catch(e){}
if(hasSave)pick('Restricted Access · Maple Hollow','Bạn có một bản lưu cũ ở Maple Hollow.',[['Tiếp tục bản lưu',load],['Chơi mới từ đầu',()=>scenePlay('Maple Hollow',INTRO)]]);
else scenePlay('Maple Hollow',INTRO);
requestAnimationFrame(tick);
