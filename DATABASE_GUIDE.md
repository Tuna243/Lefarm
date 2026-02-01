# Database Migration Guide - PostgreSQL Lefarm

## 📊 Tổng quan Database

Lefarm sử dụng **PostgreSQL** (hosted trên Aiven Cloud) với **Prisma ORM**.

Các bảng chính:

- `User` - Admin users
- `Product` - Sản phẩm/Dịch vụ
- `Project` - Dự án/Portfolio
- `Lead` - Yêu cầu liên hệ từ khách hàng
- `Contact` - Thông tin liên hệ công ty
- `Setting` - Cấu hình website

## 🔌 Connection String

Database được cấu hình trong `.env`:

```env
DATABASE_URL="postgresql://avnadmin:PASSWORD@pg-xxx.b.aivencloud.com:15998/defaultdb?sslmode=require"
DIRECT_URL="postgresql://avnadmin:PASSWORD@pg-xxx.b.aivencloud.com:15998/defaultdb?sslmode=require"
```

**Lưu ý**:

- Sử dụng `DIRECT_URL` cho migrations (avoid connection pooling issues)
- `sslmode=require` là bắt buộc cho Aiven

## 🚀 Khởi tạo Database (Lần đầu)

### Bước 1: Cài Prisma

```bash
npm install @prisma/client prisma
```

### Bước 2: Khởi tạo Prisma project

```bash
npx prisma init
```

### Bước 3: Generate migration từ schema

Nếu chưa có migration files:

```bash
npx prisma migrate dev --name init
```

Nếu database đã tồn tại nhưng schema chưa match:

```bash
npx prisma db push
```

### Bước 4: Generate Prisma Client

```bash
npx prisma generate
```

## 📝 Các migrations hiện có

```
prisma/migrations/
└── 0_init/
    └── migration.sql
```

### migration.sql - Tạo tất cả tables:

- `User` table cho admin
- `Product` table cho sản phẩm
- `Project` table cho dự án
- `Lead` table cho liên hệ
- `Contact` table cho info liên hệ
- `Setting` table cho cấu hình

## 🔄 Chạy Migration

### Development (Auto migrations)

```bash
npx prisma migrate dev
```

- Tạo migration mới
- Chạy pending migrations
- Generate Prisma Client

### Production (Deploy migrations)

```bash
npx prisma migrate deploy
```

- Chỉ chạy migrations, không prompt
- Dùng cho CI/CD

### Preview migrations (dry-run)

```bash
npx prisma migrate resolve --rolled-back migration_name
```

## ✏️ Thay đổi Schema

### Ví dụ: Thêm cột mới vào Product

1. Edit `prisma/schema.prisma`:

```prisma
model Product {
  id          String     @id @default(cuid())
  name        String
  // ... existing fields
  sku         String?    // Thêm cột mới
}
```

2. Tạo migration:

```bash
npx prisma migrate dev --name add_sku_to_product
```

3. Review generated SQL
4. Prisma tự động chạy migration + generate client

### Ví dụ: Tạo bảng mới

1. Thêm model vào schema:

```prisma
model Review {
  id        String   @id @default(cuid())
  rating    Int
  comment   String
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  createdAt DateTime @default(now())
}
```

2. Create migration:

```bash
npx prisma migrate dev --name add_reviews
```

## 🔍 Inspect Database

### Xem schema hiện tại

```bash
npx prisma db pull
```

Pull schema từ database (ngược lại migration)

### Xem data trong table

```bash
npx prisma studio
# Opens interactive UI at http://localhost:5555
```

### Query từ terminal

```bash
npx prisma db execute --stdin < query.sql
```

## 🧹 Reset Database (Cẩn thận!)

**Xóa tất cả data & tables (không có undo!):**

```bash
npx prisma migrate reset
```

Điều này sẽ:

1. Drop tất cả tables
2. Tạo schema từ đầu
3. Chạy seed (nếu có)

Chỉ dùng trong development!

## 💾 Seed Data (Dữ liệu mẫu)

Tạo file `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const chili = await prisma.product.create({
    data: {
      name: "Ớt Tây",
      slug: "ot-tay",
      description: "Ớt tây chất lượng cao",
      category: "chili",
      price: 50000,
      image: "https://res.cloudinary.com/.../chili.jpg",
    },
  });

  console.log("Seed data created:", chili);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Chạy seed:

```bash
npx prisma db seed
```

## 📋 Checklist Setup Database

- [ ] Database URL cấu hình trong `.env`
- [ ] Kết nối test (chạy prisma studio)
- [ ] Migrations khởi tạo thành công
- [ ] Prisma Client generated
- [ ] Tables tạo trong database
- [ ] Có thể query data từ API
- [ ] Seed data (optional) chạy thành công
- [ ] Backup database schedule

## 🔐 Backup & Recovery

### Backup database

Với Aiven:

1. Vào Aiven Dashboard
2. Database → **Backups**
3. Click **Download backup**

Hoặc dùng `pg_dump`:

```bash
pg_dump postgresql://user:pass@host:port/dbname > backup.sql
```

### Restore từ backup

```bash
psql postgresql://user:pass@host:port/dbname < backup.sql
```

## 🚨 Troubleshooting

### Error: "Can't reach database server"

- Kiểm tra connection string
- Network connectivity (IP whitelist?)
- Database server running?

### Error: "ECONNREFUSED"

- Port đúng không? (default: 5432, Aiven: 15998)
- Firewall/VPN issue?

### Error: "column ... already exists"

- Migration file bị conflict?
- Chạy `prisma migrate status` để xem
- Resolve bằng `prisma migrate resolve`

### Lâu khi chạy migration

- Network chậm?
- Large data set?
- Thử skip validation: `--skip-validate`

## 📚 Tài liệu Tham khảo

- [Prisma Docs](https://www.prisma.io/docs)
- [Migration Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Aiven PostgreSQL](https://aiven.io/postgresql)

---

**Cần hỗ trợ?** Liên hệ: contact@lefarm.vn
