# foodo

A household meal planner. Add recipes, plan the week, get a shopping list.

## Features

- **Recipe library** — add manually, import from a URL, or describe to AI
- **Weekly planner** — assign recipes to days/meals, set number of people and extra servings
- **Shopping list** — automatically aggregated and scaled from the week's plan, copyable to clipboard

## Tech stack

Next.js 14 · TypeScript · Tailwind CSS · Prisma 5 · SQLite (local) / PostgreSQL (production)

---

## Local development

```bash
# 1. Clone and install
git clone https://github.com/sashabadov/foodo
cd foodo
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env — DATABASE_URL is already set to SQLite for local dev

# 3. Create the database
npx prisma migrate dev

# 4. Start the dev server
npm run dev
```

Open http://localhost:3000.

To use AI recipe generation, add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Deploy to Vercel + Neon (free)

1. **Create a Neon database** at [neon.tech](https://neon.tech) (free tier) — copy the connection string.

2. **Push to GitHub** and import the repo at [vercel.com/new](https://vercel.com/new).

3. **Add environment variables** in the Vercel project settings:
   - `DATABASE_URL` — your Neon PostgreSQL connection string
   - `ANTHROPIC_API_KEY` — your Anthropic API key

4. **Update `prisma/schema.prisma`** for production — change the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"   # ← change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
   Commit and push — Vercel will rebuild automatically.

5. **Run migrations** on Neon — in the Vercel dashboard, open the project terminal or run locally with the Neon `DATABASE_URL`:
   ```bash
   DATABASE_URL="postgres://..." npx prisma migrate deploy
   ```

That's it — you and your husband will share the same database.
