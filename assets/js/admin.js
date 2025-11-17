// ==================== KHỞI TẠO DỮ LIỆU ====================
// Khởi tạo dữ liệu mẫu nếu chưa có
function initData() {
    // Dữ liệu tranh
    if (!localStorage.getItem('admin_artworks')) {
        const sampleArtworks = [
            {
                id: '1',
                name: 'Hoa Sen Tĩnh Lặng',
                category: 'Thiên nhiên',
                price: 2500000,
                author: 'Trần Minh',
                quantity: 15,
                image: './assets/img/TranhVanGoh.jpg'
            }
        ];
        localStorage.setItem('admin_artworks', JSON.stringify(sampleArtworks));
    }

    // Dữ liệu khách hàng
    if (!localStorage.getItem('admin_customers')) {
        const sampleCustomers = [
            {
                id: '1',
                name: 'Nguyễn Văn An',
                phone: '0987654321',
                email: 'an.nguyen@gmail.com',
                address: 'Hà Nội'
            }
        ];
        localStorage.setItem('admin_customers', JSON.stringify(sampleCustomers));
    }

    // Dữ liệu đơn hàng
    if (!localStorage.getItem('admin_orders')) {
        const sampleOrders = [
            {
                id: 'DH001',
                customer: 'Trần Minh',
                date: '2025-10-22',
                status: 'pending',
                total: 2450000,
                items: []
            },
            {
                id: 'DH002',
                customer: 'Nguyễn Hà',
                date: '2025-10-21',
                status: 'shipped',
                total: 1200000,
                items: []
            },
            {
                id: 'DH003',
                customer: 'Phạm Nam',
                date: '2025-10-20',
                status: 'success',
                total: 980000,
                items: []
            }
        ];
        localStorage.setItem('admin_orders', JSON.stringify(sampleOrders));
    }

    // Cài đặt
    if (!localStorage.getItem('admin_settings')) {
        const defaultSettings = {
            shopName: 'Nghệ Thuật',
            adminEmail: 'admin@nghethuat.vn',
            currencyUnit: 'VNĐ',
            primaryColor: '#ff7b00'
        };
        localStorage.setItem('admin_settings', JSON.stringify(defaultSettings));
    }
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    initData();
    loadArtworks();
    loadCustomers();
    loadOrders();
    updateDashboard();
    loadSettings();
    
    // Event listeners cho tìm kiếm
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('input', handleGlobalSearch);
    }
    
    // Lọc đơn hàng
    const statusSelect = document.getElementById('statusFilter');
    const dateInput = document.getElementById('dateFilter');
    const searchInput = document.getElementById('searchOrder');
    
    if (statusSelect) statusSelect.addEventListener('change', filterOrders);
    if (dateInput) dateInput.addEventListener('change', filterOrders);
    if (searchInput) searchInput.addEventListener('input', filterOrders);
});

// ==================== QUẢN LÝ TRANH ====================
let editingArtId = null;

function openArtForm(artId = null) {
    editingArtId = artId;
    const modal = document.getElementById('artModal');
    const form = document.getElementById('artForm');
    const title = modal.querySelector('h3');
    
    if (artId) {
        // Chế độ chỉnh sửa
        title.textContent = 'Chỉnh sửa Tranh';
        const artworks = JSON.parse(localStorage.getItem('admin_artworks') || '[]');
        const art = artworks.find(a => a.id === artId);
        if (art) {
            document.getElementById('tenTranh').value = art.name;
            document.getElementById('danhMuc').value = art.category;
            document.getElementById('giaBan').value = art.price;
            document.getElementById('tacGia').value = art.author;
            document.getElementById('soLuongTon').value = art.quantity;
            document.getElementById('anhTranh').value = art.image;
        }
    } else {
        // Chế độ thêm mới
        title.textContent = 'Thêm Tranh Mới';
        form.reset();
    }
    modal.classList.add('show');
}

function closeArtForm() {
    document.getElementById('artModal').classList.remove('show'); 
    editingArtId = null;
    document.getElementById('artForm').reset();
}

