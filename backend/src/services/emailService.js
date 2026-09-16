const nodemailer = require('nodemailer')

const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASS
const hasValidEmailConfig = !!emailUser && !!emailPass && !emailUser.includes('your-email') && !emailPass.includes('your-app')

const transporter = hasValidEmailConfig
  ? nodemailer.createTransport({
      service: 'gmail',
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })
  : null

function getEmailContent(otpCode, purpose = 'login') {
  const isSignup = purpose === 'signup'
  const isReset = purpose === 'password_reset'

  return {
    subject: isSignup
      ? 'Verify your Zepfly account'
      : isReset
        ? 'Reset your Zepfly password'
        : 'Your Zepfly secure login code',
    heading: isSignup
      ? 'Create your account securely'
      : isReset
        ? 'Reset your password'
        : 'Your secure login code',
    bodyText: isSignup
      ? 'Use this one-time password to verify your email and complete your Zepfly account setup.'
      : isReset
        ? 'Use this one-time password to verify your identity and set a new password for your Zepfly account.'
        : 'Use this one-time password to securely access your Zepfly dashboard.',
    accent: isSignup ? '#7c3aed' : isReset ? '#f59e0b' : '#2563eb',
  }
}

async function sendOtpEmail(email, otpCode, purpose = 'login') {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail) {
    throw new Error('Email is required to send OTP')
  }

  if (!hasValidEmailConfig || !transporter) {
    console.warn('Email service is not configured. Set EMAIL_USER and EMAIL_PASS in backend .env to enable OTP delivery.')
    return false
  }

  const content = getEmailContent(otpCode, purpose)

  const mailOptions = {
    from: emailUser,
    to: normalizedEmail,
    subject: content.subject,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f8fbff 0%, #eef2ff 100%); padding: 32px 16px;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 18px 45px rgba(15,23,42,0.08); border: 1px solid #e2e8f0;">
          <div style="padding: 24px 28px 10px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white;">
            <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #cbd5e1;">Zepfly</p>
            <h2 style="margin: 0; font-size: 28px; font-weight: 700;">${content.heading}</h2>
          </div>
          <div style="padding: 28px;">
            <p style="margin: 0 0 18px; color: #475569; font-size: 15px; line-height: 1.7;">${content.bodyText}</p>
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); border: 1px solid #dbeafe; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
              <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #64748b;">Your code</p>
              <div style="font-size: 34px; letter-spacing: 10px; font-weight: 800; color: ${content.accent}; font-family: 'Courier New', monospace;">
                ${otpCode}
              </div>
            </div>
            <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.7;">This code expires in 5 minutes. Do not share it with anyone.</p>
          </div>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('OTP email delivery failed:', error.code || error.name)
    return false
  }
}

module.exports = {
  sendOtpEmail,
}
