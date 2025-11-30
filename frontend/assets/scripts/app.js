/* frontend/assets/scripts/app.js - FINAL VERSION (FIXED ORGANIZER & COMPANY FORM) */

// ============================================================
// 1. CẤU HÌNH & BIẾN TOÀN CỤC
// ============================================================
const API_URL = "http://127.0.0.1:8000"; 
const TICKET_PRICE = 125000;
const USER_PRICE = 125000;

let currentAppTotal = 0;     
let isYearly = true;         
let currentMonthlyBase = 0;  
let isOrderYearly = true;    
let currentEventId = null; 

// ============================================================
// 2. KHỞI TẠO ỨNG DỤNG
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
    checkLoginState();
    setupAuthForms();

    if (document.getElementById("events-container")) loadEvents();
    if (document.getElementById("detailTitle")) loadEventDetail();

    setupCreateEventForms(); 

    const userInput = document.getElementById('userCount');
    if (userInput) {
        userInput.addEventListener('input', calculatePricing);
        userInput.addEventListener('change', calculatePricing);
        calculatePricing(); 
    }
});

// ============================================================
// 3. LOGIC AUTH
// ============================================================
function checkLoginState() {
    const userSection = document.getElementById("user-section");
    if (!userSection) return;

    const token = localStorage.getItem("access_token");
    const userInfoRaw = localStorage.getItem("user_info");

    if (token && userInfoRaw) {
        const userInfo = JSON.parse(userInfoRaw);
        userSection.innerHTML = `
            <span class="text-white me-3"><i class="fa-solid fa-user"></i> Xin chào, <strong>${userInfo.name}</strong></span>
            <a href="#" onclick="handleLogout()" class="text-warning text-decoration-none fw-bold small">
                <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
            </a>
        `;
    } else {
        userSection.innerHTML = `
            <a href="login.html" class="text-white text-decoration-none fw-bold small">
                <i class="fa-solid fa-key"></i> Đăng nhập / Đăng ký
            </a>
        `;
    }
}

function handleLogout() {
    if(confirm("Bạn có chắc muốn đăng xuất?")) {
        localStorage.clear();
        window.location.href = "login.html";
    }
}

function setupAuthForms() {
    const loginForm = document.getElementById("loginPageForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const status = document.getElementById("notify");

            status.innerText = "⏳ Đang xử lý...";
            try {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem("access_token", data.access_token);
                    localStorage.setItem("user_info", JSON.stringify(data.user_info));
                    window.location.href = "index.html";
                } else {
                    status.innerText = `❌ ${data.detail || "Sai thông tin"}`;
                }
            } catch { status.innerText = "❌ Lỗi kết nối Server"; }
        });
    }

    const regForm = document.getElementById("registerForm");
    if (regForm) {
        regForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("regName").value;
            const email = document.getElementById("regEmail").value;
            const pass = document.getElementById("regPassword").value;
            const status = document.getElementById("regStatus");

            status.innerText = "⏳ Đang đăng ký...";
            try {
                const res = await fetch(`${API_URL}/auth/register`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ full_name: name, email: email, password: pass })
                });
                if (res.ok) {
                    alert("✅ Đăng ký thành công! Vui lòng đăng nhập.");
                    window.location.href = "login.html";
                } else {
                    const err = await res.json();
                    status.innerText = `❌ ${err.detail || "Đăng ký thất bại"}`;
                }
            } catch { status.innerText = "❌ Lỗi kết nối Server"; }
        });
    }
}

// ============================================================
// 4. LOGIC EVENT LIST & DETAIL
// ============================================================
async function loadEvents() {
    const container = document.getElementById("events-container");
    if (!container) return;

    container.innerHTML = `<p class="text-center text-muted">⏳ Đang tải sự kiện...</p>`;
    try {
        const res = await fetch(`${API_URL}/events`);
        const events = await res.json();
        container.innerHTML = "";
        
        if (events.length === 0) { 
            container.innerHTML = "<p class='text-center w-100'>Chưa có sự kiện nào sắp diễn ra.</p>"; 
            return; 
        }

        events.forEach(ev => {
            const imgUrl = ev.image_url || "https://crmviet.vn/wp-content/uploads/2019/04/phan-mem-quan-ly-du-an.png";
            container.insertAdjacentHTML('beforeend', `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                    <div style="height: 200px; overflow: hidden;">
                        <img src="${imgUrl}" class="w-100 h-100 object-fit-cover" alt="${ev.title}">
                    </div>
                    <div class="card-body d-flex flex-column p-4">
                        <h5 class="fw-bold text-dark mb-2 text-truncate">${ev.title}</h5>
                        <p class="small text-muted mb-3"><i class="fa-solid fa-clock me-1 text-primary"></i> ${new Date(ev.date).toLocaleDateString('vi-VN')} | <i class="fa-solid fa-location-dot me-1 text-danger"></i> ${ev.location}</p>
                        <p class="text-secondary small mb-4 flex-grow-1 text-truncate">${ev.description}</p>
                        <a href="cava.html?event_id=${ev.id}" class="btn btn-purple fw-bold w-100 rounded-pill">Xem chi tiết & Đặt vé</a>
                    </div>
                </div>
            </div>`);
        });
    } catch { 
        container.innerHTML = "<p class='text-danger text-center'>Không thể kết nối tới Server!</p>"; 
    }
}

