import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');

    let where = {};
    if (type) {
      where = { contentType: type };
    }

    const [generations, total] = await Promise.all([
      prisma.generation.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      }),
      prisma.generation.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        generations: generations.map(g => ({
          ...g,
          input: typeof g.input === 'string' ? JSON.parse(g.input) : g.input,
        })),
        total,
        skip,
        take,
      },
    });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, tone, input, output, userId } = await request.json();

    if (!type || !tone || !input || !output) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const generation = await prisma.generation.create({
      data: {
        contentType: type,
        tone,
        input: JSON.stringify(input),
        output,
        userId: userId || 'anonymous',
      },
    });

    return NextResponse.json({
      success: true,
      data: generation,
    });
  } catch (error) {
    console.error('History save error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save to history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing ID' },
        { status: 400 }
      );
    }

    await prisma.generation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Item deleted',
    });
  } catch (error) {
    console.error('History delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete from history' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
