// app/api/recipes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
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
      components,
      flavorGoal,
    } = body;

    // Validate required fields
    if (!title || !courseType || !portions || !ingredients || !steps) {
      return NextResponse.json(
        { error: 'Missing required recipe fields.' },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        summary:     summary     ?? '',
        courseType,
        portions:    Number(portions),
        flavorGoal:  flavorGoal  ?? '',

        // Arrays must be stringified for SQLite storage
        ingredients:         JSON.stringify(ingredients),
        steps:               JSON.stringify(steps),
        chefRecommendations: JSON.stringify(chefRecommendations ?? []),

        flavorAnalysis: flavorAnalysis ?? '',

        // Original form inputs — nullable
        protein:    components?.protein    ?? null,
        starchBase: components?.starchBase ?? null,
        vegetable:  components?.vegetable  ?? null,
        sauce:      components?.sauce      ?? null,
        garnish:    components?.garnish    ?? null,
      },
    });

    return NextResponse.json({ id: recipe.id, title: recipe.title }, { status: 201 });

  } catch (error) {
    console.error('Save recipe error:', error);
    return NextResponse.json(
      { error: 'Failed to save recipe.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id:         true,
        title:      true,
        summary:    true,
        courseType: true,
        portions:   true,
        createdAt:  true,
      },
    });

    return NextResponse.json(recipes, { status: 200 });

  } catch (error) {
    console.error('Fetch recipes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes.' },
      { status: 500 }
    );
  }
}