/* =====================================================================
   MAPLE HOLLOW · dialogue. dlg[id]() → [text, [[label, fn], ...]]
   ===================================================================== */
const pickLine=(id,arr)=>arr[(day()*7+Math.floor(hour()/3)+id.length)%arr.length];
const R=(id,d)=>{S.rel[id]=(S.rel[id]||0)+d;};
const dlg={
 celine(){const o=[];
  if(!S.flags.metCeline)return['"Leo! Cuối cùng cháu cũng tới!" Dì Celine lau tay vào tạp dề rồi ôm chầm lấy bạn.',[['Chào Dì, cháu tới rồi',metCeline]]];
  if(S.flags.allowDay!==day()&&hour()<12)o.push(['Xin tiền tiêu vặt hôm nay',()=>{S.flags.allowDay=day();S.cash+=20;toast('Dì Celine dúi cho bạn 20 đô. "Đừng tiêu hết vào donut."');}]);
  if(has('loan_file')&&!S.flags.celineAlly)o.push(['Đưa Dì xem hồ sơ siết nợ',()=>{S.flags.celineAlly=1;R('celine',10);scenePlay('Dì Celine',['Dì đọc lời nhắn của ông Lang hai lần. Rồi gấp tờ giấy lại, rất phẳng.','"Ba mươi năm dì sống trong căn nhà này. Chủ nhật, dì sẽ đứng lên nói. Mặc kệ ông ta."']);}]);
  if(S.flags.pieAsked&&!has('pie')&&!S.flags.pieGiven)o.push(['Bánh táo cho Mục sư ở đâu ạ?',()=>toast('"Trên bếp, phía sau nhà. Mang cẩn thận nhé!"')]);
  o.push(['Kể cho cháu nghe về Maple Hollow',()=>scenePlay('Dì Celine',['"Năm 1791, những người đầu tiên tới đây dựng nhà thờ trước, nhà mình sau. Town Green là của chung, ai cũng được thả bò, được cưới, được chôn cất."','"Ông Lang thì nghĩ chỗ nào cũng là bãi đỗ xe."'])]);
  o.push(['Thôi ạ']);
  return[hour()<11?'"Ăn sáng chưa? Có bánh kếp trên bàn." Dì đang nhào bột.':hour()>=22?'"Khuya rồi, cháu đi ngủ đi. Giới nghiêm là giới nghiêm."':pickLine('c',['"Hôm nay ở trường quay có gì mới không? Cô Linh là người tốt."','"Đừng để Simon bắt gặp sau 23 giờ. Cậu ta thích viết biên bản hơn thích ăn."','"Lá phong năm nay đỏ sớm. Mùa thu đẹp nhất là trước khi người ta mang máy ủi tới."']),o];},
 linh(){const o=[];
  if(S.q.linh===1)o.push(['Cháu là Leo, cháu của bà Celine',metLinh]);
  if(S.q.proof===1){o.push(['Hỏi về kế hoạch',()=>questLog()]);
   if(evCount()>0)o.push([`Cho cô xem bằng chứng (${evCount()})`,()=>toast(`Linh: "${evCount()>=3?'Đủ rồi! Giờ thuyết phục người ta đứng lên.':'Tốt. Cần thêm '+(3-evCount())+' nữa.'}" Nhân chứng: ${witnesses().length}/3.`)]);}
  o.push(['Thôi']);
  return[S.q.linh===1?'Một phụ nữ áo đỏ đang cãi nhau với điện thoại: "Không, tôi không phát lại buổi cắt băng khánh thành. Tôi cần một tin THẬT."':pickLine('l',['"Ông Lang gọi tôi ba lần hôm nay. Nghĩa là chúng ta đang đi đúng hướng."','"Nhớ nhé: Chủ nhật 18:00. Tôi sẽ để sẵn một cái micro cho cậu."','"Thị trấn nhỏ có một cái hay: ai cũng biết mọi chuyện. Và một cái dở: không ai dám nói ra."']),o];},
 pastor(){const o=[];
  if(has('pie')&&!S.flags.pieGiven)o.push(['Đưa bánh táo của Dì Celine',()=>{take('pie');S.flags.pieGiven=1;S.flags.pastorAlly=1;S.flags.archivePerm=1;R('pastor',15);give('archive_key');startQ('deed');
   scenePlay('Mục sư Avery',['"Bánh táo của Celine! Buổi bán bánh được cứu rồi."','Ông nhìn quanh rồi hạ giọng: "Con là người đang giúp cô Linh, phải không? Trong kho lưu trữ có một thứ ông Lang rất muốn biến mất. Chứng thư năm 1791."','Ông đặt một chiếc chìa khóa đồng vào tay bạn. "Kho ở cuối gian chính, cửa bên phải. Và Chủ nhật, ta sẽ đứng cạnh con."']);}]);
  else if(!S.flags.pieGiven&&S.flags.metCeline)o.push(['Hỏi về buổi bán bánh',()=>{S.flags.pieAsked=1;startQ('deed');toast('"Celine hứa nướng cho ta một chiếc bánh táo. Nếu con tiện đường..."');}]);
  o.push(['Thôi']);
  return[pickLine('p',['"Nhà thờ này đứng đây từ năm 1791. Ta không định để nó thành bãi đỗ xe."','"Báo cáo nói mái nhà sắp sập? Ta đã leo lên đó tuần trước. Nó còn tốt hơn đầu gối ta."','"Chúa ban phước cho con. Và cho cái hồ, nếu ai đó định nhuộm nó."']),o];},
 dex(){const o=[];
  if(has('dex_phone')){o.push(['Trả điện thoại cho Dex',()=>{take('dex_phone');S.flags.dexAlly=1;R('dex',15);scenePlay('Dex',['"KHÔNG THỂ NÀO! Cậu lấy nó từ đồn Simon á?" Dex ôm chiếc điện thoại như ôm mèo con.','"Nghe này. Hôm thứ Ba tôi quay được cái này ở Diner, nên Simon mới tịch thu." Trên màn hình: ông Lang nhận phong bì của bà Vance.','"Cậu giữ một bản. Chủ nhật tôi sẽ đứng lên, kể cả khi bố tôi cấm."'],()=>getEv('dex_video','phone'));}]);}
  else if(!S.q.phone)o.push(['Sao trông cậu chán thế?',()=>{startQ('phone');toast('Dex: "Simon tịch thu điện thoại tôi vì tội... đứng quay phim trong quán Diner. Nó còn trong kho tang vật."');}]);
  if(!S.q.pond&&day()<=2)o.push(['Có trò gì vui không?',()=>{startQ('pond');toast('Dex cười gian: "Sáng thứ Bảy, Thị trưởng chụp ảnh bên hồ. Tiệm kim khí có bán thuốc nhuộm hồng. Tôi chỉ nói vậy thôi."');}]);
  o.push(['Thôi']);
  return[pickLine('d',['"Ê, hàng xóm! Cần sửa xe đạp thì cứ ghé."','"Ở Maple Hollow, việc thú vị nhất là xem xe buýt quay đầu."','"Simon ghét tôi. Tôi cũng không ưa cái mũ của cậu ta."']),o];},
 kim(){const o=[];
  if(!has('evid_key')&&!has('dex_phone')&&!has('dex_video')&&S.q.phone===1&&S.rel.kim>=25)o.push(['Nhờ chị lấy lại điện thoại của Dex',()=>{give('evid_key');R('kim',2);toast('Kim đặt một chùm chìa lên bàn rồi quay đi pha cà phê. "Tôi không thấy gì cả. Trả lại trước Chủ nhật."');}]);
  if(has('ledger')&&!S.flags.kimAlly)o.push(['Cho Trung sĩ Kim xem sổ chi',()=>{S.flags.kimAlly=1;R('kim',10);scenePlay('Trung sĩ Kim',['Kim lật từng trang, hàm siết lại. "Tôi biết có gì đó không ổn từ lúc hồ sơ siết nợ được duyệt trong một buổi chiều."','"Tôi không thể bắt Thị trưởng chỉ vì một cuốn sổ cậu lấy trộm. Nhưng nếu nó được trình bày công khai ở phiên điều trần, tôi sẽ có mặt. Với còng tay."']);}]);
  o.push(['Thôi']);
  return[S.rel.kim<10?'"Cậu là cháu bà Celine? Đừng gây rắc rối, và tôi sẽ không phải gặp cậu lần hai."':pickLine('k',['"Mười hai năm ở đồn này. Vụ lớn nhất là con bò nhà Kowalski đi lạc vào nhà thờ."','"Simon còn trẻ. Cậu ta tin luật hơn tin người."','"Có chuyện gì không ổn ở Tòa thị chính. Tôi chỉ chưa chứng minh được."']),o];},
 simon(){const o=[];
  if(has('donut'))o.push(['Mời cậu ta một cái donut',()=>{take('donut');R('simon',8);toast('Simon nhìn quanh rồi cắn một miếng to. "Đây không phải hối lộ, đúng không?"');}]);
  o.push(['Thôi']);
  return[inHours(23,6)?'"Giờ giới nghiêm! Về nhà ngay, không thì biên bản."':pickLine('s',['"Điều 14 nội quy thị trấn: không tụ tập quá năm người. Tôi đang đếm đấy."','"Tôi để mắt tới cậu, người mới."','"Thị trưởng nói tôi là cảnh sát triển vọng nhất Vermont."']),o];},
 sam(){const o=[];
  if(S.rel.sam>=25&&!has('staff_card')&&!has('ledger'))o.push(['Hỏi mượn thẻ nhân viên',()=>{give('staff_card');R('sam',-2);toast('Sam ngần ngừ rồi tháo thẻ đưa bạn. "Mất là tôi mất việc. Và tôi chưa từng đưa nó cho cậu."');}]);
  if(has('ledger')&&!S.flags.samAlly)o.push(['Cho Sam xem sổ chi',()=>{S.flags.samAlly=1;R('sam',8);toast('Sam che miệng. "Ông ấy bắt tôi hủy bản sao các hợp đồng này... Chủ nhật, tôi sẽ kể hết."');}]);
  o.push(['Thôi']);
  return[pickLine('sa',['"Tòa thị chính mở 8:00-18:00. Trừ giờ trưa, lúc tôi trốn ra công viên."','"Thị trưởng hay để văn phòng không khóa khi đi ăn. Tôi thì không nói gì đâu."','"Tôi chuyển tới đây vì nghĩ thị trấn nhỏ thì yên bình. Sai lầm lớn."']),o];},
 bella(){const o=[];
  if(S.flags.sawDeal&&!S.flags.bellaAlly)o.push(['Cô cũng thấy cái phong bì, đúng không?',()=>{if(S.rel.bella>=15){S.flags.bellaAlly=1;R('bella',5);toast('Bella gật đầu thật khẽ. "Tôi rót cà phê cho họ mỗi trưa thứ Ba. Chủ nhật, tôi sẽ nói."');}else toast('Bella: "Tôi... không thấy gì cả. Cậu gọi món gì?" (cần thêm thiện cảm)');}]);
  o.push(['Thôi']);
  return[pickLine('b',['"Món đặc biệt hôm nay là bánh kếp siro phong. Hôm qua cũng vậy."','"Thị trưởng boa đúng 10%. Không hơn một xu."','"Cậu là cháu bà Celine à? Bánh của bà ấy ngon hơn bánh của quán, đừng nói với ông chủ nhé."']),o];},
 bennett(){const o=[];
  if(!has('loan_file')&&S.rel.bennett>=30)o.push(['Hỏi về hồ sơ siết nợ của Dì Celine',()=>{S.flags.loanGiven=1;R('bennett',5);scenePlay('Bà Bennett',['Bà Bennett nhìn bạn rất lâu, rồi mở ngăn kéo.','"Ông Lang dọa sẽ rút hết tiền của thị trấn khỏi ngân hàng nếu tôi không ký. Tôi đã ký. Tôi xấu hổ vì điều đó."','"Cầm lấy. Chủ nhật, tôi sẽ tự mình nói với hội đồng."'],()=>getEv('loan_file','loan'));}]);
  else if(!has('loan_file')&&S.q.loan===1)o.push(['Hỏi về hồ sơ siết nợ',()=>toast('Bà Bennett: "Đó là chuyện bảo mật của ngân hàng." (cần thiện cảm 30)')]);
  o.push(['Thôi']);
  return[pickLine('be',['"Ngân hàng Maple Hollow, phục vụ thị trấn từ năm 1902. Tôi giúp gì được?"','"Hollow Commons sẽ mang lại việc làm. Ít nhất là ông Lang nói vậy."','"Cậu có khiếu ăn nói đấy. Đừng làm nghề ngân hàng, phí lắm."']),o];},
 richard(){return[pickLine('r',['"À, cháu của bà Celine! Một thị trấn nhỏ cần những người trẻ như cháu. Và một trung tâm thương mại."','"Hollow Commons: 200 việc làm, 400 chỗ đỗ xe. Ai mà phản đối được?"','"Cháu thấy chưa, ở Maple Hollow không có tội phạm. Vì tôi không cho phép."']),[['Thôi']]];},
 marlowe(){return[pickLine('m',['"Cậu đang chắn đường tôi."','"Thị trấn này đẹp. Sẽ đẹp hơn khi có thêm một bãi đỗ xe."','"Người như cậu đến rồi đi. Còn bê tông thì ở lại."']),[['Thôi']]];},
 mia(){return[pickLine('mi',['"Đừng cho vịt ăn bánh mì! Chúng bị đau bụng đấy."','"Tôi chạy quanh hồ mỗi sáng 6 giờ. Muốn thử không?"','"Nếu Town Green thành bãi đỗ xe, tôi sẽ thành... người trông xe à?"']),[['Thôi']]];},
 sloane(){const o=[];if(has('deed')&&!S.flags.sloaneDeed)o.push(['Cho cô Sloane xem chứng thư 1791',()=>{S.flags.sloaneDeed=1;R('sloane',10);toast('Cô Sloane tháo kính, giọng run run: "Bản gốc! Tôi tìm nó hai mươi năm. Chủ nhật tôi sẽ làm chứng nó là thật."');}]);o.push(['Thôi']);
  return[pickLine('sl',['"Maple Hollow thành lập năm 1791. Bài kiểm tra tuần sau, nếu cậu muốn dự thính."','"Lịch sử không lặp lại, nhưng nó có vần. Ông Lang đang gieo vần với những người tham lam trước ông."','"Thư viện có cả hồ sơ đất đai cũ, nếu cậu biết tìm."']),o];},
 lan(){return[pickLine('la',['"Cô dạy văn ở đây sáu năm. Mùa thu Vermont vẫn khiến cô muốn viết thơ."','"Em đọc Robert Frost chưa? \'Hai con đường rẽ trong rừng vàng...\'"','"Học sinh của cô hôm nay viết luận về Hollow Commons. Đa số phản đối."']),[['Thôi']]];},
 sofia(){return[pickLine('so',['"Đau ở đâu? À, không đau. Thế thì đi ra ngoài phơi nắng đi."','"Phòng khám mở 8:00 tới 18:00. Ngoài giờ thì gọi 911 hoặc gọi Dì Celine."','"Bà Vance tới đây đòi giấy chứng nhận sức khỏe cho... cái cây cổ thụ ở Town Green. Để chặt nó."']),[['Thôi']]];},
 mai(){return[pickLine('ma',['"Hoa cúc vàng mới về! Hợp để xin lỗi, hoặc để tỏ tình."','"Tiệm tôi bán hoa cho cả đám cưới lẫn đám tang trong thị trấn. Tôi biết hết bí mật."','"Bà Vance đặt hoa cho văn phòng mỗi tuần. Toàn hoa giả."']),[['Thôi']]];},
 jess(){return[pickLine('j',['"Cần gì cứ hỏi. Trừ cái kìm cắt xích, cái đó 25 đô, không mặc cả."','"Kho sau là chỗ riêng của tôi, đừng có lảng vảng."','"Bà Vance mua của tôi ba ổ khóa xích tuần trước. Khóa cái gì mà lắm thế?"']),[['Thôi']]];},
};
function metCeline(){S.flags.metCeline=1;doneQ('home');startQ('linh');S.cash+=20;S.flags.allowDay=day();S.flags.pieAsked=1;
 scenePlay('Nhà Dì Celine',['Tóc bạc, tạp dề dính bột, và cái ôm siết chặt như sợ bạn đổi ý. Đây là Dì Celine, người sẽ trông bạn từ giờ.',
  '"Phòng của cháu ở phía sau, cạnh bếp. Dì nói trước: thị trấn này có giờ giới nghiêm 23:00, và cảnh sát Simon rất thích viết biên bản."',
  'Trên bàn có một lá thư của Ngân hàng Maple Hollow: THÔNG BÁO SIẾT NỢ. Dì úp nó xuống thật nhanh.',
  '"Thị trưởng Lang muốn mua cả dãy nhà này để xây Hollow Commons. Ai không bán thì ngân hàng tự nhiên đòi nợ. Chủ nhật này hội đồng bỏ phiếu."',
  '"Cô Linh bên đài WMHV đang tìm người giúp. Ghé trường quay hoặc quán Diner buổi trưa mà gặp cô ấy. À, Mục sư Avery cần bánh táo cho buổi bán bánh, bánh ở trên bếp đấy."',
  'Dì dúi vào tay bạn 20 đô tiêu vặt.']);}
