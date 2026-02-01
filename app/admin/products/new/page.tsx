"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { MultiImageUpload } from "@/components/admin/image-upload"

// Dynamic import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-4 min-h-100 flex items-center justify-center text-muted-foreground">
      Đang tải editor...
    </div>
  )
})

const CATEGORIES = [
  { id: 'vegetables', name: 'Rau củ', prefix: 'VEG' },
  { id: 'fruits', name: 'Trái cây', prefix: 'FRU' },
]

const MIN_PRODUCT_IMAGES = 3

export default function NewProductPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nameVi: '',
    nameEn: '',
    nameRU: '',
    productCode: '',
    description: '',
    images: [] as string[],
    category: '',
  })

  const generateProductCode = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId)
    if (!category) return ''
    
    const prefix = category.prefix
    const timestamp = Date.now().toString().slice(-3)
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    const code = `${prefix}-${(timestamp + random).slice(-3).padStart(3, '0')}`
    return code
  }

  const handleCategoryChange = (categoryId: string) => {
    const newCode = generateProductCode(categoryId)
    setFormData({
      ...formData,
      category: categoryId,
      productCode: newCode,
    })
  }

  const handleSave = async () => {
    if (!formData.nameVi || !formData.nameEn || !formData.productCode || !formData.category) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc')
      return
    }

    const normalizedImages = formData.images.filter((img) => img && img.trim().length > 0)
    if (normalizedImages.length < MIN_PRODUCT_IMAGES) {
      setImageError(`Vui lòng chọn tối thiểu ${MIN_PRODUCT_IMAGES} ảnh.`)
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        ...formData,
        images: normalizedImages,
        image: normalizedImages[0] || '',
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Lỗi khi tạo sản phẩm')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Lỗi khi tạo sản phẩm')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Thêm sản phẩm mới</h1>
            <p className="text-sm text-muted-foreground">Tạo sản phẩm mới cho chợ nông sản</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          Lưu sản phẩm
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nameVi">Tên tiếng Việt *</Label>
                  <Input 
                    id="nameVi" 
                    placeholder="Tên sản phẩm" 
                    value={formData.nameVi}
                    onChange={(e) => setFormData({...formData, nameVi: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameEn">Tên tiếng Anh *</Label>
                  <Input 
                    id="nameEn" 
                    placeholder="Product name" 
                    value={formData.nameEn}
                    onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nameRU">Tên tiếng Nga</Label>
                  <Input 
                    id="nameRU" 
                    placeholder="Название продукта" 
                    value={formData.nameRU}
                    onChange={(e) => setFormData({...formData, nameRU: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productCode">Mã sản phẩm *</Label>
                  <Input 
                    id="productCode" 
                    placeholder="PROD-001" 
                    value={formData.productCode}
                    onChange={(e) => setFormData({...formData, productCode: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả chi tiết</Label>
                <RichTextEditor
                  data={formData.description}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục *</Label>
                <Select 
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <MultiImageUpload
                values={formData.images}
                onChange={(images) => {
                  setImageError(null)
                  setFormData({ ...formData, images })
                }}
                folder="products"
                minImages={MIN_PRODUCT_IMAGES}
              />
              <p className="text-xs text-muted-foreground">
                Tối thiểu {MIN_PRODUCT_IMAGES} ảnh. Ảnh đầu tiên sẽ là ảnh chính.
              </p>
              {imageError && (
                <p className="text-sm text-destructive">{imageError}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
