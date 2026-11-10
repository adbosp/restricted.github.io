/* =====================================================================
   CRESTMOOR · "Thuê Phòng" · items, notebook, Chapter 1, interactions
   ===================================================================== */
const ITEMS={
 coffee:{n:'Cà phê Crestmoor Diner',d:'Đen và nóng. Hợp với mưa Oregon.',ico:'coffee'},
 donut:{n:'Bánh donut',d:'Phủ đường, hơi dính tay.',ico:'food'},
 cookies:{n:'Hộp bánh quy yến mạch',d:'Loại Sara hay mua ở Crestmoor Mart.',ico:'food'},
 soda:{n:'Lon nước ngọt',d:'Lạnh, vừa lấy từ tủ trạm xăng.',ico:'bottle'},
 flowers:{n:'Bó cúc vàng',d:'Giống mấy chậu hoa bên bậc thềm nhà Whitfield.',ico:'flower'},
 novel:{n:'Tiểu thuyết trinh thám',d:'Sách bìa mềm ở Crestmoor Mart. Kẻ giết người luôn là người hàng xóm.',ico:'book'},
 trash:{n:'Túi rác nhà Whitfield',d:'Sara nhờ bạn mang ra thùng ở lề đường.',ico:'tool'},
 buds:{n:'Tai nghe của Rossie',d:'Bạn đang giấu nó. Rossie sẽ đi tìm.',ico:'phone'},
};
const GIFTS=['coffee','donut','cookies','soda','flowers','novel'];
const LIKES={sara:[['flowers','cookies'],['soda']],rossie:[['soda','donut'],['flowers']],may:[[],['donut','soda']],lucy:[['novel','coffee'],[]],jeanie:[['coffee'],['flowers']],
 bancroft:[['novel'],['donut']],laura:[['coffee'],['soda']],chloe:[['flowers'],[]],evan:[['soda','donut'],[]],max:[['donut'],['novel']],lily:[['soda'],['novel']],
 natasha:[['coffee','donut'],[]],lynda:[['coffee'],[]],marcus:[['coffee'],[]],maria:[['flowers'],['donut']],melania:[['flowers'],['soda']],morgan:[[],['donut']],dave:[[],[]],paul:[[],[]],williams:[[],['flowers']]};

/* ---------- notebook (sổ ghi chú) ---------- */
function addNote(cat,text){const L=S.note[cat];if(L.includes(text))return;L.push(text);toast('Sổ ghi chú: '+text);}
function notePerson(id,text){S.note.people[id]=text;}
const lvl=(v,a=['Thấp','Trung tính','Khá','Cao'])=>v<35?a[0]:v<60?a[1]:v<80?a[2]:a[3];
const trustLabel=()=>lvl(S.rel.sara),rossieLabel=()=>lvl(S.rel.rossie+20),mayLabel=()=>S.mayS<35?'Thấp':S.mayS<60?'Trung bình':'Cao';
function trust(d){S.rel.sara=clamp(S.rel.sara+d,0,100);}
function rossie(d){S.rel.rossie=clamp(S.rel.rossie+d,-40,100);}
function maySus(d){S.mayS=clamp(S.mayS+d,0,100);}

/* ---------- Chapter 1: Ngày dọn vào ----------
   c1: 0 at the gate · 1 unpack · 2 go down to the kitchen · 3 free time until dinner · 4 after dinner ·
       5 sit at the desk · 6 chapter finished (free roam) */
const dinnerT=()=>S.flags.clockFast?18.5:19;
const C1={
 0:{t:'Bấm chuông nhà số 14',o:()=>'Căn nhà gỗ trắng hai tầng có hàng hiên và mấy chậu cúc vàng ngay trước mặt. Đi theo lối sỏi và bấm chuông ở cửa chính.'},
 1:{t:'Cất đồ vào tủ quần áo',o:()=>'Phòng của bạn ở cuối hành lang tầng 2. Tủ quần áo có bản lề hơi kêu.'},
 2:{t:'Xuống bếp',o:()=>'Cầu thang ở đầu hành lang tầng 2. Bếp nằm ở tầng 1, phía sau phòng khách.'},
 3:{t:'Bữa tối lúc 7 giờ',o:()=>`Có mặt ở bàn ăn trong bếp lúc ${hm(dinnerT())}, đừng đến muộn. Trong lúc chờ, bạn có thể nói chuyện với Sara và Rossie, đọc sổ ghi chú (J) hoặc đi dạo khu phố.`},
 4:{t:'Lên phòng',o:()=>'Đi qua phòng khách, lên tầng 2 về phòng của bạn.'},
 5:{t:'Ngồi vào bàn học',o:()=>'Bàn học kê sát cửa sổ trong phòng bạn, nhìn ra vườn sau.'},
 6:{t:'Chương 2 sắp ra mắt',o:()=>'Bạn có thể tiếp tục sống ở Crestmoor: làm quen thị trấn, kết thân với mọi người. Lựa chọn cuối Chương 1 đã được lưu.'}};
