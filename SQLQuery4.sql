USE ERPVietDB;
GO

-- =============================================
-- PHẦN 1: DỌN DẸP BẢNG CŨ (Xóa theo thứ tự để tránh lỗi khóa ngoại)
-- =============================================
-- Xóa bảng con (Chi tiết & Booking) trước
IF OBJECT_ID('dbo.order_details', 'U') IS NOT NULL DROP TABLE dbo.order_details;
IF OBJECT_ID('dbo.bookings', 'U') IS NOT NULL DROP TABLE dbo.bookings;

-- Xóa bảng trung gian (Đơn hàng, Sản phẩm, Sự kiện)
IF OBJECT_ID('dbo.orders', 'U') IS NOT NULL DROP TABLE dbo.orders;
IF OBJECT_ID('dbo.products', 'U') IS NOT NULL DROP TABLE dbo.products;
IF OBJECT_ID('dbo.events', 'U') IS NOT NULL DROP TABLE dbo.events;
IF OBJECT_ID('dbo.event_requests', 'U') IS NOT NULL DROP TABLE dbo.event_requests;

-- Xóa bảng cha (User) cuối cùng
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;
GO

-- =============================================
-- PHẦN 2: TẠO CẤU TRÚC BẢNG (SCHEMA)
-- =============================================

-- 1. Bảng USERS (Tài khoản)
CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(255),    
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user', -- 'admin' hoặc 'user'
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 2. Bảng EVENTS (Sự kiện Nghệ thuật - Có bán vé)
CREATE TABLE events (
    id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255),        
    description NVARCHAR(MAX),  
    date DATETIME,
    location NVARCHAR(255),     
    capacity INT,
    image_url VARCHAR(500),     -- Link ảnh banner
    organizer_id INT,           -- Người tạo sự kiện
    FOREIGN KEY (organizer_id) REFERENCES users(id)
);
GO

-- 3. Bảng BOOKINGS (Lưu vé đã đặt của User)
CREATE TABLE bookings (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    event_id INT,
    quantity INT DEFAULT 1,
    booking_date DATETIME DEFAULT GETDATE(),
    status VARCHAR(50) DEFAULT 'confirmed',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);
GO

-- 4. Bảng EVENT_REQUESTS (Sự kiện Công ty - Form liên hệ tư vấn)
CREATE TABLE event_requests (
    id INT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(255),      -- Người liên hệ
    email VARCHAR(255),           -- Email công ty
    topic NVARCHAR(255),          -- Chủ đề sự kiện
    message NVARCHAR(MAX),        -- Nội dung yêu cầu
    status NVARCHAR(50) DEFAULT 'Pending', -- Pending (Chờ), Contacted (Đã gọi)
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 5. Bảng PRODUCTS (Các gói dịch vụ bên trang Báo giá)
CREATE TABLE products (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,    -- Tên gói (VD: Gói Pro)
    price DECIMAL(18, 0),           -- Giá tiền
    description NVARCHAR(MAX),      -- Mô tả
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 6. Bảng ORDERS (Đơn hàng mua gói dịch vụ)
CREATE TABLE orders (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,                    -- Ai mua
    total_amount DECIMAL(18, 0),    -- Tổng tiền
    status NVARCHAR(50) DEFAULT 'Pending', -- Paid (Đã thanh toán), Pending (Chờ)
    order_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

-- 7. Bảng ORDER_DETAILS (Chi tiết đơn hàng mua gì)
CREATE TABLE order_details (
    id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    price_at_purchase DECIMAL(18, 0), -- Giá tại thời điểm mua
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
GO

-- =============================================
-- PHẦN 3: NẠP DỮ LIỆU MẪU (SEED DATA)
-- =============================================

-- 1. Thêm Users
INSERT INTO users (full_name, email, password, phone, role, created_at)
VALUES 
(N'Admin Hệ Thống', 'admin@erpviet.vn', '123', '0706023978', 'admin', GETDATE()),
(N'Nguyễn Văn Vũ', 'vu662102@gmail.com', '123', '0909123456', 'user', GETDATE());

-- 2. Thêm Sự kiện mẫu
INSERT INTO events (title, description, date, location, capacity, image_url, organizer_id)
VALUES 
(N'Hội thảo Công nghệ ERP 2025', N'Giải pháp quản trị hiệu quả cho doanh nghiệp Việt.', '2025-12-20 08:00:00', N'Tòa nhà Tech, Thuận An', 500, 'assets/img/event1.jpg', 1),
(N'Đại nhạc hội EDM Mùa Hè', N'Sự kiện âm nhạc sôi động nhất năm.', '2025-07-15 19:00:00', N'Sân vận động Gò Đậu', 5000, 'assets/img/event2.jpg', 1);

-- 3. Thêm Vé đã đặt (Booking)
INSERT INTO bookings (user_id, event_id, quantity, booking_date, status)
VALUES (2, 1, 2, GETDATE(), 'confirmed');

-- 4. Thêm Yêu cầu tư vấn (Sự kiện công ty)
INSERT INTO event_requests (full_name, email, topic, message, status)
VALUES (N'Trần Văn Giám Đốc', 'boss@congtyABC.com', N'Tiệc tất niên công ty', N'Quy mô 200 khách, cần báo giá trọn gói.', 'Pending');

-- 5. Thêm Sản phẩm (Gói dịch vụ)
INSERT INTO products (name, price, description)
VALUES 
(N'Gói Khởi Nghiệp (Starter)', 5000000, N'Dành cho Start-up nhỏ, tối đa 5 user.'),
(N'Gói Chuyên Nghiệp (Pro)', 15000000, N'Dành cho SME, tối đa 50 user, full tính năng.'),
(N'Gói Doanh Nghiệp (Enterprise)', 50000000, N'Không giới hạn, Server riêng.');

-- 6. Thêm Đơn hàng mẫu (Ông Vũ mua gói Pro)
INSERT INTO orders (user_id, total_amount, status, order_date)
VALUES (2, 15000000, 'Paid', GETDATE());

-- 7. Thêm Chi tiết đơn hàng (Mua 1 gói Pro)
INSERT INTO order_details (order_id, product_id, quantity, price_at_purchase)
VALUES (1, 2, 1, 15000000);

-- =============================================
-- PHẦN 4: KIỂM TRA KẾT QUẢ
-- =============================================
SELECT * FROM users;
SELECT * FROM events;
SELECT * FROM event_requests;
SELECT * FROM orders;