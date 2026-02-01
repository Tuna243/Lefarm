import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check if user is accessing admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify token
    const payload = await verifyToken(token)

    if (!payload) {
      // Redirect to login if token is invalid
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // Token is valid, allow access
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
