-- 1. Tạo Database mới
CREATE DATABASE ERPVietDB;
GO

-- Sử dụng Database vừa tạo
USE ERPVietDB;
GO

-- 2. Tạo bảng Users (Người dùng/Thành viên)
-- Dùng NVARCHAR để lưu tiếng Việt
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1), -- Tự động tăng ID
    FullName NVARCHAR(100) NOT NULL,      -- Tên hiển thị (VD: Nguyễn Văn A)
    Email VARCHAR(100) UNIQUE NOT NULL,   -- Email đăng nhập (Không trùng)
    PasswordHash VARCHAR(255) NOT NULL,   -- Mật khẩu
    PhoneNumber VARCHAR(20),              -- Số điện thoại (Cho Hotline/Liên hệ)
    UserRole VARCHAR(20) DEFAULT 'User',  -- Phân quyền: 'Admin' hoặc 'User'
    CreatedAt DATETIME DEFAULT GETDATE()  -- Ngày tạo (Mặc định là giờ hiện tại)
);
GO

-- 3. Tạo bảng Events (Sự kiện)
-- Dùng cho nút "Tạo Sự Kiện" trên menu
CREATE TABLE Events (
    EventID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,         -- Tên sự kiện
    Description NVARCHAR(MAX),            -- Mô tả chi tiết (MAX cho bài viết dài)
    EventDate DATETIME NOT NULL,          -- Thời gian diễn ra
    Location NVARCHAR(200),               -- Địa điểm (VD: Tòa nhà Tech)
    Capacity INT,                         -- Số lượng chỗ ngồi
    ImageURL VARCHAR(500),                -- Link ảnh banner
    OrganizerID INT,                      -- Ai tạo sự kiện này?
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    -- Liên kết khóa ngoại với bảng Users
    CONSTRAINT FK_Events_User FOREIGN KEY (OrganizerID) REFERENCES Users(UserID)
);
GO

-- 4. Tạo bảng Bookings (Đăng ký tham gia)
-- Lưu dữ liệu khi ai đó bấm "Tham gia ngay"
CREATE TABLE Bookings (
    BookingID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,                  -- Khách hàng nào đặt?
    EventID INT NOT NULL,                 -- Đặt sự kiện nào?
    Quantity INT DEFAULT 1,               -- Số lượng vé
    BookingDate DATETIME DEFAULT GETDATE(), -- Ngày đặt
    Status NVARCHAR(50) DEFAULT 'Confirmed', -- Trạng thái: Đã xác nhận/Hủy
    
    -- Liên kết khóa ngoại
    CONSTRAINT FK_Bookings_User FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Bookings_Event FOREIGN KEY (EventID) REFERENCES Events(EventID)
);
GO

-- =============================================
-- 5. THÊM DỮ LIỆU MẪU (Dùng để test lên web)
-- =============================================

-- Thêm Admin và User mẫu
INSERT INTO Users (FullName, Email, PasswordHash, PhoneNumber, UserRole)
VALUES 
(N'Admin Hệ Thống', 'admin@erpviet.vn', 'password_hash_123', '0706023978', 'Admin'),
(N'Nguyễn Văn Vũ', 'vu662102@gmail.com', 'password_hash_456', '0909123456', 'User');

-- Thêm Sự kiện mẫu (Dựa trên nội dung HTML của bạn)
INSERT INTO Events (Title, Description, EventDate, Location, Capacity, OrganizerID)
VALUES 
(N'Hội thảo Công nghệ ERP 2025', N'Giải pháp quản trị hiệu quả cho doanh nghiệp Việt.', '2025-12-20 08:00:00', N'Tòa nhà Tech, Thuận An', 500, 1),
(N'Kết nối Startup Bình Dương', N'Cơ hội gặp gỡ các nhà đầu tư lớn.', '2025-11-15 14:00:00', N'Trung tâm hội nghị VSIP', 200, 1);

-- Thêm mẫu Đăng ký
INSERT INTO Bookings (UserID, EventID, Quantity)
VALUES (2, 1, 2); -- Ông Vũ đăng ký 2 vé cho sự kiện Hội thảo

-- Kiểm tra kết quả
SELECT * FROM Users;
SELECT * FROM Events;
SELECT * FROM Bookings;