function questText(){if(S.flags.ending)return'<b>Hết truyện</b><p>Tải lại bản lưu để chơi tiếp.</p>';const c=C1[Math.floor(S.c1)]||C1[6];let extra='';
 if(S.c1===3&&S.flags.trashTask===1)extra=`<p><b style="font-size:13px">Việc vặt:</b> ${has('trash')?'Mang túi rác ra thùng ở lề đường, ngay ngoài hàng rào.':'Túi rác để cạnh tủ lạnh trong bếp.'}</p>`;
 return`<b>Chương 1 · ${c.t}</b><p>${c.o()}</p>${extra}`;}
// where the story wants a character right now (overrides their routine)
function storyPlace(n){const c=Math.floor(S.c1),h=hour();
 if(n.id==='sara'){if(c<=2)return'whit';if(c===3)return h>=dinnerT()-1.2?'w_kitchen':null;if(c===4||c===5)return'w_kitchen';}
 if(n.id==='rossie'){if(c<=1)return S.flags.slam?'w_rossie':'away';if(c===2)return'w_kitchen';if(c===3)return h>=dinnerT()-.15?'w_kitchen':'w_rossie';if(c===4||c===5)return'w_rossie';}
 if(n.id==='may'){if(c<=2)return'mayfence';if(c===4||c===5)return'r_may';}
 return null;}

const SAY=(id,t)=>[id,t];// a spoken line with a portrait
function arrivalScene(){scenePlay('Chương 1 · Ngày dọn vào',['Crestmoor, Oregon. Đầu tháng Chín.',
 'Ethan Cole kéo chiếc vali cũ qua con đường rải sỏi trước căn nhà gỗ hai tầng. Sơn trắng đã bong ở góc cửa sổ, nhưng hàng hiên vẫn được quét sạch, và có người đã tưới mấy chậu hoa cúc vàng đặt cạnh bậc thềm.',
 'Cậu đứng lại, nhìn số nhà trên cánh cổng một lúc lâu.'],()=>save(true));}
function ringBell(){const sa=npc('sara');Object.assign(sa,{x:-23,z:11.4,face:Math.PI});
 scenePlay('Nhà Whitfield',['Cậu bấm chuông.',
  'Người mở cửa là một phụ nữ tóc nâu buộc gọn, mặc áo len xám, tay còn cầm một chiếc khăn lau bát. Đôi mắt bà quét qua cậu một lượt, kỹ đến mức Ethan thấy hơi ngượng.',
  SAY('sara','"Cậu là Ethan?"'),SAY('ethan','"Dạ, cháu là Ethan. Cô là cô Whitfield ạ?"'),
  SAY('sara','"Gọi tôi là Sara." Bà nghiêng người nhường lối. "Vào đi, đừng đứng ngoài đó. Cái vali kia không cần để ngoài hiên đâu."')],()=>{
  S.flags.movedIn=1;tp(116.6,22.6);P.face=Math.PI/2;P.yaw=-Math.PI/2;Object.assign(sa,{x:114.3,z:22.6,face:Math.PI/2,path:[],final:null});sa.talkT=30;
  scenePlay('Tầng 2 nhà Whitfield',['Căn phòng cho thuê nằm ở tầng hai, cuối hành lang. Cửa gỗ, một giường đơn, một bàn học sát cửa sổ nhìn ra vườn sau, và một tủ quần áo có bản lề hơi kêu.',
   'Có chiếc đèn bàn kiểu cũ, chụp vải màu kem, và trên kệ có đúng ba cuốn sách bìa cứng: một cuốn sổ tay nấu ăn, một cuốn từ điển, và một cuốn tiểu thuyết trinh thám đã sờn gáy.',
   SAY('sara','"Phòng này trước kia là phòng làm việc của chồng tôi," Sara nói, tựa vai vào khung cửa. "Anh ấy mất hai năm trước. Phòng ngủ chính là của tôi, phòng bên kia là của Rossie. Nhà có một nhà vệ sinh chung ở tầng hai, bếp và phòng khách ở dưới. Cậu được dùng sân sau, nhưng xe cộ thì để ngoài đường, vì sân sau chỉ có một chỗ đậu."'),
   SAY('ethan','"Dạ, cháu hiểu rồi ạ."'),
   SAY('sara','"Còn vài quy tắc." Sara đếm trên đầu ngón tay, giọng đều đều, như người đã nói câu này nhiều lần. "Mười giờ tối là giờ yên tĩnh. Không mang bạn về qua đêm. Tiền thuê đóng đầu tháng, bằng tiền mặt hoặc chuyển khoản. Và nếu cậu làm vỡ cái gì, cứ nói ngay, đừng để tôi tự phát hiện."'),
   SAY('ethan','"Cháu sẽ nhớ ạ."'),'Bà nhìn cậu thêm một giây nữa, như muốn nói điều gì đó, rồi lại thôi.',SAY('sara','"Bữa tối bảy giờ. Đừng đến muộn."')],()=>{
   ['22:00 là giờ yên tĩnh','Không mang bạn về qua đêm','Tiền thuê đóng đầu tháng (tiền mặt hoặc chuyển khoản)','Làm vỡ gì phải nói ngay','Bữa tối lúc 19:00, đừng đến muộn','Được dùng bếp, phòng khách và sân sau. Xe để ngoài đường'].forEach(r=>{if(!S.note.rules.includes(r))S.note.rules.push(r);});
   toast('Sổ ghi chú: đã ghi 6 quy tắc nhà (J để xem).');
   notePerson('sara','Chủ nhà, góa phụ. Chồng bà mất hai năm trước; phòng của mình từng là phòng làm việc của ông ấy. Bà như muốn nói gì đó rồi lại thôi.');
   sa.talkT=0;S.c1=1;passTime(15);save(true);});});}
