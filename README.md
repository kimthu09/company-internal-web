# Hướng dẫn cài đặt và chạy ứng dụng

## Backend

### Tạo database (Đối với lần đầu chạy Backend)

1. **Bước 1:** Tải và cài đặt MySQL Workbench từ trang chủ của MySQL.
2. **Bước 2:** Tạo kết nối:
   - Username: root
   - Password: 123456
3. **Bước 3:** Sử dụng kết nối vừa tạo, chạy file `database.sql` để tạo cơ sở dữ liệu và bảng.

### Chạy Backend
**Chú ý:** Cần thiết lập môi trường Java trước khi chạy

#### Cách 1: Sử dụng các IDE hỗ trợ (IntelliJ IDEA)

1. Mở project Backend bằng IntelliJ IDEA.
2. Chạy ứng dụng từ IDE bằng cách nhấn nút "Run" hoặc "Debug".

#### Cách 2: Sử dụng command

1. Mở terminal hoặc command prompt.
2. Di chuyển vào thư mục chứa mã nguồn của Backend.
3. Chạy lệnh sau để build và chạy ứng dụng:

   ```bash
   ./mvnw spring-boot:run
   ```

#### Link Swagger (API doc)
Truy cập địa chỉ sau để xem API documentation:
http://localhost:8080/swagger-ui/index.html

## Frontend

### Import các thư viện cần thiết

   ```bash
   npm install
   ```

### Build ứng dụng

   ```bash
   npm run build
   ```

### Chạy ứng dụng

   ```bash
   npm start
   ```

Truy cập địa chỉ sau để sử dụng frontend:
http://localhost:80