<?php include 'config.php'; ?>
<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <title>Tạo Tài Khoản  - Văn Vũ</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body class="page-login"> <div class="login-wrapper">
        <div class="card-custom text-center">
            <h2 class="fw-bold mb-4" style="color: var(--main-purple);">
                <i class="fa-brands fa-slack"></i> Văn Vũ 
            </h2>
            <h5 class="mb-3 text-muted">Đăng ký tài khoản mới</h5>
            
            <form id="registerForm">
                
                <div class="mb-3 text-start">
                    <label class="form-label fw-bold small">Họ và tên</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light"><i class="fa-solid fa-user"></i></span>
                        <input type="text" id="regName" class="form-control" placeholder="Ví dụ: Nguyễn Văn A" required>
                    </div>
                </div>

                <div class="mb-3 text-start">
                    <label class="form-label fw-bold small">Email</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light"><i class="fa-solid fa-envelope"></i></span>
                        <input type="email" id="regEmail" class="form-control" placeholder="email@example.com" required>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3 text-start">
                        <label class="form-label fw-bold small">Mật khẩu</label>
                        <input type="password" id="regPassword" class="form-control" required>
                    </div>
                    <div class="col-md-6 mb-3 text-start">
                        <label class="form-label fw-bold small">Nhập lại MK</label>
                        <input type="password" id="regRePassword" class="form-control" required>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-purple w-100 py-2 fw-bold text-uppercase">
                    <i class="fa-solid fa-user-plus me-2"></i> Đăng Ký Ngay
                </button>
                
                <p id="regStatus" class="mt-3 small fw-bold"></p>
            </form>
            
            <hr>

            <div class="mb-3">
                <span class="text-muted small">Đã có tài khoản?</span>
                <a href="login.php" class="fw-bold text-decoration-none" style="color: var(--main-purple);">
                    Đăng nhập tại đây
                </a>
            </div>

            <a href="index.php" class="text-decoration-none small text-secondary">
                <i class="fa-solid fa-arrow-left"></i> Về trang chủ
            </a>
        </div>
    </div>

    <script src="assets/scripts/app.js"></script>
</body>
</html>