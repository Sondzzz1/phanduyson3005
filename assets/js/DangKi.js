document.addEventListener("DOMContentLoaded", function () {
    // Chỉ xử lý form Đăng ký (Class: .register-form)
    const registerForm = document.querySelector('.register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Ngăn chặn gửi form mặc định

            // Lấy input - Giả định form Đăng ký có id="email" và id="phone"
            const emailInput = document.getElementById('email'); 
            const phoneInput = document.getElementById('phone');
            
            // Kiểm tra an toàn
            if (!emailInput || !phoneInput) {
                console.error("Thiếu input 'email' hoặc 'phone' trên form Đăng Ký.");
                alert("Form Đăng Ký bị thiếu trường dữ liệu.");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
            const phonePattern = /^0[0-9]{9}$/; 

            if (!emailPattern.test(emailInput.value)) {
                alert('Vui lòng nhập đúng định dạng email (ví dụ: example@domain.com).');
                return;
            }

            if (!phonePattern.test(phoneInput.value)) {
                alert('Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.');
                return;
            }
            
            // ⭐ Logic thành công: Chuyển hướng sau khi đăng ký thành công
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            window.location.href = "DangNhap.html"; // Giả sử chuyển về trang đăng nhập
        });
    }
});