import Link from "next/link";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "AI Recipe Generation",
    description:
      "Describe your ingredients and flavor vision. ChefCanvas calls Gemini to produce a fully structured recipe — title, scaled ingredients, step-by-step method, and flavor analysis — in seconds.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
      </svg>
    ),
    title: "Fully Editable Output",
    description:
      "Every field the AI generates is editable inline — title, ingredients, steps, chef recommendations. Tweak to match your kitchen's style before saving.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    ),
    title: "Recipe Book",
    description:
      "Every saved recipe lives in your personal Recipe Book — browse, revisit, edit, or delete at any time. Your entire culinary library in one place.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
      </svg>
    ),
    title: "PDF Export",
    description:
      "Export any recipe as a clean, print-ready A4 PDF — perfect for prep sheets, service briefs, or sharing with your brigade.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
    title: "Flavor Profile Analysis",
    description:
      "Beyond the recipe, ChefCanvas analyses the dish's flavor architecture — balance, contrast, dominant notes — giving you a head chef's perspective on every creation.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    ),
    title: "Course-Based Structure",
    description:
      "Select from Amuse-Bouche, Appetizer, Soup, Main Course, or Dessert. Set your portion count and ChefCanvas scales every measurement precisely to match.",
  },
];

const steps = [
  {
    number: "01",
    title: "Set the stage",
    description:
      "Choose a course type, enter your portion count, and fill in your key components — protein, starch, vegetable, sauce, and garnish.",
  },
  {
    number: "02",
    title: "Describe the vision",
    description:
      "Write your intended flavor profile in plain language. Bold and smoky? Bright and acidic? The AI reads your intent and builds around it.",
  },
  {
    number: "03",
    title: "Generate & refine",
    description:
      "Hit Generate. Within seconds you have a complete recipe with scaled ingredients, method steps, and flavor analysis. Edit anything inline.",
  },
  {
    number: "04",
    title: "Save or export",
    description:
      "Save to your Recipe Book for later, or export a print-ready PDF for the pass. Your recipes persist and remain fully editable.",
  },
];

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0e0e0e",
        color: "rgba(255,255,255,0.9)",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2rem",
          borderBottom: "0.5px solid rgba(255,255,255,0.08)",
          position: "sticky",
          top: 0,
          background: "#0e0e0e",
          zIndex: 50,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif, serif)",
            fontSize: "1.25rem",
            letterSpacing: "0.02em",
            color: "rgba(255,255,255,0.95)",
          }}
        >
          ChefCanvas
        </span>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link
            href="/recipes"
            style={{
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
            }}
          >
            Recipe Book
          </Link>
          <Link
            href="/canvas"
            style={{
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.9)",
              textDecoration: "none",
              border: "0.5px solid rgba(255,255,255,0.25)",
              padding: "0.5rem 1.25rem",
              borderRadius: "6px",
            }}
          >
            Open Canvas
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "6rem 2rem 5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          AI-powered menu ideation
        </p>

        <h1
          style={{
            fontFamily: "var(--font-serif, serif)",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: "rgba(255,255,255,0.95)",
            margin: "0 0 1.5rem",
          }}
        >
          From concept to
          <br />
          kitchen-ready recipe
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7,
            maxWidth: "520px",
            margin: "0 auto 3rem",
          }}
        >
          Describe your dish. ChefCanvas generates a fully structured, scaled
          recipe with flavor analysis and chef recommendations — ready to
          edit, save, and print.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/canvas"
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.95)",
              color: "#0e0e0e",
              textDecoration: "none",
              padding: "0.875rem 2rem",
              borderRadius: "6px",
              fontSize: "0.9375rem",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            Open the Canvas
          </Link>
          <Link
            href="/recipes"
            style={{
              display: "inline-block",
              border: "0.5px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              padding: "0.875rem 2rem",
              borderRadius: "6px",
              fontSize: "0.9375rem",
            }}
          >
            Browse Recipe Book
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          height: "0.5px",
          background: "rgba(255,255,255,0.07)",
        }}
      />

      {/* Features */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "5rem 2rem",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          What&apos;s inside
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5px",
            background: "rgba(255,255,255,0.07)",
            border: "0.5px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "#0e0e0e",
                padding: "1.75rem",
              }}
            >
              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "1rem",
                  width: 24,
                  height: 24,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif, serif)",
                  fontSize: "1.0625rem",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.9)",
                  margin: "0 0 0.625rem",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          height: "0.5px",
          background: "rgba(255,255,255,0.07)",
        }}
      />

      {/* How it works */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "5rem 2rem",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          How it works
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          {steps.map((s, i) => (
            <div key={s.number} style={{ position: "relative" }}>
              {i < steps.length - 1 && (
                <div
                  style={{
                    display: "none",
                  }}
                />
              )}
              <p
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.2)",
                  margin: "0 0 0.75rem",
                }}
              >
                {s.number}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-serif, serif)",
                  fontSize: "1.0625rem",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.85)",
                  margin: "0 0 0.625rem",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto 6rem",
          padding: "0 2rem",
        }}
      >
        <div
          style={{
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "3.5rem 2rem",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.9)",
              margin: "0 0 1rem",
              lineHeight: 1.2,
            }}
          >
            Ready to start creating?
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.4)",
              margin: "0 0 2rem",
              maxWidth: "400px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Open the canvas, describe your dish, and have a complete recipe
            ready in under a minute.
          </p>
          <Link
            href="/canvas"
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.95)",
              color: "#0e0e0e",
              textDecoration: "none",
              padding: "0.875rem 2.5rem",
              borderRadius: "6px",
              fontSize: "0.9375rem",
              fontWeight: 500,
            }}
          >
            Open the Canvas
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.07)",
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif, serif)",
            fontSize: "0.9375rem",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          ChefCanvas
        </span>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "rgba(255,255,255,0.2)",
            margin: 0,
          }}
        >
          Built with Next.js &amp; Gemini 2.0 Flash
        </p>
      </footer>
    </main>
  );
}