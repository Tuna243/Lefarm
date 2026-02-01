'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Banner {
  id: string
  title: string
  titleEn?: string
  titleRU?: string
  subtitle?: string
  image: string
  link?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners')
      const data = await response.json()
      setBanners(data)
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBanners(banners.filter((banner) => banner.id !== id))
        setDeleteId(null)
      } else {
        alert('Không thể xóa banner')
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('Lỗi khi xóa banner')
    }
  }

  const toggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...banner,
          isActive: !banner.isActive,
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setBanners(banners.map((b) => (b.id === updated.id ? updated : b)))
      }
    } catch (error) {
      console.error('Error toggling banner:', error)
    }
  }

  const updateOrder = async (banner: Banner, direction: 'up' | 'down') => {
    const sortedBanners = [...banners].sort((a, b) => a.order - b.order)
    const currentIndex = sortedBanners.findIndex((b) => b.id === banner.id)

    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === sortedBanners.length - 1) return

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const swapBanner = sortedBanners[swapIndex]

    try {
      await Promise.all([
        fetch(`/api/banners/${banner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...banner, order: swapBanner.order }),
        }),
        fetch(`/api/banners/${swapBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...swapBanner, order: banner.order }),
        }),
      ])

      fetchBanners()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  if (isLoading) {
    return <div className="p-6">Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Banner</h1>
          <p className="text-muted-foreground">Quản lý banner carousel cho trang chủ</p>
        </div>
        <Link href="/admin/content/banners/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm Banner
          </Button>
        </Link>
      </div>

      {banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Chưa có banner nào</p>
            <Link href="/admin/content/banners/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tạo Banner Đầu Tiên
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {banners
            .sort((a, b) => a.order - b.order)
            .map((banner) => (
              <Card key={banner.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{banner.title}</h3>
                            {banner.titleEn && (
                              <p className="text-sm text-muted-foreground">{banner.titleEn}</p>
                            )}
                            {banner.subtitle && (
                              <p className="text-sm text-muted-foreground mt-1">{banner.subtitle}</p>
                            )}
                          </div>
                          <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {banner.link && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Link: {banner.link}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrder(banner, 'up')}
                          disabled={banner.order === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrder(banner, 'down')}
                          disabled={banner.order === banners.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(banner)}
                        >
                          {banner.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Link href={`/admin/content/banners/${banner.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteId(banner.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
