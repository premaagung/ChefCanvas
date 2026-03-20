// app/api/recipes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found.' }, { status: 404 });
    }

    // Parse JSON strings back into arrays
    return NextResponse.json({
      ...recipe,
      ingredients:         JSON.parse(recipe.ingredients),
      steps:               JSON.parse(recipe.steps),
      chefRecommendations: JSON.parse(recipe.chefRecommendations),
    });

  } catch (error) {
    console.error('Fetch recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.recipe.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Delete recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      title,
      summary,
      courseType,
      portions,
      ingredients,
      steps,
      flavorAnalysis,
      chefRecommendations,
    } = body;

    // Validate required fields
    if (!title || !ingredients || !steps) {
      return NextResponse.json(
        { error: 'Missing required recipe fields.' },
        { status: 400 }
      );
    }

    const updated = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        summary:             summary          ?? '',
        courseType,
        portions:            Number(portions),
        ingredients:         JSON.stringify(ingredients),
        steps:               JSON.stringify(steps),
        flavorAnalysis:      flavorAnalysis   ?? '',
        chefRecommendations: JSON.stringify(chefRecommendations ?? []),
      },
    });

    return NextResponse.json({
      ...updated,
      ingredients:         JSON.parse(updated.ingredients),
      steps:               JSON.parse(updated.steps),
      chefRecommendations: JSON.parse(updated.chefRecommendations),
    }, { status: 200 });

  } catch (error) {
    console.error('Update recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to update recipe.' },
      { status: 500 }
    );
  }
}