function saveArt() {
    const name = document.getElementById('tenTranh').value;
    const category = document.getElementById('danhMuc').value;
    const price = parseInt(document.getElementById('giaBan').value);
    const author = document.getElementById('tacGia').value;
    const quantity = parseInt(document.getElementById('soLuongTon').value);
    const image = document.getElementById('anhTranh').value;

    if (!name || !category || !price || !author || !quantity || !image) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    let artworks = JSON.parse(localStorage.getItem('admin_artworks') || '[]');
    
    if (editingArtId) {
        // Cập nhật
        const index = artworks.findIndex(a => a.id === editingArtId);
        if (index !== -1) {
            artworks[index] = { ...artworks[index], name, category, price, author, quantity, image };
            alert('Cập nhật tranh thành công!');
        }
    } else {
        // Thêm mới
        const newId = Date.now().toString();
        artworks.push({ id: newId, name, category, price, author, quantity, image });
        alert('Thêm tranh thành công!');
    }

    localStorage.setItem('admin_artworks', JSON.stringify(artworks));
    closeArtForm();
    loadArtworks();
    updateDashboard();
}

function loadArtworks() {
    const artworks = JSON.parse(localStorage.getItem('admin_artworks') || '[]');
    const tbody = document.querySelector('#art .art-table tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = artworks.map(art => `
        <tr>
            <td><img src="${art.image}" alt="${art.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;"></td>
            <td>${art.name}</td>
            <td>${art.category}</td>
            <td>${art.price.toLocaleString('vi-VN')} VNĐ</td>
            <td>${art.author}</td>
            <td>${art.quantity}</td>
            <td>
                <button class="edit-btn" onclick="openArtForm('${art.id}')"><i class="ti-pencil"></i></button>
                <button class="delete-btn" onclick="deleteArt('${art.id}')"><i class="ti-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function deleteArt(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tranh này?')) {
        let artworks = JSON.parse(localStorage.getItem('admin_artworks') || '[]');
        artworks = artworks.filter(a => a.id !== id);
        localStorage.setItem('admin_artworks', JSON.stringify(artworks));
        loadArtworks();
        updateDashboard();
        alert('Đã xóa tranh thành công!');
    }
}

// ==================== QUẢN LÝ KHÁCH HÀNG ====================
let editingCustomerId = null;

function openCustomerForm(customerId = null) {
    editingCustomerId = customerId;
    const modal = document.getElementById('customerModal');
    const form = document.getElementById('customerForm');
    const title = modal.querySelector('h3');
    
    if (customerId) {
        title.textContent = 'Chỉnh sửa Khách hàng';
        const customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
            document.getElementById('tenKhachHang').value = customer.name;
            document.getElementById('sdtKhachHang').value = customer.phone;
            document.getElementById('emailKhachHang').value = customer.email;
            document.getElementById('diaChiKhachHang').value = customer.address;
        }
    } else {
        title.textContent = 'Thêm Khách Hàng Mới';
        form.reset();
    }
    modal.classList.add('show');
}

function closeCustomerForm() {
    document.getElementById('customerModal').classList.remove('show');
    editingCustomerId = null;
    document.getElementById('customerForm').reset();
}

function saveCustomer() {
    const name = document.getElementById('tenKhachHang').value;
    const phone = document.getElementById('sdtKhachHang').value;
    const email = document.getElementById('emailKhachHang').value;
    const address = document.getElementById('diaChiKhachHang').value;

    if (!name || !phone || !email || !address) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    let customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
    
    if (editingCustomerId) {
        const index = customers.findIndex(c => c.id === editingCustomerId);
        if (index !== -1) {
            customers[index] = { ...customers[index], name, phone, email, address };
            alert('Cập nhật khách hàng thành công!');
        }
    } else {
        const newId = Date.now().toString();
        customers.push({ id: newId, name, phone, email, address });
        alert('Thêm khách hàng thành công!');
    }

    localStorage.setItem('admin_customers', JSON.stringify(customers));
    closeCustomerForm();
    loadCustomers();
    updateDashboard();
}

function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
    const tbody = document.querySelector('#customers .customer-table tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>${customer.address}</td>
            <td>
                <button class="edit-btn" onclick="openCustomerForm('${customer.id}')"><i class="ti-pencil"></i></button>
                <button class="delete-btn" onclick="deleteCustomer('${customer.id}')"><i class="ti-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function deleteCustomer(id) {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
        let customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
        customers = customers.filter(c => c.id !== id);
        localStorage.setItem('admin_customers', JSON.stringify(customers));
        loadCustomers();
        updateDashboard();
        alert('Đã xóa khách hàng thành công!');
    }
}

