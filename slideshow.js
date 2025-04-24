window.addEventListener("DOMContentLoaded", () => { //Đảm bảo mã chỉ chạy khi toàn bộ nội dung DOM đã được tải.
    const slider = document.getElementById("slider");
    let slides = slider.querySelectorAll(".info-work");
    const visibleSlides = 4;
    const totalSlides = slides.length;
    let currentIndex = visibleSlides;
    let slideWidth;

    function cloneSlides() {
        for (let i = 0; i < visibleSlides; i++) {
            const first = slides[i].cloneNode(true);
            const last = slides[totalSlides - 1 - i].cloneNode(true);
            slider.appendChild(first);
            slider.insertBefore(last, slider.firstChild);
        }
        slides = slider.querySelectorAll(".info-work");
    }

    function initSlider() {
        cloneSlides();
        slideWidth = slides[0].offsetWidth;
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }

    function updateSlider() {
        slider.style.transition = 'transform 0.5s ease-in-out';
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }

    function nextSlide() {
        currentIndex++;
        updateSlider();

        if (currentIndex >= slides.length - visibleSlides) {
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = visibleSlides;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }, 500);
        }
    }

    function prevSlide() {
        currentIndex--;
        updateSlider();

        if (currentIndex < visibleSlides) {
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = slides.length - visibleSlides * 2;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }, 500);
        }
    }

    // Khởi tạo slider
    initSlider();

    // Resize lại khi thay đổi kích thước trình duyệt
    window.addEventListener("resize", () => {
        slideWidth = slides[0].offsetWidth;
        updateSlider();
    });

    // Gán hàm vào window để HTML gọi được onclick="..."
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
});

//chuyển ảnh phần nhận xét khách hàng
let currentIndex = 0;

  function showSlide(index) {
    const track = document.querySelector(".feedback-track");
    const slides = document.querySelectorAll(".feedback-slide");
    const totalSlides = slides.length;

    // Đảm bảo chỉ chạy trong giới hạn số slide
    if (index < 0) {
      index = totalSlides - 1;
    } else if (index >= totalSlides) {
      index = 0;
    }

    // Cập nhật vị trí trượt
    track.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
  }

  function nextslide() {
    showSlide(currentIndex + 1);
  }

  function prevslide() {
    showSlide(currentIndex - 1);
  }

  // Hiển thị slide đầu tiên khi tải trang
  document.addEventListener("DOMContentLoaded", () => {
    showSlide(currentIndex);
});

// Gọi để hiển thị slide đầu tiên ngay khi load trang
document.addEventListener("DOMContentLoaded", () => {
  showSlide(currentIndex);
});



//chuyển ảnh tự động trang chủ
const listImage = document.querySelector('.slider-container');
const imgs = document.querySelectorAll('.slide'); 
const length = imgs.length;
let current = 0;

function nextSlide() {
    if (!imgs.length) return; 

    let width = imgs[0].offsetWidth; 

    current = (current + 1) % length; 

    listImage.style.transform = `translateX(${-width * current}px)`;
    listImage.style.transition = "transform 0.5s ease-in-out"; 
}

// Chạy tự động sau mỗi 4 giây
let slideInterval = setInterval(nextSlide, 4000);


//tác phẩm nỗi bật trang chủ
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("slided");
    let slides = slider.querySelectorAll(".info-work");

    const totalSlides = slides.length;
    const visibleSlides = 4;
    const slideWidth = slides[0].offsetWidth;

    let currentIndex = visibleSlides; 

    for (let i = slides.length - visibleSlides; i < slides.length; i++) {
        let clone = slides[i].cloneNode(true);
        clone.classList.add("clone");
        slider.insertBefore(clone, slider.firstChild);
    }

    for (let i = 0; i < visibleSlides; i++) {
        let clone = slides[i].cloneNode(true);
        clone.classList.add("clone");
        slider.appendChild(clone);
    }

    // Re-calculate slides after cloning
    slides = slider.querySelectorAll(".info-work");
    slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

    function Nextslide() {
        if (currentIndex >= slides.length - visibleSlides) return;
        currentIndex++;
        slider.style.transition = "transform 0.4s ease";
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

        slider.addEventListener("transitionend", () => {
            if (currentIndex === slides.length - visibleSlides) {
                slider.style.transition = "none";
                currentIndex = visibleSlides;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }
        }, { once: true });
    }

    function Prevslide() {
        if (currentIndex <= 0) return;
        currentIndex--;
        slider.style.transition = "transform 0.4s ease";
        slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

        slider.addEventListener("transitionend", () => {
            if (currentIndex === 0) {
                slider.style.transition = "none";
                currentIndex = slides.length - visibleSlides * 2;
                slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            }
        }, { once: true });
    }

    window.Nextslide = Nextslide;
    window.Prevslide = Prevslide;
});







