'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save } from 'lucide-react'
import { ImageUpload } from '@/components/admin/image-upload'

export default function NewBannerPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    titleRU: '',
    subtitle: '',
    image: '',
    link: '',
    order: 0,
    isActive: true,
  })

  const handleSave = async () => {
    if (!formData.image) {
      alert('Vui lòng chọn ảnh banner')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/content/banners')
      } else {
        alert('Không thể tạo banner')
      }
    } catch (error) {
      console.error('Error creating banner:', error)
      alert('Lỗi khi tạo banner')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content/banners">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Thêm Banner Mới</h1>
            <p className="text-muted-foreground">Tạo banner mới cho trang chủ</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? 'Đang lưu...' : 'Lưu Banner'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề (Tiếng Việt) (không bắt buộc)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nhập tiêu đề banner..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="titleEn">Tiêu đề (English) (không bắt buộc)</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Enter banner title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="titleRU">Tiêu đề (Русский) (không bắt buộc)</Label>
                <Input
                  id="titleRU"
                  value={formData.titleRU}
                  onChange={(e) => setFormData({ ...formData, titleRU: e.target.value })}
                  placeholder="Введите название баннера..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Mô tả ngắn (không bắt buộc)</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Mô tả ngắn về banner..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Đường dẫn (Link)</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/marketplace hoặc https://..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ảnh Banner *</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="banners"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Kích thước khuyến nghị: 1920x600px
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cài đặt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order">Thứ tự hiển thị</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Kích hoạt</Label>
                  <p className="text-sm text-muted-foreground">
                    Hiển thị banner trên trang chủ
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
