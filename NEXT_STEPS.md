# 🎯 NEXT STEPS - Lefarm

## ⚡ QUAN TRỌNG - Làm ngay

### 1. Cấu hình Cloudinary (5 phút)

```
1. Vào https://cloudinary.com → Tạo account (hoặc đăng nhập)
2. Dashboard → Sao chép:
   - Cloud Name
   - API Key
   - API Secret
3. Settings → Upload → Tạo Upload Preset:
   - Name: lefarm_products
   - Mode: Unsigned (toggle ON)
   - Folder: lefarm
4. Update .env:
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_key"
   CLOUDINARY_API_SECRET="your_secret"
```

### 2. Khởi tạo Database (5 phút)

```bash
# Option A: Push schema (nhanh)
npx prisma db push

# Option B: Chạy migrations
npx prisma migrate deploy

# Kiểm tra
npx prisma studio
# Mở http://localhost:5555 → Xem tables
```

### 3. Test Local (5 phút)

```bash
# Start server
npm run dev

# Mở browser:
http://localhost:3000             → Home
http://localhost:3000/contact     → Test form
http://localhost:3000/admin       → Dashboard
http://localhost:3000/admin/leads → Xem leads

# Test submit form contact → Kiểm tra admin/leads
```

## 📝 Database hiện tại

Database trên Aiven Cloud đã được configured trong `.env`:

```
DATABASE_URL="postgresql://avnadmin:...@pg-214d7e4c-nhtuan-b778.b.aivencloud.com:15998/defaultdb?sslmode=require"
```

**Cần làm**: Chạy migration để tạo tables

```bash
npx prisma db push
```

Nếu database đã có data cũ, có thể reset:

```bash
npx prisma migrate reset  # Cẩn thận: Xóa tất cả data!
```

## 🖼️ Cloudinary - Cần làm

**Hiện tại**: Chưa có credentials trong `.env`

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""  # Cần điền
CLOUDINARY_API_KEY=""                  # Cần điền
CLOUDINARY_API_SECRET=""               # Cần điền
```

**Sau khi điền**: Upload images sẽ hoạt động

## ✅ Đã hoàn tất

- ✅ Database schema (6 models: User, Product, Project, Lead, Contact, Setting)
- ✅ API routes (/api/products, /api/projects, /api/leads, /api/contacts)
- ✅ Frontend pages (Marketplace, Contact, Projects, Admin)
- ✅ Cloudinary integration code (lib/cloudinary.ts)
- ✅ Documentation (README, guides, quickstart)

## 🚀 Deploy lên Production

### Vercel (Khuyến nghị)

```bash
1. Push code lên GitHub
2. Vercel.com → Import project
3. Add Environment Variables:
   - DATABASE_URL
   - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
4. Deploy
5. Chạy migration:
   npx prisma migrate deploy --url "$PROD_DATABASE_URL"
```

## 📚 Documentation

Đã tạo 5 files hướng dẫn:

1. **README.md** - Tổng quan, features, API docs
2. **QUICKSTART.md** - Bắt đầu nhanh 15 phút
3. **DATABASE_GUIDE.md** - Hướng dẫn Prisma & migrations
4. **CLOUDINARY_GUIDE.md** - Setup Cloudinary chi tiết
5. **CHECKLIST.md** - Checklist setup & deploy đầy đủ

Đọc theo thứ tự:

```
QUICKSTART.md → README.md → Specific guides khi cần
```

## 🔧 Các lệnh thường dùng

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push          # Push schema (khuyến nghị khi dev)
npm run db:migrate       # Tạo migration mới
npm run db:deploy        # Deploy migrations (production)
npm run db:studio        # Prisma Studio UI

# Build
npm run build            # Build production
npm run start            # Start production server
```

## ❗ Troubleshooting

### Database không kết nối

```bash
# Test connection
npx prisma db pull

# Nếu fail: Kiểm tra
- DATABASE_URL đúng không?
- Network/firewall OK?
- Database server running?
```

### Cloudinary upload fail

```bash
# Kiểm tra:
- Cloud Name, API Key đã điền?
- Upload Preset tạo chưa?
- Upload Preset là Unsigned?
```

### Port 3000 đã dùng

```bash
# Kill process
npx kill-port 3000

# Hoặc dùng port khác
npm run dev -- -p 3001
```

## 📞 Support

- Email: contact@lefarm.vn
- Docs: Đọc README.md và guides
- Issues: Tạo issue trên GitHub (nếu có repo)

---

**Priority**:

1. Setup Cloudinary credentials (5 min)
2. Run database migration (5 min)
3. Test locally (5 min)
4. Deploy to Vercel (15 min)

**Total time**: ~30 minutes để có production-ready website!
