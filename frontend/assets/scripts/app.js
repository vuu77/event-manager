/* frontend/assets/scripts/app.js - FINAL COMPLETE VERSION (FIXED API URL) */

// ============================================================
// 1. CẤU HÌNH & BIẾN TOÀN CỤC
// ============================================================
// FIX: Loại bỏ '/api/v1' vì log Backend (image_693919.png) cho thấy nó không dùng prefix này.
const API_URL = "http://127.0.0.1:8000"; 
const TICKET_PRICE = 125000;
const USER_PRICE = 125000;

let currentAppTotal = 0;     
let isYearly = true;         
let currentEventId = null; 
let globalEventList = []; 
let orderState = { type: 'year', quantity: 1, basePrice: 0 };

// ============================================================
// 2. HÀM HỖ TRỢ CHUNG
// ============================================================
function formatMoney(amount) {
    return Math.round(amount).toLocaleString('vi-VN') + ' đ';
}

function extractFieldFromMessage(message, fieldName) {
    // Regex tìm trường trong block message
    const regex = new RegExp(`- ${fieldName}:\\s*(.*)`); 
    const match = message.match(regex);
    // Nếu không tìm thấy, thử tìm trong message gốc (trường hợp Topic)
    if (fieldName === 'Chủ đề') return match && match[1] ? match[1].trim() : null;

    // Các trường khác
    return match && match[1] ? match[1].trim() : null;
}

function updateText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

// ============================================================
// 3. KHỞI TẠO ỨNG DỤNG
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
    checkLoginState();
    setupAuthForms();

    if (document.getElementById("events-container")) loadEvents();
    
    // Nếu đang ở trang chi tiết (cava.html), hàm này sẽ chạy
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
// 4. LOGIC AUTH (GIỮ NGUYÊN)
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

