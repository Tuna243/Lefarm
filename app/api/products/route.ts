import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products - Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const products = await prisma.product.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        Nutrition: true,
        ProductDetails: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nameVi,
      nameEn,
      nameRU,
      productCode,
      category,
      price,
      image,
      images,
      description,
      stock,
      unit,
      benefits,
    } = body;

    if (!nameVi || !nameEn || !productCode || !category) {
      return NextResponse.json(
        { error: 'Missing required fields (nameVi, nameEn, productCode, category)' },
        { status: 400 }
      );
    }

    const normalizedImages = Array.isArray(images)
      ? images.filter((img: string) => typeof img === 'string' && img.trim().length > 0)
      : [];
    if (normalizedImages.length < 3) {
      return NextResponse.json(
        { error: 'Please provide at least 3 product images' },
        { status: 400 }
      );
    }
    const primaryImage = image || normalizedImages[0] || '';

    const data = {
      nameVi,
      nameEn,
      nameRU: nameRU || null,
      productCode,
      category,
      price: price ? parseFloat(price) : 0,
      image: primaryImage,
      images: normalizedImages,
      description: description || null,
      stock: stock || 0,
      unit: unit || null,
      benefits: benefits || [],
    } as Prisma.ProductCreateInput;

    const product = await prisma.product.create({ data });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
