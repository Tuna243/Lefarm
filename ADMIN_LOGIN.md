# 🔐 ADMIN AUTHENTICATION - QUICK START

## ✅ Setup hoàn tất!

Hệ thống authentication cho admin panel đã sẵn sàng.

## 🔑 Đăng nhập

**URL:** http://localhost:3000/admin

**Thông tin đăng nhập:**

- **Email:** `nhtuan.job@gmail.com`
- **Password:** `Tuan.24032002`

## 📋 Tính năng

- ✅ Login/Logout bảo mật
- ✅ JWT token authentication (7 ngày)
- ✅ HTTP-only cookies
- ✅ Password hashing (bcrypt)
- ✅ Middleware protection cho tất cả `/admin/*` routes
- ✅ Auto-redirect khi chưa đăng nhập
- ✅ User info trong admin header

## 🚀 Sử dụng

1. Start server: `npm run dev`
2. Truy cập: `http://localhost:3000/admin`
3. Đăng nhập với thông tin trên
4. Đăng xuất: Click avatar → Đăng xuất

## 📁 Files quan trọng

- `lib/auth.ts` - Authentication helpers
- `middleware.ts` - Route protection
- `app/api/auth/*` - Login/Logout APIs
- `app/admin/login/page.tsx` - Login page
- `scripts/seed-admin.ts` - Seed admin user

## 🔧 Reset admin user

```bash
npx tsx scripts/seed-admin.ts
```

## 📖 Tài liệu chi tiết

Xem file: `AUTHENTICATION.md`

---

**Hệ thống đã sẵn sàng! Admin panel giờ đây được bảo vệ hoàn toàn.** 🎉
