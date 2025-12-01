USE ERPVietDB;
GO

-- =============================================
-- PHẦN 1: DỌN DẸP BẢNG CŨ (Reset lại để tránh lỗi conflict)
-- =============================================
-- Lưu ý: Thứ tự xóa rất quan trọng để không bị lỗi khóa ngoại (Foreign Key)
IF OBJECT_ID('dbo.order_details', 'U') IS NOT NULL DROP TABLE dbo.order_details;
IF OBJECT_ID('dbo.bookings', 'U') IS NOT NULL DROP TABLE dbo.bookings;
IF OBJECT_ID('dbo.orders', 'U') IS NOT NULL DROP TABLE dbo.orders;
IF OBJECT_ID('dbo.products', 'U') IS NOT NULL DROP TABLE dbo.products;
IF OBJECT_ID('dbo.events', 'U') IS NOT NULL DROP TABLE dbo.events;
IF OBJECT_ID('dbo.event_requests', 'U') IS NOT NULL DROP TABLE dbo.event_requests; -- Xóa bảng này để tạo lại mới
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;
GO

-- =============================================
-- PHẦN 2: TẠO CẤU TRÚC BẢNG (SCHEMA)
-- =============================================

-- 1. Bảng USERS (Tài khoản)
CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(255) NOT NULL,    
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 2. Bảng EVENTS (Sự kiện Nghệ thuật)
CREATE TABLE events (
    id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,        
    description NVARCHAR(MAX),  
    date DATETIME NOT NULL,
    location NVARCHAR(255),     
    capacity INT,
    image_url VARCHAR(500),     
    organizer_id INT,            
    FOREIGN KEY (organizer_id) REFERENCES users(id)
);
GO

-- 3. Bảng BOOKINGS (Đặt vé)
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

-- 4. Bảng EVENT_REQUESTS (Sự kiện Công ty)
-- !!! ĐÂY LÀ PHẦN QUAN TRỌNG BẠN CẦN !!!
CREATE TABLE event_requests (
    id INT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(255) NOT NULL,      -- Khớp với schemas.py
    email VARCHAR(255) NOT NULL,           -- Khớp với schemas.py
    topic NVARCHAR(255) NOT NULL,          -- Khớp với schemas.py
    message NVARCHAR(MAX) NOT NULL,        -- Khớp với schemas.py
    status NVARCHAR(50) DEFAULT 'Pending', -- Trạng thái xử lý
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 5. Bảng PRODUCTS (Gói dịch vụ)
CREATE TABLE products (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,    
    price DECIMAL(18, 0),            
    description NVARCHAR(MAX),      
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 6. Bảng ORDERS (Đơn hàng)
CREATE TABLE orders (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,                    
    total_amount DECIMAL(18, 0),    
    status NVARCHAR(50) DEFAULT 'Pending', 
    order_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

-- 7. Bảng ORDER_DETAILS (Chi tiết đơn hàng)
CREATE TABLE order_details (
    id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    price_at_purchase DECIMAL(18, 0), 
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
GO

-- =============================================
-- PHẦN 3: NẠP DỮ LIỆU MẪU (SEED DATA)
-- =============================================

-- Thêm Users
INSERT INTO users (full_name, email, password, phone, role)
VALUES 
(N'Admin Hệ Thống', 'admin@erpviet.vn', '123', '0706023978', 'admin'),
(N'Nguyễn Văn Vũ', 'vu662102@gmail.com', '123', '0909123456', 'user');

-- Thêm Sự kiện mẫu
INSERT INTO events (title, description, date, location, capacity, image_url, organizer_id)
VALUES 
(N'Hội thảo Công nghệ ERP 2025', N'Giải pháp quản trị hiệu quả.', '2025-12-20 08:00:00', N'Tòa nhà Tech, Thuận An', 500, 'assets/img/event1.jpg', 1),
(N'Đại nhạc hội EDM Mùa Hè', N'Sự kiện âm nhạc sôi động.', '2025-07-15 19:00:00', N'Sân vận động Gò Đậu', 5000, 'assets/img/event2.jpg', 1);

-- Thêm Sản phẩm
INSERT INTO products (name, price, description)
VALUES 
(N'Gói Khởi Nghiệp (Starter)', 5000000, N'Dành cho Start-up nhỏ.'),
(N'Gói Chuyên Nghiệp (Pro)', 15000000, N'Dành cho SME.'),
(N'Gói Doanh Nghiệp (Enterprise)', 50000000, N'Không giới hạn.');

-- Thêm dữ liệu test cho Event Request (Để kiểm tra bảng có hoạt động không)
INSERT INTO event_requests (full_name, email, topic, message)
VALUES (N'Khách Hàng Test', 'test@gmail.com', N'Test Hệ Thống', N'Nếu bạn thấy dòng này nghĩa là bảng đã tạo thành công.');
GO



-- =============================================
-- PHẦN 4: KIỂM TRA KẾT QUẢ
-- =============================================
SELECT * FROM users;
SELECT * FROM events;
SELECT * FROM event_requests;
SELECT * FROM orders;