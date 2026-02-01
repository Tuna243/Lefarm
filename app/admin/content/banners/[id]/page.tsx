'use client'

import { use, useEffect, useState } from 'react'
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

interface EditBannerPageProps {
  params: Promise<{ id: string }>
}

export default function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch(`/api/banners/${id}`)
        if (response.ok) {
          const banner = await response.json()
          setFormData({
            title: banner.title || '',
            titleEn: banner.titleEn || '',
            titleRU: banner.titleRU || '',
            subtitle: banner.subtitle || '',
            image: banner.image || '',
            link: banner.link || '',
            order: banner.order || 0,
            isActive: banner.isActive,
          })
        } else {
          alert('Không tìm thấy banner')
          router.push('/admin/content/banners')
        }
      } catch (error) {
        console.error('Error fetching banner:', error)
        alert('Lỗi khi tải banner')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanner()
  }, [id, router])

  const handleSave = async () => {
    if (!formData.image) {
      alert('Vui lòng chọn ảnh banner')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/content/banners')
      } else {
        alert('Không thể cập nhật banner')
      }
    } catch (error) {
      console.error('Error updating banner:', error)
      alert('Lỗi khi cập nhật banner')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-6">Đang tải...</div>
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
            <h1 className="text-2xl font-bold">Chỉnh sửa Banner</h1>
            <p className="text-muted-foreground">Cập nhật thông tin banner</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
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
