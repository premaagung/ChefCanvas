'use client';

import { AIAnalysisResult } from '@/types';

interface Props {
  result: AIAnalysisResult;
  courseType: string;
  portions: number;
}

export default function DownloadButton({ result, courseType, portions }: Props) {
  async function handleExport() {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const pageW = 210;
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = 20;

    const COLORS = {
      black:    [14, 14, 14]   as [number, number, number],
      dark:     [38, 38, 38]   as [number, number, number],
      muted:    [82, 82, 82]   as [number, number, number],
      faint:    [163, 163, 163] as [number, number, number],
      rule:     [212, 212, 212] as [number, number, number],
    };

    function checkPageBreak(needed = 10) {
      if (y + needed > 270) {
        doc.addPage();
        y = 20;
      }
    }

    function drawRule(color = COLORS.rule) {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageW - margin, y);
      y += 5;
    }

    function sectionLabel(text: string) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.faint);
      doc.setCharSpace(1.5);
      doc.text(text.toUpperCase(), margin, y);
      doc.setCharSpace(0);
      y += 7;
    }

    function wrapText(text: string, x: number, maxWidth: number, fontSize: number, color: [number,number,number], style = 'normal') {
      doc.setFont('helvetica', style);
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        checkPageBreak(fontSize * 0.5);
        doc.text(line, x, y);
        y += fontSize * 0.45;
      });
    }

    // ── Header ──────────────────────────────────────────
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.faint);
    doc.setCharSpace(1.5);
    doc.text('CHEFCANVAS — STANDARDIZED RECIPE CARD', margin, y);
    doc.setCharSpace(0);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(...COLORS.black);
    const titleLines = doc.splitTextToSize(result.title, contentW);
    titleLines.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 10;
    });
    y += 2;

    wrapText(result.summary, margin, contentW, 9, COLORS.muted, 'italic');
    y += 3;

    // Meta pills as text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.faint);
    doc.setCharSpace(1);
    doc.text(`${courseType.toUpperCase()}   ·   ${portions} PAX`, margin, y);
    doc.setCharSpace(0);
    y += 8;

    drawRule();

    // ── Ingredients ─────────────────────────────────────
    sectionLabel(`Ingredients — ${portions} portions`);

    // Column headers
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.faint);
    doc.setCharSpace(1);
    doc.text('AMT',         margin,      y);
    doc.text('UNIT',        margin + 18, y);
    doc.text('INGREDIENT',  margin + 32, y);
    doc.text('PREPARATION', margin + 90, y);
    doc.setCharSpace(0);
    y += 5;

    doc.setDrawColor(...COLORS.rule);
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageW - margin, y);
    y += 4;

    result.ingredients.forEach((ing) => {
      checkPageBreak(8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      doc.setTextColor(...COLORS.dark);
      doc.text(String(ing.amount), margin, y);

      doc.setTextColor(...COLORS.muted);
      doc.text(String(ing.unit), margin + 18, y);

      doc.setTextColor(...COLORS.dark);
      const ingText = doc.splitTextToSize(String(ing.ingredient), 55);
      doc.text(ingText[0], margin + 32, y);

      doc.setTextColor(...COLORS.muted);
      doc.setFont('helvetica', 'italic');
      const prepValue = ing.preparation && ing.preparation !== 'undefined' 
        ? ing.preparation 
        : '';
      const prepText = doc.splitTextToSize(String(prepValue), 55);
      doc.text(prepText[0] ?? '', margin + 90, y);

      y += 6;
    });

    y += 4;
    drawRule();

    // ── Method ──────────────────────────────────────────
    sectionLabel('Method');

      result.steps.forEach((step, i) => {
      checkPageBreak(20);

      // Step number
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.faint);
      doc.text(String(i + 1).padStart(2, '0'), margin, y);

      // Stage label on same line as number
      doc.setFontSize(7);
      doc.setCharSpace(1.2);
      doc.setTextColor(...COLORS.faint);
      doc.text(step.stage.toUpperCase(), margin + 12, y);
      doc.setCharSpace(0);
      y += 6;

      // Instruction lines below
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.dark);
      const instructionLines = doc.splitTextToSize(
        String(step.instruction),
        contentW - 12
      );
      instructionLines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, margin + 12, y);
        y += 5;
      });

      y += 6;
    });

    drawRule();

    // ── Flavor Analysis ─────────────────────────────────
    sectionLabel('Flavor Analysis');
    wrapText(result.flavorAnalysis, margin, contentW, 9, COLORS.muted, 'italic');
    y += 4;
    drawRule();

    // ── Chef Recommendations ────────────────────────────
    sectionLabel('Chef Recommendations');

    result.chefRecommendations.forEach((rec, i) => {
      checkPageBreak(14);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.faint);
      doc.text(String(i + 1).padStart(2, '0'), margin, y);

      doc.setFontSize(9);
      doc.setTextColor(...COLORS.dark);
      const recLines = doc.splitTextToSize(rec, contentW - 12);
      recLines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, margin + 12, y);
        y += 5;
      });   
      y += 3;
    });

    // ── Footer ──────────────────────────────────────────
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setDrawColor(...COLORS.rule);
      doc.setLineWidth(0.2);
      doc.line(margin, 282, pageW - margin, 282);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.faint);
      doc.setCharSpace(1);
      doc.text('CHEFCANVAS', margin, 287);
      doc.text(result.title.toUpperCase(), pageW / 2, 287, { align: 'center' });
      doc.text(
        new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        pageW - margin,
        287,
        { align: 'right' }
      );
      doc.setCharSpace(0);
    }

    // Save
    const fileName = `${result.title.toLowerCase().replace(/\s+/g, '-')}-${portions}pax.pdf`;
    doc.save(fileName);
  }

  return (
    <button
      onClick={handleExport}
      className="font-mono text-[11px] tracking-widest uppercase border border-white/20 rounded-lg px-7 py-3.5 text-white/60 hover:border-white/40 hover:text-white transition-colors cursor-pointer"
    >
      Export PDF &#8595;
    </button>
  );
}