# Hướng dẫn Cloudinary - Lưu trữ Hình ảnh

## 📸 Giới thiệu

Cloudinary là dịch vụ lưu trữ và xử lý hình ảnh trên cloud. Lefarm sử dụng Cloudinary để:

- Lưu trữ hình ảnh sản phẩm
- Tối ưu hóa hình ảnh (resize, compress)
- Cung cấp URL ảnh nhanh & ổn định
- Hỗ trợ transformations (crop, filter, effects)

## 🔧 Setup Cloudinary

### 1. Tạo tài khoản Cloudinary

1. Vào https://cloudinary.com
2. Click **Sign Up** (hoặc **Get started for free**)
3. Điền thông tin email, password
4. Xác nhận email
5. Chọn **Developer** khi được hỏi role

### 2. Lấy Credentials

1. Vào **Cloudinary Dashboard**
2. Tìm **API Environment Variable**
3. Sao chép các giá trị:
   - **Cloud Name** (ví dụ: `dxxxxx`)
   - **API Key** (ví dụ: `123456789`)
   - **API Secret** (ví dụ: `abcdef...`) - Giữ bí mật!

### 3. Cấu hình Upload Preset

**Upload Preset** cho phép upload hình ảnh mà không cần API Secret (an toàn hơn).

#### Tạo Upload Preset:

1. Dashboard → **Settings** (icon gear) → **Upload**
2. Scroll xuống **Upload presets**
3. Click **Add upload preset**
4. Điền thông tin:
   - **Preset Name**: `lefarm_products` (hoặc tên khác)
   - **Unsigned**: Toggle **ON** (quan trọng!)
   - **Folder**: `lefarm` hoặc `lefarm/products`
5. Click **Save**

### 4. Cập nhật Environment Variables

Tạo/cập nhật file `.env` (hoặc `.env.local`):

```env
# Cloudinary - Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
CLOUDINARY_API_KEY="your_api_key_here"
CLOUDINARY_API_SECRET="your_api_secret_here"

# Upload Preset name
# Upload Preset phải được set trong CLOUDINARY_UPLOAD_PRESET constant ở lib/cloudinary.ts
```

**Lưu ý:**

- `NEXT_PUBLIC_*` prefix: Biến này sẽ exposed lên client (an toàn vì chỉ dùng để upload)
- `CLOUDINARY_API_SECRET`: Giữ bí mật, chỉ dùng server-side
- Không commit `.env` lên Git!

## 💻 Sử dụng Upload

### Upload từ Form (Client-side)

```tsx
import { uploadToCloudinary } from "@/lib/cloudinary";

export function ProductForm() {
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadToCloudinary(file, "products");
      // Sử dụng imageUrl để lưu vào database
      console.log("Image uploaded:", imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return <input type="file" accept="image/*" onChange={handleImageChange} />;
}
```

### URL Hình ảnh

Sau khi upload, bạn sẽ nhận được URL như:

```
https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/lefarm/products/abc123.jpg
```

### Transformations

Cloudinary hỗ trợ nhiều transformations. Ví dụ:

```typescript
import { getCloudinaryUrl } from "@/lib/cloudinary";

// Resize image
const thumbnail = getCloudinaryUrl(publicId, {
  width: 300,
  height: 300,
  crop: "fill", // fill | fit | scale
  quality: "auto",
});

// Result:
// https://res.cloudinary.com/.../w_300,h_300,c_fill,q_auto/...
```

Các transformations khác:

- **crop**: fill, fit, scale, pad, thumb, etc.
- **quality**: auto, 80, 60, etc.
- **gravity**: auto, face, center, etc.
- **effect**: blur, grayscale, sepia, etc.
- **format**: auto, webp, jpg, png, etc.

[Xem thêm Transformations](https://cloudinary.com/documentation/transformation_reference)

## 📁 Folder Organization

Đề xuất cấu trúc folder trong Cloudinary:

```
lefarm/
├── products/      # Hình ảnh sản phẩm
│   ├── product-1.jpg
│   └── product-2.jpg
├── projects/      # Hình ảnh dự án
│   ├── project-1.jpg
│   └── project-gallery/
└── blog/          # Hình ảnh blog/news
    └── post-1.jpg
```

Folders được set tự động qua:

```typescript
uploadToCloudinary(file, "products"); // → uploads to lefarm/products/
uploadToCloudinary(file, "projects"); // → uploads to lefarm/projects/
```

## 🗑️ Xóa Hình ảnh

### Server-side (API):

```typescript
// lib/cloudinary.ts - deleteFromCloudinary()
// Gọi API endpoint /api/cloudinary/delete

const response = await deleteFromCloudinary("lefarm/products/image-id");
```

### API Endpoint:

```typescript
// app/api/cloudinary/delete/route.ts
// Dùng cloudinary.v2.uploader.destroy()

export async function POST(request: NextRequest) {
  const { publicId } = await request.json();
  // publicId ví dụ: 'lefarm/products/abc123'

  const result = await cloudinary.uploader.destroy(publicId);
  return NextResponse.json(result);
}
```

## 🔐 Bảo mật

### Do's ✅

- Upload Preset phải **Unsigned**
- Chỉ expose `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- Upload từ client-side khi có thể
- Validate file type & size trước upload
- Giữ `CLOUDINARY_API_SECRET` bí mật

### Don'ts ❌

- Không share API Key/Secret
- Không push `.env` lên Git
- Không bỏ `CLOUDINARY_API_SECRET` vào client-side code
- Không allow upload từ unsigned preset nếu cần restriction

## 📊 Monitoring & Management

### Xem Upload History

1. Vào Dashboard
2. **Media Library** → Xem tất cả uploaded files
3. Có thể delete, tag, organize ở đây

### Usage Stats

1. Dashboard → **Usage Dashboard**
2. Xem:
   - Bandwidth used
   - Storage used
   - Monthly credits remaining

### Quotas & Limits

- **Free tier**: 25 GB storage, 25 GB bandwidth/month
- **Upgrade**: Nếu vượt quá, tự động upgrade (tính phí)
- Xem plan details: **Settings** → **Account**

## 🚨 Troubleshooting

### Error: "Unsigned upload preset not enabled"

- Vào Upload Preset settings
- Confirm **Unsigned** is toggled ON

### Error: "Invalid upload preset"

- Kiểm tra lại Upload Preset name trong code
- Pastie: `UPLOAD_PRESET = 'lefarm_products'` phải match preset name

### Images not displaying

- Kiểm tra Cloud Name đúng không?
- URL format đúng không?
- Có CORS issues không? (Cloudinary handles this)

### Upload timeout

- File quá lớn? (limit ~100MB)
- Network chậm?
- Thử reduce image quality trước upload

## 🔗 Tài liệu Tham khảo

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Upload API](https://cloudinary.com/documentation/upload_widget_reference)
- [Transformations](https://cloudinary.com/documentation/transformation_reference)
- [SDKs & Libraries](https://cloudinary.com/documentation/libraries)

## 📝 Checklist

- [ ] Tạo Cloudinary account
- [ ] Lấy Cloud Name, API Key, API Secret
- [ ] Tạo Upload Preset (unsigned)
- [ ] Cập nhật `.env` với credentials
- [ ] Test upload từ product form
- [ ] Verify images hiển thị đúng
- [ ] Setup image optimization (crops, sizes)
- [ ] Configure CORS nếu cần
- [ ] Monitor usage dashboard

---

**Cần hỗ trợ?** Liên hệ: contact@lefarm.vn
