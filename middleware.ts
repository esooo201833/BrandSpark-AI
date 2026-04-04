import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'never'
});

export const config = {
  // Only run middleware on paths that don't start with these prefixes
  matcher: ['/((?!_next|api|public).*)']
};