// ==================== QUẢN LÝ ĐỚN HÀNG ====================
function openInvoiceForm(orderId = null) {
    const modal = document.getElementById('invoiceModal');
    modal.classList.add('show');
    
    if (orderId) {
        // Chỉnh sửa đơn hàng
        const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        if (order) {
            document.getElementById('maHD').value = order.id;
            document.getElementById('tenKH').value = order.customer;
            document.getElementById('ngayLap').value = order.date;
            document.getElementById('tongTien').value = order.total;
            document.getElementById('maHD').disabled = true;
        }
    } else {
        // Tạo mới
        document.getElementById('invoiceForm').reset();
        document.getElementById('maHD').disabled = false;
        document.getElementById('maHD').value = 'DH' + String(Date.now()).slice(-6);
        document.getElementById('ngayLap').value = new Date().toISOString().split('T')[0];
    }
}

function closeInvoiceForm() {
    document.getElementById('invoiceModal').classList.remove('show');
    document.getElementById('invoiceForm').reset();
    document.getElementById('maHD').disabled = false;
}

function saveInvoice() {
    const id = document.getElementById('maHD').value;
    const customer = document.getElementById('tenKH').value;
    const date = document.getElementById('ngayLap').value;
    const total = parseInt(document.getElementById('tongTien').value);

    if (!id || !customer || !date || !total) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    let orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    const existingIndex = orders.findIndex(o => o.id === id);

    if (existingIndex !== -1) {
        orders[existingIndex] = { ...orders[existingIndex], customer, date, total };
        alert('Cập nhật đơn hàng thành công!');
    } else {
        orders.push({ id, customer, date, status: 'pending', total, items: [] });
        alert('Tạo đơn hàng thành công!');
    }

    localStorage.setItem('admin_orders', JSON.stringify(orders));
    closeInvoiceForm();
    loadOrders();
    updateDashboard();
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    const tbody = document.querySelector('#orders .styled-table tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = orders.map(order => {
        const statusText = {
            'pending': 'Chờ xử lý',
            'shipped': 'Đang giao',
            'success': 'Hoàn tất',
            'canceled': 'Đã hủy'
        };
        const statusClass = order.status;
        
        return `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${formatDate(order.date)}</td>
                <td><span class="status ${statusClass}">${statusText[order.status] || order.status}</span></td>
                <td>${order.total.toLocaleString('vi-VN')}đ</td>
                <td>
                    <button class="edit" onclick="viewOrder('${order.id}')" title="Xem chi tiết"><i class="ti-eye"></i></button>
                    <button class="edit" onclick="openInvoiceForm('${order.id}')" title="Chỉnh sửa"><i class="ti-pencil"></i></button>
                    <select onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 4px; border-radius: 4px; margin-left: 5px;">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Đang giao</option>
                        <option value="success" ${order.status === 'success' ? 'selected' : ''}>Hoàn tất</option>
                        <option value="canceled" ${order.status === 'canceled' ? 'selected' : ''}>Đã hủy</option>
                    </select>
                    <button class="delete" onclick="deleteOrder('${order.id}')" title="Xóa"><i class="ti-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('admin_orders', JSON.stringify(orders));
        loadOrders();
        updateDashboard();
    }
}

function viewOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (order) {
        alert(`Chi tiết đơn hàng:\n\nMã đơn: ${order.id}\nKhách hàng: ${order.customer}\nNgày đặt: ${formatDate(order.date)}\nTổng tiền: ${order.total.toLocaleString('vi-VN')}đ\nTrạng thái: ${order.status}`);
    }
}

function deleteOrder(id) {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
        let orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        orders = orders.filter(o => o.id !== id);
        localStorage.setItem('admin_orders', JSON.stringify(orders));
        loadOrders();
        updateDashboard();
        alert('Đã xóa đơn hàng thành công!');
    }
}

// Lọc đơn hàng
function filterOrders() {
    const statusFilter = document.getElementById('statusFilter')?.value || 'Tất cả';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    const searchFilter = document.getElementById('searchOrder')?.value.toLowerCase() || '';
    
    const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    const tbody = document.querySelector('#orders .styled-table tbody');
    
    if (!tbody) return;
    
    let filtered = orders.filter(order => {
        const matchStatus = statusFilter === 'Tất cả' || order.status === statusFilter;
        const matchDate = !dateFilter || order.date === dateFilter;
        const matchSearch = !searchFilter || 
            order.id.toLowerCase().includes(searchFilter) || 
            order.customer.toLowerCase().includes(searchFilter);
        
        return matchStatus && matchDate && matchSearch;
    });
    
    // Render lại bảng với dữ liệu đã lọc
    const statusText = {
        'pending': 'Chờ xử lý',
        'shipped': 'Đang giao',
        'success': 'Hoàn tất',
        'canceled': 'Đã hủy'
    };
    
    tbody.innerHTML = filtered.map(order => {
        const statusClass = order.status;
        return `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${formatDate(order.date)}</td>
                <td><span class="status ${statusClass}">${statusText[order.status] || order.status}</span></td>
                <td>${order.total.toLocaleString('vi-VN')}đ</td>
                <td>
                    <button class="edit" onclick="viewOrder('${order.id}')"><i class="ti-eye"></i></button>
                    <button class="edit" onclick="openInvoiceForm('${order.id}')"><i class="ti-pencil"></i></button>
                    <select onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 4px; border-radius: 4px; margin-left: 5px;">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Đang giao</option>
                        <option value="success" ${order.status === 'success' ? 'selected' : ''}>Hoàn tất</option>
                        <option value="canceled" ${order.status === 'canceled' ? 'selected' : ''}>Đã hủy</option>
                    </select>
                    <button class="delete" onclick="deleteOrder('${order.id}')"><i class="ti-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}


// ==================== BÁO CÁO ====================
let reportChart = null;
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    
    // Lọc theo ngày
    let filteredOrders = orders;
    if (startDate && endDate) {
        filteredOrders = orders.filter(o => o.date >= startDate && o.date <= endDate);
    } else if (startDate) {
        filteredOrders = orders.filter(o => o.date >= startDate);
    } else if (endDate) {
        filteredOrders = orders.filter(o => o.date <= endDate);
    }
    
    // Mình cho chart hiển thị cho loại "Doanh thu & Lợi nhuận" (sales)
    // và "Đơn hàng" luôn, vì đều dùng chung dữ liệu.
    if (reportType === 'sales' || reportType === 'orders') {
        const totalRevenue = filteredOrders.reduce(
            (sum, o) => sum + (o.status === 'success' ? o.total : 0), 0
        );
        const totalProfit = Math.round(totalRevenue * 0.3); // Giả sử lợi nhuận 30%
        const totalOrders = filteredOrders.length;
        const totalItemsSold = filteredOrders.reduce(
            (sum, o) => sum + (o.items?.length || 0), 0
        );
        
        document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString('vi-VN') + ' VNĐ';
        document.getElementById('totalProfit').textContent = totalProfit.toLocaleString('vi-VN') + ' VNĐ';
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalItemsSold').textContent = totalItemsSold;
        
        // --------- Chuẩn bị dữ liệu chi tiết theo ngày ----------
        const reportTable = document.querySelector('#reportTable tbody');
        const dailyData = {};
        
        filteredOrders.forEach(order => {
            if (!dailyData[order.date]) {
                dailyData[order.date] = { revenue: 0, profit: 0, count: 0 };
            }
            if (order.status === 'success') {
                dailyData[order.date].revenue += order.total;
                dailyData[order.date].profit += Math.round(order.total * 0.3);
            }
            dailyData[order.date].count += 1;
        });
        
        const sortedEntries = Object.entries(dailyData)
            .sort((a, b) => a[0].localeCompare(b[0]));

        // Đổ dữ liệu vào bảng
        reportTable.innerHTML = sortedEntries.map(([date, data]) => `
            <tr>
                <td>${formatDate(date)}</td>
                <td>${data.revenue.toLocaleString('vi-VN')} VNĐ</td>
                <td>${data.profit.toLocaleString('vi-VN')} VNĐ</td>
                <td>${data.count}</td>
            </tr>
        `).join('');

        // --------- Vẽ biểu đồ bằng Chart.js ----------
        const labels = sortedEntries.map(([date]) => formatDate(date));
        const revenues = sortedEntries.map(([_, data]) => data.revenue);
        const profits  = sortedEntries.map(([_, data]) => data.profit);
        const counts   = sortedEntries.map(([_, data]) => data.count);

        const canvas = document.getElementById('reportChart');
        if (!canvas) return;

        // Nếu đã có chart rồi thì hủy đi để vẽ lại
        if (reportChart) {
            reportChart.destroy();
        }

        reportChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Doanh thu (VNĐ)',
                        data: revenues,
                        backgroundColor: 'rgba(46, 204, 113, 0.6)'
                    },
                    {
                        label: 'Lợi nhuận (VNĐ)',
                        data: profits,
                        backgroundColor: 'rgba(231, 76, 60, 0.6)'
                    },
                    {
                        label: 'Số đơn',
                        data: counts,
                        type: 'line',
                        borderWidth: 2,
                        borderColor: 'rgba(241, 196, 15, 1)',
                        fill: false,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'VNĐ'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Số đơn'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
}


// ==================== CÀI ĐẶT ====================
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    if (settings.shopName) document.getElementById('shopName').value = settings.shopName;
    if (settings.adminEmail) document.getElementById('adminEmail').value = settings.adminEmail;
    if (settings.currencyUnit) document.getElementById('currencyUnit').value = settings.currencyUnit;
    if (settings.primaryColor) document.getElementById('primaryColor').value = settings.primaryColor;
}

function saveGeneralSettings() {
    const settings = {
        shopName: document.getElementById('shopName').value,
        adminEmail: document.getElementById('adminEmail').value,
        currencyUnit: document.getElementById('currencyUnit').value,
        primaryColor: document.getElementById('primaryColor').value
    };
    
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    alert('Đã lưu cài đặt thành công!');
}

function saveThemeSettings() {
    const primaryColor = document.getElementById('primaryColor').value;
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    settings.primaryColor = primaryColor;
    
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    
    // Áp dụng màu ngay lập tức
    document.querySelector('.sidebar').style.background = primaryColor;
    document.querySelectorAll('.bg-primary').forEach(el => {
        el.style.background = primaryColor;
    });
    
    alert('Đã cập nhật màu sắc giao diện!');
}

// ==================== DASHBOARD ====================
function updateDashboard() {
    const artworks = JSON.parse(localStorage.getItem('admin_artworks') || '[]');
    const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    const customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
    
    // Cập nhật số liệu
    const artCount = artworks.length;
    const orderCount = orders.length;
    const customerCount = customers.length;
    const totalRevenue = orders
        .filter(o => o.status === 'success')
        .reduce((sum, o) => sum + o.total, 0);
    
    // Cập nhật DOM
    const cards = document.querySelectorAll('.dashboard .card');
    if (cards.length >= 4) {
        cards[0].querySelector('h3').textContent = artCount;
        cards[1].querySelector('h3').textContent = orderCount;
        cards[2].querySelector('h3').textContent = customerCount;
        cards[3].querySelector('h3').textContent = (totalRevenue / 1000000).toFixed(1) + ' triệu';
    }
    
    // Cập nhật thống kê hôm nay
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.date === today);
    const todayRevenue = todayOrders
        .filter(o => o.status === 'success')
        .reduce((sum, o) => sum + o.total, 0);
    const todayNewCustomers = customers.filter(c => {
        // Giả sử có trường createdAt, nếu không thì bỏ qua
        return true;
    }).length;
    
    const stats = document.querySelectorAll('.stats .stat');
    if (stats.length >= 3) {
        stats[0].querySelector('h3').textContent = (todayRevenue / 1000000).toFixed(1) + ' triệu';
        stats[1].querySelector('h3').textContent = todayOrders.length;
        stats[2].querySelector('h3').textContent = todayNewCustomers;
    }
}

