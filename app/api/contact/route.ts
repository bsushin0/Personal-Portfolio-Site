import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { saveContactSubmission, getIpGeolocation } from "@/lib/db"

// Initialize Resend - Vercel will automatically provide RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || "")

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured")
      return NextResponse.json(
        { error: "Email service is not configured. Please contact the administrator." },
        { status: 500 }
      )
    }

    const data: ContactFormData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get IP address from request headers
    const ip = (
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    );

    // Get geolocation data for the IP
    const geoData = await getIpGeolocation(ip);

    // Save to database (non-blocking, continue even if it fails)
    try {
      if (process.env.DATABASE_URL) {
        await saveContactSubmission({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          ip_address: ip,
          ...geoData,
        });
        console.log(`Saved contact submission to database: ${data.email} from ${ip}`);
      }
    } catch (dbError) {
      console.error('Failed to save to database:', dbError);
      // Don't fail the request if database save fails
    }

    // Read resume file from public folder (deployed with the app)
    const resumePath = path.join(process.cwd(), "public", "sushin-bandha-resume.pdf")
    const resumeBuffer = fs.readFileSync(resumePath)

    // Send auto-reply to the user with resume attachment
    const userEmailResponse = await resend.emails.send({
      from: "noreply@sushinbandha.com",
      to: data.email,
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00c1ff;">Thank you, ${data.name}!</h2>
          <p>I received your message about "${data.subject}" and appreciate you taking the time to reach out.</p>
          
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          
          <h3 style="color: #00c1ff; margin-top: 20px;">About Me</h3>
          <p>I'm a Computer Science specialist with deep expertise in AI/ML systems, cybersecurity, and scalable architecture. My work focuses on building intelligent solutions that solve real-world problems through advanced algorithms, secure design principles, and thoughtful engineering.</p>
          
          <p>I'm passionate about:</p>
          <ul style="color: #666; line-height: 1.8;">
            <li><strong>AI & Machine Learning</strong> - Building intelligent systems and optimizing neural networks</li>
            <li><strong>Cybersecurity</strong> - Designing secure systems and identifying vulnerabilities</li>
            <li><strong>Full-Stack Development</strong> - Creating scalable, production-grade applications</li>
            <li><strong>System Design</strong> - Architecting robust solutions for complex problems</li>
          </ul>
          
          <p>I've attached my resume for your reference. I'm always interested in discussing challenging opportunities, collaborating on impactful projects, or exploring how my skills can add value to your team.</p>
          
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          
      ...(resumeBuffer && {
        attachments: [
          {
            filename: "Sushin-Bandha-Resume.pdf",
            content: resumeBuffer,
          },
        ],
      })     <a href="https://linkedin.com" style="color: #00c1ff; text-decoration: none;">LinkedIn</a> | 
            <a href="https://github.com" style="color: #00c1ff; text-decoration: none;">GitHub</a>
          </p>
          <p style="font-size: 12px; color: #999;">Your message: "${data.subject}"</p>
        </div>
      `,
      attachments: [
        {
          filename: "Sushin-Bandha-Resume.pdf",
          content: resumeBuffer,
        },
      ],
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
      to: "bsushin1@gmail.com",
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00c1ff;">New Message from Your Portfolio</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>IP Address:</strong> ${ip}</p>
          ${geoData.city ? `<p><strong>Location:</strong> ${geoData.city}, ${geoData.region}, ${geoData.country}</p>` : ''}
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
    }

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
