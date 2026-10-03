# Restricted Access · Ashgrove Stories

Chơi online: https://adbosp.github.io/restricted.github.io/

Camera ngôi thứ ba mặc định ở gần ngang tầm nhân vật. Giữ chuột trái và kéo ngang/dọc trên cảnh 3D để xoay quanh nhân vật và nâng/hạ camera; trên mobile kéo bằng ngón tay, có thể dùng cùng lúc với joystick. Lăn chuột, chụm hai ngón hoặc nút − / + để zoom. Nút **Góc nhìn** (phím **V** trên máy tính) chuyển lần lượt **Trực diện → Từ trên cao → Sau vai**. Góc trực diện hạ camera ngang thân trên và xoay về phía mặt nhân vật; sau đó vẫn có thể kéo tự do. Camera tránh tường đặc, trần phòng khác và mái nhà khác, nhưng đi xuyên cánh cửa để không bị đẩy/giật khi cửa mở hoặc đóng. Khoảng cách orbit không đổi tại ranh giới trong/ngoài nhà; sau vật cản, camera giãn lại từ từ.

Mở `RestrictedAccess.html` bằng Chrome hoặc Edge. Giữ thư mục `vendor` bên cạnh file HTML; thư viện Three.js đã được lưu tại máy để cảnh 3D không phụ thuộc CDN. Font Google có font hệ thống thay thế khi không có mạng.

## Mobile và cài game

Game tự bật chế độ Mobile trên thiết bị cảm ứng. Nút **Mobile** cho phép chọn Tự động, Mobile hoặc Máy tính; lựa chọn được nhớ trên thiết bị. Joystick bên trái có tốc độ theo độ kéo. Dùng ngón khác kéo trực tiếp trên cảnh để xoay camera trong lúc di chuyển; chụm hai ngón hoặc bấm **− / +** để zoom. Nút **Tương tác** dùng cùng hành động E, nút **Cúi** dùng cùng hành động C. Khi thả tay, mất tiêu điểm hoặc mở hội thoại, điều khiển tự trở về trạng thái dừng.

Hỗ trợ cả màn hình dọc/ngang, phần khuyết và thanh home của điện thoại. Nút **Mobile** và **Cài game** nằm đầu thanh công cụ trong chế độ cảm ứng; vuốt ngang thanh để mở các chức năng còn lại. Nhiệm vụ đầy đủ nằm ở nút **Nhiệm vụ**. Độ phân giải 3D giới hạn ở 1.5 lần điểm ảnh CSS trên mobile để giảm tải GPU. Bàn phím, chuột, lưu/tải và quy tắc nhìn vào phòng vẫn dùng chung với bản máy tính.

Để cài trên điện thoại, đưa các file sau lên cùng thư mục của máy chủ **HTTPS**, rồi mở `RestrictedAccess.html`:

- `RestrictedAccess.html`, `mobile.css`, `mobile.js`, `manifest.webmanifest`, `sw.js`.
- Thư mục `icons/` và `vendor/`.

Android Chrome / Edge: bấm **Cài game** và xác nhận hộp cài đặt. Nếu trình duyệt chưa đưa ra lời mời, dùng menu **⋮ → Cài đặt ứng dụng / Thêm vào màn hình chính**. iPhone / iPad: dùng **Chia sẻ → Thêm vào Màn hình chính**. Game đã cài mở ở chế độ ứng dụng, có biểu tượng Ashgrove riêng. Nút Mobile cũng có lựa chọn fullscreen nếu trình duyệt hỗ trợ.

Sau khi tải đầy đủ và trạng thái báo **Đã sẵn sàng chơi ngoại tuyến**, tài nguyên game được lưu bằng service worker; có thể mở lại khi mất mạng. Save vẫn sử dụng `ra_save3` qua **Lưu / Tải**, gắn với trình duyệt và địa chỉ web đang chơi; không tự đồng bộ giữa các máy. Font ngoài mạng có font hệ thống thay thế.

Kiểm tra trên máy tính bằng `python -m http.server 8765 --bind 127.0.0.1`, rồi mở `http://127.0.0.1:8765/RestrictedAccess.html`. `localhost` hỗ trợ thử PWA trên chính máy tính; địa chỉ này không phải đường dẫn để điện thoại truy cập. Mở file trực tiếp hoặc dùng HTTP qua địa chỉ LAN vẫn chơi được, nhưng cài đặt/ngoại tuyến trên điện thoại cần HTTPS.

Khi thay đổi tài nguyên được phân phối, tăng phiên bản `CACHE` trong `sw.js`. Bản mới tải vào nền và kích hoạt tự động; tải lại trang hoặc mở lại ứng dụng để nhận camera và tài nguyên mới. Thư mục backups và các script kiểm tra không cần đưa lên máy chủ. Bản trước cập nhật mobile: `backups/RestrictedAccess.before-mobile.html`.

`node verify-mobile.cjs` kiểm tra cảm ứng đa điểm, joystick analog, camera, cúi/tương tác, dừng điều khiển, chuyển/lưu chế độ, màn hình dọc/ngang, manifest/icon, điều kiện cài của Chrome và khởi động/tải save ngoại tuyến. `mobile-results.json` ghi kết quả. Kiểm tra chạy bằng Chrome giả lập cảm ứng Android/iOS; chưa cài thử trên điện thoại thật.