function metLinh(){S.q.linh=2;['proof','deed','ledger','report','loan','phone'].forEach(k=>{if(!S.q[k])S.q[k]=1;});R('linh',5);S.flags.metLinh=1;
 scenePlay('MC Linh Tran · WMHV-TV',['"Cháu của bà Celine hả? Tốt. Tôi cần một người mà Thị trưởng chưa để ý tới."',
  '"Hollow Commons là một vụ lừa. Lang nhận tiền của Marlowe Vance, làm giả báo cáo để phá nhà thờ, và ép ngân hàng siết nợ những ai không chịu bán."',
  '"Chủ nhật 18:00, tôi phát sóng trực tiếp phiên điều trần ở Tòa thị chính. Mang tới ít nhất 3 bằng chứng, và thuyết phục ít nhất 3 người dân đứng lên nói. Như thế Trung sĩ Kim sẽ phải hành động."',
  '"Năm manh mối: chứng thư 1791 trong nhà thờ, sổ chi trong văn phòng Thị trưởng, báo cáo kiểm định ở Nhà máy cũ, hồ sơ siết nợ ở ngân hàng, và video trong điện thoại của Dex mà Simon đã tịch thu."',
  '"Cẩn thận: nhân viên và cảnh sát mà thấy cậu ở khu NHÂN VIÊN, KHU CẤM, hay ngoài đường sau 23:00, thanh RẮC RỐI sẽ tăng. Bị bắt 4 lần là cậu bị gửi về."'],()=>questLog());}
