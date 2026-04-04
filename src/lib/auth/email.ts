import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateEmailToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateEmailVerificationLink(token: string, email: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return `${baseUrl}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;
}

// Email provider configurations
export const EMAIL_PROVIDERS = {
  gmail: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    name: 'Gmail',
  },
  outlook: {
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    name: 'Outlook / Hotmail',
  },
  yahoo: {
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
    name: 'Yahoo Mail',
  },
  zoho: {
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    name: 'Zoho Mail',
  },
  sendgrid: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    name: 'SendGrid',
  },
  mailgun: {
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    name: 'Mailgun',
  },
  custom: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    name: 'Custom SMTP',
  },
};

export type EmailProvider = keyof typeof EMAIL_PROVIDERS;

export function getEmailProvider(): { configured: boolean; provider?: EmailProvider; config?: typeof EMAIL_PROVIDERS[EmailProvider] } {
  // Check for preset providers via env
  const providerFromEnv = process.env.EMAIL_PROVIDER as EmailProvider;
  
  if (providerFromEnv && EMAIL_PROVIDERS[providerFromEnv] && providerFromEnv !== 'custom') {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;
    
    if (user && pass) {
      return {
        configured: true,
        provider: providerFromEnv,
        config: EMAIL_PROVIDERS[providerFromEnv],
      };
    }
  }
  
  // Check for custom SMTP
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      configured: true,
      provider: 'custom',
      config: EMAIL_PROVIDERS.custom,
    };
  }
  
  // Check legacy Gmail settings
  if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
    return {
      configured: true,
      provider: 'gmail',
      config: EMAIL_PROVIDERS.gmail,
    };
  }
  
  return { configured: false };
}

export async function sendVerificationEmail(email: string, token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const providerInfo = getEmailProvider();
    
    if (!providerInfo.configured || !providerInfo.config) {
      const errorMsg = 'No email provider configured. Check EMAIL_PROVIDER, EMAIL_USER, and EMAIL_PASSWORD in .env.local';
      console.error('❌', errorMsg);
      return { success: false, error: errorMsg };
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodemailer = require('nodemailer');

    const config = providerInfo.config;
    
    // Determine credentials
    let authUser: string;
    let authPass: string;
    
    if (providerInfo.provider === 'custom') {
      authUser = process.env.SMTP_USER!;
      authPass = process.env.SMTP_PASS!;
    } else if (providerInfo.provider === 'gmail' && process.env.GMAIL_USER) {
      // Legacy Gmail support
      authUser = process.env.GMAIL_USER;
      authPass = process.env.GMAIL_PASSWORD!;
    } else {
      authUser = process.env.EMAIL_USER!;
      authPass = process.env.EMAIL_PASSWORD!;
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: authUser,
        pass: authPass,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certs for some providers
      },
    });

    // Verify connection
    try {
      await transporter.verify();
      console.log(`✅ Connected to ${config.name} SMTP`);
    } catch (verifyError) {
      console.error(`❌ SMTP connection failed for ${config.name}:`, verifyError);
      if (verifyError instanceof Error) {
        console.error(`❌ Error details:`, verifyError.message);
      }
      return { success: false, error: `SMTP connection failed: ${verifyError instanceof Error ? verifyError.message : String(verifyError)}` };
    }

    const verificationLink = generateEmailVerificationLink(token, email);
    const fromEmail = process.env.EMAIL_FROM || authUser;
    
    const mailOptions = {
      from: `"BrandSpark AI" <${fromEmail}>`,
      to: email,
      subject: '🔐 تحقق من بريدك الإلكتروني - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0;">✨ BrandSpark AI</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; text-align: center;">تحقق من بريدك الإلكتروني</h2>
            <h3 style="color: #666; text-align: center; font-weight: normal;">Verify Your Email</h3>
            
            <p style="font-size: 14px; color: #666; margin: 20px 0; text-align: center;">
              شكراً لتسجيلك في BrandSpark!<br>
              Thank you for signing up at BrandSpark!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #667eea; text-align: center;">
              <p style="margin: 0 0 15px 0;">
                <a href="${verificationLink}" 
                   style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  تحقق من البريد / Verify Email
                </a>
              </p>
              <p style="margin: 10px 0; font-size: 12px; color: #999;">
                أو انسخ هذا الرابط / Or copy this link:<br>
                <code style="background: #f0f0f0; padding: 5px 10px; border-radius: 3px; font-size: 11px; word-break: break-all;">
                  ${verificationLink}
                </code>
              </p>
            </div>
            
            <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
              الرابط ينتهي بعد 24 ساعة / Link expires in 24 hours
            </p>
          </div>
          
          <div style="padding: 20px; background: #e8e8e8; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px;">
            <p>© 2026 BrandSpark AI. All rights reserved.</p>
            <p style="margin-top: 10px;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" style="color: #667eea;">
                زيارة الموقع / Visit Website
              </a>
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email} via ${config.name}`, info.messageId);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Error sending email:', errorMsg);
    return { success: false, error: errorMsg };
  }
}
