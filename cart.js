
function addToCartFromButton(button) {
    const productContainer = button.closest('.product-details');
    const quantityInput = productContainer.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value);

    const item = {
        id: button.getAttribute('data-id'),
        name: button.getAttribute('data-name'),
        price: parseInt(button.getAttribute('data-price')),
        image: button.getAttribute('data-image'),
        quantity: quantity
    };

    addToCart(item);
}


function addToCart(item) {
    var list;
    if (localStorage.getItem('cart') == null) {
        list = [item];
    } else {
        list = JSON.parse(localStorage.getItem('cart')) || [];
        let found = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == item.id) {
                list[i].quantity += item.quantity;
                found = true;
                break;
            }
        }
        if (!found) {
            list.push(item);
        }
    }
    localStorage.setItem('cart', JSON.stringify(list));
    alert("🛒 Đã thêm sản phẩm vào giỏ hàng!");
    LoadData();
    capNhatSoLuongGioHang();
}

var list = JSON.parse(localStorage.getItem('cart'));
function LoadData() {
    var list = JSON.parse(localStorage.getItem('cart')) || [];
    var str = "";
    var total = 0;
    for (let x of list) {
        total += x.price * x.quantity;
        str += `<tr>
    <td>
        <i onclick="Xoa('${x.id}')" class="ti-trash" style="font-size:18px;color:red;cursor:pointer;" title="Xóa sản phẩm"></i>
    </td>
    <td><img src="${x.image}" style="width:50px;height:50px;border-radius:6px;"></td>
    <td class="ten-sp">${x.name}</td> <!-- 👈 -->
    <td class="gia-sp">${x.price.toLocaleString()}₫</td> <!-- 👈 -->
    <td class="sl-sp">
        <button onclick="Giam('${x.id}')" style="background-color:orange;border:none;border-radius:4px;padding:4px 8px;">-</button>
        <input id="q_${x.id}" type="number" value="${x.quantity}" onchange="updateQuantity('${x.id}')" style="width:40px;text-align:center;">
        <button onclick="Tang('${x.id}')" style="background-color:orange;border:none;border-radius:4px;padding:4px 8px;">+</button>
    </td>
    <td>${(x.price * x.quantity).toLocaleString()}₫</td>
</tr>`;

    }
    document.getElementById("listCart").innerHTML = str;
    document.getElementById("spTong").innerText = total.toLocaleString() + "₫";
    document.getElementById("tTong").innerText = total.toLocaleString() + "₫";
    capNhatSoLuongGioHang(); // cập nhật số hiển thị ở icon
}

function Xoa(id) {
    if (confirm("🗑️ Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?")) {
        var list = JSON.parse(localStorage.getItem('cart')) || [];
        list = list.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(list));
        LoadData(); // cập nhật lại bảng sau khi xóa
    }
}
function Giam(id) {
    var list = JSON.parse(localStorage.getItem('cart')) || [];
    var item = list.find(x => x.id == id);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
    }
    localStorage.setItem('cart', JSON.stringify(list));
    LoadData();
}

function Tang(id) {
    var list = JSON.parse(localStorage.getItem('cart')) || [];
    var item = list.find(x => x.id == id);
    if (item) {
        item.quantity += 1;
    }
    localStorage.setItem('cart', JSON.stringify(list));
    LoadData();
}

function updateQuantity(id) {
    var list = JSON.parse(localStorage.getItem('cart')) || [];
    var item = list.find(x => x.id == id);
    if (item) {
        var qty = parseInt(document.getElementById("q_" + id).value);
        item.quantity = qty > 0 ? qty : 1;
    }
    localStorage.setItem('cart', JSON.stringify(list));
    LoadData();
}

function updateCart() {
    alert("✅ Giỏ hàng đã được cập nhật!");
    LoadData();
}

function XoaCart() {
    if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
        localStorage.removeItem("cart");
        LoadData();
    }
}
//hiển thị số lượng ở icon giỏ hàng
// Lấy giỏ hàng từ localStorage hoặc tạo mới nếu chưa có
function layGioHang() {
    return JSON.parse(localStorage.getItem('gioHang')) || [];
}

// Lưu lại giỏ hàng vào localStorage
function luuGioHang(gioHang) {
    localStorage.setItem('gioHang', JSON.stringify(gioHang));
}

// Thêm sản phẩm vào giỏ
function themVaoGioHang(maSanPham) {
    let gioHang = layGioHang();
    
    // Tìm sản phẩm trong giỏ
    let sanPham = gioHang.find(sp => sp.ma === maSanPham);
    
    if (sanPham) {
        sanPham.soLuong += 1;
    } else {
        gioHang.push({ ma: maSanPham, soLuong: 1 });
    }

    luuGioHang(gioHang);
    capNhatSoLuongGioHang();
}

// Cập nhật số lượng hiển thị
function capNhatSoLuongGioHang() {
    let list = JSON.parse(localStorage.getItem('cart')) || [];
    let tongSoLuong = list.reduce((tong, sp) => tong + sp.quantity, 0);
    let el = document.querySelector(".cart-count");
    if (el) {
        el.textContent = tongSoLuong;
    }
}


// Gọi khi trang load để cập nhật số lượng nếu đã có trong localStorage
document.addEventListener("DOMContentLoaded", function() {
    LoadData(); // nếu bác muốn load sản phẩm lên bảng
    capNhatSoLuongGioHang();
});


//tiến hành thanh toán
function ThanhToan() {
    // Không cần copy lại vì giỏ hàng đã lưu trong localStorage với key 'cart'
    window.location.href = "ThanhToan.html";
}


// Lấy sản phẩm từ bảng giỏ hàng
function getCartItems() {
    const rows = document.querySelectorAll("#listCart tr");
    let items = [];

    rows.forEach(row => {
        const ten = row.querySelector(".ten-sp")?.innerText || "";
        const gia = row.querySelector(".gia-sp")?.innerText || "0";
        const soLuong = row.querySelector(".sl-sp input")?.value || 1;

        items.push({
            ten: ten,
            gia: parseInt(gia.replace(/[^\d]/g, "")), // bỏ ký tự ₫
            soLuong: parseInt(soLuong),
        });
    });

    return items;
}
function ThanhToan() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem("checkoutItems", JSON.stringify(cartItems)); // lưu riêng cho trang Thanh toán
    window.location.href = "ThanhToan.html";
}
