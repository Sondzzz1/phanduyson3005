
//đăng nhập - LOGIC CHÍNH
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('.login-form');
    
    // ⭐ Định nghĩa tài khoản để kiểm tra phân quyền 
    const ADMIN_EMAIL = 'admin@art.com'; 
    const ADMIN_PASSWORD = '123456'; 
    
    const USER_PAGE = 'index.html';      
    const ADMIN_PAGE = 'admin.html'; 

    if (form) { // Đảm bảo form tồn tại trước khi thêm listener
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // --- Kiểm tra định dạng và dữ liệu trống ---
            if (!emailPattern.test(emailInput.value)) {
                alert('Vui lòng nhập đúng định dạng email (ví dụ: mau@gmail.com).');
                return;
            }
            if (passwordInput.value.trim() === "") {
                alert("Vui lòng nhập mật khẩu.");
                return;
            }
            // ------------------------------------------

            // --- LOGIC PHÂN QUYỀN VÀ CHUYỂN HƯỚNG ---
            const enteredEmail = emailInput.value;
            const enteredPassword = passwordInput.value;
            
            let redirectURL = null;
            let userRole = null;

            if (enteredEmail === ADMIN_EMAIL && enteredPassword === ADMIN_PASSWORD) {
                // Trường hợp 1: Tài khoản Admin hợp lệ
                userRole = 'admin';
                redirectURL = ADMIN_PAGE; // admin.html
            } else {
                // Trường hợp 2: Tài khoản Người dùng thường (Giả lập)
                if (enteredEmail === 'user@art.com' && enteredPassword === '123456') {
                     userRole = 'user';
                     redirectURL = USER_PAGE; // TrangChu.html
                } else {
                     alert('Thông tin đăng nhập không hợp lệ.');
                     return;
                }
            }
            
            // --- LƯU TRẠNG THÁI ---
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userRole', userRole);

            // --- CHUYỂN HƯỚNG ---
            window.location.href = redirectURL;
        });
    }
});