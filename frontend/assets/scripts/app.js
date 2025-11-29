/* frontend/assets/scripts/app.js - BẢN FINAL ĐẦY ĐỦ CHỨC NĂNG */

// ============================================================
// 1. CẤU HÌNH & BIẾN TOÀN CỤC
// ============================================================
const API_URL = "http://127.0.0.1:8000"; 
const TICKET_PRICE = 125000; // Giá vé sự kiện
const USER_PRICE = 125000;   // Giá user phần mềm

// Biến trạng thái Báo giá & Thanh toán
let currentAppTotal = 0;     
let isYearly = true;         
let currentMonthlyBase = 0;  
let isOrderYearly = true;    

// ============================================================
// 2. KHỞI TẠO ỨNG DỤNG (MAIN)
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
    // 1. Auth & User
    checkLoginState();
    setupAuthForms();

    // 2. Events (Sự kiện)
    if (document.getElementById("events-container")) loadEvents();
    if (document.getElementById("detailTitle")) loadEventDetail();
    setupCreateEventForm();

    // 3. Booking (Đặt vé)
    fillUserInfo(); 

    // 4. Pricing (Báo giá)
    const userInput = document.getElementById('userCount');
    if (userInput) {
        userInput.addEventListener('input', calculatePricing);
        userInput.addEventListener('change', calculatePricing);
        calculatePricing(); 
    }
});

// ============================================================
// 3. LOGIC TÀI KHOẢN (AUTH) - ĐÃ SỬA CHUẨN
// ============================================================

// Kiểm tra trạng thái đăng nhập
function checkLoginState() {
    const userSection = document.getElementById("user-section");
    if (!userSection) return;

    const token = localStorage.getItem("access_token");
    const userInfoRaw = localStorage.getItem("user_info");

    if (token && userInfoRaw) {
        const userInfo = JSON.parse(userInfoRaw);
        userSection.innerHTML = `
            <span class="text-white me-3">Xin chào, <strong>${userInfo.name || 'User'}</strong></span>
            <a href="#" onclick="handleLogout()" class="text-warning text-decoration-none fw-bold">
                <i class="fa-solid fa-right-from-bracket"></i> Đăng Xuất
            </a>
        `;
    } else {
        userSection.innerHTML = `
            <a href="login.html" class="text-white text-decoration-none hover-underline fw-bold">
                <i class="fa-solid fa-user-circle"></i> Đăng nhập / Đăng ký
            </a>
        `;
    }
}

// Đăng xuất
function handleLogout() {
    if(confirm("Bạn có chắc muốn đăng xuất?")) {
        localStorage.clear();
        window.location.href = "login.html";
    }
}

// Xử lý Form Đăng nhập & Đăng ký
function setupAuthForms() {
    
    // --- A. XỬ LÝ ĐĂNG NHẬP ---
    const handleLogin = async (e) => {
        e.preventDefault();
        const isPageLogin = e.target.id === "loginPageForm";
        const emailId = isPageLogin ? "email" : "loginEmail";
        const passId = isPageLogin ? "password" : "loginPassword";
        const statusId = isPageLogin ? "notify" : "loginStatus";

        const emailElement = document.getElementById(emailId);
        const passwordElement = document.getElementById(passId);
        const status = document.getElementById(statusId);

        if (!emailElement || !passwordElement) return;

        const email = emailElement.value.trim();
        const password = passwordElement.value.trim();

        if(status) { status.style.color = "blue"; status.innerText = "⏳ Đang xử lý..."; }

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                if(status) { status.style.color = "green"; status.innerText = "✅ Thành công!"; }
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("user_info", JSON.stringify(data.user_info));
                setTimeout(() => window.location.href = "index.html", 1000);
            } else {
                if(status) { status.style.color = "red"; status.innerText = `❌ ${data.detail || "Sai thông tin"}`; }
            }
        } catch (err) {
            if(status) { status.style.color = "red"; status.innerText = "❌ Lỗi kết nối"; }
        }
    };

    // --- B. XỬ LÝ ĐĂNG KÝ (FIX FINAL) ---
