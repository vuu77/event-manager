<?php include 'config.php'; ?>
<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <title>Báo Giá - VănVũ</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">

</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-custom sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.php" style="color: var(--main-purple); font-size: 1.5rem;">
                <i class="fa-brands fa-slack me-2"></i>VănVũ
            </a>
            <div class="collapse navbar-collapse justify-content-center">
                <ul class="navbar-nav">
                    <li class="nav-item"><a class="nav-link" href="index.php">Trang chủ</a></li>
                    <li class="nav-item"><a class="nav-link" href="register.php">Tính năng</a></li>
                    <li class="nav-item"><a class="nav-link active" href="pricing.php">Báo giá</a></li>
                     <li class="nav-item"><a class="nav-link" href="events.php">Liên hệ</a></li>
                </ul>
            </div>
            <a href="login.php" class="btn btn-outline-secondary btn-sm">Đăng Nhập</a>
        </div>
    </nav>

    <div class="pricing-hero">
        <div class="container">
            <h2>Báo giá phần mềm quản trị doanh nghiệp</h2>
            <p class="mb-0 opacity-75">Hơn 60 ứng dụng cốt lõi và 20.000 ứng dụng tùy chỉnh</p>
        </div>
    </div>

    <div class="container mt-5 mb-5">
        <div class="row">
            
            <div class="col-lg-8">
                
                <h4 class="mb-3">Chọn số lượng người dùng</h4>
                <div class="price-input-group mb-5">
                    <input type="number" id="userCount" class="form-control text-center fw-bold" value="10" min="1" style="width: 100px; font-size: 1.2rem;">
                    <span class="fw-bold">Người dùng</span>
                    <span class="ms-auto text-muted"><strong id="pricePerUser">125.000</strong> đ/người dùng/tháng</span>
                </div>

                <h4 class="mb-4">Chọn ứng dụng của bạn</h4>

                <div class="app-category-title">Công cụ</div>
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="app-card selected" onclick="toggleApp(this, 0)">
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-comments app-icon text-primary"></i>
                                <div>
                                    <div class="fw-bold">Thảo luận</div>
                                    <div class="small text-muted">Miễn phí</div>
                                </div>
                            </div>
                            <div class="check-circle"></div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="app-card selected" onclick="toggleApp(this, 0)">
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-calendar-days app-icon text-warning"></i>
                                <div>
                                    <div class="fw-bold">Lịch</div>
                                    <div class="small text-muted">Miễn phí</div>
                                </div>
                            </div>
                            <div class="check-circle"></div>
                        </div>
                    </div>
                </div>

                <div class="app-category-title">Bán hàng</div>
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="app-card" onclick="toggleApp(this, 198000)">
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-handshake app-icon text-info"></i>
                                <div>
                                    <div class="fw-bold">CRM</div>
                                    <div class="small text-muted">198.000 đ/tháng</div>
                                </div>
                            </div>
                            <div class="check-circle"></div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="app-card" onclick="toggleApp(this, 99000)">
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-cart-shopping app-icon text-success"></i>
                                <div>
                                    <div class="fw-bold">Bán hàng</div>
                                    <div class="small text-muted">99.000 đ/tháng</div>
                                </div>
                            </div>
                            <div class="check-circle"></div>
                        </div>
                    </div>
                </div>

                <div class="app-category-title">Quản lý kho & Sản xuất</div>
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="app-card" onclick="toggleApp(this, 297000)">
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-warehouse app-icon text-danger"></i>
                                <div>
                                    <div class="fw-bold">Quản lý kho</div>
                                    <div class="small text-muted">297.000 đ/tháng</div>
                                </div>
                            </div>
                            <div class="check-circle"></div>
                        </div>
                    </div>
                </div>

                <h4 class="mt-5 mb-3">Bảng giá dịch vụ triển khai</h4>
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="table-light">
                            <tr>
                                <th>STT</th>
                                <th>Dịch vụ</th>
                                <th>ĐVT</th>
                                <th>Đơn giá</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Tư vấn trực tiếp</td>
                                <td>Giờ</td>
                                <td>680.000</td>
                                <td>Tư vấn tại văn phòng khách hàng</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Tư vấn Online</td>
                                <td>Giờ</td>
                                <td>500.000</td>
                                <td>Qua Zoom, Zalo, Teamviewer</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Triển khai hệ thống</td>
                                <td>Giờ</td>
                                <td>480.000</td>
                                <td>Cài đặt, cấu hình ban đầu</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="summary-box">
                    <div class="d-flex justify-content-center mb-3">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-secondary active">Hàng năm</button>
                            <button type="button" class="btn btn-outline-secondary">Hàng tháng</button>
                        </div>
                    </div>
                    <hr>
                    <div class="summary-row">
                        <span id="displayUserCount">10 Người dùng</span>
                        <span class="fw-bold" id="totalUserPrice">1.250.000 đ</span>
                    </div>
                    <div class="summary-row">
                        <span>Ứng dụng chọn thêm</span>
                        <span class="fw-bold" id="totalAppPrice">0 đ</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span>Tổng / tháng</span>
                        <span class="total-price" id="finalMonthlyPrice">1.250.000 đ</span>
                    </div>
                    <div class="text-end text-muted small mb-4">
                        Tổng hàng năm: <strong id="finalYearlyPrice">15.000.000 đ</strong>
                    </div>
                    <button class="btn-register">ĐĂNG KÝ NGAY</button>
                    <div class="text-center mt-3 text-muted small">
                        Dự tính chi phí triển khai: <span class="text-danger fw-bold">0 đ</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="frontend/assets/scripts/app.js"></script>

</body>
</html>