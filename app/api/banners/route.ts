import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all banners (or only active ones)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') === 'true'

    const banners = await prisma.banner.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(banners)
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

// POST - Create a new banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, titleEn, titleRU, subtitle, image, link, order, isActive } = body

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }

    const banner = await prisma.banner.create({
      data: {
        title: title || '',
        titleEn: titleEn || null,
        titleRU: titleRU || null,
        subtitle: subtitle || null,
        image,
        link: link || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}