const handleRegister = async (e) => {
        e.preventDefault();
        
        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const pass = document.getElementById("regPassword").value;
        const status = document.getElementById("regStatus");

        if(status) { 
            status.style.color = "blue"; 
            status.innerText = "⏳ Đang kết nối..."; 
        }

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ full_name: name, email: email, password: pass })
            });

            // --- ĐOẠN QUAN TRỌNG: KIỂM TRA THÀNH CÔNG TRƯỚC KHI ĐỌC DỮ LIỆU ---
            if (res.ok) {
                // Nếu Server báo 200 OK -> CHUYỂN TRANG LUÔN (Không cần đọc JSON)
                if(status) { }
                
                
                localStorage.clear();
                window.location.href = "login.html"; // Chuyển trang ngay
                status.style.color = "green"; status.innerText = "✅ Thành công!";
                return; // Kết thúc hàm luôn
            }

            // Nếu thất bại mới ngồi đọc lỗi
            const errorText = await res.text(); // Đọc dạng text để tránh lỗi JSON
            console.error("Lỗi Server:", errorText);
            
            if(status) { 
                status.style.color = "red"; 
                // Cố gắng hiển thị thông báo ngắn gọn
                try {
                    const errJson = JSON.parse(errorText);
                    status.innerText = `❌ ${errJson.detail || "Lỗi đăng ký"}`;
                } catch {
                    status.innerText = "❌ Lỗi hệ thống (Email có thể đã trùng)";
                }
            }

        } catch (err) {
            console.error(err);
            if(status) { status.style.color = "red"; status.innerText = "❌ Mất kết nối tới Server"; }
        }
    };

    // --- C. GẮN SỰ KIỆN ---
    const loginForm = document.getElementById("loginForm") || document.getElementById("loginPageForm");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);

    const registerForm = document.getElementById("registerForm");
    if (registerForm) registerForm.addEventListener("submit", handleRegister);
}

// ============================================================
// 4. LOGIC SỰ KIỆN (EVENTS)
// ============================================================

async function loadEvents() {
    const container = document.getElementById("events-container");
    if (!container) return;

    container.innerHTML = `<p class="text-center">⏳ Đang tải...</p>`;
    try {
        const res = await fetch(`${API_URL}/events`);
        const events = await res.json();
        container.innerHTML = "";
        
        if (events.length === 0) { 
            container.innerHTML = "<p class='text-center w-100'>Chưa có sự kiện nào.</p>"; 
            return; 
        }

        events.forEach(ev => {
            container.insertAdjacentHTML('beforeend', `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card-custom h-100 d-flex flex-column">
                    <h5 class="fw-bold text-purple">${ev.title}</h5>
                    <p class="small text-muted mb-2"><i class="fa-solid fa-calendar"></i> ${ev.date} | ${ev.location}</p>
                    <p class="text-truncate">${ev.description}</p>
                    <a href="cava.html?event_id=${ev.id}" class="btn btn-sm btn-outline-secondary mt-auto">Xem chi tiết</a>
                </div>
            </div>`);
        });
    } catch { 
        container.innerHTML = "<p class='text-danger text-center'>Lỗi kết nối Server!</p>"; 
    }
}

async function loadEventDetail() {
    const id = new URLSearchParams(window.location.search).get('event_id');
    if(!id) return;
    
    try {
        const res = await fetch(`${API_URL}/events/${id}`);
        const ev = await res.json();
        
        if(document.getElementById("detailTitle")) document.getElementById("detailTitle").innerText = ev.title;
        if(document.getElementById("detailLocation")) document.getElementById("detailLocation").innerText = ev.location;
        if(document.getElementById("detailDate")) document.getElementById("detailDate").innerText = ev.date;
        if(document.getElementById("detailDescription")) document.getElementById("detailDescription").innerText = ev.description;
        if(document.getElementById("detailCapacity")) document.getElementById("detailCapacity").innerText = ev.capacity + " vé";
        
        if(document.getElementById("performersContainer") && ev.performers) {
            document.getElementById("performersContainer").innerHTML = ev.performers.split(",").map(n => 
                `<div class="col-6 mb-2"><div class="bg-light p-2 border rounded fw-bold text-purple">${n}</div></div>`
            ).join("");
        }
    } catch {}
}

