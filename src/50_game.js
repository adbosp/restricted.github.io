/* =====================================================================
   MAPLE HOLLOW · items, quests, interactions, dialogue, story
   ===================================================================== */
const ITEMS={
 pie:{n:'Bánh táo của Dì Celine',d:'Còn ấm, thơm mùi quế. Mục sư Avery đang cần một chiếc.',ico:'food'},
 coffee:{n:'Cà phê Hollow Diner',d:'Đen và nóng.',ico:'coffee'},
 donut:{n:'Bánh donut',d:'Món ruột của cảnh sát Simon.',ico:'food'},
 flowers:{n:'Bó hoa thu',d:'Cúc vàng và lá phong đỏ.',ico:'flower'},
 novel:{n:'Tiểu thuyết "Những đêm Vermont"',d:'Sách bìa mềm bán ở Hollow Mart.',ico:'book'},
 maple:{n:'Chai siro phong',d:'Đặc sản Vermont, ai cũng thích.',ico:'bottle'},
 bolt_cutter:{n:'Kìm cắt xích',d:'Cắt được ổ khóa xích ở cổng Nhà máy cũ.',ico:'tool'},
 pond_dye:{n:'Thuốc nhuộm hồ màu hồng',d:'Vô hại cho cá. Rất có hại cho một buổi chụp ảnh.',ico:'dye'},
 archive_key:{n:'Chìa khóa kho lưu trữ',d:'Mục sư Avery tin bạn.',ico:'key'},
 evid_key:{n:'Chìa khóa kho tang vật',d:'Của đồn cảnh sát Maple Hollow.',ico:'key'},
 staff_card:{n:'Thẻ nhân viên Tòa thị chính',d:'Của Sam. Mở được văn phòng Thị trưởng bất cứ lúc nào.',ico:'card'},
 dex_phone:{n:'Điện thoại của Dex',d:'Simon tịch thu nó từ thứ Ba. Trả lại cho Dex.',ico:'phone'},
 deed:{n:'Chứng thư năm 1791',d:'"Town Green thuộc về người dân Maple Hollow, mãi mãi." Không ai có quyền bán.',ico:'doc',ev:1},
 ledger:{n:'Sổ chi riêng của Thị trưởng',d:'Các khoản "tư vấn" hàng tháng từ Vance Development.',ico:'doc',ev:1},
 report:{n:'Báo cáo kiểm định giả',d:'"Nhà thờ nguy hiểm, cần phá dỡ." Chữ ký kỹ sư được cắt dán từ giấy khác.',ico:'doc',ev:1},
 loan_file:{n:'Hồ sơ siết nợ',d:'Thị trưởng ép ngân hàng siết nợ nhà Dì Celine và sáu hộ khác trên Main St.',ico:'doc',ev:1},
 dex_video:{n:'Video trong điện thoại Dex',d:'Thị trưởng Lang nhận phong bì dày từ Marlowe Vance ở quán Diner.',ico:'phone',ev:1},
};
const EVID=['deed','ledger','report','loan_file','dex_video'];
const GIFTS=['pie','coffee','donut','flowers','novel','maple'];
const evCount=()=>EVID.filter(has).length;
const LIKES={celine:[['flowers','maple'],['donut']],sam:[['coffee','novel'],[]],dex:[['donut','coffee'],['flowers']],bella:[['flowers','novel'],[]],mia:[['maple','coffee'],[]],
 kim:[['coffee','donut'],[]],richard:[['maple'],[]],marlowe:[[],['donut','pie','novel']],simon:[['donut'],['flowers']],linh:[['coffee','flowers'],[]],sloane:[['novel','coffee'],['donut']],
 lan:[['novel','flowers'],[]],sofia:[['coffee','maple'],['donut']],mai:[['novel','maple'],['flowers']],bennett:[['maple','flowers'],[]],jess:[['coffee','donut'],[]],pastor:[['pie','maple'],[]]};
