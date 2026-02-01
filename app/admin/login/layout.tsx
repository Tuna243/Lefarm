import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đăng nhập - LEFARM Admin",
  description: "Đăng nhập vào hệ thống quản trị LEFARM",
}

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  // Layout riêng cho trang login - không có sidebar, header
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {children}
    </div>
  )
}
