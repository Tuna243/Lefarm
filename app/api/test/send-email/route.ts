import { sendContactNotificationEmail, sendContactConfirmationEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/test/send-email - Test email sending
 * This is a test endpoint to verify email configuration
 * Remove or secure this in production
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, type } = body

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let result

    if (type === 'notification') {
      // Send admin notification
      result = await sendContactNotificationEmail({
        name,
        email,
        phone,
        subject,
        message,
      })
    } else {
      // Send customer confirmation
      result = await sendContactConfirmationEmail({
        name,
        email,
      })
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error testing email:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