Bản cập nhật thêm hai sự cố thỉnh thoảng xuất hiện:

- Ms. Lopez bị mắc tay áo trong cửa máy giặt ở Phòng giặt KTX.
- Jade, nữ sinh cá biệt, bị mắc ba lô khi chui hàng rào phía đông để trốn tiết.

Đi theo dấu **! màu cam** trên bản đồ, tới gần và nhấn **E** để chọn giúp đỡ hoặc bỏ mặc. Giúp đỡ tăng danh tiếng và thiện cảm; bỏ mặc giảm cả hai. Nếu không can thiệp trong 105 phút game, người khác sẽ giúp. Thời gian tạm dừng trong hộp lựa chọn.

Ngày đầu tiên có cơ hội gặp Jade lúc 09:30 và Ms. Lopez lúc 18:00. Những ngày sau, mỗi tình huống có xác suất và khung giờ riêng, được lưu cùng tiến trình; tải lại game không đổi lịch đã chọn. Nút Chờ tăng 30 phút game. Ms. Lopez tặng chìa kho hồ sơ trong lần giúp đầu tiên, giữ đường mở kho của game cũ.

Đồ họa được cập nhật với vật liệu PBR, màu sắc được chuyển đúng sang không gian tuyến tính, ánh sáng ngày/đêm, bóng mềm, mặt nước có phản xạ và gợn sóng, nhân vật có tay chân tròn và chi tiết máy giặt/hàng rào. UI mới có HUD xanh navy, điểm nhấn vàng, thẻ sự cố, nhật ký và bố cục điện thoại.

Bản gốc được giữ trong `backups/RestrictedAccess.before-update.html`. Bản lưu vẫn sử dụng khóa `ra_save3` và hỗ trợ bổ sung dữ liệu mới khi tải save cũ.

`verify-game.cjs` kiểm tra trên Chrome qua CDP bằng Playwright đi kèm Codex. `verification-results.json` ghi số kiểm tra đã đạt và danh sách ảnh kiểm chứng. Các kiểm tra bao gồm hai nhánh lựa chọn, hết thời gian, chuyển ngày, lưu/tải sự cố đang xảy ra, save cũ, tránh thưởng lặp, mở bản đồ/nhân vật/nhật ký và bố cục điện thoại.

## Quyền nhìn vào phòng

Tường, cửa sổ, viền ngoài và cánh cửa giữ nguyên hình dạng/chiều cao khi vào phòng hoặc xoay camera. Chỉ trần/mái che phòng đang đứng được ẩn trong bố cục tầng hiện tại; phòng khác vẫn có trần che. Nội thất, nhân vật và nhãn tương tác của mỗi phòng chỉ xuất hiện trong góc nhìn chính khi Leo thực sự ở trong phòng đó. Đứng ở hành lang hoặc đưa camera qua khe cửa cũng không làm lộ các phòng bên cạnh. Rời phòng đóng lại nội thất ngay, kể cả sau dịch chuyển hoặc tải save.

Tới gần cửa sổ có điểm tương tác rồi nhấn **E** để mở góc nhìn 3D giới hạn qua cửa sổ. Điểm xem trộm tại phòng thí nghiệm, phòng khách A và cửa phòng nhạc cũng mở góc quan sát; nút **Quan sát câu chuyện** giữ các tình tiết có sẵn. Nhấn **Esc** hoặc **Rời điểm quan sát** để đóng. Quyền quan sát không được lưu thành quyền nhìn xuyên phòng.

Ô quan sát mặc định mở gần kín màn hình. Nút **⛶ Toàn màn hình** nằm cạnh **Đóng · Esc** ở góc trên bên phải; nhấn **⛶ Thu nhỏ** để trở lại. Trình duyệt nhúng không hỗ trợ fullscreen sẽ dùng chế độ phủ kín khung trình duyệt. Độ phân giải và tỷ lệ camera tự điều chỉnh theo kích thước ô quan sát.

`verify-room-privacy.cjs` kiểm tra tất cả 54 phòng kín, các mặt ngoài, hướng xoay và giới hạn zoom, phòng cạnh hành lang, vị trí camera, nhìn cửa sổ/xem trộm, đóng góc quan sát, quyền theo tầng và giao diện điện thoại. Kết quả nằm trong `room-privacy-results.json`. Bản ngay trước thay đổi này được giữ ở `backups/RestrictedAccess.before-room-privacy.html`.

`node verify-camera.cjs` kiểm tra xoay ngang/dọc bằng chuột và cảm ứng, giới hạn pitch, góc ngang tầm/trực diện, phím V, reset khi mất tiêu điểm/mở modal, và joystick cùng lúc với xoay dọc. `camera-results.json` ghi kết quả.

`node verify-solid-walls.cjs` kiểm tra tường/cửa/viền/trần trong cả 54 phòng, đo đường đi camera hai chiều tại cửa KTX, cửa chính, cửa phòng giặt và lớp Toán, xác nhận chuyển động cánh cửa không ảnh hưởng camera, quyền nhìn vào phòng và bước qua cửa bằng điều khiển thật. `solid-walls-results.json` ghi kết quả và số đo dịch chuyển. Bản trước thay đổi tường được giữ tại `backups/RestrictedAccess.before-solid-walls.html` trên máy.
