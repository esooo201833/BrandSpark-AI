import { ReactNode } from 'react';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Note: html and body tags are already rendered by root layout.tsx
  // We just need to return children here to avoid nested document error
  return (
    <>
      {children}
    </>
  );
}
