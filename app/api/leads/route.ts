import { prisma } from '@/lib/prisma';
import { sendContactNotificationEmail, sendContactConfirmationEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/leads - Get all leads with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const leads = await prisma.lead.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST /api/leads - Create new lead (contact form submission)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email: email || null,
        phone,
        subject,
        message,
        status: 'new',
      },
    });

    // Send notification emails asynchronously
    // Don't wait for email to complete - return response immediately
    Promise.all([
      // Send notification to admin
      sendContactNotificationEmail({
        name,
        email: email || 'no-email@example.com',
        phone,
        subject,
        message,
      }),
      // Send confirmation to customer (if email provided)
      email ? sendContactConfirmationEmail({ name, email }) : Promise.resolve({ success: false }),
    ]).catch((error) => {
      console.error('Error sending emails:', error);
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
