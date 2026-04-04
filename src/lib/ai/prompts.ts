export type ContentType =
  | 'brand-name'
  | 'slogan'
  | 'social-post'
  | 'landing-copy'
  | 'ad-hook'
  | 'email-subject'
  | 'product-description'
  | 'blog-headline';

export type Tone = 'professional' | 'casual' | 'creative' | 'technical';

interface PromptTemplate {
  system: string;
  user: (input: Record<string, string>) => string;
}

const prompts: Record<ContentType, PromptTemplate> = {
  'brand-name': {
    system:
      'You are a creative brand naming expert. Generate catchy, memorable brand names that are easy to remember and spell. Focus on uniqueness and market appeal.',
    user: (input) =>
      `Create 5 unique brand names for: ${input.description || input.businessType}${
        input.industry ? ` in the ${input.industry} industry` : ''
      }. Make them memorable and modern.`,
  },
  'slogan': {
    system:
      'You are an expert copywriter specializing in compelling brand slogans. Create short, punchy, memorable taglines that capture brand essence.',
    user: (input) =>
      `Create 5 powerful slogans for a brand called "${input.brandName}" that ${input.description || 'delivers value'}. ${
        input.targetAudience ? `Target audience: ${input.targetAudience}` : ''
      }`,
  },
  'social-post': {
    system:
      'You are a social media expert. Write engaging, shareable posts optimized for engagement. Keep language natural and platform-appropriate. Include emojis sparingly.',
    user: (input) =>
      `Write a social media post about: ${input.topic}. Purpose: ${input.purpose || 'engagement'}. Call-to-action: ${
        input.cta || 'none'
      }`,
  },
  'landing-copy': {
    system:
      'You are a conversion-focused copywriter. Write compelling landing page copy that speaks to pain points and highlights benefits. Be clear, concise, and persuasive.',
    user: (input) =>
      `Write landing page copy for: ${input.productName}. Key benefit: ${input.keyBenefit}. Target: ${
        input.targetAudience || 'general audience'
      }. Include headline, subheading, and CTA.`,
  },
  'ad-hook': {
    system:
      'You are an advertising copywriter specializing in attention-grabbing ad hooks. Create compelling opening lines that stop scrolling and spark curiosity or interest.',
    user: (input) =>
      `Create 5 compelling ad hooks for: ${input.productName}. Problem: ${input.problem || 'unspecified'}. Audience: ${
        input.targetAudience || 'general'
      }`,
  },
  'email-subject': {
    system:
      'You are an email marketing expert. Create subject lines that have high open rates. Be concise, create urgency when appropriate, and avoid spam triggers.',
    user: (input) =>
      `Create 5 email subject lines for: ${input.emailPurpose}. Offer: ${input.offer || 'none'}. Tone: ${
        input.tone || 'professional'
      }`,
  },
  'product-description': {
    system:
      'You are a product marketing specialist. Write product descriptions that highlight features and benefits. Be persuasive yet honest. Help customers understand value.',
    user: (input) =>
      `Write a product description for: ${input.productName}. Key features: ${input.features || 'unspecified'}. Price point: ${
        input.pricePoint || 'mid-range'
      }. Use 2-3 paragraphs.`,
  },
  'blog-headline': {
    system:
      'You are a content strategist specializing in blog headlines. Create headlines that are specific, valuable, and optimized for click-through. Use power words when appropriate.',
    user: (input) =>
      `Create 5 blog post headlines about: ${input.topic}. Format: ${input.format || 'list post'}. SEO focus: ${
        input.seoKeyword || 'unspecified'
      }`,
  },
};

export function getPrompt(type: ContentType, tone: Tone): PromptTemplate {
  const basePrompt = prompts[type];
  if (!basePrompt) {
    throw new Error(`Unknown content type: ${type}`);
  }

  // Modify system prompt based on tone
  const toneInstructions: Record<Tone, string> = {
    professional:
      'Maintain a formal, business-appropriate tone. Use industry terminology appropriately. Sound trustworthy and authoritative.',
    casual:
      'Use conversational, friendly language. Feel like talking to a friend. Include colloquialisms and relatable language.',
    creative:
      'Be imaginative and push boundaries. Use vivid language and metaphors. Make it memorable and unique.',
    technical:
      'Use precise, technical language. Focus on specifications and capabilities. Sound knowledgeable and detailed.',
  };

  return {
    system: `${basePrompt.system}\n\nTone: ${toneInstructions[tone]}`,
    user: basePrompt.user,
  };
}

export function buildPrompt(
  type: ContentType,
  tone: Tone,
  input: Record<string, string>
) {
  const promptTemplate = getPrompt(type, tone);
  return {
    system: promptTemplate.system,
    user: promptTemplate.user(input),
  };
}