function setupCreateEventForm() {
    const form = document.getElementById("createEventForm");
    if (!form) return; 

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("⚠️ Bạn chưa đăng nhập! Vui lòng đăng nhập trước.");
            window.location.href = "login.html";
            return;
        }

        const payload = {
            title: document.getElementById("evtTitle").value,
            date: document.getElementById("evtDate").value,
            location: document.getElementById("evtLocation").value,
            capacity: parseInt(document.getElementById("evtCapacity").value),
            performers: document.getElementById("evtPerformers").value,
            description: document.getElementById("evtDesc").value
        };

        const btn = form.querySelector("button[type='submit']");
        const oldText = btn.innerText;
        btn.innerText = "Đang lưu..."; 
        btn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/events`, {
                method: "POST", 
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                }, 
                body: JSON.stringify(payload)
            });

            const data = await res.json(); 

            if (res.ok) { 
                alert("✅ Tạo sự kiện thành công!"); 
                window.location.href = "index.html"; 
            } else { 
                if (res.status === 401) {
                    alert("⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    localStorage.clear();
                    window.location.href = "login.html";
                } else {
                    alert(`❌ Lỗi: ${data.detail || "Không thể tạo sự kiện"}`);
                }
            }
        } catch (err) { 
            console.error(err);
            alert("❌ Lỗi kết nối Server!"); 
        } finally { 
            btn.innerText = oldText; 
            btn.disabled = false; 
        }
    });
}

// ============================================================
// 5. LOGIC ĐẶT VÉ & GỬI EMAIL (BOOKING)
// ============================================================

function fillUserInfo() {
    const user = JSON.parse(localStorage.getItem("user_info"));
    if (user && document.getElementById('cusName')) {
        document.getElementById('cusName').value = user.name || "";
        document.getElementById('cusEmail').value = user.email || "";
    }
}

function openBookingModal() {
    fillUserInfo();

    if(document.getElementById('step2-qr')) document.getElementById('step2-qr').classList.add('d-none');
    if(document.getElementById('step1-form')) document.getElementById('step1-form').classList.remove('d-none');
    if(document.getElementById('modalTitle')) document.getElementById('modalTitle').innerText = "Thông Tin Đặt Vé";
    
    if(document.getElementById('cusQty')) document.getElementById('cusQty').value = 1;
    calculateBookingTotal();

    new bootstrap.Modal(document.getElementById('paymentModal')).show();
}

function calculateBookingTotal() {
    let qtyInput = document.getElementById('cusQty');
    if(!qtyInput) return;
    let qty = qtyInput.value;
    if (qty < 1) { qty = 1; qtyInput.value = 1; }
    document.getElementById('totalPriceDisplay').innerText = formatMoney(qty * TICKET_PRICE);
}

function goToStep2() {
    let name = document.getElementById('cusName').value.trim();
    let phone = document.getElementById('cusPhone').value.trim();
    let email = document.getElementById('cusEmail').value.trim();
    let qty = document.getElementById('cusQty').value;

    if (!name || !phone || !email) { alert("Vui lòng nhập đủ thông tin!"); return; }

    let total = qty * TICKET_PRICE;
    let cleanName = name.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
    let content = `VE ${cleanName} ${phone}`;
    let qrSrc = `https://img.vietqr.io/image/vietinbank-0706023978-compact2.png?amount=${total}&addInfo=${encodeURIComponent(content)}&accountName=ERPVIET`;
    
    document.getElementById('qrImage').src = qrSrc;
    document.getElementById('qrAmount').innerText = formatMoney(total);
    document.getElementById('qrContent').innerText = content;
    document.getElementById('modalTitle').innerText = "Quét Mã Thanh Toán";
    
    document.getElementById('step1-form').classList.add('d-none');
    document.getElementById('step2-qr').classList.remove('d-none');
}