async function loadEventDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('event_id');
    if(!id) {
        alert("Không tìm thấy sự kiện!");
        window.location.href = "index.html";
        return;
    }
    currentEventId = id;

    try {
        const res = await fetch(`${API_URL}/events/${id}`);
        if (!res.ok) throw new Error("Sự kiện không tồn tại");
        
        const ev = await res.json();
        
        if(document.getElementById("detailTitle")) document.getElementById("detailTitle").innerText = ev.title;
        if(document.getElementById("detailLocation")) document.getElementById("detailLocation").innerText = ev.location;
        if(document.getElementById("detailDescription")) document.getElementById("detailDescription").innerText = ev.description;
        if(document.getElementById("detailCapacity")) document.getElementById("detailCapacity").innerText = ev.capacity;
        
        if(document.getElementById("detailDate")) {
            const dateObj = new Date(ev.date);
            document.getElementById("detailDate").innerText = dateObj.toLocaleDateString('vi-VN') + ' - ' + dateObj.toLocaleTimeString('vi-VN').slice(0,5);
        }

        if(document.getElementById("detailImage")) {
            document.getElementById("detailImage").src = ev.image_url || "https://crmviet.vn/wp-content/uploads/2019/04/phan-mem-quan-ly-du-an.png";
        }

        // --- ĐOẠN NÀY ĐÃ SỬA: Dùng đúng ID 'detailOrganizer' ---
        if(document.getElementById("detailOrganizer")) {
            let orgName = "Không xác định";
            if (ev.organizer && ev.organizer.full_name) {
                orgName = ev.organizer.full_name;
            } else if (ev.organizer_id) {
                orgName = "ID #" + ev.organizer_id;
            }
            document.getElementById("detailOrganizer").innerText = orgName;
        }

    } catch (err) {
        console.error(err);
        alert("Lỗi tải thông tin sự kiện.");
    }
}

// ============================================================
// 5. CREATE EVENT (ART & COMPANY)
// ============================================================
function setupCreateEventForms() {
    const artForm = document.getElementById("createEventForm");
    if (artForm) {
        artForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const token = localStorage.getItem("access_token");
            if (!token) { alert("Vui lòng đăng nhập!"); window.location.href = "login.html"; return; }

            const payload = {
                title: document.getElementById("evtTitle").value,
                date: document.getElementById("evtDate").value,
                location: document.getElementById("evtLocation").value,
                capacity: parseInt(document.getElementById("evtCapacity").value),
                description: document.getElementById("evtDesc").value,
                image_url: document.getElementById("evtImage") ? document.getElementById("evtImage").value : ""
            };

            try {
                const res = await fetch(`${API_URL}/events`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    alert("✅ Tạo sự kiện thành công!");
                    window.location.href = "index.html";
                } else {
                    const data = await res.json();
                    alert(`❌ Lỗi: ${data.detail || "Lỗi tạo sự kiện"}`);
                }
            } catch { alert("Lỗi kết nối!"); }
        });
    }
}

// Hàm gửi form công ty (Global)
window.submitCompanyForm = async function(e) {
    if(e) e.preventDefault();
    const requestData = {
        full_name: document.getElementById('comName').value,
        email: document.getElementById('comEmail').value,
        topic: document.getElementById('comTopic').value,
        message: document.getElementById('comMsg').value
    };

    if(!requestData.full_name || !requestData.email) {
        alert("Vui lòng điền tên và email!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/event-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        if (res.ok) {
            alert("✅ Đã gửi yêu cầu! Chúng tôi sẽ liên hệ lại sớm.");
            window.location.href = "index.html";
        } else {
            alert("❌ Gửi thất bại.");
        }
    } catch { alert("Lỗi kết nối server"); }
};