window.handleLogout = function() {
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
// 5. LOGIC EVENT LIST (TRANG CHỦ - ĐÃ TỐI ƯU ÁNH XẠ DỮ LIỆU CTY)
// ============================================================
async function loadEvents() {
    const container = document.getElementById("events-container");
    if (!container) return;

    container.innerHTML = `<p class="text-center text-muted">⏳ Đang tải dữ liệu...</p>`;
    
    try {
        const [resArt, resCompany] = await Promise.all([
            fetch(`${API_URL}/events`),
            fetch(`${API_URL}/event-requests`)
        ]);

        const artEvents = await resArt.json();
        let companyRequests = []; 
        if (resCompany.ok) companyRequests = await resCompany.json();

        container.innerHTML = "";
        
        globalEventList = [
            ...artEvents.map(ev => ({ 
                ...ev, 
                type: 'art', 
                location: ev.location || "Đang cập nhật",
                image_url: ev.image_url || "https://crmviet.vn/wp-content/uploads/2019/04/phan-mem-quan-ly-du-an.png"
            })), 
            ...companyRequests.map(req => {
                // Ánh xạ dữ liệu Company cho trang chủ
                const companyName = extractFieldFromMessage(req.message, "Công ty/Tổ chức");
                const shortLocation = extractFieldFromMessage(req.message, "Địa điểm");
                const imageUrl = extractFieldFromMessage(req.message, "Image URL");
                
                return {
                    id: req.id,
                    title: req.topic || "Sự kiện Doanh Nghiệp (Yêu cầu)",
                    date: req.created_at, 
                    location: shortLocation || companyName || "Liên hệ xác nhận",
                    description: req.message,
                    image_url: imageUrl || "https://www.eventjuicer.com/site/assets/files/1488/event-management.jpg",
                    type: 'company'
                };
            })
        ];

        if (globalEventList.length === 0) { 
            container.innerHTML = "<p class='text-center w-100'>Chưa có sự kiện nào.</p>"; 
            return; 
        }

        globalEventList.sort((a, b) => new Date(b.date) - new Date(a.date));

        globalEventList.forEach(ev => {
            const imgUrl = ev.image_url || "https://crmviet.vn/wp-content/uploads/2019/04/phan-mem-quan-ly-du-an.png";
            const isCompany = ev.type === 'company';
            
            const badge = isCompany 
                ? `<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-3">Doanh nghiệp</span>`
                : `<span class="badge bg-purple position-absolute top-0 end-0 m-3">Sắp diễn ra</span>`;

            let linkDetail = `cava.html?event_id=${ev.id}`;
            if (isCompany) linkDetail += `&type=company`;

            const shortDesc = ev.description ? (ev.description.substring(0, 150) + (ev.description.length > 150 ? '...' : '')) : '';


            container.insertAdjacentHTML('beforeend', `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden position-relative">
                    ${badge}
                    <div style="height: 200px; overflow: hidden;">
                        <img src="${imgUrl}" class="w-100 h-100 object-fit-cover" alt="${ev.title}"
                             onerror="this.onerror=null;this.src='https://crmviet.vn/wp-content/uploads/2019/04/phan-mem-quan-ly-du-an.png';">
                    </div>
                    <div class="card-body d-flex flex-column p-4">
                        <h5 class="fw-bold text-dark mb-2 text-truncate">${ev.title}</h5>
                        <p class="small text-muted mb-3">
                            <i class="fa-solid fa-clock me-1 text-primary"></i> ${new Date(ev.date).toLocaleDateString('vi-VN')} <br>
                            <i class="fa-solid fa-location-dot me-1 text-danger"></i> ${ev.location}
                        </p>
                        <p class="text-secondary small mb-4 flex-grow-1 text-truncate">${shortDesc}</p>
                        <a href="${linkDetail}" class="btn btn-${isCompany ? 'outline-warning text-dark' : 'purple'} fw-bold w-100 rounded-pill">
                            ${isCompany ? '🔍 Xem chi tiết' : 'Xem & Đặt vé'}
                        </a>
                    </div>
                </div>
            </div>`);
        });

    } catch (err) { 
        console.error("Lỗi tải sự kiện:", err);
        container.innerHTML = "<p class='text-danger text-center'>Không thể tải dữ liệu! (Kiểm tra Backend)</p>"; 
    }
}

// ============================================================
// 6. LOGIC EVENT DETAIL (CHI TIẾT SỰ KIỆN - ĐÃ TỐI ƯU LẤY REQUEST)
// ============================================================
async function loadEventDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('event_id');
    const type = urlParams.get('type') || 'art'; 

    if(!id) return;
    currentEventId = id;

    try {
        let ev = null;

        if (type === 'art') {
            const res = await fetch(`${API_URL}/events/${id}`);
            if (res.ok) ev = await res.json();
        } else {
            // Loại Company: Gọi API chi tiết request (Endpoint /event-requests/{id} có thể không tồn tại, nên dùng list nếu API chi tiết lỗi)
            let res = await fetch(`${API_URL}/event-requests/${id}`);
            let req = null;
            if (res.ok) {
                req = await res.json();
            } else {
                // FALLBACK: Nếu API /event-requests/{id} không hoạt động (dựa trên log 404), gọi list và tìm
                console.warn(`Lỗi 404 khi gọi ${API_URL}/event-requests/${id}. Thử Fallback.`);
                const listRes = await fetch(`${API_URL}/event-requests`);
                if (listRes.ok) {
                    const list = await listRes.json();
                    req = list.find(item => String(item.id) === String(id));
                }
            }

            if (req) {
                // Ánh xạ dữ liệu Company
                ev = {
                    id: req.id,
                    title: req.topic,
                    date: req.created_at,
                    location: extractFieldFromMessage(req.message, "Địa điểm") || extractFieldFromMessage(req.message, "Công ty/Tổ chức"),
                    description: req.message,
                    capacity: extractFieldFromMessage(req.message, "Quy mô dự kiến") || "Liên hệ",
                    image_url: extractFieldFromMessage(req.message, "Image URL") || "https://www.eventjuicer.com/site/assets/files/1488/event-management.jpg",
                    isCompany: true,
                    organizer: req.full_name,
                    email: req.email
                };
            }
        }

        if (!ev) { alert("Không tìm thấy thông tin sự kiện!"); return; }
        
        // HIỂN THỊ LÊN GIAO DIỆN
        if(document.getElementById("detailTitle")) document.getElementById("detailTitle").innerText = ev.title;
        if(document.getElementById("detailLocation")) document.getElementById("detailLocation").innerText = ev.location;
        if(document.getElementById("detailDescription")) document.getElementById("detailDescription").innerText = ev.description;
        if(document.getElementById("detailCapacity")) document.getElementById("detailCapacity").innerText = ev.capacity;
        
        if(document.getElementById("detailDate")) {
            const dateObj = new Date(ev.date);
            document.getElementById("detailDate").innerText = dateObj.toLocaleDateString('vi-VN') + ' - ' + dateObj.toLocaleTimeString('vi-VN').slice(0,5);
        }

        const detailImageEl = document.getElementById("detailImage");
        if(detailImageEl) {
            detailImageEl.src = ev.image_url || "https://crmviet.vn/wp-content/uploads/2019/04/phan-mem-quan-ly-du-an.png";
            detailImageEl.onerror = function() { this.onerror=null; this.src='https://crmviet.vn/wp-content/uploads/2019/04/phan-mem-quan-ly-du-an.png'; };
        }

        // Xử lý tên BTC
        if(document.getElementById("detailOrganizer")) {
            let orgName = "Hệ thống CAVA";
            if (ev.isCompany) {
                orgName = ev.organizer || "Công ty đối tác";
            } else if (ev.description && ev.description.startsWith("[BTC:")) {
                const match = ev.description.match(/\[BTC: (.*?)\]/);
                if (match) orgName = match[1];
            } else if (ev.organizer && ev.organizer.full_name) {
                orgName = ev.organizer.full_name;
            }
            document.getElementById("detailOrganizer").innerText = orgName;
        }

        // Xử lý nút Đặt vé (Ẩn nếu là Company)
        const btnArea = document.querySelector(".col-lg-4 .btn-purple"); 
        if (ev.isCompany && btnArea) {
            btnArea.parentElement.innerHTML = `
                <div class="alert alert-warning text-center">
                    <i class="fa-solid fa-lock"></i> Sự kiện nội bộ<br>
                    <small>Liên hệ: <strong>${ev.email || 'N/A'}</strong></small>
                </div>
            `;
        }

    } catch (err) {
        console.error("Lỗi tải chi tiết:", err);
        alert("Lỗi tải dữ liệu chi tiết.");
    }
}