const WIT=[
 ['celine','Dì Celine: kể về lá thư siết nợ',()=>S.flags.celineAlly||S.rel.celine>=45],
 ['pastor','Mục sư Avery: chứng thư và nhà thờ',()=>S.flags.pastorAlly],
 ['dex','Dex: người quay video',()=>S.flags.dexAlly],
 ['bella','Bella: tận mắt thấy phong bì',()=>S.flags.bellaAlly||S.rel.bella>=40],
 ['kim','Trung sĩ Kim: cảnh sát đứng về phía bạn',()=>S.flags.kimAlly||S.rel.kim>=40],
 ['bennett','Bà Bennett: bị ép siết nợ',()=>S.flags.loanGiven],
 ['sam','Sam: bị bắt hủy giấy tờ',()=>S.flags.samAlly||S.rel.sam>=40],
 ['mia','Mia: kiểm lâm Town Green',()=>S.rel.mia>=40],['sofia','Bác sĩ Sofia',()=>S.rel.sofia>=40],['lan','Cô Lan',()=>S.rel.lan>=40],
 ['sloane','Cô Sloane: lịch sử thị trấn',()=>S.rel.sloane>=40||S.flags.sloaneDeed],['mai','Mai Lin',()=>S.rel.mai>=40],['jess','Jess Walker',()=>S.rel.jess>=40]];
const witnesses=()=>WIT.filter(w=>w[2]());

const QUESTS={
 home:{t:'Về nhà Dì Celine',o:()=>'Nhà Dì ở phía nam Main St, ngay sau trạm xe buýt (hàng rào trắng). Vào nhà và nói chuyện với Dì.'},
 linh:{t:'Gặp MC Linh Tran',o:()=>'Trường quay WMHV-TV ở phía đông Main St (8:00-12:00, 14:00-17:00), hoặc quán Hollow Diner lúc 12:00-14:00.'},
 proof:{t:'Phiên điều trần Chủ nhật',o:()=>`Bằng chứng ${evCount()}/3 · Nhân chứng ${witnesses().length}/3. Tòa thị chính, Chủ nhật 18:00-21:00: lên bục phát biểu.`},
 deed:{t:'Chứng thư năm 1791',o:()=>has('deed')?'Đã có.':has('archive_key')?'Kho lưu trữ ở cuối gian chính nhà thờ Thánh Giles, bên phải.':'Mục sư Avery giữ chìa khóa kho lưu trữ. Ông đang cần bánh táo cho buổi bán bánh: bánh của Dì Celine ở trong bếp.'},
 ledger:{t:'Sổ chi của Thị trưởng',o:()=>has('ledger')?'Đã có.':'Văn phòng Thị trưởng (Tòa thị chính) mở cửa lúc 12:00-13:00 khi mọi người đi ăn trưa, hoặc mượn thẻ nhân viên của Sam. Đừng để ai thấy.'},
 report:{t:'Báo cáo kiểm định giả',o:()=>has('report')?'Đã có.':S.flags.millOpen?'Văn phòng công trường ở cuối xưởng Nhà máy cũ. Marlowe ở đó 9:00-12:00 và 14:00-19:00.':'Nhà máy cũ ở bên kia West Rd. Cổng khóa xích: kìm cắt xích bán ở tiệm kim khí Walker (25 đô).'},
 loan:{t:'Hồ sơ siết nợ',o:()=>has('loan_file')?'Đã có.':'Bà Bennett ở Ngân hàng sẽ giúp nếu tin bạn (thiện cảm 30). Hoặc phòng Giám đốc không khóa 12:00-13:00.'},
 phone:{t:'Điện thoại của Dex',o:()=>has('dex_video')?'Đã có video.':has('dex_phone')?'Trả điện thoại cho Dex (trạm xăng ban ngày, quán Diner buổi tối).':has('evid_key')?'Kho tang vật ở cuối đồn cảnh sát.':'Simon tịch thu điện thoại của Dex. Chìa kho tang vật nằm trên bàn Simon ở đồn (Simon đi ăn 11:00-12:00), hoặc nhờ Trung sĩ Kim (thiện cảm 25).'},
 pond:{t:'(Phụ) Hồ nước màu hồng',o:()=>'Sáng thứ Bảy 10:00, Thị trưởng chụp ảnh tranh cử bên hồ. Thuốc nhuộm hồ bán ở tiệm kim khí. Dex đã thách bạn.'},
};
function startQ(k){if(!S.q[k]){S.q[k]=1;toast('Nhiệm vụ mới: '+QUESTS[k].t);}}
function doneQ(k){if(S.q[k]!==2){S.q[k]=2;toast('✓ Hoàn thành: '+QUESTS[k].t);}}
function getEv(k,quest){if(has(k))return;give(k);if(quest)doneQ(quest);if(evCount()>=3&&!S.flags.ev3){S.flags.ev3=1;toast('Đã đủ 3 bằng chứng! Giờ cần 3 nhân chứng.');}}
const hot=k=>{S.hot=S.hot||[];if(!S.hot.includes(k))S.hot.push(k);};

