<?php include 'config.php'; ?>
<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Trang Chủ - VănVũ</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>

    <div class="top-bar text-end px-5">
        <span class="me-3"><i class="fa-solid fa-phone"></i> Hotline: 0706 02 3978</span>
        
        <span id="user-section"></span>
    </div>

    <nav class="navbar navbar-expand-lg navbar-custom sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.php" style="color: var(--main-purple); font-size: 1.5rem;">
                <i class="fa-brands fa-slack me-2"></i>VănVũ
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainMenu">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse justify-content-center" id="mainMenu">
                <ul class="navbar-nav">
                    <li class="nav-item"><a class="nav-link active" href="index.php">Trang chủ</a></li>
                    <li class="nav-item"><a class="nav-link" href="register.php">Tính năng</a></li>
                    <li class="nav-item"><a class="nav-link" href="pricing.php">Báo giá</a></li>
                    <li class="nav-item"><a class="nav-link" href="events.php">Liên hệ</a></li>
                </ul>
            </div>

            <div class="d-none d-lg-block">
                <a href="events.php" class="btn btn-purple rounded-pill px-4">
                    <i class="fa-solid fa-plus"></i> Tạo Sự Kiện
                </a>
            </div>
        </div>
    </nav>

    <div class="hero-section">
        <div class="container">
            <h1 class="fw-bold">Quản Lý Sự Kiện Chuyên Nghiệp</h1>
            <p class="lead opacity-75">Nền tảng tất cả trong một cho doanh nghiệp</p>
            <div class="mt-4">
                <a href="register.php" class="btn btn-light text-purple fw-bold px-4 py-2 rounded-pill">
                    Khám phá ngay
                </a>
            </div>
        </div>
    </div>

    <div class="container mb-5 text-center">
        <p class="text-muted mb-4 mt-4">Chọn loại hình sự kiện bạn muốn tổ chức:</p>
        <div class="row justify-content-center">
            <div class="col-4 col-md-2 mb-3"><a href="register.php" class="text-decoration-none feature-box d-block"><div class="icon-circle"><i class="fa-solid fa-comments"></i></div><div class="feature-title">Hội nghị</div></a></div>
            <div class="col-4 col-md-2 mb-3"><a href="register.php" class="text-decoration-none feature-box d-block"><div class="icon-circle"><i class="fa-solid fa-desktop"></i></div><div class="feature-title">Online</div></a></div>
            <div class="col-4 col-md-2 mb-3"><a href="register.php" class="text-decoration-none feature-box d-block"><div class="icon-circle"><i class="fa-solid fa-music"></i></div><div class="feature-title">Lễ hội</div></a></div>
            <div class="col-4 col-md-2 mb-3"><a href="register.php" class="text-decoration-none feature-box d-block"><div class="icon-circle"><i class="fa-solid fa-graduation-cap"></i></div><div class="feature-title">Lớp học</div></a></div>
            <div class="col-4 col-md-2 mb-3"><a href="register.php" class="text-decoration-none feature-box d-block"><div class="icon-circle"><i class="fa-solid fa-heart"></i></div><div class="feature-title">Từ thiện</div></a></div>
            <div class="col-4 col-md-2 mb-3"><a href="register.php" class="text-decoration-none feature-box d-block"><div class="icon-circle"><i class="fa-solid fa-martini-glass"></i></div><div class="feature-title">Triển lãm</div></a></div>
        </div>
    </div>

    <hr class="container opacity-25">

    <div class="container py-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold" style="color: var(--main-purple)">
                <i class="fa-solid fa-calendar-day me-2"></i>Sự Kiện Sắp Diễn Ra
            </h3>
            <a href="events.php" class="btn btn-outline-secondary btn-sm">
                <i class="fa-solid fa-plus"></i> Thêm mới
            </a>
        </div>
        <div class="row justify-content-center">
            <div class="col-12">
                <div id="events-container" class="row g-4">
                    <div class="text-center py-5">
                        <div class="spinner-border text-secondary" role="status"></div>
                        <p class="mt-2 text-muted">Đang kết nối máy chủ...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <footer class="bg-light border-top py-4 mt-auto">
        <div class="container text-center text-muted small">
            &copy; 2025 ERPVIET Clone System
        </div>
    </footer>

    <div class="modal fade" id="authChoiceModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-center p-4">
                <div class="modal-header border-0 justify-content-end p-0">
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <h4 class="fw-bold mb-3" style="color: var(--main-purple)">Chào mừng đến với VănVũ</h4>
                    <p class="text-muted mb-4">Bạn đã có tài khoản thành viên chưa?</p>
                    
                    <div class="d-grid gap-3">
                        <a href="login.php" class="btn btn-purple fw-bold py-2">
                            <i class="fa-solid fa-right-to-bracket me-2"></i> TÔI ĐÃ CÓ TÀI KHOẢN
                        </a>

                        <a href="nava.php" class="btn btn-outline-secondary fw-bold py-2">
                            <i class="fa-solid fa-user-plus me-2"></i> TÔI CHƯA CÓ, ĐĂNG KÝ MỚI
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="assets/scripts/app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>