// ============================================================
// 7. FORM TẠO SỰ KIỆN
// ============================================================
function setupCreateEventForms() {
    const artForm = document.getElementById("createEventForm");
    if (artForm) {
        artForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const token = localStorage.getItem("access_token");
            if (!token) { alert("⚠️ Vui lòng đăng nhập!"); window.location.href = "login.html"; return; }

            const organizerName = document.getElementById("evtOrganizerName").value || "BTC";
            const rawDesc = document.getElementById("evtDesc").value;
            const finalDesc = `[BTC: ${organizerName}]\n${rawDesc}`;
            
            const imageUrlInput = document.getElementById("evtImage");
            const imageUrl = imageUrlInput ? imageUrlInput.value : "";

            const payload = {
                title: document.getElementById("evtTitle").value,
                date: document.getElementById("evtDate").value,
                location: document.getElementById("evtLocation").value,
                capacity: parseInt(document.getElementById("evtCapacity").value),
                description: finalDesc,
                image_url: imageUrl
            };

            try {
                const res = await fetch(`${API_URL}/events`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    alert("✅ Tạo sự kiện Nghệ thuật thành công!");
                    window.location.href = "index.html";
                } else {
                    const data = await res.json();
                    alert(`❌ Lỗi: ${data.detail || "Không thể tạo"}`);
                }
            } catch { alert("Lỗi kết nối Server!"); }
        });
    }
}