/* ---------- interactables ---------- */
const INT=[];
const markGeo=new THREE.OctahedronGeometry(.22,0),markMat=new THREE.MeshBasicMaterial({color:0xffc531});
function I(o){o.mark=mesh(markGeo,markMat,o.x,2.2,o.z,WORLD,false);o.mark.visible=false;INT.push(o);return o;}
function lockOk(L){if(!L)return true;if(L.flag&&S.flags[L.flag])return true;if(L.hours&&inHours(L.hours[0],L.hours[1]))return true;return !!(L.items&&L.items.some(has));}
function lockWhy(L){const p=[];if(L.hours)p.push('mở '+L.hours[0]+':00-'+L.hours[1]+':00');if(L.items&&!L.items.includes('__never'))p.push('cần '+L.items.map(i=>ITEMS[i]?ITEMS[i].n:i).join(' / '));return p.length?p.join(' · '):'riêng tư, không vào được';}

// shops
const SHOPS={diner:[['coffee',3],['donut',2]],mart:[['novel',7],['maple',6],['donut',2]],flowers:[['flowers',8]],hardware:[['bolt_cutter',25],['pond_dye',6]],inn:[['maple',6],['coffee',3]]};
function shop(id,title){const list=SHOPS[id];pick(title,`Bạn có ${S.cash} đô.`,list.map(([k,p])=>[`${ITEMS[k].n} · ${p} đô`,()=>{if(S.cash<p)return toast('Không đủ tiền.');
 if(k==='bolt_cutter'&&has(k))return toast('Bạn có rồi.');S.cash-=p;give(k);if(k==='bolt_cutter')S.flags.boughtCutter=1;}]).concat([['Thôi']]));}
I({x:67,z:-15.3,label:'Gọi món ở quầy Diner',act:()=>shop('diner','Hollow Diner')});
I({x:21,z:10.3,label:'Thanh toán ở quầy Hollow Mart',act:()=>shop('mart','Hollow Mart')});
I({x:53,z:10.4,label:'Mua hoa',act:()=>shop('flowers','Tiệm hoa Petal & Stem')});
I({x:38.5,z:10.3,label:'Mua đồ ở tiệm kim khí',act:()=>shop('hardware','Tiệm kim khí Walker')});
I({x:27,z:44.4,label:'Quầy bar Maple Inn',act:()=>shop('inn','Quầy bar Maple Inn')});

// home
I({x:-30,z:24.4,label:'Lấy bánh táo Dì nướng',hide:()=>!S.flags.metCeline||has('pie')||S.flags.pieGiven,act(){give('pie');toast('Dì để sẵn một chiếc trên bếp, kèm mảnh giấy: "Cho Mục sư Avery."');}});
I({x:-24.5,z:23,label:'Đi ngủ (tới 7:00 sáng, tự lưu)',act:sleep});
I({x:-25.5,z:8.2,label:'Hộp thư nhà Dì',act(){if(!S.flags.metCeline)return toast('Thư gửi "Celine Hart". Không phải của bạn... chưa.');toast('Toàn hóa đơn. Lá thư của ngân hàng thì Dì đã cất đi.');}});
function sleep(){const h=hour();if(h>=6&&h<20.5)return toast('Còn sớm. Bạn chỉ ngủ được sau 20:30.');
 const target=(h>=20.5?Math.floor(S.min/1440)+1:Math.floor(S.min/1440))*1440+7*60;passTime(target-S.min);S.trouble=0;
 if(!checkDeadline()){scenePlay('Một đêm ở Maple Hollow',[nightLine()],()=>save(true));}}
