<?php include 'config.php'; ?>
<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <title>Chi Tiết Sự Kiện - ERPVIET</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-custom sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.php" style="color: var(--main-purple); font-size: 1.5rem;">
                <i class="fa-brands fa-slack me-2"></i>ERPVIET
            </a>
            <a href="index.php" class="btn btn-outline-secondary btn-sm">
                <i class="fa-solid fa-arrow-left"></i> Quay lại
            </a>
        </div>
    </nav>

    <div style="background: #eee; height: 300px; position: relative; overflow: hidden;">
        <img src="https://source.unsplash.com/1600x900/?concert,conference" class="w-100 h-100" style="object-fit: cover; opacity: 0.8;">
        <div class="position-absolute bottom-0 start-0 w-100 p-4" style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
            <div class="container text-white">
                <span class="badge bg-warning text-dark mb-2">Sắp diễn ra</span>
                <h1 class="fw-bold" id="detailTitle">Đang tải tên sự kiện...</h1>
                <p class="mb-0"><i class="fa-solid fa-location-dot me-2"></i> <span id="detailLocation">...</span></p>
            </div>
        </div>
    </div>

    <div class="container py-5">
        <div class="row">
            
            <div class="col-lg-8">
                <h4 class="fw-bold text-purple mb-3"><i class="fa-solid fa-circle-info me-2"></i>Giới thiệu sự kiện</h4>
                <p id="detailDescription" class="text-muted" style="line-height: 1.8;">Đang tải nội dung...</p>

                <hr class="my-5">

                <h4 class="fw-bold text-purple mb-4"><i class="fa-solid fa-microphone-lines me-2"></i>Nghệ sĩ & Diễn giả</h4>
                <div class="row g-3" id="performersContainer">
                    </div>
            </div>

            <div class="col-lg-4">
                <div class="card-custom sticky-top" style="top: 100px;">
                    <h5 class="fw-bold mb-4">Thông tin vé</h5>
                    
                    <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
                        <span class="text-muted">Ngày tổ chức:</span>
                        <span class="fw-bold" id="detailDate">...</span>
                    </div>

                    <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
                        <span class="text-muted">Tổng số vé:</span>
                        <span class="fw-bold" id="detailCapacity">0</span>
                    </div>

                    <div class="d-flex justify-content-between mb-4">
                        <span class="text-muted">Trạng thái:</span>
                        <span class="text-success fw-bold">Đang mở bán</span>
                    </div>

                    <button class="btn btn-purple w-100 py-2 fw-bold text-uppercase mb-2">
                        <i class="fa-solid fa-ticket me-2"></i> Đặt vé ngay
                    </button>
                    <p class="text-center small text-muted">Cam kết hoàn tiền trong 24h</p>
                </div>
            </div>
        </div>
    </div>

    <footer class="text-center py-4 bg-light mt-5 border-top">
        &copy; 2025 ERPVIET Events
    </footer>

    <script src="assets/scripts/app.js"></script>
</body>
</html>