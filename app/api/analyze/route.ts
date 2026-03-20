// app/api/analyze/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ChefCanvasFormData, AIAnalysisResult } from '@/types';

function buildSystemInstruction(portions: number): string {
  return `You are Chef Atelier, a Michelin three-star executive chef and culinary scientist.
You are generating a standardized recipe card for a professional kitchen brigade.

CRITICAL: You must respond with ONLY a raw JSON object. No markdown, no fences, no preamble.

The JSON must contain EXACTLY these six keys:

"title": A creative, professional menu title for this dish. 3-6 words. 
Evocative and elegant — the kind of title that appears on a tasting menu.
Example: "Lacquered Duck, Gochujang, Scorched Allium"

"summary": A 2-3 sentence executive summary of the dish written in the voice 
of a head chef presenting to their team. Describe the concept, the dominant 
flavor arc, and the intended guest experience.

"ingredients": An array of objects. Each object has exactly four keys:
  - "amount": a numeric string scaled precisely for ${portions} portions (e.g. "240")
  - "unit": the metric unit (e.g. "g", "ml", "tsp", "kg", "L", "pcs")
  - "ingredient": the ingredient name in lowercase (e.g. "duck breast")
  - "preparation": brief prep note or empty string (e.g. "skin scored", "brunoise", "")
Scale every measurement precisely for ${portions} portions using standard 
culinary ratios. Be specific — no vague quantities like "to taste" for main 
ingredients.

"steps": An array of objects. Each object has exactly two keys:
  - "stage": the kitchen station or phase in Title Case (e.g. "Mise en Place", 
    "Protein", "Sauce", "Vegetable", "Plating")
  - "instruction": one concise, technically precise instruction for that stage.
    Max 40 words. Use professional culinary terminology.
Provide 6 to 9 step objects total.

"flavorAnalysis": A single string of 3-4 sentences. Clinically diagnose the 
flavor compound interactions — identify glutamates, capsaicin, volatile acids, 
Maillard compounds, fat-soluble aromatics. Be honest about imbalances.

"chefRecommendations": An array of exactly 3 strings. Each is one specific, 
actionable technique or ingredient addition that bridges the gap between the 
dish's actual profile and the chef's stated intention. Name exact quantities 
and techniques — never vague advice.

Return ONLY the JSON object. Nothing before it, nothing after it.`;
}

function buildPrompt(data: ChefCanvasFormData): string {
  const { courseType, portions, components, intendedFlavorProfile } = data;

  const componentLabels: Record<string, string> = {
    protein:    'Protein',
    starchBase: 'Starch / Base',
    vegetable:  'Vegetable / Accompaniment',
    sauce:      'Sauce / Liquid',
    garnish:    'Garnish',
  };

  const filledComponents = Object.entries(components)
    .filter(([, value]) => value.trim() !== '')
    .map(([key, value]) => `  - ${componentLabels[key]}: ${value}`)
    .join('\n');

  return `DISH BRIEF — ${courseType.toUpperCase()}
TARGET YIELD: ${portions} portions

COMPONENTS:
${filledComponents}

CHEF'S INTENDED FLAVOR PROFILE:
"${intendedFlavorProfile}"

Generate the full recipe card JSON now.`.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body: ChefCanvasFormData = await req.json();

    const hasComponents = Object.values(body.components).some(
      (v) => v.trim() !== ''
    );
    if (!hasComponents || !body.intendedFlavorProfile.trim()) {
      return NextResponse.json(
        { error: 'Incomplete dish brief.' },
        { status: 400 }
      );
    }

    const systemInstruction = buildSystemInstruction(body.portions);
    const prompt = buildPrompt(body);

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const err = await geminiResponse.json();
      console.error('Gemini API error:', err);
      return NextResponse.json(
        { error: 'Gemini API call failed.' },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();

    const rawText: string =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!rawText) {
      return NextResponse.json(
        { error: 'Empty response from Gemini.' },
        { status: 502 }
      );
    }

    // Strip all markdown fence variations
    const cleaned = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    // Extract JSON boundaries defensively
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No JSON found:', cleaned.slice(0, 300));
      return NextResponse.json(
        { error: 'No JSON found in AI response.' },
        { status: 502 }
      );
    }

    const jsonString = cleaned.slice(jsonStart, jsonEnd + 1);
    const result: AIAnalysisResult = JSON.parse(jsonString);

    // Validate the critical keys exist
    if (!result.title || !result.ingredients || !result.steps) {
      console.error('Malformed AI result:', result);
      return NextResponse.json(
        { error: 'AI returned incomplete recipe structure.' },
        { status: 502 }
      );
    }

    // Sanitize ingredients — clean up undefined preparation fields
    if (Array.isArray(result.ingredients)) {
      result.ingredients = result.ingredients.map((ing) => ({
        ...ing,
        preparation: ing.preparation === 'undefined' || !ing.preparation 
          ? '' 
          : ing.preparation,
      }));
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json(
      { error: 'Failed to parse AI response.' },
      { status: 500 }
    );
  }
}