function nightLine(){const d=weekday();return d===1?'Sáng thứ Bảy. Mùi bánh kếp từ bếp. Ngoài cửa sổ, lá phong đỏ phủ kín sân.':d===2?'Chủ nhật. Ngày Hội Thành Lập. Phiên điều trần lúc 18:00 ở Tòa thị chính.':'Một buổi sáng nữa ở Maple Hollow.';}

// church
I({x:-27,z:-50.3,label:'Tìm trong kệ lưu trữ',act(){if(has('deed'))return toast('Những cuốn sổ rửa tội từ thế kỷ 18.');
 scenePlay('Kho lưu trữ nhà thờ',['Bụi, nến cũ và mùi giấy ẩm. Ngăn kéo thứ ba có một ống da buộc dây.','Bên trong là chứng thư năm 1791, chữ viết tay nghiêng: "Mảnh đất gọi là Town Green được trao cho người dân Maple Hollow, mãi mãi, không ai được mua bán."','Nếu tờ giấy này là thật, Thị trưởng không có quyền bán Town Green cho bất kỳ ai.'],()=>{getEv('deed','deed');});}});
I({x:-36.2,z:-33.6,label:'Kéo chuông nhà thờ',act(){const night=inHours(23,6);if(window.CHURCH_BELL)S.bellT=3;
 if(night){S.trouble=Math.min(100,S.trouble+55);NPCS.forEach(n=>{if(!n.away&&n.police){n.ov={place:'church',until:S.min+25};emote(n,'!',8);}});toast('BOONG... BOONG! Cả thị trấn bật đèn. Cảnh sát đang tới!');}
 else{const p=npc('pastor');if(!p.away&&Math.hypot(p.x-P.x,p.z-P.z)<20){emote(p,'!',4);S.rel.pastor-=2;toast('Mục sư Avery: "Con ơi, chuông chỉ kéo vào giờ lễ thôi!"');}else toast('BOONG! Đàn bồ câu bay khỏi tháp chuông.');}}});
// town hall
I({x:14.5,z:-29,label:'Lục bàn Thị trưởng',act(){if(has('ledger'))return toast('Ảnh chụp ông Lang bắt tay đủ loại người quan trọng.');
 steal(30);scenePlay('Văn phòng Thị trưởng',['Ngăn kéo dưới cùng có khóa, nhưng chìa được dán ngay dưới mặt bàn. Kinh điển.','Một cuốn sổ bìa da: mỗi tháng 5.000 đô "phí tư vấn" từ Vance Development, ghi chú bằng chữ ông Lang: "Commons, đợt 3".','Bạn nhét cuốn sổ vào áo và đóng ngăn kéo lại như cũ.'],()=>getEv('ledger','ledger'));}});
I({x:27.5,z:-27.5,label:'Bục phát biểu',act:podium});
// bank
I({x:45.8,z:-23,label:'Tủ hồ sơ của Giám đốc',act(){if(has('loan_file'))return toast('Báo cáo quý, khô như ngói.');
 steal(30);scenePlay('Phòng Giám đốc ngân hàng',['Ngăn "SIẾT NỢ" dày bất thường. Bảy hồ sơ, đều là nhà trên Main St, đều được duyệt cùng một ngày.','Kẹp ở trên là một tờ giấy viết tay, ký tên R. Lang: "Victoria, làm cho xong trước Chủ nhật, nếu bà còn muốn giữ ghế."','Hồ sơ đầu tiên mang tên Celine Hart.'],()=>getEv('loan_file','loan'));}});
