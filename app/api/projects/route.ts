import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const year = searchParams.get('year');

    const projects = await prisma.project.findMany({
      where: {
        ...(category && { category }),
        ...(year && { year: parseInt(year) }),
      },
      orderBy: { year: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, description, image, images, category, results, year } = body;

    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        image,
        images: images ? JSON.stringify(images) : null,
        category,
        results,
        year: year ? parseInt(year) : null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
