import { NextResponse } from 'next/server';
import { getEmailProvider, EMAIL_PROVIDERS } from '@/lib/auth/email';

export async function GET() {
  const emailProvider = getEmailProvider();
  
  const checks = {
    // Email Configuration
    email: {
      configured: emailProvider.configured,
      provider: emailProvider.provider || 'none',
      name: emailProvider.config?.name || 'Not configured',
    },
    // Google OAuth
    googleOAuth: {
      configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      clientId: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
    },
    // GitHub OAuth
    GitHubOAuth: {
      configured: !!(process.env.GitHub_CLIENT_ID && process.env.GitHub_CLIENT_SECRET),
      clientId: process.env.GitHub_CLIENT_ID ? '✅ Set' : '❌ Missing',
      clientSecret: process.env.GitHub_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
    },
    // App URL
    appUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000 (default)',
  };

  const emailReady = checks.email.configured;
  const oauthReady = checks.googleOAuth.configured || checks.GitHubOAuth.configured;

  return NextResponse.json({
    status: emailReady ? 'ready' : 'missing_config',
    checks,
    availableEmailProviders: Object.entries(EMAIL_PROVIDERS).map(([key, value]) => ({
      key,
      name: value.name,
    })),
    summary: {
      emailReady,
      oauthReady,
      message: emailReady 
        ? `✅ Email configured: ${checks.email.name}` 
        : '❌ Email configuration missing',
    },
    setupGuide: {
      email: {
        title: 'Email Provider Setup',
        options: [
          {
            name: 'Gmail (Recommended)',
            env: [
              'EMAIL_PROVIDER=gmail',
              'EMAIL_USER=your-email@gmail.com',
              'EMAIL_PASSWORD=your-app-password',
            ],
            note: 'Get app password from: myaccount.google.com → Security → App passwords',
          },
          {
            name: 'Outlook / Hotmail',
            env: [
              'EMAIL_PROVIDER=outlook',
              'EMAIL_USER=your-email@outlook.com',
              'EMAIL_PASSWORD=your-password',
            ],
          },
          {
            name: 'Yahoo Mail',
            env: [
              'EMAIL_PROVIDER=yahoo',
              'EMAIL_USER=your-email@yahoo.com',
              'EMAIL_PASSWORD=your-app-password',
            ],
          },
          {
            name: 'Custom SMTP',
            env: [
              'SMTP_HOST=smtp.example.com',
              'SMTP_PORT=587',
              'SMTP_USER=your-email@example.com',
              'SMTP_PASS=your-password',
              'SMTP_SECURE=false',
            ],
          },
        ],
      },
      googleOAuth: {
        title: 'Google OAuth Setup',
        steps: [
          'Go to https://console.cloud.google.com/apis/credentials',
          'Create OAuth 2.0 Client ID',
          'Add authorized redirect URI: http://localhost:3000/api/auth/callback/google',
          'Add to .env.local:',
          '  GOOGLE_CLIENT_ID=your-client-id',
          '  GOOGLE_CLIENT_SECRET=your-client-secret',
        ],
      },
      GitHubOAuth: {
        title: 'GitHub OAuth Setup',
        steps: [
          'Go to https://GitHub.com/settings/developers',
          'Create new OAuth App',
          'Authorization callback URL: http://localhost:3000/api/auth/callback/GitHub',
          'Add to .env.local:',
          '  GitHub_CLIENT_ID=your-client-id',
          '  GitHub_CLIENT_SECRET=your-client-secret',
        ],
      },
    },
  });
}
