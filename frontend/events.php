<?php
include 'config.php';
$message = '';
$msg_type = '';

// XỬ LÝ KHI BẤM NÚT LƯU
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $location = $_POST['location'] ?? '';
    $date = $_POST['date'] ?? date('Y-m-d');
    
    // --- LẤY THÊM 2 TRƯỜNG MỚI ---
    $capacity = $_POST['capacity'] ?? 100; // Mặc định 100 vé
    $performers = $_POST['performers'] ?? 'Đang cập nhật';

    // Đóng gói dữ liệu gửi sang Python
    $payload = json_encode([
        'title' => $title,
        'description' => $description,
        'location' => $location,
        'date' => $date,
        'capacity' => $capacity,     // Gửi số vé
        'performers' => $performers  // Gửi tên ca sĩ
    ]);
    
    // Gửi bằng cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, API_URL . '/events');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    if ($curl_error) {
        $msg_type = 'danger';
        $message = '❌ Lỗi kết nối tới Backend Python: ' . $curl_error;
    } elseif ($http_code == 200 || $http_code == 201) {
        $msg_type = 'success';
        $message = '✅ Đã tạo sự kiện thành công!';
    } else {
        $msg_type = 'danger';
        $message = '❌ Lỗi Server: ' . $response;
    }
}
?>

<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <title>Tạo Sự Kiện - ERPVIET</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body style="background-color: #f4f6f9;">

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-custom mb-4 sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.php" style="color: var(--main-purple);">
                <i class="fa-brands fa-slack me-2"></i>ERPVIET
            </a>
            <a href="index.php" class="btn btn-outline-secondary btn-sm">
                <i class="fa-solid fa-house me-1"></i> Về Trang Chủ
            </a>
        </div>
    </nav>

    <div class="container pb-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                
                <!-- THÔNG BÁO KẾT QUẢ -->
                <?php if ($message): ?>
                    <div class="alert alert-<?php echo $msg_type; ?> shadow-sm">
                        <?php echo $message; ?>
                    </div>
                <?php endif; ?>

                <!-- FORM NHẬP LIỆU -->
                <div class="card-custom">
                    <h4 class="text-center mb-4 fw-bold" style="color: var(--main-purple)">
                        <i class="fa-solid fa-calendar-plus me-2"></i>Thêm Sự Kiện Mới
                    </h4>
                    
                    <form method="post">
                        <!-- Tên sự kiện -->
                        <div class="mb-3">
                            <label class="fw-bold small text-muted">Tên sự kiện <span class="text-danger">*</span></label>
                            <input type="text" name="title" class="form-control" placeholder="Ví dụ: Đại nhạc hội Mùa Hè" required>
                        </div>

                        <!-- Hàng 1: Địa điểm & Ngày -->
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="fw-bold small text-muted">Địa điểm</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light"><i class="fa-solid fa-location-dot"></i></span>
                                    <input type="text" name="location" class="form-control" placeholder="Nhập địa điểm...">
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="fw-bold small text-muted">Ngày tổ chức</label>
                                <input type="date" name="date" class="form-control" value="<?php echo date('Y-m-d'); ?>">
                            </div>
                        </div>

                        <!-- Hàng 2: Số vé & Ca sĩ (MỚI) -->
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="fw-bold small text-muted">Số lượng vé phát hành</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light"><i class="fa-solid fa-ticket"></i></span>
                                    <input type="number" name="capacity" class="form-control" value="100">
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="fw-bold small text-muted">Ca sĩ / Khách mời</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light"><i class="fa-solid fa-microphone"></i></span>
                                    <input type="text" name="performers" class="form-control" placeholder="VD: Sơn Tùng, Đen Vâu...">
                                </div>
                            </div>
                        </div>

                        <!-- Mô tả -->
                        <div class="mb-4">
                            <label class="fw-bold small text-muted">Mô tả chi tiết</label>
                            <textarea name="description" class="form-control" rows="5" placeholder="Nhập nội dung sự kiện..."></textarea>
                        </div>

                        <!-- Nút Lưu -->
                        <button type="submit" class="btn btn-purple w-100 fw-bold py-2 text-uppercase">
                            <i class="fa-solid fa-save me-2"></i> Lưu Sự Kiện
                        </button>
                    </form>
                </div>

            </div>
        </div>
    </div>

</body>
</html>