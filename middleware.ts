import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'never'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip for API routes and static files
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Check if path already has locale prefix
  const hasLocalePrefix = pathname.startsWith('/en') || pathname.startsWith('/ar');
  
  if (!hasLocalePrefix) {
    // Redirect to default locale (en)
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|api|public|.*\\..*).*)']
};
