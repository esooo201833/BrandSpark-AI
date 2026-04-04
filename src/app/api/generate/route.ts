import { NextRequest, NextResponse } from 'next/server';
import { openai, checkRateLimit } from '@/lib/ai/client';
import { buildPrompt, type ContentType, type Tone } from '@/lib/ai/prompts';
import { validateGenerateRequest } from '@/lib/api/validation';
import { contentCache } from '@/lib/api/cache';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate request
    const validation = validateGenerateRequest(body);
    if (!validation.success) {
      const errorMessages = validation.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: ' + errorMessages,
        },
        { status: 400 }
      );
    }

    const { type, tone, input, model } = validation.data;

    // Check cache first
    const cacheKey = contentCache.generateKey(type as string, tone as string, input as Record<string, string>);
    const cachedContent = contentCache.get(cacheKey);
    
    if (cachedContent) {
      return NextResponse.json({
        success: true,
        data: {
          content: cachedContent,
          cached: true,
          model: model,
          type,
          tone,
        },
      });
    }

    // Build prompt
    const prompt = buildPrompt(type as ContentType, tone as Tone, input as Record<string, string>);

    // Call OpenAI API
    let generatedContent = '';
    
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: prompt.system,
          },
          {
            role: 'user',
            content: prompt.user,
          },
        ],
        temperature: tone === 'professional' ? 0.7 : tone === 'casual' ? 0.8 : tone === 'creative' ? 0.9 : 0.6,
        max_tokens: 1000,
      });

      generatedContent = response.choices[0]?.message?.content || '';
    } catch (openaiError: unknown) {
      const error = openaiError as Error;
      console.error('OpenAI API Error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to generate content. Please check your OpenAI API key.',
        },
        { status: 500 }
      );
    }

    if (!generatedContent) {
      return NextResponse.json(
        { success: false, error: 'No content generated from AI' },
        { status: 500 }
      );
    }

    // Save to database
    try {
      await prisma.generation.create({
        data: {
          contentType: type as string,
          tone: tone as string,
          input: JSON.stringify(input),
          output: generatedContent,
          userId: 'anonymous', // Will be replaced with real user ID when auth is set up
        },
      });
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue even if DB save fails
    }

    // Cache the result
    contentCache.set(cacheKey, generatedContent, 3600); // Cache for 1 hour

    return NextResponse.json({
      success: true,
      data: {
        content: generatedContent,
        cached: false,
        model: model,
        type,
        tone,
      },
    });
  } catch (error) {
    console.error('Generate endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