function unpack(){scenePlay('Phòng của Ethan',['Ethan mở vali, gấp từng chiếc áo vào tủ. Bản lề kêu cót két mỗi lần cánh tủ đung đưa.',
 'Cậu đang gấp quần áo vào tủ thì nghe tiếng bước chân nặng nề chạy lên cầu thang, theo sau là tiếng cửa phòng bên đập mạnh.',
 'Bên kia bức tường, tiếng nhạc bật lên rồi tắt ngay. Rồi im lặng.'],()=>{S.flags.slam=1;passTime(10);S.c1=2;toast('Mười phút sau...');save(true);});}
function kitchenScene(){S.c1=2.5;const ro=npc('rossie');Object.assign(ro,{x:-28.4,z:24.7,face:0,path:[],final:null});ro.talkT=40;
 scenePlay('Bếp nhà Whitfield',['Ethan xuống bếp. Một cô gái tóc đen buộc đuôi ngựa, áo hoodie rộng thùng thình, đang ngồi trên quầy bếp, một chân đung đưa, tay cầm điện thoại và nhai kẹo cao su. Cô liếc cậu qua vai.',
  SAY('rossie','"Cậu là thằng thuê phòng." Không phải câu hỏi.'),SAY('ethan','"Ethan."'),
  SAY('rossie','"Rossie." Cô chẳng buồn đổi tư thế. "Mẹ tôi bảo tôi phải tử tế với cậu. Tôi đang cố làm vậy đây, đừng có chọc tôi."'),
  SAY('ethan','"Tôi có làm gì đâu."'),
  SAY('rossie','"Chưa." Rossie nhảy xuống, lướt qua cậu để mở tủ lạnh, giọng vẫn lười biếng nhưng sắc. "Tôi học năm ba ở đại học Crestmoor. Cậu học năm nhất ở đó đúng không? Vậy tốt nhất là đừng để tôi thấy mặt cậu ở đâu ngoài nhà này. Tôi không muốn ai biết mẹ tôi cho thuê phòng để trả tiền nợ."'),
  'Cô nói đến chữ "nợ" rất nhanh, như thể vừa lỡ miệng, rồi đóng tủ lạnh lại. Hai người đứng cách nhau một bước trong bếp.'],()=>{
  notePerson('rossie','Con gái Sara, năm ba ở Đại học Crestmoor. Cọc cằn, không muốn ai ở trường biết nhà cô cho thuê phòng. Lỡ miệng nhắc đến "nợ".');
  pick('Rossie','Cô đứng chờ, tay vẫn đặt trên cánh tủ lạnh. Bạn nói gì?',[
   ['(Im lặng)',()=>mayScene()],
   ['"Nợ á?"',()=>{rossie(-5);S.flags.askedDebt=1;scenePlay('Bếp nhà Whitfield',[SAY('rossie','"Cậu nghe nhầm rồi." Rossie trừng mắt nhìn cậu, rồi quay đi. "Và đừng có hỏi mẹ tôi câu đó."')],mayScene);}],
   ['"Yên tâm, tôi không nói với ai đâu."',()=>{rossie(4);scenePlay('Bếp nhà Whitfield',['Rossie liếc cậu, lần đầu tiên không có vẻ khó chịu. Rồi cô nhún vai.',SAY('rossie','"...Ừ. Tốt."')],mayScene);}]]);});}
