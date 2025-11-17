// ./assets/js/clientArt.js

// Lấy danh sách tranh từ localStorage (do admin lưu)
function getArtworksFromStorage() {
    try {
        const raw = localStorage.getItem('admin_artworks');
        if (!raw) return [];
        const artworks = JSON.parse(raw);
        if (!Array.isArray(artworks)) return [];
        return artworks;
    } catch (e) {
        console.error('Lỗi đọc admin_artworks từ localStorage:', e);
        return [];
    }
}

// Render tranh ra trang người dùng, MỖI TRANG CHỈ GỌI 1 LẦN KHI LOAD
function renderArtworksForPage() {
    const container = document.getElementById('art-list');
    if (!container) {
        console.warn('Không tìm thấy #art-list trên trang người dùng');
        return;
    }

    // Loại tranh của trang (VD: "Tranh sơn dầu") – bạn set trong HTML:
    // <div id="art-list" data-art-category="Tranh sơn dầu">
    const pageCategory = (container.dataset.artCategory || 'all').toLowerCase();

    // Tìm 1 thẻ .painting có sẵn để làm template
    const templateCard = container.querySelector('.painting');
    if (!templateCard) {
        console.warn('Không tìm thấy .painting nào để làm mẫu trong #art-list');
        return;
    }

    let artworks = getArtworksFromStorage();
    if (!artworks.length) {
        // Không có dữ liệu từ admin → thôi, giữ nguyên tranh có sẵn
        return;
    }

    // Lọc theo danh mục của trang
    if (pageCategory !== 'all') {
        artworks = artworks.filter(art =>
            (art.category || '').toLowerCase() === pageCategory ||
            (art.category || '').toLowerCase().includes(pageCategory)
        );
    }

    if (!artworks.length) {
        // Không có tranh nào đúng loại này → khỏi thêm
        return;
    }

    // Tạo fragment để append cho mượt
    const fragment = document.createDocumentFragment();

    artworks.forEach(art => {
        // Clone node từ template (true = clone cả cây con)
        const card = templateCard.cloneNode(true);

        // Cập nhật dữ liệu bên trong
        const imgEl = card.querySelector('img');
        if (imgEl) {
            imgEl.src = art.image;
            imgEl.alt = art.name;
        }

        const nameEl = card.querySelector('.name');
        if (nameEl) {
            nameEl.textContent = art.name;
        }

        const catEl = card.querySelector('.category');
        if (catEl) {
            // Bạn có thể chỉnh lại format nếu muốn
            catEl.textContent = (art.category || '').toUpperCase();
        }

        const priceEl = card.querySelector('.price');
        if (priceEl) {
            // Ở admin mình chỉ có 1 giá: price
            // Nếu sau này bạn muốn thêm giá gốc / giảm giá, có thể mở rộng thêm field
            const priceText = art.price
                ? Number(art.price).toLocaleString('vi-VN') + 'đ'
                : '';
            priceEl.innerHTML = priceText;
        }

        fragment.appendChild(card);
    });

    // Append tranh mới xuống dưới, GIỮ NGUYÊN tranh cũ
    container.appendChild(fragment);
}

// Khởi động khi trang load
document.addEventListener('DOMContentLoaded', renderArtworksForPage);
