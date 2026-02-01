"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n/context"
import { usePathname } from "next/navigation"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/marketplace", label: t.nav.marketplace },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
  ]

  // Company information
  const companyInfo = {
    name: "CÔNG TY TNHH XUẤT NHẬP KHẨU LEFARM KHÁNH HÒA",
    phone: "079.4567.157",
    email: "lefarmkhanhhoa@gmail.com",
    address: "Thôn Võ Kiện, Xã Diên An, Huyện Diên Khánh, Tỉnh Khánh Hòa",
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md mb-0">
      {/* Top Info Bar - Green */}
      <div className="bg-green-700 px-4 sm:px-6 lg:px-8 ">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-1 text-white text-xs sm:text-sm">
          <span className="font-medium">LEFARM Khánh Hòa - Chuyên xuất khẩu trái cây, rau củ quả sạch</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>CSKH 24/7</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span className="font-semibold">{companyInfo.phone}</span>
            </div>
            <div className="hidden md:flex">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Logo & Company Name */}
      <div className="px-4 sm:px-6 lg:px-8 py-2 bg-white">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          {/* Logo - Left */}
          <Link href="/" className="flex-shrink-0" aria-label="Lefarm home">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20">
              <Image
                src="/logo.png"
                alt="Lefarm Khanh Hoa logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Company Name - Center */}
          <div className="flex-1 text-center">
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-green-700 uppercase leading-tight">
              {companyInfo.name}
            </h1>
            <p className="hidden sm:block text-xs sm:text-sm text-gray-600 mt-1">
              {companyInfo.address}
            </p>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex-shrink-0 rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
  {/* Navigation Bar - Green Background */}
      <nav className="hidden md:block bg-[#eff5ef]  border-green-800/20 w-full mx-auto rounded-lg mb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-6 py-3 text-base lg:text-lg font-medium transition-all hover:bg-green-700 hover:text-white ${pathname === link.href
                  ? 'text-green-800 bg-green-800 text-white border-b-2 border-green-700'
                  : 'text-gray-700'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${pathname === link.href
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-3 border-t mt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    
    </header>
    
  )
}
