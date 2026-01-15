import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"

// Initialize Resend - Vercel will automatically provide RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || "")

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  tr// Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured")
      return NextResponse.json(
        { error: "Email service is not configured. Please contact the administrator." },
        { status: 500 }
      )
    }

    y {
    const data: ContactFormData = await request.json()
const userEmailResponse = await resend.emails.send({
      from: "noreply@sushinbandha.com",
      to: data.email,
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00c1ff;">Thank you, ${data.name}!</h2>
          <p>I received your message about "${data.subject}" and appreciate you taking the time to reach out.</p>
          <p>I'll review your message and get back to you within 24-48 hours. If you need my resume or have any urgent matters, feel free to reach out again.</p>
          <p>Best regards,<br><strong>Sushin Bandha</strong><br>AI & Cybersecurity Specialist</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">Your message: "${data.subject}"</p>
        </div>
      `,
    })

    if (userEmailResponse.error) {
      console.error("Failed to send user email:", userEmailResponse.error)
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      )
    }

    // Send notification email to you
    const notificationResponse = await resend.emails.send({
      from: "noreply@sushinbandha.com",
      to: "Bsushin@outlook.com",
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00c1ff;">New Message from Your Portfolio</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <h3>Message:</h3>
          <p style="background: #f5f5f5; padding: 15px; border-left: 4px solid #00c1ff;">
            ${data.message.replace(/\n/g, "<br>")}
          </p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">Received at ${new Date().toLocaleString()}</p>
        </div>
      `,
    })

    if (notificationResponse.error) {
      console.error("Failed to send notification email:", notificationResponse.error)
      // Don't fail the request if notification email fails - user's email was sent
    }    <p><strong>Subject:</strong> ${data.subject}</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <h3>Message:</h3>
          <p style="background: #f5f5f5; padding: 15px; border-left: 4px solid #00c1ff;">
            ${data.message.replace(/\n/g, "<br>")}
          </p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">Received at ${new Date().toLocaleString()}</p>
        </div>
      `,
    })

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    )
  }
}
