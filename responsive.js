// Toggle menu khi bấm nút 3 gạch
const toggleBtn = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

toggleBtn?.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// Mở submenu khi bấm vào mục có .subnav
const navLinks = document.querySelectorAll("#nav > li > a");
navLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    const parent = this.parentElement;
    const hasSubnav = parent.querySelector(".subnav");

    if (hasSubnav && window.innerWidth <= 1024) {
      e.preventDefault(); // Ngăn chuyển trang
      parent.classList.toggle("active");

      // Đóng các menu khác
      document.querySelectorAll("#nav > li").forEach(li => {
        if (li !== parent) li.classList.remove("active");
      });
    }
  });
});