function mayScene(){const may=npc('may');Object.assign(may,{x:-41.5,z:7.4,face:Math.PI*.9});
 scenePlay('Nhà Whitfield',['Ethan chưa kịp nghĩ ra cách đáp thì tiếng chuông cổng vang lên.',
  'Qua cửa sổ phòng khách, Ethan thấy một người phụ nữ tóc vàng ngắn, mặc áo khoác đỏ, đang đứng bên hàng rào của nhà bên cạnh. Bà ta không bước vào sân, chỉ đứng nhìn về phía cửa sổ tầng hai, nơi phòng của Ethan nằm.',
  'Khi Sara mở cửa, người phụ nữ kia nói, đủ lớn để Ethan nghe rõ:',
  SAY('may','"Sara, cô nên xem lại người cô cho ở trọ đi. Lúc nãy tôi thấy cậu ta đứng bên cửa sổ suốt mấy phút liền. Nhìn chằm chằm vào sân sau nhà tôi."'),
  'Ethan bước ra hành lang, định phản bác, thì Sara đã quay lại nhìn cậu. Ánh mắt bà rất bình tĩnh, nhưng có điều gì đó lạnh đi.',
  SAY('sara','"May, tôi sẽ nói chuyện với cậu ấy." Bà nói với hàng xóm, không rời mắt khỏi Ethan. "Cảm ơn cô đã báo."'),'Cánh cửa khép lại.',
  SAY('sara','"Cậu có đứng bên cửa sổ không?" Sara hỏi, khi họ chỉ còn hai người trong phòng khách.')],()=>{
  tp(-24.5,17.2);P.face=Math.PI;notePerson('may','May Dawson, hàng xóm nhà bên. Tóc vàng ngắn, áo khoác đỏ. Đã mách Sara ngay trong ngày đầu tiên.');
  const after=()=>{maySus(0);S.c1=3;passTime(10);addNote('found','May Dawson theo dõi cửa sổ phòng mình');save(true);};
  pick('Sara','Bà đứng khoanh tay giữa phòng khách, chờ câu trả lời.',[
   ['"Dạ... có. Nhưng chỉ vì cháu nhìn thấy con mèo của hàng xóm leo lên mái..."',()=>{S.mayS=70;if(S.flags.sawCat)trust(2);
    scenePlay('Phòng khách',[SAY('ethan','"Dạ... có. Nhưng chỉ vì cháu nhìn thấy con mèo của hàng xóm leo lên mái, và—"'),
     SAY('sara','"Tôi không cần lý do." Sara cắt ngang. "Tôi chỉ cần cậu hiểu rằng May Dawson không phải người dễ tính, và bà ấy không quên đâu. Đừng cho bà ấy thêm cớ."'),
     'Bà quay đi, rồi dừng lại ở cửa bếp.',SAY('sara','"Bữa tối bảy giờ."')],after);}],
   ['"Không ạ. Chắc bà ấy nhầm."',()=>{S.mayS=80;trust(-6);S.flags.liedToSara=1;
    scenePlay('Phòng khách',[SAY('ethan','"Không ạ. Chắc bà ấy nhầm."'),'Sara nhìn cậu lâu hơn cần thiết.',
     SAY('sara','"May Dawson khó tính, nhưng bà ấy không bịa chuyện." Giọng bà vẫn đều, nhưng lạnh hơn. "Ở nhà này, tôi chỉ xin một điều: đừng nói dối tôi."'),
     'Bà quay đi, rồi dừng lại ở cửa bếp.',SAY('sara','"Bữa tối bảy giờ."')],()=>{addNote('rules','Đừng nói dối Sara');after();});}],
   ['"Có ạ. Cháu sẽ sang xin lỗi bà ấy."',()=>{S.mayS=65;trust(3);S.flags.offeredSorry=1;
    scenePlay('Phòng khách',[SAY('ethan','"Có ạ. Cháu xin lỗi. Cháu sẽ sang nói chuyện với bà ấy."'),
     SAY('sara','"Không cần đâu. Bà ấy sẽ không nghe." Sara thở ra, vai chùng xuống một chút. "Chỉ cần cậu hiểu rằng May Dawson không quên chuyện gì cả. Đừng cho bà ấy thêm cớ."'),
     'Bà quay đi, rồi dừng lại ở cửa bếp.',SAY('sara','"Bữa tối bảy giờ."')],after);}]]);});}
function dinner(missed){S.c1=4;const late=!missed&&hour()>dinnerT()+.25;const L=[];
 if(missed){trust(-10);rossie(-2);L.push('Khi Ethan về đến bếp thì bàn ăn đã dọn. Một đĩa thức ăn bọc màng bọc thực phẩm để sẵn ở chỗ của cậu.',SAY('sara','"Tôi đã nói bảy giờ." Sara không quay lại, tay vẫn rửa bát.'),SAY('rossie','"Ngày đầu tiên đấy," Rossie nói với cái điện thoại, rồi bỏ lên lầu.'));}
 else{if(late){trust(-6);L.push(SAY('sara','"Tôi đã nói bảy giờ." Sara đặt đĩa xuống trước mặt cậu, hơi mạnh tay.'));}
  L.push('Bữa tối hôm đó diễn ra trong im lặng. Sara ăn ít, hỏi Ethan vài câu xã giao về trường lớp. Rossie nghịch thìa, thỉnh thoảng liếc Ethan rồi nhìn đi chỗ khác.');}
 if(!missed&&S.flags.clockFast){trust(-5);rossie(3);L.push('Giữa bữa, Sara nhìn đồng hồ treo tường, rồi nhìn đồng hồ trên điện thoại.',SAY('sara','"Cái đồng hồ này chạy nhanh nửa tiếng." Bà nhìn Ethan lâu hơn một chút.'),'Rossie cúi xuống đĩa, cố nhịn cười.');S.flags.clockFast=0;}
 if(S.flags.trashBad){trust(-6);maySus(10);L.push(SAY('sara','"May vừa nhắn cho tôi. Túi rác bị xé tung ngoài lề đường, rác vương khắp vỉa hè nhà bà ấy." Sara đặt dĩa xuống. "Tôi nhờ cậu một việc thôi."'));S.flags.trashBad=2;}
 if(S.flags.trashOk===1){trust(3);L.push(SAY('sara','"Cảm ơn vì đã đổ rác." Bà nói nhỏ, không ngẩng lên. Nhưng bà có nói.'));S.flags.trashOk=2;}
 const tail=['Bà mẹ đặt điện thoại úp xuống bàn, nhưng Ethan để ý thấy nó rung hai lần, và lần nào Sara cũng nhìn màn hình một giây trước khi nhấc máy nhắn lại.'];
 const finish=()=>scenePlay('Bữa tối',tail,()=>{addNote('found','Điện thoại Sara rung hai lần trong bữa tối. Bà nhắn lại ngay');passTime(35);save(true);});
 scenePlay(missed?'Bếp nhà Whitfield':'Bữa tối',L,()=>{
  if(has('buds')){pick('Rossie',`Rossie đặt thìa xuống. "Ai thấy tai nghe của tôi không? Tôi để trên ghế sofa."`,[
   ['Lấy ra trả lại: "Tôi đùa thôi."',()=>{take('buds');S.flags.hidBuds=2;rossie(-3);trust(1);scenePlay('Bữa tối',[SAY('rossie','"Buồn cười lắm." Rossie giật lấy tai nghe. Nhưng khóe miệng cô hơi nhếch lên.')],finish);}],
   ['"Không thấy."',()=>{take('buds');S.flags.hidBuds=3;rossie(-6);trust(-4);scenePlay('Bữa tối',['Sara liếc xuống túi áo Ethan, nơi sợi dây tai nghe trắng đang thò ra.',SAY('sara','"Ethan."'),'Cậu đặt tai nghe lên bàn. Rossie nhìn cậu như nhìn một con gián.',SAY('rossie','"Đừng có chọc tôi. Tôi đã nói rồi."')],finish);}]]);}
  else finish();});}
