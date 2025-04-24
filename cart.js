//Được gọi khi người dùng nhấn nút "Thêm vào giỏ".
//Truy xuất thông tin sản phẩm qua data- attribute (data-id, data-name,...).
//Gọi addToCart(item) để xử lý giỏ hàng.
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

//localStorage là một bộ nhớ lưu trữ cục bộ (local) của trình duyệt web, 
//dùng để lưu dữ liệu trực tiếp trên máy của người dùng — và giữ lại cả khi người dùng tắt trình duyệt
// hoặc tắt máy.


//Lấy giỏ hàng từ localStorage.
//Nếu có rồi:
//Kiểm tra xem sản phẩm đã tồn tại chưa
//Nếu có, cộng thêm số lượng.
//Nếu chưa, thêm sản phẩm mới.
//Sau đó cập nhật localStorage và gọi lại LoadData() để render lại giao diện.
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
    var list = JSON.parse(localStorage.getItem('cart')) || [];//Lấy dữ liệu giỏ hàng từ localStorage theo key "cart".
    var str = "";//Biến str dùng để chứa HTML tạo ra từ dữ liệu sản phẩm, để gắn vào bảng giỏ hàng.
    var total = 0;//Biến total để tính tổng giá trị giỏ hàng.
    for (let x of list) { //Lặp qua từng sản phẩm x trong giỏ hàng.
        total += x.price * x.quantity;//Cộng dồn giá sản phẩm nhân với số lượng vào tổng tiền.
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
    document.getElementById("listCart").innerHTML = str;//Gán toàn bộ HTML vừa tạo (str) vào phần tử có id="listCart" (tức là bảng giỏ hàng).
    document.getElementById("spTong").innerText = total.toLocaleString() + "₫";//Gán tổng tiền (total) vào phần tử hiển thị tổng tiền sản phẩm (có id="spTong")
    document.getElementById("tTong").innerText = total.toLocaleString() + "₫";//Gán tổng tiền vào phần tổng thanh toán (có id="tTong").
    capNhatSoLuongGioHang(); // cập nhật số hiển thị ở icon
}

function Xoa(id) {
    if (confirm("🗑️ Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?")) {
        var list = JSON.parse(localStorage.getItem('cart')) || [];//Lấy dữ liệu giỏ hàng từ localStorage, nơi lưu trữ dữ liệu trên trình duyệt.
        list = list.filter(item => item.id !== id);//loại bỏ các sp có id khác với id cần xóa
        localStorage.setItem('cart', JSON.stringify(list));//lưu lại giỏ hàng đã xóa sp vào localSlocalS
        LoadData(); // cập nhật lại bảng sau khi xóa
    }
}
function Giam(id) {
    var list = JSON.parse(localStorage.getItem('cart')) || [];
    var item = list.find(x => x.id == id);//tìm sản phẩm giỏ hàng theo id
    if (item && item.quantity > 1) {//kiểm tra xem sp có tồn tại và số lượng lớn hơn 11
        item.quantity -= 1;
    }
    localStorage.setItem('cart', JSON.stringify(list));//lưu lại giỏ hàng đã giảm số lượng sp vào local
    LoadData();
}

function Tang(id) {
    var list = JSON.parse(localStorage.getItem('cart')) || [];
    var item = list.find(x => x.id == id);//tìm sản phẩm giỏ hàng theo id
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
    let list = JSON.parse(localStorage.getItem('cart')) || [];//Lấy giỏ hàng từ localStorage, nếu chưa có thì tạo mảng rỗng.
    let tongSoLuong = list.reduce((tong, sp) => tong + sp.quantity, 0);//Tính tổng số lượng sản phẩm trong giỏ hàng lặp qua từng sản phẩm và cộng dồn biến tong.
    let el = document.querySelector(".cart-count");//tìm phần tử class cart-count để hiển thị số lượnglượng
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
    const rows = document.querySelectorAll("#listCart tr");//lấy tất cả các hàng trong bảng giỏ hàng
    let items = [];//Khởi tạo một mảng rỗng để chứa các sản phẩm sau khi lấy thông tin.

    rows.forEach(row => { //Lặp qua từng dòng sản phẩm (<tr>) trong bảng.
        const ten = row.querySelector(".ten-sp")?.innerText || ""; //Dấu ?. là optional chaining: Nếu không tìm thấy thì không lỗi mà trả về undefined.
        const gia = row.querySelector(".gia-sp")?.innerText || "0";
        const soLuong = row.querySelector(".sl-sp input")?.value || 1;//Lấy giá trị trong ô input số lượng nằm trong .sl-sp.
        //thêm sản phẩm vào mảng iteam  
        items.push({
            ten: ten,
            //parseInt(...): chuyển chuỗi thành số nguyên.
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