// ============================================================
// 6. BOOKING LOGIC
// ============================================================
window.openBookingModal = function() {
    if (!currentEventId) { alert("Lỗi ID sự kiện!"); return; }
    
    const user = JSON.parse(localStorage.getItem("user_info"));
    if (user) {
        if(document.getElementById('cusName')) document.getElementById('cusName').value = user.name || "";
        if(document.getElementById('cusEmail')) document.getElementById('cusEmail').value = user.email || "";
    }

    document.getElementById('step1-form').classList.remove('d-none');
    document.getElementById('step2-qr').classList.add('d-none');
    if(document.getElementById('cusQty')) document.getElementById('cusQty').value = 1;
    calculateBookingTotal();

    const modalEl = document.getElementById('paymentModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
};

window.calculateBookingTotal = function() {
    let qtyInput = document.getElementById('cusQty');
    if (!qtyInput) return;
    let qty = parseInt(qtyInput.value);
    if (qty < 1) { qty = 1; qtyInput.value = 1; }
    document.getElementById('totalPriceDisplay').innerText = formatMoney(qty * TICKET_PRICE);
};

window.goToStep2 = function() {
    const name = document.getElementById('cusName').value;
    const phone = document.getElementById('cusPhone').value;
    const email = document.getElementById('cusEmail').value;
    const qty = parseInt(document.getElementById('cusQty').value);

    if (!name || !phone || !email) { alert("Thiếu thông tin!"); return; }

    const total = qty * TICKET_PRICE;
    const content = `VE EVT${currentEventId} ${phone}`; 
    const qrSrc = `https://img.vietqr.io/image/vietinbank-0706023978-compact2.png?amount=${total}&addInfo=${encodeURIComponent(content)}&accountName=ERPVIET`;

    document.getElementById('qrImage').src = qrSrc;
    document.getElementById('qrAmount').innerText = formatMoney(total);
    document.getElementById('qrContent').innerText = content;
    
    document.getElementById('step1-form').classList.add('d-none');
    document.getElementById('step2-qr').classList.remove('d-none');
};

window.finishBooking = async function() {
    const btn = document.getElementById('btnConfirmBooking');
    if (btn) { btn.innerHTML = "Đang xử lý..."; btn.disabled = true; }

    try {
        const qty = parseInt(document.getElementById('cusQty').value);
        const res = await fetch(`${API_URL}/bookings/send-email`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: document.getElementById('cusName').value,
                phone: document.getElementById('cusPhone').value,
                email: document.getElementById('cusEmail').value,
                quantity: qty,
                total_price: qty * TICKET_PRICE,
                event_id: parseInt(currentEventId)
            })
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide();
            document.getElementById('successEmail').innerText = document.getElementById('cusEmail').value;
            new bootstrap.Modal(document.getElementById('successModal')).show();
        } else {
            alert("Lỗi tạo vé.");
        }
    } catch (err) { alert("Lỗi kết nối!"); } 
    finally { if (btn) { btn.innerHTML = "Xác nhận"; btn.disabled = false; } }
};

window.backToStep1 = function() {
    document.getElementById('step2-qr').classList.add('d-none');
    document.getElementById('step1-form').classList.remove('d-none');
};

// ============================================================
// 7. UTILS & NAVIGATION
// ============================================================
function formatMoney(amount) {
    return Math.round(amount).toLocaleString('vi-VN') + ' đ';
}

function calculatePricing() {
    const userInput = document.getElementById('userCount');
    if (!userInput) return;
    let users = parseInt(userInput.value) || 0;
    if (users < 0) users = 0;
    
    updateText('displayUserCount', users);
    updateText('totalUserPrice', formatMoney(users * USER_PRICE));
    updateText('totalAppPrice', formatMoney(currentAppTotal));
    
    let total = (users * USER_PRICE) + currentAppTotal;
    if(isYearly) total *= 12;
    updateText('finalTotalPrice', formatMoney(total));
}

function updateText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

window.toggleApp = function(element, price) {
    element.classList.toggle('selected');
    if (element.classList.contains('selected')) currentAppTotal += price;
    else currentAppTotal -= price;
    calculatePricing();
};

window.setBillingCycle = function(cycle) {
    isYearly = (cycle === 'yearly');
    const btnY = document.getElementById('btnYearly');
    const btnM = document.getElementById('btnMonthly');
    if(isYearly) {
        btnY.classList.add('btn-purple', 'active'); btnY.classList.remove('btn-outline-secondary');
        btnM.classList.remove('btn-purple', 'active'); btnM.classList.add('btn-outline-secondary');
    } else {
        btnM.classList.add('btn-purple', 'active'); btnM.classList.remove('btn-outline-secondary');
        btnY.classList.remove('btn-purple', 'active'); btnY.classList.add('btn-outline-secondary');
    }
    calculatePricing();
};

window.goToCreateEvent = function() {
    const token = localStorage.getItem("access_token");
    if (token) window.location.href = "events.html"; 
    else { alert("Vui lòng đăng nhập!"); window.location.href = "login.html"; }
};

window.showForm = function(type) {
    document.getElementById('selectionScreen').classList.add('d-none');
    if (type === 'company') {
        document.getElementById('companyForm').classList.remove('d-none');
        document.getElementById('artForm').classList.add('d-none');
    } else {
        document.getElementById('artForm').classList.remove('d-none');
        document.getElementById('companyForm').classList.add('d-none');
    }
};

window.goBack = function() {
    document.getElementById('selectionScreen').classList.remove('d-none');
    document.getElementById('companyForm').classList.add('d-none');
    document.getElementById('artForm').classList.add('d-none');
};