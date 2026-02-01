"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"

// Dynamic import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center text-muted-foreground">
      Đang tải editor...
    </div>
  )
})

const STATUS_OPTIONS = [
  { id: 'draft', name: 'Bản nháp' },
  { id: 'published', name: 'Đã xuất bản' },
]

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const editorRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    status: 'draft',
    tags: [] as string[],
  })

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/news/${params.id}`)
        if (response.ok) {
          const post = await response.json()
          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            image: post.image || '',
            status: post.status || 'draft',
            tags: post.tags || [],
          })
        } else {
          alert('Không tìm thấy bài viết')
          router.push('/admin/blog')
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        alert('Lỗi khi tải bài viết')
        router.push('/admin/blog')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id, router])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
    }))
  }

  const handleSave = async (publish = false) => {
    if (!formData.title || !formData.slug || !formData.content) {
      alert('Vui lòng điền đầy đủ tiêu đề, slug và nội dung')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        ...formData,
        status: publish ? 'published' : formData.status,
        publishedAt: publish && formData.status === 'draft' ? new Date().toISOString() : undefined,
      }

      const response = await fetch(`/api/news/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push('/admin/blog')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Lỗi khi cập nhật bài viết')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Lỗi khi cập nhật bài viết')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chỉnh sửa bài viết</h1>
            <p className="text-sm text-muted-foreground">Cập nhật nội dung bài viết</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            Lưu nháp
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            <Eye className="h-4 w-4 mr-2" />
            {formData.status === 'published' ? 'Cập nhật' : 'Xuất bản'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề bài viết"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-lg font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  placeholder="bai-viet-moi"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  URL thân thiện cho bài viết.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Tóm tắt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Hiển thị trong danh sách bài viết và meta description
                </p>
              </div>

              <div className="space-y-2">
                <Label>Nội dung bài viết *</Label>
                {!isLoading && (
                  <RichTextEditor
                    data={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Nhập nội dung bài viết..."
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt xuất bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="news"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Hình ảnh hiển thị trong danh sách bài viết
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