// ==================== GHI CHÚ ====================
document.addEventListener('DOMContentLoaded', function() {
    const noteTextarea = document.querySelector('#ghichu textarea');
    if (noteTextarea) {
        // Load ghi chú đã lưu
        const savedNote = localStorage.getItem('admin_notes');
        if (savedNote) {
            noteTextarea.value = savedNote;
        }
        
        // Lưu khi thay đổi
        noteTextarea.addEventListener('blur', function() {
            localStorage.setItem('admin_notes', this.value);
        });
    }
});

// ==================== TÌM KIẾM TOÀN CỤC ====================
function handleGlobalSearch(e) {
    const query = e.target.value.toLowerCase();
    if (!query) return;
    
    // Tìm trong tranh
    const artworks = JSON.parse(localStorage.getItem('admin_artworks') || '[]');
    const artResults = artworks.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query) ||
        a.author.toLowerCase().includes(query)
    );
    
    // Tìm trong khách hàng
    const customers = JSON.parse(localStorage.getItem('admin_customers') || '[]');
    const customerResults = customers.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(query)
    );
    
    // Tìm trong đơn hàng
    const orders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
    const orderResults = orders.filter(o =>
        o.id.toLowerCase().includes(query) ||
        o.customer.toLowerCase().includes(query)
    );
    
    // Hiển thị kết quả (có thể tạo modal hoặc dropdown)
    if (artResults.length > 0 || customerResults.length > 0 || orderResults.length > 0) {
        console.log('Kết quả tìm kiếm:', {
            tranh: artResults,
            khachHang: customerResults,
            donHang: orderResults
        });
    }
}

// ==================== UTILITY FUNCTIONS ====================
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// Đóng modal bằng ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});