function envelopeScene(){S.c1=4.5;scenePlay('Phòng khách',['Sau bữa tối, khi Ethan lên lầu, cậu đi ngang qua phòng khách. Trên bàn trà có một phong bì trắng không dán tem, đã được mở. Bên trong là mấy tờ giấy in, một trong số đó có logo của một ngân hàng địa phương.',
 'Cậu không đọc được gì ngoài dòng chữ đậm ở đầu trang: THÔNG BÁO NHẮC NỢ LẦN BA.'],()=>{
 pick('Phong bì trên bàn trà','Trong bếp, tiếng nước chảy. Sara đang rửa bát.',[
  ['Đi tiếp lên lầu',()=>{addNote('found','Thông báo nhắc nợ lần ba trên bàn trà (chưa hiểu hết)');S.c1=5;save(true);}],
  ['Lật thêm một trang',()=>{rossie(-6);S.flags.peeked=1;scenePlay('Phòng khách',['Ethan nhấc mép tờ giấy. Logo: NGÂN HÀNG PRYCE. Một con số có quá nhiều chữ số không, và một ngày được khoanh đỏ.',
    SAY('rossie','"Cậu làm gì đấy?"'),'Rossie đứng ở chân cầu thang, tay khoanh trước ngực. Cậu không biết cô đã đứng đó bao lâu.',
    SAY('rossie','"Đồ của người khác thì đừng có động vào." Cô nói nhỏ, đủ để Sara trong bếp không nghe thấy, rồi đi thẳng lên lầu.')],()=>{
    addNote('found','Thông báo nhắc nợ lần ba của Ngân hàng Pryce (chưa hiểu hết)');addNote('found','Rossie bắt gặp mình xem phong bì');S.c1=5;save(true);});}]]);});}
function deskScene(){scenePlay('Phòng của Ethan',['Ethan đóng cửa phòng, ngồi xuống bàn học. Chiếc đèn bàn chụp vải màu kem hắt một vòng sáng vàng lên mặt gỗ.',
 'Ngoài cửa sổ, vườn sau tối om. Bên kia hàng rào, một ngọn đèn vàng bật lên ở tầng hai nhà hàng xóm, rồi có bóng người đứng sau tấm rèm.','Ethan kéo rèm lại.'],chapterEnd);}
