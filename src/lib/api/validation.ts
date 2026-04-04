import { z } from 'zod';

export const generateRequestSchema = z.object({
  type: z.enum([
    'brand-name',
    'slogan',
    'social-post',
    'landing-copy',
    'ad-hook',
    'email-subject',
    'product-description',
    'blog-headline',
  ]),
  tone: z.enum(['professional', 'casual', 'creative', 'technical']),
  input: z.record(z.string(), z.string()),
  model: z.enum(['gpt-4o-mini', 'gpt-4o']).optional().default('gpt-4o-mini'),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export const generateResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    content: z.string(),
    contentId: z.string(),
    type: z.string(),
    tone: z.string(),
  }),
  error: z.string().optional(),
});

export function validateGenerateRequest(data: unknown) {
  return generateRequestSchema.safeParse(data);
}
