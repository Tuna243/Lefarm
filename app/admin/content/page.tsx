"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Newspaper, FileText, Plus } from "lucide-react"

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
        <p className="text-muted-foreground">Quản lý nội dung website: Banner, News, Pages</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Banners */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Banner Carousel</CardTitle>
                <CardDescription>Quản lý banner trang chủ</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Tạo và quản lý banner carousel hiển thị trên trang chủ
            </p>
            <Link href="/admin/content/banners">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Quản lý Banner
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* News */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Newspaper className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>Tin tức</CardTitle>
                <CardDescription>Quản lý bài viết tin tức</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Đăng và quản lý các bài viết tin tức, thông báo
            </p>
            <Button className="w-full" variant="outline" disabled>
              <Plus className="mr-2 h-4 w-4" />
              Đang phát triển
            </Button>
          </CardContent>
        </Card>

        {/* Pages */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle>Trang nội dung</CardTitle>
                <CardDescription>Quản lý các trang static</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Chỉnh sửa nội dung các trang About, Contact,...
            </p>
            <Button className="w-full" variant="outline" disabled>
              <Plus className="mr-2 h-4 w-4" />
              Đang phát triển
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
