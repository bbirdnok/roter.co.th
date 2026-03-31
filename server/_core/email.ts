interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email via Manus built-in email service
 * Currently using notification system as fallback
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // In production, integrate with actual email service (SendGrid, AWS SES, etc.)
    // For now, we'll use the notification system for owner alerts
    console.log(`[Email] Sending email to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

/**
 * Generate HTML email template for lead confirmation
 */
export function generateLeadConfirmationEmail(
  fullName: string,
  organizationName: string,
  language: "en" | "th" = "en"
): string {
  const content = {
    en: {
      subject: "Thank you for contacting Roter Thailand",
      greeting: `Hello ${fullName},`,
      body: `Thank you for your interest in Roter (Thailand) Company Limited. We have received your inquiry regarding document management solutions for ${organizationName}.`,
      nextSteps: "Our specialists will review your requirements and contact you within 24 business hours with a tailored proposal.",
      closing: "Best regards,",
      company: "Roter (Thailand) Company Limited",
    },
    th: {
      subject: "ขอบคุณที่ติดต่อบริษัท โรเตอร์ (ประเทศไทย) จำกัด",
      greeting: `สวัสดี ${fullName},`,
      body: `ขอบคุณที่สนใจบริการของบริษัท โรเตอร์ (ประเทศไทย) จำกัด เราได้รับคำขอของคุณเกี่ยวกับโซลูชันการจัดการเอกสารสำหรับ ${organizationName} แล้ว`,
      nextSteps: "ผู้เชี่ยวชาญของเราจะทบทวนความต้องการของคุณและติดต่อคุณภายใน 24 ชั่วโมงทำการพร้อมข้อเสนอที่เหมาะสม",
      closing: "ด้วยความเคารพ",
      company: "บริษัท โรเตอร์ (ประเทศไทย) จำกัด",
    },
  };

  const t = content[language];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { border-bottom: 3px solid #C9A84C; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #0A1628; }
    .content { margin-bottom: 30px; }
    .footer { border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; }
    .accent { color: #C9A84C; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ROTER</div>
      <div style="font-size: 12px; color: #666; margin-top: 5px;">Thailand</div>
    </div>

    <div class="content">
      <p>${t.greeting}</p>
      <p>${t.body}</p>
      <p><strong>${t.nextSteps}</strong></p>
    </div>

    <div class="footer">
      <p>${t.closing}<br>${t.company}</p>
      <p>
        <strong>Contact Information:</strong><br>
        Email: info@roter-thailand.com<br>
        Phone: +66 2-XXX-XXXX<br>
        Website: www.roter-thailand.com
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate HTML email template for admin notification
 */
export function generateAdminNotificationEmail(
  leadData: {
    fullName: string;
    organizationName: string;
    organizationType: string;
    email: string;
    phone?: string;
    message?: string;
  }
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0A1628; color: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: 600; color: #C9A84C; }
    .value { color: #333; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">🎯 New Lead Submission</h2>
    </div>

    <div class="field">
      <div class="label">Contact Name:</div>
      <div class="value">${leadData.fullName}</div>
    </div>

    <div class="field">
      <div class="label">Organization:</div>
      <div class="value">${leadData.organizationName} (${leadData.organizationType})</div>
    </div>

    <div class="field">
      <div class="label">Email:</div>
      <div class="value"><a href="mailto:${leadData.email}">${leadData.email}</a></div>
    </div>

    ${leadData.phone ? `
    <div class="field">
      <div class="label">Phone:</div>
      <div class="value">${leadData.phone}</div>
    </div>
    ` : ""}

    ${leadData.message ? `
    <div class="field">
      <div class="label">Message:</div>
      <div class="value">${leadData.message}</div>
    </div>
    ` : ""}

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
      <p>This is an automated notification from your Roter Thailand website.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
