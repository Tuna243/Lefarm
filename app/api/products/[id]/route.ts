import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      nameVi,
      nameEn,
      nameRU,
      description,
      image,
      images,
      category,
      price,
      stock,
      unit,
      benefits,
      featured,
    } = body;

    const normalizedImages = Array.isArray(images)
      ? images.filter((img: string) => typeof img === 'string' && img.trim().length > 0)
      : undefined;
    if (normalizedImages && normalizedImages.length < 3) {
      return NextResponse.json(
        { error: 'Please provide at least 3 product images' },
        { status: 400 }
      );
    }
    const primaryImage = image !== undefined
      ? image
      : normalizedImages
        ? normalizedImages[0] || ''
        : undefined;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(nameVi && { nameVi }),
        ...(nameEn && { nameEn }),
        ...(nameRU !== undefined && { nameRU }),
        ...(description && { description }),
        ...(primaryImage !== undefined && { image: primaryImage }),
        ...(normalizedImages !== undefined && { images: normalizedImages }),
        ...(category && { category }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock }),
        ...(unit !== undefined && { unit }),
        ...(benefits && { benefits }),
        ...(featured !== undefined && { featured }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