// police
I({x:77,z:-17.6,label:'Bàn làm việc của Simon',act(){if(has('evid_key')||has('dex_phone')||has('dex_video'))return toast('Một hộp donut rỗng và cuốn "Luật giao thông Vermont" kẹp đầy giấy nhớ.');
 steal(45);give('evid_key');hot('evid_key');toast('Chùm chìa khóa có dán nhãn "TANG VẬT". Simon nên học cách giấu đồ.');}});
I({x:83,z:-24.6,label:'Tủ tang vật',act(){if(has('dex_phone')||has('dex_video'))return toast('Một chiếc ván trượt, ba biển số xe và một con vịt nhựa.');
 steal(25);give('dex_phone');take('evid_key');S.hot=(S.hot||[]).filter(k=>k!=='evid_key');toast('Túi nhựa ghi "D. REED · gây rối trật tự". Bên trong là điện thoại của Dex.');startQ('phone');}});
// hardware back room
I({x:41,z:22.4,label:'Kìm cắt xích trên kệ',hide:()=>has('bolt_cutter')||S.flags.millOpen,act(){steal(35);give('bolt_cutter');hot('bolt_cutter');toast('Bạn "mượn" chiếc kìm. Jess chắc sẽ không để ý... chắc vậy.');}});
// mill
I({x:-120.2,z:-30.5,label:'Bàn làm việc ở công trường',act(){if(has('report'))return toast('Bản vẽ Hollow Commons: một trung tâm thương mại đè lên chỗ nhà thờ.');
 steal(30);scenePlay('Văn phòng công trường',['Bản vẽ Hollow Commons trải kín bàn: bãi đỗ xe ngay chỗ nhà thờ, cửa hàng ngay chỗ hồ nước.','Dưới cùng là bản gốc "Báo cáo kiểm định": nhà thờ Thánh Giles "nguy hiểm, cần phá dỡ". Chữ ký kỹ sư được cắt từ một lá thư khác rồi photocopy đè lên.','Báo cáo này là giả. Và nó đang nằm trong tay bạn.'],()=>getEv('report','report'));}});
// diner booth: overhear the deal
I({x:60.7,z:-11.6,label:'Ngồi ở bàn sát vách',act(){const r=npc('richard'),m=npc('marlowe');const here=n=>!n.away&&bldAt(n.x,n.z)==='diner';
 if(S.flags.sawDeal||!here(r)||!here(m))return toast(here(r)||here(m)?'Bạn ngồi một lúc. Không có gì đáng nghe.':'Ghế da đỏ, menu dán băng keo. Thị trưởng và bà Vance hay ăn trưa ở đây.');
 scenePlay('Hollow Diner',['Bạn ngồi xuống bàn sát vách, giả vờ đọc thực đơn.','"Báo cáo kiểm định xong rồi," bà Vance nói khẽ. "Nhà thờ sẽ bị đóng vì nguy hiểm. Bản gốc tôi để ở văn phòng công trường."','"Còn bà Celine?" "Ngân hàng lo. Bennett không dám cãi tôi." Ông Lang cười, đút một phong bì dày vào túi áo.','Bella đứng sau quầy, tay cầm bình cà phê, mặt tái đi. Cô ấy cũng nghe thấy.'],()=>{S.flags.sawDeal=1;startQ('report');startQ('loan');});}});
