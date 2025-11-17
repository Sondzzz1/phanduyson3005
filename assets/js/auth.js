// assets/js/auth.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn form submit theo cách truyền thống

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Mặc định địa chỉ trang người dùng (trang xem tranh)
    const USER_PAGE = '/index.html'; 
    // Địa chỉ trang admin (trang quản trị hiện tại)
    const ADMIN_PAGE = '/admin.html; // Giả sử file quản trị của bạn là admin.html';

    // 1. Logic kiểm tra tài khoản
    let role = null;
    let redirectURL = null;

    // Kiểm tra tài khoản Admin
    if (username === 'admin' && password === '123456') {
        role = 'admin';
        redirectURL = ADMIN_PAGE;
    } 
    // Kiểm tra tài khoản Người dùng thường
    else if (username === 'user' && password === '123456') {
        role = 'user';
        redirectURL = USER_PAGE;
    } 
    // Sai tên đăng nhập/mật khẩu
    else {
        errorMessage.textContent = 'Sai tên đăng nhập hoặc mật khẩu.';
        return;
    }

    // Xóa thông báo lỗi
    errorMessage.textContent = ''; 

    // 2. Lưu trữ trạng thái đăng nhập và vai trò (Dùng sessionStorage hoặc localStorage)
    // Lưu ý: Trong môi trường thực tế, thông tin này phải được server xác thực bằng JWT hoặc Session.
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userRole', role);

    // 3. Chuyển hướng
    window.location.href = redirectURL;
});