window.submitCompanyForm = async function(e) {
    if(e) e.preventDefault();
    const elName = document.getElementById('comName');
    const elEmail = document.getElementById('comEmail');
    const elCompany = document.getElementById('comCompany'); 
    const elCapacity = document.getElementById('comCapacity'); 
    const elDate = document.getElementById('comDate'); 
    const elTopic = document.getElementById('comTopic');
    const elMsg = document.getElementById('comMsg');
    const elLocation = document.getElementById('comLocation'); 
    const elImage = document.getElementById('comImage'); 

    if (!elName || !elEmail || !elCompany || !elDate) {
        alert("❌ Lỗi Code HTML: Thiếu trường nhập liệu!");
        return;
    }
    if (!elName.value || !elEmail.value) {
        alert("Vui lòng điền tên và email!");
        return;
    }
    
    // Đưa tất cả thông tin chi tiết vào message
    const imageUrlLine = elImage && elImage.value ? `- Image URL: ${elImage.value}\n` : '';

    const fullMessage = `
- Công ty/Tổ chức: ${elCompany.value}
- Quy mô dự kiến: ${elCapacity.value} khách
- Địa điểm: ${elLocation.value || 'N/A'}
- Thời gian tổ chức: ${new Date(elDate.value).toLocaleString('vi-VN')}
${imageUrlLine}
-----------------------
${elMsg.value}
`;

    const requestData = {
        full_name: elName.value,
        email: elEmail.value,
        topic: elTopic.value,
        message: fullMessage 
    };

    const token = localStorage.getItem("access_token");
    try {
        const res = await fetch(`${API_URL}/event-requests`, { 
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...(token ? { "Authorization": `Bearer ${token}` } : {}) 
            },
            body: JSON.stringify(requestData)
        });

        if (res.ok) {
            alert("✅ Đã gửi yêu cầu thành công!");
            window.location.reload(); 
        } else {
            const err = await res.json();
            // Lỗi 404 (Not Found) thường do sai Endpoint
            alert(`❌ Gửi thất bại: ${err.detail || "Not Found"}`); 
        }
    } catch { alert("Lỗi kết nối server!"); }
};

// ============================================================
// 8. BOOKING VÉ (Dành cho Art Events) - GIỮ NGUYÊN
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
        } else { alert("Lỗi tạo vé."); }
    } catch (err) { alert("Lỗi kết nối!"); } 
    finally { if (btn) { btn.innerHTML = "Xác nhận"; btn.disabled = false; } }
};

window.backToStep1 = function() {
    document.getElementById('step2-qr').classList.add('d-none');
    document.getElementById('step1-form').classList.remove('d-none');
};

// ============================================================
// 9. TÍNH TIỀN & BÁO GIÁ - GIỮ NGUYÊN
// ============================================================
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

// ============================================================
// 10. LOGIC THANH TOÁN BÁO GIÁ (QR CODE) - GIỮ NGUYÊN
// ============================================================
window.submitPricingOrder = function() {
    const token = localStorage.getItem("access_token");
    if (!token) { 
        alert("⚠️ Vui lòng đăng nhập để đăng ký!"); 
        window.location.href = "login.html"; 
        return; 
    }

    const userCountInput = document.getElementById('userCount');
    if (!userCountInput) {
        console.error("Không tìm thấy ô nhập userCount");
        return; 
    }

    const userCount = parseInt(userCountInput.value) || 0;
    if (userCount <= 0) { alert("Vui lòng nhập số lượng user > 0"); return; }

    orderState.basePrice = (userCount * USER_PRICE) + currentAppTotal;
    orderState.type = isYearly ? 'year' : 'month';
    orderState.quantity = 1;

    updateOrderModal();
    const modalEl = document.getElementById('orderModal');
    if(modalEl) new bootstrap.Modal(modalEl).show();
    else alert("Thiếu Modal 'orderModal' trong HTML!");
};