function chapterEnd(){S.c1=6;const secret=S.flags.peeked?'Thông báo nhắc nợ của Ngân hàng Pryce (Ethan chưa hiểu hết)':'Thông báo nhắc nợ (Ethan chưa hiểu hết)';
 const ch=[['Hỏi thẳng Sara về phong bì nợ','Sara sẽ nói dối, nhưng Ethan sẽ biết bà đang giấu điều gì.'],['Giữ im lặng và âm thầm tìm hiểu thêm','Rossie sẽ để ý nếu cậu tò mò.'],['Đi gặp May để giải thích','Bà ta sẽ không tin, nhưng sẽ ghi nhớ.']];
 openModal(`<div class="who">Kết thúc Chương 1 · Ngày dọn vào</div><h2>Trạng thái hiện tại</h2>
 <div class="item"><div><div><b>Độ tin cậy của Sara</b><small>${S.rel.sara}/100</small></div></div><span class="status" style="background:var(--accent)">${trustLabel()}</span></div>
 <div class="item"><div><div><b>Thiện cảm của Rossie</b><small>${S.rel.rossie}</small></div></div><span class="status" style="background:#8e44ad">${rossieLabel()}</span></div>
 <div class="item"><div><div><b>Độ nghi ngờ của May</b><small>${S.mayS}/100</small></div></div><span class="status" style="background:var(--danger)">${mayLabel()}</span></div>
 <div class="item"><div><div><b>Bí mật đã lộ</b><small>${secret}</small></div></div></div>
 <h2 style="margin-top:14px">Lựa chọn cuối chương</h2><p style="color:var(--dim)">Sẽ ảnh hưởng đến Chương 2.</p><div class="opts" id="chs"></div>`);mbox.classList.add('wide');
 const o=mbox.querySelector('#chs');ch.forEach(([t,d],i)=>{const b=document.createElement('button');b.innerHTML=`${i+1}. ${t}<br><small style="font-weight:500">${d}</small>`;b.style.textAlign='left';
  b.onclick=()=>{S.ch2=i+1;addNote('found','Quyết định cho ngày mai: '+t);closeModal();save(true);
   openModal(`<div class="who">Thuê Phòng · Crestmoor</div><h2>Hết Chương 1</h2><p>Lựa chọn của bạn đã được lưu: <b>${t}</b>.</p><p>Chương 2 · Bí mật của Sara sẽ tiếp tục từ đây. Trong lúc chờ, bạn có thể sống tiếp ở Crestmoor: đi ngủ, dạo thị trấn, làm quen mọi người.</p><div class="opts"><button id="eC">Tiếp tục ở Crestmoor</button><button id="eR" class="alt">Chơi lại Chương 1</button></div>`);
   document.getElementById('eC').onclick=closeModal;document.getElementById('eR').onclick=()=>{try{localStorage.removeItem(SAVE_KEY);}catch(e){}location.reload();};};o.appendChild(b);});}
// called every frame from the main loop
let mayWatchT=0;
function storyTick(dt){if(paused)return;const rid=P.room&&P.room.id;
 if(S.c1===2&&rid==='w_kitchen')return kitchenScene();
 if(S.c1===3&&(hour()>dinnerT()+1||day()>1)&&rid!=='w_kitchen')return dinner(true);
 if(S.c1===4&&rid==='whit_lobby'&&P.z>15.6&&P.x>-29)return envelopeScene();
 // May watches the boy who loiters by her house
 const may=npc('may');mayWatchT-=dt;
 if(S.c1>=3&&!may.away&&!P.b&&P.x>-57&&P.x<-37.5&&P.z>2&&P.z<30){maySus(dt*1.2);if(mayWatchT<=0){mayWatchT=45;toast('Rèm cửa nhà Dawson khẽ động. May đang nhìn bạn.');}}
 ENVELOPE.visible=S.c1>=4&&S.c1<5;}

/* ---------- interactables ---------- */
const INT=[];
const markGeo=new THREE.OctahedronGeometry(.22,0),markMat=new THREE.MeshBasicMaterial({color:0xffc531});
function I(o){o.mark=mesh(markGeo,markMat,o.x,2.2,o.z,WORLD,false);o.mark.visible=false;INT.push(o);return o;}
function lockOk(L){if(!L)return true;if(L.flag&&S.flags[L.flag])return true;if(L.hours&&inHours(L.hours[0],L.hours[1]))return true;return !!(L.items&&L.items.some(has));}
function lockWhy(L){const p=[];if(L.hours)p.push('mở '+L.hours[0]+':00-'+L.hours[1]+':00');if(L.items&&!L.items.includes('__never'))p.push('cần '+L.items.map(i=>ITEMS[i]?ITEMS[i].n:i).join(' / '));if(L.flag==='movedIn')p.push('hãy bấm chuông trước');return p.length?p.join(' · '):'riêng tư, không vào được';}
const ENVELOPE=mesh(B(.32,.02,.22),C(0xf6f4ee),-28.9,.82,14.5,WORLD,false);ENVELOPE.rotation.y=.4;ENVELOPE.visible=false;

// shops
const SHOPS={diner:[['coffee',3],['donut',2]],mart:[['cookies',5],['novel',8],['soda',2]],flowers:[['flowers',9]],gas:[['soda',2],['donut',2]]};
function shop(id,title){const list=SHOPS[id];pick(title,`Bạn có ${S.cash} đô.`,list.map(([k,p])=>[`${ITEMS[k].n} · ${p} đô`,()=>{if(S.cash<p)return toast('Không đủ tiền.');S.cash-=p;give(k);}]).concat([['Thôi']]));}
I({x:67,z:-15.3,label:'Gọi món ở quầy Diner',act:()=>shop('diner','Crestmoor Diner')});
I({x:21,z:10.3,label:'Thanh toán ở Crestmoor Mart',act:()=>shop('mart','Crestmoor Mart')});
I({x:53,z:10.4,label:'Mua hoa',act:()=>shop('flowers','Tiệm hoa Willow')});
I({x:82,z:47.6,label:'Quầy trạm xăng',act:()=>shop('gas','Trạm xăng Crestmoor')});

