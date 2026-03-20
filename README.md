# ChefCanvas

> AI-powered menu ideation and recipe management for professional kitchens.

ChefCanvas turns a list of ingredients and a flavor vision into a fully structured, kitchen-ready recipe — complete with scaled measurements, step-by-step method, flavor analysis, and chef recommendations. Built for working chefs who need to move fast without sacrificing craft.

---

## Features

- **AI recipe generation** — Describe your components and flavor intention. ChefCanvas calls Gemini 2.0 Flash and returns a complete recipe in seconds
- **Scaled measurements** — Set your target yield (pax) and every ingredient is calculated to match
- **Fully editable output** — Every field the AI generates is editable inline before saving
- **Portion rescaling** — Saved a recipe for 10 pax but need 35 tonight? Rescale any recipe with one click — pure frontend math, no AI call needed
- **Recipe Book** — Browse, filter, edit, and delete your saved recipes. Filter by course type with one click
- **PDF export** — Export any recipe as a clean, print-ready A4 PDF for the pass
- **Copy as text** — Copy the full recipe as plain text for WhatsApp, email, or kitchen display systems
- **Course types** — Amuse-Bouche, Appetizer, Soup, Main Course, Dessert

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.0 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite via Prisma 7 (local) |
| AI | Gemini 2.0 Flash (direct fetch) |
| PDF | jsPDF |
| Fonts | Cormorant Garamond, DM Mono |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/chefcanvas.git
cd chefcanvas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Set up the database
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Environment Variables

Create a `.env.local` file in the root with the following:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL="file:./prisma/dev.db"
```

---

## Project Structure

```
app/
├── api/
│   ├── analyze/route.ts        # Gemini API route
│   └── recipes/
│       ├── route.ts            # GET all, POST create
│       └── [id]/route.ts       # GET one, PUT update, DELETE
├── canvas/page.tsx             # Main form + editable result
├── recipes/
│   ├── page.tsx                # Recipe Book listing
│   └── [id]/page.tsx          # Recipe detail, edit, rescale
└── page.tsx                    # Landing page

components/
├── ChefCanvas/
│   ├── CanvasForm.tsx          # Main input form
│   ├── ComponentInput.tsx      # Ingredient row input
│   └── CourseSelector.tsx      # Course type pill selector
├── Dashboard/
│   └── EditableRecipe.tsx      # AI output editable form
└── PDF/
    └── DownloadButton.tsx      # jsPDF export button

lib/
└── prisma.ts                   # Prisma singleton client

types/
└── index.ts                    # TypeScript interfaces
```

---

## Screenshots

> Coming soon.

---

## Roadmap

- [ ] Vercel deployment with Turso (hosted SQLite)
- [ ] Duplicate recipe
- [ ] Print-optimized view (`window.print()`)
- [ ] Authentication (NextAuth.js + Google)
- [ ] Recipe versioning
- [ ] Prep time and cook time fields
- [ ] Cost per portion calculator
- [ ] Image upload (plating photos)

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## License

[MIT](./LICENSE) — © 2025 A. A. Bagus Premananta Kumara

---

## Acknowledgements

- [Google Gemini](https://deepmind.google/technologies/gemini/) for the AI backbone
- [Prisma](https://www.prisma.io/) for the database layer
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
- [Vercel](https://vercel.com/) for hosting