window.switchOrderType = function(type) {
    orderState.type = type;
    updateOrderModal();
};

window.changeQty = function(delta) {
    const newQty = orderState.quantity + delta;
    if (newQty >= 1) {
        orderState.quantity = newQty;
        updateOrderModal();
    }
};

function updateOrderModal() {
    const boxYear = document.getElementById('boxYear');
    const boxMonth = document.getElementById('boxMonth');
    const qtyLabel = document.getElementById('qtyLabel');

    if (orderState.type === 'year') {
        if(boxYear) { boxYear.style.border = "2px solid #6f42c1"; boxYear.style.backgroundColor = "#f3e5f5"; }
        if(boxMonth) { boxMonth.style.border = "1px solid #dee2e6"; boxMonth.style.backgroundColor = "#f8f9fa"; }
        if(qtyLabel) qtyLabel.innerText = "Số năm gia hạn:";
    } else {
        if(boxMonth) { boxMonth.style.border = "2px solid #6f42c1"; boxMonth.style.backgroundColor = "#f3e5f5"; }
        if(boxYear) { boxYear.style.border = "1px solid #dee2e6"; boxYear.style.backgroundColor = "#f8f9fa"; }
        if(qtyLabel) qtyLabel.innerText = "Số tháng gia hạn:";
    }

    const qtyInput = document.getElementById('orderQty');
    if(qtyInput) qtyInput.value = orderState.quantity;

    let total = 0;
    if (orderState.type === 'year') {
        total = orderState.basePrice * 12 * orderState.quantity;
    } else {
        total = orderState.basePrice * orderState.quantity;
    }

    const totalPriceEl = document.getElementById('orderTotalPrice');
    if(totalPriceEl) totalPriceEl.innerText = formatMoney(total);
    
    const cycleText = orderState.type === 'year' ? 'NAM' : 'THANG';
    const content = `ERP ${cycleText} ${orderState.quantity}`;
    const contentEl = document.getElementById('orderContent');
    if(contentEl) contentEl.innerText = content;

    const qrSrc = `https://img.vietqr.io/image/vietinbank-0706023978-compact2.png?amount=${total}&addInfo=${encodeURIComponent(content)}&accountName=ERPVIET`;
    const qrImg = document.getElementById('orderQRImage');
    if(qrImg) qrImg.src = qrSrc;

    const yearHint = document.getElementById('modalPriceYear');
    const monthHint = document.getElementById('modalPriceMonth');
    if(yearHint) yearHint.innerText = formatMoney(orderState.basePrice * 12) + "/năm";
    if(monthHint) monthHint.innerText = formatMoney(orderState.basePrice) + "/tháng";
}

window.confirmOrderPayment = async function() {
    const btn = document.querySelector('#orderModal .btn-success');
    if(btn) { btn.innerHTML = "Đang xử lý..."; btn.disabled = true; }

    try {
        const token = localStorage.getItem("access_token");
        let total = orderState.type === 'year' 
            ? orderState.basePrice * 12 * orderState.quantity
            : orderState.basePrice * orderState.quantity;

        const details = `Mua gói: ${orderState.quantity} ${orderState.type === 'year' ? 'Năm' : 'Tháng'}. Tổng: ${formatMoney(total)}`;

        const res = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ total_amount: total, details: details })
        });

        if (res.ok) {
            const modalEl = document.getElementById('orderModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();
            const successModalEl = document.getElementById('successOrderModal');
            if(successModalEl) new bootstrap.Modal(successModalEl).show();
            else { alert("Đăng ký thành công!"); window.location.href = "index.html"; }
        } else {
            const err = await res.json();
            alert(`Lỗi: ${err.detail || "Không thể tạo đơn hàng"}`);
        }
    } catch (e) {
        console.error(e);
        alert("Lỗi kết nối Server!");
    } finally {
        if(btn) { btn.innerHTML = '<i class="fa-solid fa-check me-2"></i> Đã chuyển khoản'; btn.disabled = false; }
    }
};