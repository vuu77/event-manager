/* frontend/assets/scripts/app.js - BẢN FINAL */

document.addEventListener("DOMContentLoaded", function() {

    // 1. KIỂM TRA ĐĂNG NHẬP
    checkLoginState();

    // 2. LOAD SỰ KIỆN (Trang chủ)
    const eventsContainer = document.getElementById("events-container");
    if (eventsContainer) loadEvents();

    // 3. LOAD CHI TIẾT (Trang cava.php)
    const detailTitle = document.getElementById("detailTitle");
    if (detailTitle) loadEventDetail();

    // 4. XỬ LÝ CÁC FORM (Login & Register)
    setupAuthForms();

    // 5. TÍNH BÁO GIÁ
    const userCountInput = document.getElementById("userCount");
    if (userCountInput) {
        calculateTotal();
        userCountInput.addEventListener("input", calculateTotal);
    }
});

// ============================================================
// A. CÁC HÀM XỬ LÝ TÀI KHOẢN (AUTH)
// ============================================================

// Kiểm tra xem đã đăng nhập chưa để đổi nút trên Menu
function checkLoginState() {
    const userSection = document.getElementById("user-section");
    if (!userSection) return;

    const token = localStorage.getItem("access_token");
    const userInfoRaw = localStorage.getItem("user_info");

    if (token && userInfoRaw) {
        // ĐÃ ĐĂNG NHẬP
        const userInfo = JSON.parse(userInfoRaw);
        userSection.innerHTML = `
            <span class="text-white me-3">Xin chào, <strong>${userInfo.name || 'User'}</strong></span>
            <a href="login.php" onclick="handleLogout()" class="text-warning text-decoration-none fw-bold">
                <i class="fa-solid fa-right-from-bracket"></i> Đăng Xuất
            </a>
        `;
    } else {
        // CHƯA ĐĂNG NHẬP -> Hiện nút dẫn sang login.php
        userSection.innerHTML = `
            <a href="login.php" class="text-white text-decoration-none hover-underline fw-bold">
                <i class="fa-solid fa-user-circle"></i> Đăng nhập / Đăng ký
            </a>
        `;
    }
}

// Hàm Đăng xuất
function handleLogout() {
    if(confirm("Bạn có chắc muốn đăng xuất?")) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_info");
        window.location.href = "index.php";
    }
}

// Hàm Bảo vệ nút "Tạo sự kiện"
function goToCreateEvent() {
    const token = localStorage.getItem("access_token");
    if (token) {
        window.location.href = "events.php";
    } else {
        if(confirm("Bạn cần đăng nhập để tạo sự kiện. Đến trang đăng nhập ngay?")) {
            window.location.href = "login.php";
        }
    }
}

// Xử lý gửi Form Đăng nhập & Đăng ký
function setupAuthForms() {
    // --- XỬ LÝ ĐĂNG NHẬP ---
    const handleLogin = (e) => {
        e.preventDefault();
        const isPageLogin = e.target.id === "loginPageForm";
        const emailId = isPageLogin ? "email" : "loginEmail";
        const passId = isPageLogin ? "password" : "loginPassword";
        const statusId = isPageLogin ? "notify" : "loginStatus";

        const email = document.getElementById(emailId).value.trim();
        const password = document.getElementById(passId).value.trim();
        const status = document.getElementById(statusId);

        status.style.color = "blue"; status.innerText = "⏳ Đang xử lý...";

        fetch("http://127.0.0.1:8000/auth/login", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => {
            if (!res.ok) throw new Error("Sai thông tin đăng nhập");
            return res.json();
        })
        .then(data => {
            status.style.color = "green"; status.innerText = "✅ Thành công!";
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user_info", JSON.stringify(data.user_info));
            setTimeout(() => window.location.href = "index.php", 1000);
        })
        .catch(err => {
            status.style.color = "red"; status.innerText = "❌ " + err.message;
        });
    };

    // --- XỬ LÝ ĐĂNG KÝ (Sửa lỗi 422) ---
    const handleRegister = (e) => {
        e.preventDefault();
        // Lấy dữ liệu (Thêm kiểm tra null để tránh lỗi)
        const nameInput = document.getElementById("regName");
        const emailInput = document.getElementById("regEmail");
        
        const name = nameInput ? nameInput.value.trim() : "New User";
        const email = emailInput ? emailInput.value.trim() : "";
        const pass = document.getElementById("regPassword").value;
        const rePass = document.getElementById("regRePassword").value;
        const status = document.getElementById("regStatus");

        if (pass !== rePass) {
            status.style.color = "red"; status.innerText = "⚠️ Mật khẩu không khớp!";
            return;
        }
        status.style.color = "blue"; status.innerText = "⏳ Đang tạo tài khoản...";

        // Gửi sang Python (BẮT BUỘC PHẢI CÓ full_name)
        fetch("http://127.0.0.1:8000/auth/register", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                full_name: name,  // <--- Quan trọng
                email: email, 
                password: pass 
            })
        })
        .then(res => {
            if (!res.ok) return res.json().then(e => { throw new Error(e.detail) });
            return res.json();
        })
        .then(() => {
            status.style.color = "green"; status.innerText = "✅ Đăng ký thành công!";
            setTimeout(() => window.location.href = "login.php", 1500);
        })
        .catch(err => {
            status.style.color = "red"; status.innerText = "❌ " + err.message;
        });
    };

    // Gán sự kiện vào Form
    if(document.getElementById("loginForm")) document.getElementById("loginForm").addEventListener("submit", handleLogin);
    if(document.getElementById("loginPageForm")) document.getElementById("loginPageForm").addEventListener("submit", handleLogin);
    if(document.getElementById("registerForm")) document.getElementById("registerForm").addEventListener("submit", handleRegister);
}

