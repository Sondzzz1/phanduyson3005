function showSection(id) {
  // Ẩn tất cả các phần nội dung
  const sections = document.querySelectorAll("#home, #orders, #art, #customers, #warehouse, #report, #settings");
  sections.forEach(sec => sec.classList.add("hidden"));

  // Hiện phần được chọn
  document.getElementById(id).classList.remove("hidden");

  // Cập nhật trạng thái active trong sidebar
  const items = document.querySelectorAll(".sidebar ul li");
  items.forEach(li => li.classList.remove("active"));
  
  // Thêm class active cho item vừa được click
  event.currentTarget.classList.add("active");
}

function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
    window.location.href = "../DangNhap.html";
  }
}
