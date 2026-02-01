import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/products/featured - Get featured products for homepage
export async function GET() {
  try {
    const featuredProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
    });

    return NextResponse.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
}