// gas station odd job
I({x:64,z:47.6,label:'Rửa xe giúp Dex (kiếm 15 đô)',hide:()=>{const d=npc('dex');return d.away||Math.hypot(d.x-66,d.z-45)>8||S.flags.washDay===day();},act(){S.flags.washDay=day();passTime(45);S.cash+=15;S.rel.dex+=3;toast('45 phút với vòi nước và bọt xà phòng. +15 đô. Dex: "Cậu rửa xe còn kỹ hơn tôi."');}});
// pond prank
I({x:-68,z:-21.4,label:'Đổ thuốc nhuộm xuống hồ',hide:()=>!has('pond_dye')||S.flags.pondPink,act(){take('pond_dye');S.flags.pondPink=1;WATER_U.uTint.value.set(0xff8fc8);WATER_U.uDeep.value.set(0x9a3a6a);
 const r=npc('richard');if(!r.away&&Math.hypot(r.x-POND.x,r.z-POND.z)<16){doneQ('pond');S.rel.dex+=10;S.rel.linh+=5;S.rel.richard-=10;S.rel.mia-=4;emote(r,'!',10);
  scenePlay('Bờ hồ Town Green',['Thị trưởng Lang tạo dáng bên hồ, nụ cười tranh cử bật sẵn. Nhiếp ảnh gia đếm: "Ba, hai..."','Mặt hồ chuyển sang màu hồng kẹo bông. Một con vịt kêu như phản đối.','Tấm ảnh lên trang nhất tờ Hollow Gazette: "Thị trưởng và hồ nước hồng." Cả thị trấn cười suốt buổi sáng.'],()=>{S.flags.pondPhoto=1;});}
 else{doneQ('pond');toast('Hồ nước chuyển màu hồng. Đàn vịt có vẻ hoang mang.');}}});
// bus timetable
I({x:-11,z:7.8,label:'Bảng giờ xe buýt',act:()=>toast('Tuyến Maple Hollow Transit chạy vòng quanh thị trấn. Chuyến về thành phố: thứ Hai.')});
// gazebo + bench rest
I({x:-52,z:-37.4,label:'Ngồi nghỉ ở vọng lâu (30 phút)',act(){passTime(30);toast('Gió thổi lá phong lả tả. Bạn thấy đầu óc nhẹ hơn.');S.trouble=Math.max(0,S.trouble-20);}});

function steal(amount){// someone with authority nearby notices?
 const w=watchers();if(w.length){S.trouble=Math.min(100,S.trouble+amount);emote(w[0],'!',5);toast(w[0].name+' thấy bạn đang lục lọi!');}}
function passTime(min){S.min+=min;NPCS.forEach(n=>{n.ov=null;spawnNPC(n);});}

/* ---------- the Sunday hearing ---------- */
function podium(){if(S.flags.ending)return toast('Bục phát biểu trống trơn.');
 if(!hearingTime())return toast('Phiên điều trần về Hollow Commons: Chủ nhật 18:00-21:00. Ghế bây giờ còn trống.');
 const ev=EVID.filter(has),w=witnesses();
 pick('Phiên điều trần · Hollow Commons',`Bạn có ${ev.length} bằng chứng và ${w.length} nhân chứng sẵn sàng lên tiếng. Cần ít nhất 3 và 3. Lên phát biểu ngay?`,[
  ['Lên bục phát biểu',()=>ev.length>=3&&w.length>=3?goodEnding(ev,w):badEnding(ev,w)],['Chưa, đợi thêm chút']]);}
function goodEnding(ev,w){S.flags.ending='good';const lines=['Tòa thị chính, Chủ nhật. Đèn của WMHV-TV bật sáng. Linh gật đầu với bạn: "Lên đi. Cả thị trấn đang xem."'];
 const say={deed:'Bạn giơ chứng thư năm 1791: Town Green thuộc về người dân, mãi mãi. Hội đồng không có quyền bán.',ledger:'Bạn đọc to từng dòng trong sổ chi: 5.000 đô mỗi tháng từ Vance Development, chữ viết tay của Thị trưởng.',
  report:'Bạn chiếu báo cáo kiểm định lên màn hình. Chữ ký kỹ sư lệch hẳn một dòng: cắt dán, photocopy đè.',loan_file:'Bạn đưa ra bảy hồ sơ siết nợ, duyệt cùng một ngày, kèm lời nhắn của ông Lang gửi bà Bennett.',
  dex_video:'Dex bấm nút. Trên màn hình: ông Lang đút phong bì của bà Vance vào túi áo, ở chính quán Diner này.'};
 ev.forEach(k=>lines.push(say[k]));lines.push('Rồi lần lượt từng người đứng dậy: '+w.map(x=>npc(x[0]).name).join(', ')+'.');
 lines.push('Thị trưởng Lang đập bàn: "Bịa đặt!" Nhưng Trung sĩ Kim đã đứng sau lưng ông, tay cầm còng.','Marlowe Vance lách ra cửa sau. Cảnh sát Simon, lần đầu tiên trong đời, ghi biên bản đúng người.',
  'Hội đồng hủy dự án Hollow Commons, 7 phiếu trên 7. Ngân hàng rút lệnh siết nợ. Chuông nhà thờ Thánh Giles vang khắp thị trấn.');
 const lv=S.flags.lover;if(lv)lines.push(ROM[lv].end);
 lines.push('HẾT · Maple Hollow vẫn là Maple Hollow. Còn bạn đã có một nơi để gọi là nhà.');
 S.trouble=0;scenePlay('Ngày Hội Thành Lập',lines,()=>endScreen('Kết thúc có hậu','Bạn đã cứu Town Green, nhà thờ và căn nhà của Dì Celine.'));}
