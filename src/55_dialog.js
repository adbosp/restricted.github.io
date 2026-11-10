/* =====================================================================
   CRESTMOOR · dialogue. dlg[id]() → [text, [[label, fn], ...]]
   Chapter 1 only reveals what Ethan can know on his first day; the rest waits for later chapters.
   ===================================================================== */
const pickLine=(id,arr)=>arr[(day()*7+Math.floor(hour()/3)+id.length)%arr.length];
const R=(id,d)=>{S.rel[id]=(S.rel[id]||0)+d;};
const simple=(k,lines)=>()=>[pickLine(k,lines),[['Thôi']]];
const dlg={
 sara(){const o=[],c=Math.floor(S.c1);
  if(c===3&&!S.flags.trashTask)o.push(['Cháu giúp được gì không ạ?',()=>{S.flags.trashTask=1;scenePlay('Sara',[SAY('sara','Sara hơi ngạc nhiên. "...Túi rác cạnh tủ lạnh. Mang ra thùng ở lề đường giúp tôi. Đậy nắp cho kỹ, ở đây gấu mèo nhiều lắm."')]);}]);
  if(c>=3&&!S.flags.askTown)o.push(['Hỏi về Crestmoor',()=>{S.flags.askTown=1;trust(1);scenePlay('Sara',[SAY('sara','"Crestmoor nhỏ lắm. Một con phố chính, một trường đại học, một ngân hàng." Bà ngừng một chút ở chữ "ngân hàng".'),
   SAY('sara','"Thị trưởng Keller thích chụp ảnh với sinh viên năm nhất. Đài KCRM thì thích chụp ảnh lúc người ta không muốn bị chụp. Còn quán bar Red Lantern bên Cedar Ln..." Bà lắc đầu. "Tránh xa chỗ đó ra."')],()=>{addNote('rules','Tránh xa quán bar Red Lantern (lời Sara)');});}]);
  if(c>=3&&S.flags.trashTask===2&&S.flags.trashOk!==2&&!S.flags.thanked&&S.flags.trashOk)o.push(['"Cháu đổ rác rồi ạ."',()=>{S.flags.thanked=1;toast('Sara gật đầu. "Ừ. Tôi thấy rồi."');}]);
  o.push(['Thôi']);
  const t=c<3?'"Có gì cần thì cứ hỏi. Nhưng đừng hỏi nhiều quá."':c===3?(hour()>=dinnerT()-1.2?'Sara đang đảo nồi súp, không ngẩng lên. "Bữa tối bảy giờ. Tôi nhớ là đã nói rồi."':'"Cậu dọn đồ xong chưa?" Sara gấp chiếc khăn lau bát làm tư, rồi làm tư lần nữa.')
   :c<6?'Sara rửa bát, lưng quay về phía cậu. Điện thoại úp trên quầy lại rung lên.'
   :pickLine('sa',['"Giờ yên tĩnh là mười giờ. Tôi nói lần cuối."','"Cậu ăn sáng chưa? Có bánh mì nướng trong lò."','"Tiền thuê đầu tháng nhé. Đừng để tôi phải nhắc."','Sara đang xem một tờ giấy, thấy cậu bước vào thì gấp lại thật nhanh.']);
  return[t,o];},
 rossie(){const o=[],c=Math.floor(S.c1);
  if(c>=3&&!S.flags.askCampus)o.push(['Hỏi về Đại học Crestmoor',()=>{S.flags.askCampus=1;if(S.rel.rossie>=15){rossie(2);toast('Rossie: "Hiệu trưởng Bancroft ghét bị cãi. Cô Hanley dạy Hóa thì ghét đi muộn. Thế thôi, giờ để tôi yên."');addNote('found','Theo Rossie: Bancroft ghét bị cãi, cô Hanley ghét đi muộn');}else{rossie(-1);toast('Rossie: "Tự mà tìm hiểu. Tôi không phải hướng dẫn viên."');}}]);
  if(c>=3&&S.flags.askedDebt&&!S.flags.sorryDebt)o.push(['Xin lỗi vì câu hỏi lúc nãy',()=>{S.flags.sorryDebt=1;rossie(3);toast('Rossie im lặng một lúc. "...Quên đi." Nghe như một lời chấp nhận.');}]);
  o.push(['Thôi']);
  const t=c<3?'"Gì?"':c===3?pickLine('ro',['Rossie không rời mắt khỏi điện thoại. "Cậu cần gì?"','"Cậu đứng chắn ánh sáng của tôi."','Rossie đeo một bên tai nghe, bên kia để trống, như thể sẵn sàng bỏ đi bất cứ lúc nào.'])
   :c<6?'Cửa phòng Rossie khép hờ. "Đi ngủ đi, người thuê nhà."'
   :pickLine('ro2',['"Ở trường đừng có chào tôi. Tôi nói nghiêm túc đấy."','"Tối nay tôi về muộn. Đừng có mách mẹ tôi."','"Cậu nhìn cái gì?"','Rossie ngáp dài. "Mười giờ sáng đã là sáng sớm rồi."']);
  return[t,o];},
 may(){const o=[];if(!S.flags.mayIntro)o.push(['"Chào cô, cháu là Ethan, ở nhà bên."',()=>{S.flags.mayIntro=1;maySus(S.flags.offeredSorry?-3:2);toast('May: "Tôi biết cậu là ai." Bà ta không đưa tay ra bắt.');}]);o.push(['Thôi']);
  return[pickLine('my',['"Cậu đi đâu đấy, cậu nhóc?"','"Sara là người tốt. Quá tốt so với những người bà ấy cho ở trọ."','May đứng tưới cây, nhưng vòi nước chĩa vào đúng một chỗ đã ướt sũng từ lâu.','"Chồng tôi đi công tác. Nhưng tôi thì luôn ở nhà. Nhớ lấy."']),o];},
 dave:simple('dv',['"À, sinh viên năm nhất! Crestmoor an toàn nhất Oregon, nhờ có tôi. Nhớ bỏ phiếu cho Keller nhé."','"Thị trấn cần phát triển, cậu hiểu không? Khu đất gần trường bỏ hoang thì phí quá."','Thị trưởng bắt tay cậu, nụ cười rộng nhưng mắt thì đang nhìn qua vai cậu, tìm ai đó quan trọng hơn.']),
 melania:simple('ml',['"Cậu đang đứng trên thảm hoa của Hội Phụ nữ Crestmoor đấy."','Bà Keller nhìn cậu như đang ước lượng giá trị của một món đồ.','"Chồng tôi lo phát biểu. Còn mọi việc khác thì tôi lo."']),
 jeanie:simple('jn',['"Sinh viên năm nhất hả? Tuyệt. Có gì thú vị ở trường thì nhắn cho tôi. Ẩn danh cũng được."','"Bancroft ghét tôi. Đó là lời khen tốt nhất mà tôi từng nhận."','Jeanie nghiêng đầu nhìn cậu. "Cậu ở nhà ai? Whitfield à? Hừm. Thú vị."']),
 bancroft:simple('bc',['"Năm nhất? Lịch nhập học dán ở hành lang. Tôi không nhắc lại lần hai."','Hiệu trưởng Bancroft nhìn cậu qua cặp kính, lâu hơn một giây so với cần thiết, rồi quay đi.','"Trường này có quy tắc. Ai không theo được thì cửa ở phía sau."']),
 laura:simple('lh',['"Phòng thí nghiệm không phải chỗ chơi. Đeo kính bảo hộ, và đừng đến muộn."','"Hiệu trưởng Bancroft đã nói vậy thì cứ thế mà làm."','Cô Hanley đang dán nhãn từng lọ hóa chất, chữ thẳng tắp như in.']),
 maria:simple('mo',['"Cậu là sinh viên mới? Chào mừng đến Crestmoor." Nụ cười của bà Ortega lịch sự đến mức không đọc được gì.','"Con gái tôi, Diana, cũng từng học ở đây. Giờ nó đang đi du lịch. Rất xa."','"Một ngôi trường cũng như một công ty. Ai nắm cổ phần, người đó quyết định."']),
 chloe:simple('ch',['"Cậu là thằng bé ở trọ nhà Sara hả?" Chloe nhìn cậu từ đầu đến chân. "Sara đủ mệt rồi, đừng làm bà ấy mệt thêm."','"Tôi đã bảo Sara đừng cho người lạ vào nhà."','Chloe nhắn tin liên tục, môi mím chặt.']),
 morgan:simple('mg',['"Một tài khoản sinh viên tại Ngân hàng Pryce? Chúng tôi luôn chào đón khách hàng trẻ." Ông mỉm cười như một con cá mập hiền lành.','"Ở Crestmoor, mọi khoản nợ đều được ghi nhớ, cậu ạ. Đó là nguyên tắc của ngân hàng."','Morgan Pryce chỉnh lại khuy măng sét bằng vàng, không thèm nhìn cậu.']),
 lucy:simple('lc',['"Chào! Cậu là người mới đúng không? Mình là Lucy, chắc mình học chung lớp đấy." Cô cười, rồi lùi lại một bước.','"Thư viện yên tĩnh nhất vào buổi trưa. Mình hay ngồi ở bàn cạnh cửa sổ."','"Cẩn thận Lily với Max nhé. Họ... không tốt lắm với người mới."']),
 lily:simple('ll',['"Ơ, nhìn kìa, đồ mới mua ở chợ giảm giá à?" Lily cười, liếc sang Max.','"Đừng có đứng gần tôi, người ta lại tưởng mình quen nhau."','Lily chụp ảnh cậu bằng điện thoại, rồi cười khúc khích.']),
 max:simple('mx',['"Năm nhất à? Ở đây năm nhất phải xách đồ cho năm hai. Luật đấy." Max cười to.','Max cố tình huých vai cậu khi đi ngang qua.','"Thấy gì vui không, thằng thuê nhà?"']),
 evan:simple('ev',['"Ê, cậu mới tới hả? Cần gì cứ hỏi tớ, tớ biết hết mọi chuyện ở đây." Evan cười rất thân thiện.','"Cậu ở nhà ai thế? Ở với ai? Đi học giờ nào?" Evan hỏi dồn, rồi tự cười. "Tớ tò mò thôi."','"Tối nay tớ phải ghé Red Lantern gặp người quen. Việc riêng ấy mà."']),
 natasha:simple('nt',['"Đi bộ thì nhìn đường. Tôi không muốn phải viết thêm biên bản tai nạn."','Natasha chống tay lên hông, nhìn cậu từ đầu đến chân. "Mặt lạ. Mới tới hả?"','"Ở Crestmoor, có những chỗ sau mười giờ tối không nên lảng vảng. Cậu sẽ biết."']),
 lynda:simple('lf',['"Đại úy Ford. Có gì đáng ngờ thì báo cho tôi, đừng tự làm anh hùng."','Đại úy Ford đang xem một tập hồ sơ dày, bìa có vẽ một bông hồng đỏ.','"Tôi chậm, nhưng tôi không bỏ cuộc. Nhớ lấy điều đó, nếu cậu định làm gì dại dột."']),
 marcus:simple('mv',['"Đừng nhìn tôi như thế. Tôi chỉ đang ăn sáng." Marcus Vale không rời mắt khỏi cửa ra vào.','"Tôi làm việc cho người trả tiền. Hôm nay thì chưa ai trả."','"Cậu ở nhà Whitfield nhỉ? Tôi biết căn nhà đó. Biết cả vụ tai nạn xe nữa."']),
 paul:simple('pl',['"Cần gì thì nói. Đồ gì tôi cũng kiếm được. Giá thì... tùy."','Paul nhìn quanh trước khi nói tiếp. "Không phải ở đây. Không phải bây giờ."','"Cậu chưa đủ tiền để làm khách của tôi đâu, nhóc."']),
 williams:simple('wl',['Người đàn ông mặc đồ đen nhìn cậu, không nói gì. Hai gã đứng sau lưng ông ta bước lên một bước.','"Đi tiếp đi, cậu nhóc. Đây không phải chỗ cho sinh viên."','"Crestmoor là một thị trấn tốt. Miễn là ai cũng biết vị trí của mình."']),
};