// the Whitfield house
I({x:-23,z:9.1,label:'Bấm chuông',pri:1,hide:()=>S.c1!==0,act:ringBell});
I({x:-17.6,z:23.4,label:'Lên tầng 2',pri:1,act(){stairFade(()=>{tp(112.5,37.2);P.face=Math.PI;toast('Tầng 2 · Hành lang. Phòng của bạn ở cuối hành lang.');});}});
I({x:112.5,z:38.4,label:'Xuống tầng 1',pri:1,act(){stairFade(()=>{tp(-17.6,22.2);P.face=Math.PI;});}});
function stairFade(fn){let d=document.getElementById('stairFade');if(!d){d=document.createElement('div');d.id='stairFade';d.style.cssText='position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;transition:opacity .22s;z-index:40';document.body.appendChild(d);}
 d.style.opacity=1;setTimeout(()=>{fn();setTimeout(()=>{d.style.opacity=0;},120);},230);}
I({x:121.4,z:22.7,label:'Nhìn ra cửa sổ',act(){const n=hour()>=19.5||hour()<6;
 if(S.c1<=2){S.flags.sawCat=1;toast('Vườn sau nhà Whitfield, hàng rào gỗ, rồi sân sau nhà Dawson. Một con mèo mướp đang bò trên mái nhà kho bên đó.');}
 else toast(n?'Vườn sau tối om. Bên kia hàng rào, cửa sổ tầng hai nhà Dawson vẫn sáng đèn.':'Vườn sau có một chiếc xích đu cũ và một chỗ đậu xe trống.');}});
I({x:117.6,z:21.2,label:'Cất quần áo vào tủ',pri:1,hide:()=>S.c1!==1,act:unpack});
I({x:116.8,z:24.2,label:'Xem kệ sách',act:()=>toast('Một cuốn sổ tay nấu ăn, một cuốn từ điển, và một cuốn tiểu thuyết trinh thám đã sờn gáy. Bên trong bìa có chữ ký: M. Whitfield.')});
I({x:120.4,z:24.2,label:'Ngồi xuống bàn học',pri:1,hide:()=>S.c1!==5,act:deskScene});
I({x:119.8,z:21.2,label:'Đi ngủ (tới 7:00 sáng, tự lưu)',hide:()=>S.c1<6,act:sleep});
I({x:111.4,z:28,label:'Ảnh gia đình trên bàn',act(){toast('Sara, Rossie hồi nhỏ, và một người đàn ông cười rạng rỡ, tay khoác vai cả hai. Khung ảnh không có một hạt bụi.');if(!S.note.found.includes('Ảnh gia đình: Sara, Rossie và người chồng đã mất'))addNote('found','Ảnh gia đình: Sara, Rossie và người chồng đã mất');}});
I({x:-31,z:22.6,label:'Chỉnh đồng hồ bếp nhanh 30 phút (nghịch)',hide:()=>S.c1!==3||S.flags.clockFast||S.flags.clockDone,act(){
 const ro=npc('rossie');const seen=!ro.away&&roomAt(ro.x,ro.z)===P.room;S.flags.clockFast=1;S.flags.clockDone=1;
 if(seen){rossie(3);toast('Rossie thấy bạn vặn kim đồng hồ. Cô nhướng mày, rồi giả vờ như không thấy gì.');}else toast('Bạn vặn kim nhanh nửa tiếng. Sara sẽ dọn bữa tối sớm hơn... và nghĩ bạn đến muộn.');}});
I({x:-31,z:22.6,label:'Chỉnh đồng hồ bếp về đúng giờ',hide:()=>S.c1!==3||!S.flags.clockFast,act(){S.flags.clockFast=0;toast('Bạn chỉnh đồng hồ về đúng giờ. Như chưa có chuyện gì.');}});
I({x:-26.4,z:14.6,label:'Tai nghe của Rossie trên sofa',hide:()=>S.c1!==3||S.flags.hidBuds,act(){pick('Tai nghe của Rossie','Một đôi tai nghe trắng nằm lăn lóc trên ghế sofa.',[
 ['Giấu đi (nghịch)',()=>{S.flags.hidBuds=1;give('buds');toast('Bạn nhét tai nghe vào túi áo. Rossie sẽ đi tìm.');}],['Để yên']]);}});
I({x:-26.6,z:24.6,label:'Lấy túi rác',hide:()=>S.c1!==3||S.flags.trashTask!==1||has('trash'),act(){give('trash');}});
I({x:-27.6,z:7.4,label:'Thùng rác ở lề đường',act(){if(!has('trash'))return toast('Thùng rác xanh của nhà Whitfield. Nắp có dán băng keo ghi "14".');
 pick('Thùng rác','Túi rác khá nặng và hơi rỉ nước.',[
  ['Bỏ vào thùng, đậy nắp cẩn thận',()=>{take('trash');S.flags.trashTask=2;S.flags.trashOk=1;trust(2);passTime(5);const m=npc('may');if(!m.away&&bldAt(m.x,m.z)==='dawson'){maySus(-4);toast('Bạn đậy nắp thùng thật chặt. Rèm nhà Dawson khẽ động, rồi khép lại.');}else toast('Xong. Nắp thùng đóng chặt.');}],
  ['Quẳng cạnh thùng cho nhanh (làm hỏng việc vặt)',()=>{take('trash');S.flags.trashTask=2;S.flags.trashBad=1;toast('Bạn đặt túi rác cạnh thùng rồi đi vào. Trời sắp tối, và Crestmoor có rất nhiều gấu mèo.');}]]);}});
