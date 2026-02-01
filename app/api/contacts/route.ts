import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/contacts - Get all contact information
export async function GET(request: NextRequest) {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST /api/contacts - Create new contact (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value, label } = body;

    if (!type || !value) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        type, // phone, email, address, zalo
        value,
        label,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