// ============================================================
// B. CÁC HÀM HIỂN THỊ DỮ LIỆU (DATA)
// ============================================================

// Tải danh sách sự kiện (Link sang cava.php)
async function loadEvents() {
    const container = document.getElementById("events-container");
    container.innerHTML = `<div class="col-12 text-center"><div class="spinner-border text-primary"></div><p>Đang tải...</p></div>`;
    try {
        const response = await fetch("http://127.0.0.1:8000/events");
        if (!response.ok) throw new Error("Lỗi kết nối");
        const events = await response.json();
        container.innerHTML = "";
        
        if (events.length === 0) { 
            container.innerHTML = "<p class='text-center w-100'>Chưa có sự kiện nào.</p>"; return; 
        }

        events.forEach(event => {
            const html = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card-custom h-100 d-flex flex-column">
                    <h5 class="fw-bold" style="color: #7a2e59;">${event.title}</h5>
                    <p class="small text-muted mb-2">
                        <i class="fa-solid fa-calendar-days"></i> ${event.date} <br>
                        <i class="fa-solid fa-location-dot"></i> ${event.location}
                    </p>
                    <p class="flex-grow-1 text-truncate">${event.description || '...'}</p>
                    <a href="cava.php?event_id=${event.id}" class="btn btn-sm btn-outline-secondary mt-auto">
                        Xem chi tiết <i class="fa-solid fa-arrow-right ms-1"></i>
                    </a>
                </div>
            </div>`;
            container.insertAdjacentHTML('beforeend', html);
        });
    } catch (err) { 
        console.error(err); 
        container.innerHTML = "<p class='text-danger text-center'>Lỗi tải dữ liệu. Kiểm tra Backend!</p>"; 
    }
}

// Tải chi tiết sự kiện (Cho file cava.php)
async function loadEventDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event_id');
    if (!eventId) { document.getElementById("detailTitle").innerText = "Không tìm thấy ID!"; return; }

    try {
        const response = await fetch(`http://127.0.0.1:8000/events/${eventId}`);
        if (!response.ok) throw new Error("Không tìm thấy");
        const event = await response.json();

        document.getElementById("detailTitle").innerText = event.title;
        document.getElementById("detailLocation").innerText = event.location;
        document.getElementById("detailDate").innerText = event.date;
        document.getElementById("detailDescription").innerText = event.description;
        
        const capacityEl = document.getElementById("detailCapacity");
        if(capacityEl) capacityEl.innerText = (event.capacity || 100) + " vé";

        const performersContainer = document.getElementById("performersContainer");
        if (performersContainer) {
            const list = (event.performers || "Đang cập nhật").split(",");
            let html = "";
            list.forEach(name => { 
                if(name.trim()) html += `
                <div class="col-6 mb-2">
                    <div class="bg-light p-2 border rounded fw-bold" style="color: #7a2e59">
                        <i class="fa-solid fa-microphone me-2"></i>${name.trim()}
                    </div>
                </div>`; 
            });
            performersContainer.innerHTML = html;
        }
    } catch (err) { console.error(err); }
}

// Tính tiền Báo giá
function calculateTotal() {
    const userInput = document.getElementById('userCount');
    if (!userInput) return;
    const USER_PRICE = 125000;
    let users = parseInt(userInput.value) || 0; if(users < 1) users = 0;
    let total = users * USER_PRICE; // (Giản lược)
    
    // Nếu có các element hiển thị thì cập nhật
    if(document.getElementById('displayUserCount')) document.getElementById('displayUserCount').innerText = users + " Người dùng";
    if(document.getElementById('finalMonthlyPrice')) document.getElementById('finalMonthlyPrice').innerText = total.toLocaleString('vi-VN') + ' đ';
}