I({x:-28.2,z:21.5,label:'Ngồi vào bàn ăn tối',pri:1,hide:()=>S.c1!==3||hour()<dinnerT()-.25,act:()=>dinner(false)});
I({x:-47,z:9.1,label:'Gõ cửa nhà Dawson',act(){const m=npc('may');if(m.away||bldAt(m.x,m.z)!=='dawson')return toast('Không ai ra mở cửa.');
 if(S.flags.mayKnock===day())return toast('Lần này May không thèm ra mở cửa.');S.flags.mayKnock=day();
 scenePlay('Nhà Dawson',['Cánh cửa mở hé, vừa đủ một khe hẹp, xích an toàn vẫn cài.',SAY('may','"Gì?"'),SAY('ethan','"Cháu là Ethan, ở nhà bên. Cháu chỉ muốn nói là lúc nãy cháu nhìn con mèo trên mái, không phải nhìn nhà cô."'),
  SAY('may','"Con mèo." May nhìn cậu từ đầu đến chân. "Nhà tôi không nuôi mèo, cậu nhóc."'),'Cánh cửa đóng lại. Tiếng khóa cài hai lần.'],()=>{maySus(-3);addNote('found','May Dawson nói nhà bà không nuôi mèo. Vậy con mèo trên mái là của ai?');});}});
I({x:-11,z:7.8,label:'Bảng giờ xe buýt',act:()=>toast('Tuyến Crestmoor Transit chạy vòng quanh thị trấn. Chuyến đi Portland: mỗi sáng 6:40.')});
I({x:-52,z:-37.4,label:'Ngồi nghỉ ở vọng lâu (30 phút)',act(){passTime(30);toast('Mưa phùn lất phất. Bạn thấy đầu óc nhẹ hơn.');S.trouble=Math.max(0,S.trouble-20);}});

function sleep(){const h=hour();if(h>=6&&h<20.5)return toast('Còn sớm. Bạn chỉ ngủ được sau 20:30.');
 const target=(h>=20.5?Math.floor(S.min/1440)+1:Math.floor(S.min/1440))*1440+7*60;passTime(target-S.min);S.trouble=0;
 scenePlay('Một đêm ở Crestmoor',['Mưa gõ đều lên mái hiên suốt đêm. Sáng ra, sương phủ trắng vườn sau.'],()=>save(true));}
function steal(amount){const w=watchers();if(w.length){S.trouble=Math.min(100,S.trouble+amount);emote(w[0],'!',5);toast(w[0].name+' thấy bạn đang lục lọi!');}}
function passTime(min){S.min+=min;NPCS.forEach(n=>{n.ov=null;spawnNPC(n);});PEDS.forEach(pedSpawn);}
function checkDeadline(){return false;}

/* ---------- getting caught ---------- */
function caught(by){S.trouble=0;S.rel[by.id]=(S.rel[by.id]||0)-5;
 if(by.id==='sara'||by.id==='rossie'){trust(by.id==='sara'?-10:-4);if(by.id==='rossie')rossie(-8);tp(117.6,22.6);addNote('rules','Phòng riêng của Sara và Rossie là chỗ cấm');
  return scenePlay('Bị '+by.name+' bắt gặp',[by.id==='sara'?SAY('sara','"Cậu làm gì trong phòng tôi?" Giọng Sara không lớn, nhưng lạnh đến mức Ethan thấy gáy mình ớn lạnh. "Phòng riêng là phòng riêng. Về phòng cậu đi."'):SAY('rossie','"CÚT RA!" Rossie ném chiếc gối thẳng vào mặt cậu. "Thử vào đây lần nữa xem, tôi mách mẹ ngay."'),'Ethan về phòng, đóng cửa. Lòng tin ở nhà này không dễ lấy lại.']);}
 S.records++;S.rel.sara=clamp(S.rel.sara-6,0,100);
 if(S.records>=4){S.flags.ending='out';return scenePlay('Lần thứ tư',['Lần thứ tư xe cảnh sát dừng trước nhà số 14. Sara đứng ở hiên rất lâu, rồi nói rằng cậu nên tìm chỗ khác từ cuối tuần này.','Ethan kéo chiếc vali cũ ra khỏi căn nhà gỗ trắng, lần này về phía bến xe.'],()=>endScreen('Bị mời ra khỏi nhà','Bị bắt 4 lần là Sara không cho thuê nữa. Tải lại bản lưu để thử lần nữa.'));}
 tp(BLD.whit.ex,BLD.whit.ez-2);passTime(60);
 scenePlay('Bị '+by.name+' bắt quả tang',[by.police?'"Đứng yên đó." Còng thì không, nhưng biên bản thì có.':`"Cậu làm gì ở đây?!" ${by.name} gọi ngay cho cảnh sát.`,
  'Xe cảnh sát chở bạn về trước cửa nhà Whitfield. Sara đứng trên hiên, khoanh tay.',`Biên bản thứ ${S.records}/3. Lần thứ tư, Sara sẽ không cho bạn thuê phòng nữa.`]);}

/* ---------- romance: later chapters (awkward dialogue, fade to black) ---------- */
const ROM={};
const romOk=id=>!!ROM[id];
