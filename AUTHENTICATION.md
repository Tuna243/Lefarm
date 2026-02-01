# 🔐 Authentication System - LEFARM Admin Panel

## ✅ Đã hoàn thành

Hệ thống xác thực quản trị viên đã được triển khai đầy đủ với các tính năng sau:

### 🎯 Tính năng

1. **Đăng nhập bảo mật**
   - Email + Password authentication
   - Password được hash bằng bcrypt
   - JWT token với thời hạn 7 ngày
   - HTTP-only cookies (bảo vệ khỏi XSS)

2. **Bảo vệ Admin Routes**
   - Middleware tự động kiểm tra authentication
   - Redirect về `/admin/login` nếu chưa đăng nhập
   - Verify JWT token trên mọi request

3. **Quản lý Session**
   - Logout functionality
   - Auto-redirect sau khi đăng xuất
   - Clear cookies an toàn

---

## 🔑 Thông tin đăng nhập

**Email:** `nhtuan.job@gmail.com`  
**Password:** `Tuan.24032002`

---

## 📂 Cấu trúc Files

### 1. **Authentication Library**

**File:** `lib/auth.ts`

Chứa các functions:

- `generateToken()` - Tạo JWT token
- `verifyToken()` - Verify JWT token
- `hashPassword()` - Hash password với bcrypt
- `comparePassword()` - So sánh password

### 2. **API Routes**

#### `app/api/auth/login/route.ts`

- POST endpoint để đăng nhập
- Verify email + password
- Tạo JWT token và set cookie
- Trả về thông tin user

#### `app/api/auth/logout/route.ts`

- POST endpoint để đăng xuất
- Clear auth-token cookie

#### `app/api/auth/me/route.ts`

- GET endpoint để lấy thông tin user hiện tại
- Verify JWT token từ cookie
- Trả về user info

### 3. **Middleware**

**File:** `middleware.ts`

- Protect tất cả routes `/admin/*` (trừ `/admin/login`)
- Kiểm tra JWT token trong cookie
- Auto-redirect nếu không có token hoặc token invalid

### 4. **Login Page**

**File:** `app/admin/login/page.tsx`

- Form đăng nhập với email & password
- Loading state
- Error handling
- Responsive design với logo Lefarm

**Layout:** `app/admin/login/layout.tsx`

- Layout riêng không có sidebar/header

### 5. **Admin Header Update**

**File:** `components/admin/header.tsx`

- Hiển thị thông tin user (email, name)
- Logout button
- Avatar với initial letter
- Dropdown menu

### 6. **Seed Script**

**File:** `scripts/seed-admin.ts`

- Script để tạo admin user
- Hash password trước khi lưu vào DB
- Check và update nếu user đã tồn tại

---

## 🚀 Sử dụng

### Đăng nhập Admin Panel

1. Truy cập: `http://localhost:3000/admin`
2. Tự động redirect về `/admin/login`
3. Nhập thông tin đăng nhập:
   - Email: `nhtuan.job@gmail.com`
   - Password: `Tuan.24032002`
4. Click "Đăng nhập"
5. Redirect về `/admin` dashboard

### Đăng xuất

1. Click vào avatar góc phải
2. Click "Đăng xuất"
3. Redirect về `/admin/login`

---

## 🔒 Bảo mật

### Đã implement:

✅ Password hashing với bcrypt (salt rounds: 10)  
✅ JWT token với expiration (7 ngày)  
✅ HTTP-only cookies (không thể truy cập từ JavaScript)  
✅ Secure cookies trong production  
✅ SameSite: lax (bảo vệ CSRF)  
✅ Token verification trên mỗi request  
✅ Middleware protection cho admin routes

### Environment Variables:

```env
JWT_SECRET="lefarm-khanhhoa-secret-key-2026-change-in-production"
```

⚠️ **Lưu ý:** Thay đổi `JWT_SECRET` thành giá trị ngẫu nhiên mạnh trước khi deploy production!

---

## 📊 Database Schema

**Model:** `User` (đã có sẵn trong schema.prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed password
  name      String
  role      String   @default("admin")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}
```

---

## 🛠️ Các lệnh hữu ích

### Tạo admin user mới:

```bash
npx tsx scripts/seed-admin.ts
```

### Update password cho user hiện tại:

Script sẽ tự động update nếu email đã tồn tại

---

## 🔄 Luồng Authentication

### Login Flow:

```
1. User nhập email + password → /admin/login
2. Submit form → POST /api/auth/login
3. Verify credentials với database (Prisma)
4. Hash password comparison (bcrypt)
5. Generate JWT token (jose)
6. Set HTTP-only cookie
7. Return user info
8. Redirect to /admin
```

### Route Protection Flow:

```
1. User truy cập /admin/*
2. Middleware intercept request
3. Check auth-token cookie
4. Verify JWT token
5. If valid → Allow access
6. If invalid → Redirect to /admin/login
```

### Logout Flow:

```
1. User click logout button
2. POST /api/auth/logout
3. Clear auth-token cookie
4. Redirect to /admin/login
```

---

## 🎨 UI Components

### Login Page Features:

- ✅ Lefarm logo
- ✅ Responsive design
- ✅ Email & Password inputs with icons
- ✅ Loading state
- ✅ Error alerts
- ✅ Green theme matching Lefarm brand

### Admin Header Features:

- ✅ User avatar with initials
- ✅ Display user name & email
- ✅ Logout button
- ✅ Dropdown menu

---

## 📝 Testing

### Test Login:

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/admin`
3. Should redirect to `/admin/login`
4. Login with credentials
5. Should redirect to `/admin` dashboard

### Test Logout:

1. Click avatar in admin header
2. Click "Đăng xuất"
3. Should clear cookie and redirect to login

### Test Protection:

1. Logout completely
2. Try to access `http://localhost:3000/admin/products`
3. Should auto-redirect to `/admin/login`

---

## 🐛 Troubleshooting

### "Email hoặc mật khẩu không đúng"

- Kiểm tra email chính xác: `nhtuan.job@gmail.com`
- Kiểm tra password: `Tuan.24032002` (có chữ hoa và chữ thường)
- Chạy lại seed script nếu cần

### Token không hợp lệ

- Check `JWT_SECRET` trong .env
- Clear cookies trong browser
- Login lại

### Middleware không hoạt động

- Restart dev server
- Check middleware.ts config matcher
- Verify token generation

---

## 🔮 Future Improvements

- [ ] Remember me functionality
- [ ] Password reset via email
- [ ] Two-factor authentication (2FA)
- [ ] Session management dashboard
- [ ] Role-based access control (RBAC)
- [ ] Activity logs
- [ ] Multiple admin users
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts
- [ ] Email verification

---

## ✅ Summary

Hệ thống authentication đã sẵn sàng sử dụng! Admin panel giờ đây được bảo vệ hoàn toàn với:

- 🔐 Login bảo mật
- 🛡️ Route protection
- 🚪 Logout functionality
- 🔑 JWT token authentication
- 🍪 Secure HTTP-only cookies
- 👤 User session management

**Tất cả admin routes giờ đây yêu cầu authentication trước khi truy cập!**
