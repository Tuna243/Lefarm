import nodemailer from 'nodemailer'

// Create transporter for sending emails
// Using Gmail SMTP - requires app password for authentication
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'nhtuan.job@gmail.com',
    pass: process.env.GMAIL_PASSWORD || '', // Use app password, not regular password
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER || 'nhtuan.job@gmail.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || '',
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Send notification email to admin about new contact form submission
 */
export async function sendContactNotificationEmail(data: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL || 'nhtuan.job@gmail.com'

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #333;">Message:</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
      </div>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      
      <p style="color: #666; font-size: 12px;">
        This is an automated email from LeFarm Contact Form.
        <br>
        Sent at: ${new Date().toLocaleString('vi-VN')}
      </p>
    </div>
  `

  return sendEmail({
    to: adminEmail,
    subject: `[LeFarm Contact] New submission from ${data.name}`,
    html: htmlContent,
    text: `New Contact Form Submission\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
  })
}

/**
 * Send confirmation email to customer
 */
export async function sendContactConfirmationEmail(data: {
  name: string
  email: string
}) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Thank you for contacting LeFarm!</h2>
      
      <p>Hi ${data.name},</p>
      
      <p>We have received your contact form submission. Our team will review your message and get back to you as soon as possible.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">What's next?</h3>
        <ul>
          <li>We typically respond within 24-48 hours</li>
          <li>Check your email for our response</li>
          <li>If you don't see it, please check your spam folder</li>
        </ul>
      </div>

      <p>Thank you for choosing LeFarm!</p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      
      <p style="color: #666; font-size: 12px;">
        Best regards,<br>
        LeFarm Team
      </p>
    </div>
  `

  return sendEmail({
    to: data.email,
    subject: 'We received your message - LeFarm',
    html: htmlContent,
    text: `Thank you for contacting LeFarm!\n\nWe have received your contact form submission. Our team will review your message and get back to you as soon as possible.\n\nThank you,\nLeFarm Team`,
  })
}

// Send manual reply from admin to a lead
export async function sendLeadReplyEmail(data: {
  to: string
  subject: string
  body: string
}) {
  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e6e9ed; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(120deg, #2c7a4b, #4caf50); color: #ffffff; padding: 20px 24px;">
        <div style="font-size: 18px; font-weight: 700; letter-spacing: 0.3px;">LeFarm Support</div>
        <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">Phản hồi yêu cầu của bạn</div>
      </div>

      <div style="padding: 24px; color: #1f2933;">
        <p style="margin: 0 0 12px 0; font-size: 14px;">Xin chào,</p>
        <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.7;">${data.body.replace(/\n/g, '<br>')}</p>

        <div style="margin: 20px 0; padding: 16px; background: #f4f7f9; border-radius: 10px; border: 1px solid #e6e9ed;">
          <div style="font-size: 13px; color: #111827; font-weight: 600; margin-bottom: 8px;">Liên hệ nhanh</div>
          <div style="font-size: 13px; color: #4b5563; line-height: 1.6;">
            Email: support@lefarm.vn<br />
            Hotline: 096 123 4567<br />
            Website: www.lefarm.vn
          </div>
        </div>

        <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.6;">Cảm ơn bạn đã tin tưởng LeFarm. Nếu cần hỗ trợ thêm, hãy phản hồi email này hoặc liên hệ qua các kênh trên.</p>
      </div>

      <div style="background: #f9fafb; color: #6b7280; font-size: 12px; padding: 14px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        © ${new Date().getFullYear()} LeFarm. Mọi quyền được bảo lưu.
      </div>
    </div>
  `

  return sendEmail({
    to: data.to,
    subject: data.subject,
    html: htmlContent,
    text: data.body,
  })
}
