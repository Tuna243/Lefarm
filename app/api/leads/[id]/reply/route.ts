import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendLeadReplyEmail } from '@/lib/email'

// POST /api/leads/:id/reply - Send a reply to a lead and mark as replied
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js dynamic route params are a promise in app router APIs
    const { id: leadId } = await context.params
    if (!leadId) {
      return NextResponse.json({ error: 'Missing lead id' }, { status: 400 })
    }
    const body = await request.json()
    const { subject, message } = body

    if (!subject || !message) {
      return NextResponse.json({ error: 'Missing subject or message' }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    if (!lead.email) {
      return NextResponse.json({ error: 'Lead does not have an email address' }, { status: 400 })
    }

    const emailResult = await sendLeadReplyEmail({
      to: lead.email,
      subject,
      body: message,
    })

    await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'replied',
        contactedAt: new Date(),
      },
    })

    if (!emailResult.success) {
      return NextResponse.json({ error: emailResult.error || 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, messageId: emailResult.messageId })
  } catch (error) {
    console.error('Error sending reply to lead:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
