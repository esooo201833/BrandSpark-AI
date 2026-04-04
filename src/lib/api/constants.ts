export const contentTypes = [
  { id: 'brand-name', label: 'Brand Name', category: 'brand' },
  { id: 'slogan', label: 'Slogan', category: 'brand' },
  { id: 'social-post', label: 'Social Post', category: 'social' },
  { id: 'landing-copy', label: 'Landing Page Copy', category: 'landing' },
  { id: 'ad-hook', label: 'Ad Hook', category: 'ads' },
  { id: 'email-subject', label: 'Email Subject', category: 'social' },
  { id: 'product-description', label: 'Product Description', category: 'content' },
  { id: 'blog-headline', label: 'Blog Headline', category: 'content' },
] as const;

export const tones = [
  { id: 'professional', label: 'Professional', description: 'Formal and authoritative' },
  { id: 'casual', label: 'Casual', description: 'Friendly and conversational' },
  { id: 'creative', label: 'Creative', description: 'Imaginative and unique' },
  { id: 'technical', label: 'Technical', description: 'Detailed and precise' },
] as const;

export function getContentTypeLabel(id: string): string {
  return contentTypes.find((t) => t.id === id)?.label || id;
}

export function getToneLabel(id: string): string {
  return tones.find((t) => t.id === id)?.label || id;
}

export const inputFieldsForType: Record<string, { name: string; label: string; placeholder: string }[]> = {
  'brand-name': [
    { name: 'businessType', label: 'Business Type', placeholder: 'e.g., SaaS, E-commerce' },
    { name: 'description', label: 'Business Description', placeholder: 'What does your business do?' },
    { name: 'industry', label: 'Industry', placeholder: 'e.g., Technology, Fashion' },
    {
      name: 'targetAudience',
      label: 'Target Audience',
      placeholder: 'Who are you trying to reach?',
    },
  ],
  'slogan': [
    { name: 'brandName', label: 'Brand Name', placeholder: 'Your company/product name' },
    {
      name: 'description',
      label: 'What you do',
      placeholder: 'Brief description of your offering',
    },
    { name: 'targetAudience', label: 'Target Audience', placeholder: 'Who is your customer?' },
  ],
  'social-post': [
    { name: 'topic', label: 'Topic', placeholder: 'What do you want to post about?' },
    {
      name: 'purpose',
      label: 'Purpose',
      placeholder: 'e.g., engagement, announcement, question',
    },
    {
      name: 'cta',
      label: 'Call to Action',
      placeholder: 'What should people do? (optional)',
    },
  ],
  'landing-copy': [
    { name: 'productName', label: 'Product/Service Name', placeholder: 'Name of your product' },
    {
      name: 'keyBenefit',
      label: 'Main Benefit',
      placeholder: 'What problem does it solve?',
    },
    {
      name: 'targetAudience',
      label: 'Target Audience',
      placeholder: 'Who needs this product?',
    },
  ],
  'ad-hook': [
    { name: 'productName', label: 'Product Name', placeholder: 'What are you promoting?' },
    { name: 'problem', label: 'Problem Solved', placeholder: 'What pain point does it address?' },
    {
      name: 'targetAudience',
      label: 'Target Audience',
      placeholder: 'Who should see this ad?',
    },
  ],
  'email-subject': [
    { name: 'emailPurpose', label: 'Email Purpose', placeholder: 'e.g., promotion, update, invitation' },
    { name: 'offer', label: 'Offer/Message', placeholder: 'What are you offering?' },
  ],
  'product-description': [
    { name: 'productName', label: 'Product Name', placeholder: 'Name of your product' },
    { name: 'features', label: 'Key Features', placeholder: 'Main features (comma-separated)' },
    {
      name: 'pricePoint',
      label: 'Price Point',
      placeholder: 'e.g., budget, mid-range, premium',
    },
  ],
  'blog-headline': [
    { name: 'topic', label: 'Blog Topic', placeholder: 'What is the post about?' },
    { name: 'format', label: 'Post Format', placeholder: 'e.g., how-to, list, opinion' },
    { name: 'seoKeyword', label: 'SEO Keyword', placeholder: 'Target keyword (optional)' },
  ],
};
