<?php include 'config.php'; ?>
<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <title>Kho Ứng Dụng - ERPVIET</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body style="background-color: #f8f9fa;"> <nav class="navbar navbar-expand-lg navbar-custom sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.php" style="color: var(--main-purple); font-size: 1.5rem;">
                <i class="fa-brands fa-slack me-2"></i>VănVũ
            </a>
            <div class="collapse navbar-collapse justify-content-center">
                <ul class="navbar-nav">
                    <li class="nav-item"><a class="nav-link" href="index.php">Trang chủ</a></li>
                    <li class="nav-item"><a class="nav-link active" href="register.php">Tính năng</a></li>
                    <li class="nav-item"><a class="nav-link" href="pricing.php">Báo giá</a></li>
                    <li class="nav-item"><a class="nav-link" href="events.php">Liên hệ</a></li>
                </ul>
            </div>
            <a href="login.php" class="btn btn-outline-secondary btn-sm">Đăng Nhập</a>
        </div>
    </nav>

    <div class="feature-hero">
        <div class="container">
            <h1 class="fw-bold">Kho Ứng Dụng Doanh Nghiệp</h1>
            <p class="lead opacity-75">Hệ sinh thái toàn diện quản lý mọi hoạt động của bạn</p>
            <div class="d-flex justify-content-center mt-4">
                <div class="input-group w-50" style="min-width: 300px;">
                    <span class="input-group-text border-0"><i class="fa-solid fa-search"></i></span>
                    <input type="text" class="form-control border-0 py-2" placeholder="Tìm kiếm ứng dụng (VD: CRM, Kế toán...)" style="box-shadow: none;">
                    <button class="btn btn-light fw-bold text-dark">Tìm kiếm</button>
                </div>
            </div>
        </div>
    </div>

    <div class="container pb-5">

        <div class="category-title text-primary">
            <i class="fa-solid fa-chart-pie"></i> Bán Hàng & CRM
        </div>
        <div class="row g-4">
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-blue"><i class="fa-solid fa-handshake"></i></div>
                    <h5>CRM</h5>
                    <p>Theo dõi khách hàng tiềm năng và chốt đơn nhanh chóng.</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-blue"><i class="fa-solid fa-cash-register"></i></div>
                    <h5>Điểm Bán Lẻ (POS)</h5>
                    <p>Giao diện bán hàng tại quầy, đồng bộ tồn kho tức thì.</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-blue"><i class="fa-solid fa-globe"></i></div>
                    <h5>Website TMĐT</h5>
                    <p>Xây dựng cửa hàng Online chuyên nghiệp không cần code.</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-blue"><i class="fa-solid fa-calendar-check"></i></div>
                    <h5>Cho Thuê</h5>
                    <p>Quản lý lịch thuê và hợp đồng tài sản.</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
        </div>

        <div class="category-title text-warning" style="color: #fd7e14 !important;">
            <i class="fa-solid fa-file-invoice-dollar"></i> Tài Chính
        </div>
        <div class="row g-4">
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-orange"><i class="fa-solid fa-calculator"></i></div>
                    <h5>Kế Toán</h5>
                    <p>Hệ thống sổ sách kép, báo cáo thuế tự động.</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-orange"><i class="fa-solid fa-file-invoice"></i></div>
                    <h5>Hóa Đơn</h5>
                    <p>Tạo hóa đơn chuyên nghiệp và gửi qua Email/Zalo.</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-orange"><i class="fa-solid fa-receipt"></i></div>
                    <h5>Chi Phí</h5>
                    <p>Quản lý chi tiêu nhân viên và phê duyệt ngân sách.</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
        </div>

        <div class="category-title text-danger">
            <i class="fa-solid fa-warehouse"></i> Kho & Sản Xuất
        </div>
        <div class="row g-4">
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-red"><i class="fa-solid fa-boxes-stacked"></i></div>
                    <h5>Kho Hàng</h5>
                    <p>Quản lý nhập xuất tồn, đa kho, mã vạch.</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-red"><i class="fa-solid fa-industry"></i></div>
                    <h5>Sản Xuất (MRP)</h5>
                    <p>Lập kế hoạch sản xuất, định mức nguyên vật liệu (BOM).</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-red"><i class="fa-solid fa-truck-fast"></i></div>
                    <h5>Mua Hàng</h5>
                    <p>Quản lý nhà cung cấp và đề nghị mua hàng.</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
        </div>
        
        <div class="category-title text-success">
            <i class="fa-solid fa-users"></i> Nhân Sự (HR)
        </div>
        <div class="row g-4">
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-green"><i class="fa-solid fa-id-card"></i></div>
                    <h5>Nhân Viên</h5>
                    <p>Hồ sơ nhân sự tập trung và quản lý hợp đồng.</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
            <div class="col-md-6 col-lg-3">
                <a href="#" class="app-card">
                    <div class="app-icon-box bg-gradient-green"><i class="fa-solid fa-user-clock"></i></div>
                    <h5>Chấm Công</h5>
                    <p>Theo dõi ngày công, tăng ca và nghỉ phép.</p>
                    <div class="btn-install">Chi tiết <i class="fa-solid fa-arrow-right ms-1"></i></div>
                </a>
            </div>
        </div>

    </div>

    <footer class="text-center py-4 bg-white text-muted small border-top mt-5">
        &copy; 2025 ERPVIET Ecosystem
    </footer>

    <script src="assets/scripts/app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>