function backToStep1() {
    document.getElementById('step2-qr').classList.add('d-none');
    document.getElementById('step1-form').classList.remove('d-none');
    document.getElementById('modalTitle').innerText = "Thông Tin Đặt Vé";
}

async function finishBooking() {
    let btn = document.getElementById('btnConfirmBooking'); 
    if(!btn && event) btn = event.target;

    let oldText = btn ? btn.innerHTML : "Xác nhận";
    if(btn) { btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi mail...`; btn.disabled = true; }

    try {
        let qty = parseInt(document.getElementById('cusQty').value);
        await fetch(`${API_URL}/bookings/send-email`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: document.getElementById('cusName').value,
                phone: document.getElementById('cusPhone').value,
                email: document.getElementById('cusEmail').value,
                quantity: qty,
                total_price: qty * TICKET_PRICE
            })
        });

        const modalEl = document.getElementById('paymentModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if(modalInstance) modalInstance.hide();
        
        if(document.getElementById('successEmail')) document.getElementById('successEmail').innerText = document.getElementById('cusEmail').value;
        new bootstrap.Modal(document.getElementById('successModal')).show();
    } catch {
        alert("Lỗi kết nối! Vé đã ghi nhận nhưng email lỗi.");
    } finally {
        if(btn) { btn.innerHTML = oldText; btn.disabled = false; }
    }
}

// ============================================================
// 6. LOGIC BÁO GIÁ (PRICING)
// ============================================================

function toggleApp(element, price) {
    element.classList.toggle('selected');
    if (element.classList.contains('selected')) currentAppTotal += price;
    else currentAppTotal -= price;
    calculatePricing();
}

function setBillingCycle(cycle) {
    isYearly = (cycle === 'yearly');
    const btnYearly = document.getElementById('btnYearly');
    const btnMonthly = document.getElementById('btnMonthly');
    
    if (isYearly) {
        btnYearly.classList.add('btn-purple', 'active'); btnYearly.classList.remove('btn-outline-secondary');
        btnMonthly.classList.remove('btn-purple', 'active'); btnMonthly.classList.add('btn-outline-secondary');
    } else {
        btnMonthly.classList.add('btn-purple', 'active'); btnMonthly.classList.remove('btn-outline-secondary');
        btnYearly.classList.remove('btn-purple', 'active'); btnYearly.classList.add('btn-outline-secondary');
    }
    calculatePricing();
}

function calculatePricing() {
    const userInput = document.getElementById('userCount');
    if (!userInput) return;

    let users = parseInt(userInput.value) || 0;
    if (users < 0) users = 0;

    let totalUserCost = users * USER_PRICE;
    let monthlyBase = totalUserCost + currentAppTotal; 

    updateText('displayUserCount', users);
    updateText('totalUserPrice', formatMoney(totalUserCost));
    updateText('totalAppPrice', formatMoney(currentAppTotal));

    let finalAmount = isYearly ? monthlyBase * 12 : monthlyBase;
    const label = document.getElementById('priceLabel');
    const yearlyInfo = document.getElementById('yearlyInfoBox');

    if(label) label.innerText = isYearly ? "Tổng / năm" : "Tổng / tháng";
    if(yearlyInfo) yearlyInfo.style.display = isYearly ? 'block' : 'none';

    updateText('finalTotalPrice', formatMoney(finalAmount));
}

// ============================================================
// 7. LOGIC THANH TOÁN GÓI CƯỚC (ORDER)
// ============================================================

function openOrderModal() {
    let finalPriceText = document.getElementById('finalTotalPrice').innerText;
    let finalPrice = parseInt(finalPriceText.replace(/\./g, '').replace(' đ', ''));
    
    const isYearlyOutside = document.getElementById('btnYearly').classList.contains('active');
    
    if (isYearlyOutside) {
        currentMonthlyBase = finalPrice / 12; 
    } else {
        currentMonthlyBase = finalPrice; 
    }

    if (!currentMonthlyBase || isNaN(currentMonthlyBase)) currentMonthlyBase = 1250000;

    document.getElementById('modalPriceMonth').innerText = formatMoney(currentMonthlyBase);
    document.getElementById('modalPriceYear').innerText = formatMoney(currentMonthlyBase * 12);

    switchOrderType('year');
    document.getElementById('orderQty').value = 1;
    if(document.getElementById('orderQtyRange')) document.getElementById('orderQtyRange').value = 1;
    if(document.getElementById('displayQty')) document.getElementById('displayQty').innerText = 1;
    
    new bootstrap.Modal(document.getElementById('orderModal')).show();
}

function switchOrderType(type) {
    isOrderYearly = (type === 'year');
    const boxMonth = document.getElementById('boxMonth');
    const boxYear = document.getElementById('boxYear');
    const label = document.getElementById('qtyLabel');

    const defStyle = "border: 1px solid #dee2e6; background-color: white;";
    const actStyle = "border: 2px solid #7a2e59; background-color: #fdf2f8;";

    if(boxMonth && boxYear) {
        boxMonth.style.cssText = defStyle; boxMonth.classList.remove('shadow');
        boxYear.style.cssText = defStyle; boxYear.classList.remove('shadow');

        if (isOrderYearly) {
            boxYear.style.cssText = actStyle; boxYear.classList.add('shadow');
            label.innerText = "Số năm gia hạn:";
        } else {
            boxMonth.style.cssText = actStyle; boxMonth.classList.add('shadow');
            label.innerText = "Số tháng gia hạn:";
        }
    }
    updateOrderQR();
}

function syncQty(val) {
    document.getElementById('orderQty').value = val;
    if(document.getElementById('orderQtyRange')) document.getElementById('orderQtyRange').value = val;
    if(document.getElementById('displayQty')) document.getElementById('displayQty').innerText = val;
    updateOrderQR();
}

function changeQty(amount) {
    const input = document.getElementById('orderQty');
    let val = parseInt(input.value) || 1;
    val += amount;
    if (val < 1) val = 1;
    
    input.value = val;
    syncQty(val);
}

function updateOrderQR() {
    const qty = parseInt(document.getElementById('orderQty').value) || 1;
    
    let unitPrice = isOrderYearly ? (currentMonthlyBase * 12) : currentMonthlyBase;
    let total = qty * unitPrice;
    let cycleText = isOrderYearly ? "NAM" : "THANG";
    
    let content = `THANHTOAN ${qty} ${cycleText}`;
    let qrSrc = `https://img.vietqr.io/image/vietinbank-0706023978-compact2.png?amount=${total}&addInfo=${encodeURIComponent(content)}&accountName=ERPVIET`;
    
    document.getElementById('orderQRImage').src = qrSrc;
    document.getElementById('orderTotalPrice').innerText = formatMoney(total);
    document.getElementById('orderContent').innerText = content;
}

function confirmOrderPayment() {
    const orderModalEl = document.getElementById('orderModal');
    const orderModal = bootstrap.Modal.getInstance(orderModalEl);
    orderModal.hide();

    setTimeout(() => {
        const successModal = new bootstrap.Modal(document.getElementById('successOrderModal'));
        successModal.show();
    }, 500);
}

// ============================================================
// 8. TIỆN ÍCH (UTILS)
// ============================================================

function formatMoney(amount) {
    return Math.round(amount).toLocaleString('vi-VN') + ' đ';
}

function updateText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

// Các hàm điều hướng HTML
function goToCreateEvent() {
    if (localStorage.getItem("access_token")) window.location.href = "events.html"; 
    else if(confirm("Cần đăng nhập. Đi tới trang đăng nhập?")) window.location.href = "login.html"; 
}

function goToRegister() { window.location.href = "register.html"; }
function goToLogin() { window.location.href = "login.html"; }
function goToHome() { window.location.href = "index.html"; }
function goToEvents() { window.location.href = "events.html"; }