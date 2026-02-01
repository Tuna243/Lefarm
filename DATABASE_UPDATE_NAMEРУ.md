# Database Update - Thêm hỗ trợ tiếng Nga

## Thay đổi đã thực hiện

### 1. Schema Database

Đã thêm field `nameRU` vào model `Product`:

```prisma
model Product {
  id             String          @id @default(cuid())
  nameVi         String          @db.VarChar(255)  // Tiếng Việt
  nameEn         String          @db.VarChar(255)  // Tiếng Anh
  nameRU         String?         @db.VarChar(255)  // Tiếng Nga (MỚI)
  // ... các field khác
}
```

### 2. Cấu trúc Database hiện tại

**Model Product** bao gồm:

- **Thông tin cơ bản:**
  - `id`: ID duy nhất
  - `nameVi`: Tên sản phẩm tiếng Việt (bắt buộc)
  - `nameEn`: Tên sản phẩm tiếng Anh (bắt buộc)
  - `nameRU`: Tên sản phẩm tiếng Nga (tùy chọn) ✨ **MỚI**
  - `category`: Danh mục sản phẩm
  - `productCode`: Mã sản phẩm (unique)
  - `description`: Mô tả sản phẩm
  - `image`: URL hình ảnh
  - `price`: Giá sản phẩm
  - `stock`: Số lượng tồn kho
  - `unit`: Đơn vị tính
  - `benefits`: Lợi ích sản phẩm (array)

- **Relations:**
  - `Nutrition`: Thông tin dinh dưỡng (1-1)
  - `ProductDetails`: Chi tiết sản phẩm (1-1)

**Model Nutrition:**

- `calories`, `protein`, `carbs`, `fiber`
- `Vitamin[]`: Danh sách vitamin

**Model ProductDetails:**

- `origin`: Xuất xứ
- `season`: Mùa vụ (array)
- `storage`: Cách bảo quản
- `tips`: Mẹo sử dụng (array)

**Model Vitamin:**

- `name`: Tên vitamin
- `amount`: Hàm lượng

### 3. Migration SQL

File migration đã được tạo tại: `prisma/migrations/add_nameRU_column.sql`

Để thực thi migration, chạy lệnh sau:

```bash
# Tự động push schema (khuyến nghị)
npx prisma db push

# Hoặc chạy SQL thủ công
psql $DATABASE_URL -f prisma/migrations/add_nameRU_column.sql
```

### 4. Prisma Client

Đã generate Prisma Client mới với field `nameRU`. Bây giờ bạn có thể sử dụng:

```typescript
// Tạo sản phẩm mới với tên tiếng Nga
await prisma.product.create({
  data: {
    nameVi: "Ớt chuông",
    nameEn: "Bell Pepper",
    nameRU: "Болгарский перец", // Tên tiếng Nga
    category: "vegetables",
    price: 25000,
    // ...
  },
});

// Query và hiển thị tên theo ngôn ngữ
const product = await prisma.product.findUnique({
  where: { id: "..." },
});

// Hiển thị theo ngôn ngữ người dùng
const displayName =
  language === "ru"
    ? product.nameRU
    : language === "en"
      ? product.nameEn
      : product.nameVi;
```

### 5. API Updates cần thiết

Cần update các API endpoints để hỗ trợ `nameRU`:

**a) GET /api/products** - Thêm nameRU vào response  
**b) POST /api/products** - Cho phép nhập nameRU khi tạo  
**c) PUT /api/products/:id** - Cho phép cập nhật nameRU

**d) Frontend Components:**

- `components/marketplace-client.tsx` - Hiển thị tên theo language
- `components/admin/product-form.tsx` - Form nhập nameRU
- `hooks/use-language.ts` - Hook để quản lý ngôn ngữ

### 6. Kết nối Database

Database đang sử dụng: **Aiven PostgreSQL Cloud**

- Host: `pg-214d7e4c-nhtuan-b778.b.aivencloud.com:15998`
- Database: `defaultdb`
- Schema: `public`

Nếu gặp lỗi kết nối khi chạy `npx prisma db push`, bạn có thể:

1. Kiểm tra VPN/Firewall
2. Chạy SQL thủ công qua pgAdmin hoặc Aiven Console
3. Sử dụng file migration SQL đã tạo

### 7. Data hiện tại

Database hiện có **20 products** với:

- ✅ `nameVi` và `nameEn` đã có dữ liệu
- ⏳ `nameRU` = NULL (cần cập nhật)

Để cập nhật dữ liệu tiếng Nga, sử dụng:

```sql
-- Update từng sản phẩm
UPDATE "Product"
SET "nameRU" = 'Болгарский перец'
WHERE "productCode" = 'PEPPER-001';
```

### 8. Checklist

- [x] Thêm field `nameRU` vào schema.prisma
- [x] Generate Prisma Client mới
- [x] Tạo migration SQL
- [ ] Chạy migration trên production database
- [ ] Update API endpoints
- [ ] Update Frontend components
- [ ] Nhập dữ liệu tiếng Nga cho 20 products hiện có
- [ ] Test hiển thị đa ngôn ngữ

## Ghi chú

- `nameRU` là optional (nullable) nên không ảnh hưởng đến dữ liệu hiện tại
- Có thể thêm các ngôn ngữ khác tương tự: `nameZH` (Trung), `nameJA` (Nhật), v.v.
- Cân nhắc tạo bảng `ProductTranslation` riêng nếu cần nhiều ngôn ngữ hơn
