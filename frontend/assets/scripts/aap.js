// URL backend (API)
const API_URL = "http://127.0.0.1:8000";

// Biến toàn cục cho Slider (Để HTML có thể gọi được)
let slideIndex = 0;
let slideTimer; // Biến lưu bộ đếm giờ để reset khi cần

// Chờ HTML tải xong rồi mới chạy các hàm cài đặt
document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 Website đã tải xong, JS bắt đầu chạy...");

    // 1. KIỂM TRA SERVER
    checkServer();

    // 2. XỬ LÝ ĐĂNG NHẬP
    handleLogin();

    // 3. XỬ LÝ SLIDER
    // Gọi hàm hiển thị slide đầu tiên
    showSlides(); 
});

// --- HÀM 1: KIỂM TRA KẾT NỐI SERVER ---
async function checkServer() {
    try {
        const res = await fetch(`${API_URL}/api/events`);
        if (res.ok) {
            console.log("✅ Kết nối Server thành công!");
        } else {
            console.warn("⚠️ Server phản hồi lỗi:", res.status);
        }
    } catch (error) {
        console.error("❌ Không thể kết nối Server (Backend có đang bật không?)");
    }
}

// --- HÀM 2: XỬ LÝ ĐĂNG NHẬP ---
function handleLogin() {
    const loginForm = document.getElementById("loginForm");
    
    // Nếu không tìm thấy form login (đang ở trang chủ), thoát luôn
    if (!loginForm) return;

    console.log("🔑 Đã tìm thấy Form Login, sẵn sàng xử lý...");

    const statusText = document.getElementById("loginStatus");

    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault(); // Chặn việc reload trang

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Validate
        if (!email || !password) {
            if(statusText) {
                statusText.innerText = "⚠️ Vui lòng nhập đầy đủ thông tin!";
                statusText.style.color = "red";
            }
            return;
        }

        // Thông báo đang xử lý
        if(statusText) {
            statusText.innerText = "⏳ Đang đăng nhập...";
            statusText.style.color = "blue";
        }

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Thành công
                localStorage.setItem("accessToken", data.access_token);
                
                if(statusText) {
                    statusText.innerText = "✅ Đăng nhập thành công!";
                    statusText.style.color = "green";
                }
                
                // Chuyển trang sau 1s
                setTimeout(() => {
                    window.location.href = "index.html"; 
                }, 1000);
            } else {
                // Thất bại
                if(statusText) {
                    statusText.innerText = "❌ " + (data.detail || "Sai email hoặc mật khẩu");
                    statusText.style.color = "red";
                }
            }
        } catch (error) {
            console.error("Lỗi Login:", error);
            if(statusText) {
                statusText.innerText = "❌ KHÔNG THỂ ĐĂNG NHẬP ";
                statusText.style.color = "red";
            }
        }
    });
}

// --- HÀM 3: XỬ LÝ SLIDER (BANNER) ---

// Hàm này được gọi tự động và đệ quy
function showSlides() {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    // Nếu trang này không có slider thì thoát luôn
    if (slides.length === 0) return;

    // 1. Ẩn tất cả slide cũ
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    // Bỏ active ở tất cả chấm tròn
    for (let i = 0; i < dots.length; i++) {
        if(dots[i]) dots[i].classList.remove("active");
    }

    // 2. Tăng index lên
    slideIndex++;

    // Nếu vượt quá số lượng slide thì quay về 1
    if (slideIndex > slides.length) { slideIndex = 1 }

    // 3. Hiện slide mới
    slides[slideIndex - 1].classList.add("active");
    if(dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active");
    }

    // 4. Xóa timer cũ (nếu có) để tránh chồng chéo
    clearTimeout(slideTimer);

    // 5. Hẹn giờ chạy tiếp sau 5 giây
    slideTimer = setTimeout(showSlides, 5000); 
}

// --- HÀM HỖ TRỢ: KHI BẤM VÀO CHẤM TRÒN ---
// Gán vào window để HTML có thể gọi được onclick="currentSlide(n)"
window.currentSlide = function(n) {
    const slides = document.querySelectorAll(".slide");
    if (slides.length === 0) return;

    // Gán slideIndex bằng n - 1 (vì showSlides sẽ tự tăng lên 1 ngay sau đó)
    slideIndex = n - 1;

    // Xóa timer đang chạy để nó không tự chuyển ngay lập tức
    clearTimeout(slideTimer);

    // Gọi hàm hiển thị ngay lập tức
    showSlides();
}