function badEnding(ev,w){S.flags.ending='bad';scenePlay('Phiên điều trần',[
 'Bạn trình bày những gì mình có. Thị trưởng Lang mỉm cười: "Một cậu nhóc mới tới ba ngày, với vài tờ giấy không rõ nguồn gốc?"',
 ev.length<3?`Chỉ ${ev.length} bằng chứng. Không đủ để thuyết phục hội đồng.`:`Chỉ ${w.length} người dám đứng lên. Những người còn lại cúi đầu nhìn xuống sàn.`,
 'Hội đồng bỏ phiếu 5-2 thông qua Hollow Commons. Sáng thứ Hai, máy ủi tiến vào Town Green.'],()=>endScreen('Kết thúc buồn','Cần ít nhất 3 bằng chứng và 3 nhân chứng. Tải lại bản lưu để thử lần nữa.'));}
function checkDeadline(){if(S.flags.ending)return false;if(day()>3||(day()===3&&hour()>=21)){S.flags.ending='late';
 scenePlay('Chủ nhật, 21:00',['Phiên điều trần kết thúc mà không có bạn. Không ai phản đối, Hollow Commons được thông qua.','Sáng thứ Hai, hàng rào công trường dựng quanh Town Green. Dì Celine bắt đầu đóng thùng đồ đạc.'],()=>endScreen('Lỡ hẹn','Phiên điều trần là Chủ nhật 18:00-21:00 ở Tòa thị chính.'));return true;}return false;}

/* ---------- getting caught ---------- */
function caught(by){S.records++;const lost=(S.hot||[]).filter(has);lost.forEach(k=>{take(k);});S.hot=[];
 S.trouble=0;S.rel[by.id]=(S.rel[by.id]||0)-5;S.rel.celine-=6;
 if(S.records>=4){S.flags.ending='home';return scenePlay('Lần thứ tư',['Lần thứ tư cảnh sát đưa bạn về tận cửa. Dì Celine im lặng rất lâu, rồi gọi một cuộc điện thoại.','Sáng hôm sau, bạn ngồi trên chuyến xe buýt rời Maple Hollow. Qua cửa kính, Town Green vẫn còn đó. Nhưng không lâu nữa.'],()=>endScreen('Bị gửi về','Bị bắt 4 lần là hết cơ hội. Tải lại bản lưu để thử lần nữa.'));}
 tp(BLD.aunt.ex,BLD.aunt.ez+3);passTime(60);
 scenePlay('Bị '+by.name+' bắt quả tang',[by.police?'"Đứng yên đó, cậu nhóc." Còng thì không, nhưng biên bản thì có.':`"Cậu làm gì ở đây?!" ${by.name} gọi ngay cho cảnh sát.`,
  'Cảnh sát chở bạn về nhà Dì Celine.'+(lost.length?' Bị tịch thu: '+lost.map(k=>ITEMS[k].n).join(', ')+'.':''),`Biên bản thứ ${S.records}/3. Lần thứ tư, Dì sẽ phải gửi bạn về.`]);}

/* ---------- romance (adults; fade to black) ---------- */
const ROM={
 bella:{date:'Bella tan ca, hai người ngồi trên nóc xe tải của Dex ăn khoai tây chiên nguội. Cô kể về giấc mơ mở tiệm bánh ở Boston.',confess:'Bella giữ tay bạn lâu hơn cần thiết. "Ở lại Maple Hollow đi." Đèn quán Diner tắt từng chiếc một.',end:'Bella mở được tiệm bánh nhỏ ngay cạnh quán Diner. Tấm biển đầu tiên do bạn sơn.'},
 mia:{date:'Mia dẫn bạn chạy vòng quanh hồ lúc hoàng hôn, rồi thua bạn đúng một bước. Cô bảo là cố tình.',confess:'Trong trạm kiểm lâm, Mia tắt đèn pin. "Tôi không giỏi nói mấy chuyện này." Cô không cần nói.',end:'Mia được nhận làm kiểm lâm chính thức của Town Green. Bạn được nhận làm người đi tuần đêm cùng cô.'},
 linh:{date:'Linh kéo bạn lên sân thượng trường quay, chỉ cho bạn những ngọn đồi đỏ rực. "Ba năm ở đây, giờ tôi mới thấy chúng đẹp."',confess:'Linh tắt micro. "Tin này tôi không phát sóng." Rồi cô hôn bạn, và màn hình tối đi.',end:'Phóng sự của Linh được đài lớn ở Boston mua lại. Cô từ chối chuyển đi. Lý do: không phát sóng.'},
 lan:{date:'Cô Lan đọc cho bạn nghe một bài thơ của Robert Frost dưới vọng lâu, rồi bật cười vì giọng đọc của chính mình.',confess:'"Có những câu chuyện không cần chương kết," cô Lan nói khẽ, rồi gấp cuốn sách lại.',end:'Cô Lan mở một câu lạc bộ đọc sách ở Maple Inn. Bạn luôn ngồi hàng đầu.'},
 sofia:{date:'Bác sĩ Sofia rủ bạn đi hái táo ở vườn phía bắc. Cô trèo cây giỏi hơn bạn nhiều.',confess:'Sofia tháo kính. "Chẩn đoán của tôi: cậu hết thuốc chữa rồi." Đèn phòng khám tắt.',end:'Phòng khám Maple có thêm một bức ảnh trên tường: hai người, một giỏ táo, và một nụ cười ngốc nghếch.'},
 mai:{date:'Mai dạy bạn cắm một bó hoa đúng kiểu. Kết quả trông như một cái chổi. Cô vẫn giữ nó trên quầy.',confess:'Mai cài một bông cúc lên áo bạn. "Ở tiệm hoa, cái này nghĩa là: đừng đi đâu cả."',end:'Tiệm Petal & Stem treo biển mới: "Hoa cưới, đặt trước." Mai chưa nói của ai.'},
 sloane:{date:'Cô Sloane dẫn bạn đi xem những ngôi mộ cổ sau nhà thờ, kể chuyện từng người như kể chuyện hàng xóm.',confess:'"Tôi dạy lịch sử hai mươi năm," cô Sloane nói. "Đây là lần đầu tôi muốn làm nên một chút lịch sử."',end:'Cô Sloane viết cuốn sách về Maple Hollow. Chương cuối có tên bạn.'},
 bennett:{date:'Bà Bennett mời bạn một ly ở quầy bar Maple Inn, rồi thừa nhận mình chưa từng cười nhiều thế kể từ khi nhận chức.',confess:'Victoria Bennett tháo đôi khuyên tai vàng đặt lên quầy. "Gọi tôi là Victoria." Phần còn lại của đêm không ai kể.',end:'Victoria Bennett từ chức giám đốc ngân hàng và mở quỹ tín dụng cho dân Main St. Bạn là khách hàng đầu tiên.'},
};
const romOk=id=>!!ROM[id];
