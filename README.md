# BrandSpark AI

AI-powered content generation for modern marketers. Generate brand names, slogans, social posts, landing page copy, and ad hooks instantly.

## What's Included

✅ **Complete API Infrastructure** — Real OpenAI integration with rate limiting  
✅ **Web Dashboard** — Generate content, view history, manage settings  
✅ **8 Content Types** — Brand names, slogans, social posts, landing copy, ads, emails, descriptions, headlines  
✅ **Dynamic Prompts** — Context-aware system messages that adapt to user input  
✅ **4 Tone Options** — Professional, casual, creative, technical  
✅ **History & Analytics** — Real-time stats and content browsing  
✅ **Export Formats** — Download as text, markdown, or HTML  

## Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js  
- **AI**: OpenAI API (gpt-4o-mini / gpt-4o)
- **Storage**: In-memory (development), ready for PostgreSQL
- **Features**: Rate limiting, validation, error handling

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment

Create `.env.local`:

```
OPENAI_API_KEY=sk-proj-your_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000/dashboard` in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── history/page.tsx      # Full history browser
│   │   └── settings/page.tsx     # User settings
│   ├── api/
│   │   ├── generate/route.ts     # Content generation endpoint
│   │   └── history/route.ts      # History endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   │   ├── stats.tsx             # Live statistics
│   │   └── export.tsx            # Export functionality
│   ├── history/
│   │   ├── history-list.tsx      # Recent items list
│   │   └── full-history.tsx      # Full history viewer
│   ├── generator/
│   │   └── content-generator.tsx # Main content generator
│   ├── layout/
│   │   └── sidebar.tsx           # Navigation sidebar
│   └── ui/                       # shadcn/ui components
├── hooks/
│   └── useGenerate.ts            # Content generation hook
├── lib/
│   ├── ai/
│   │   ├── client.ts             # OpenAI setup
│   │   └── prompts.ts            # Dynamic prompts
│   ├── api/
│   │   ├── client.ts             # Frontend API client
│   │   ├── validation.ts         # Request validation
│   │   ├── storage.ts            # In-memory storage
│   │   └── constants.ts          # Content types & fields
│   └── utils.ts
└── types/
    └── index.ts                  # TypeScript interfaces
```

---

## API Endpoints

### POST `/api/generate`

Generate content based on parameters.

**Request:**
```typescript
{
  type: "brand-name" | "slogan" | "social-post" | "landing-copy" | "ad-hook" | "email-subject" | "product-description" | "blog-headline",
  tone: "professional" | "casual" | "creative" | "technical",
  input: { [field: string]: string },
  model?: "gpt-4o-mini" | "gpt-4o"  // defaults to gpt-4o-mini
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    content: string,
    contentId: string,
    type: string,
    tone: string
  }
}
```

### GET `/api/history?type=optional-filter`

Fetch all generations (optionally filtered by type).

**Response:**
```typescript
{
  success: true,
  data: {
    generations: GenerationItem[],
    count: number
  }
}
```

---

## Content Types

| Type | Description | Example Input |
|------|-------------|---|
| **brand-name** | Unique business names | Business Type, Description |
| **slogan** | Catchy taglines | Brand Name, What you do |
| **social-post** | Social media content | Topic, Purpose, CTA |
| **landing-copy** | Landing page text | Product Name, Key Benefit |
| **ad-hook** | Ad headlines | Product Name, Problem Solved |
| **email-subject** | Email subject lines | Email Purpose, Offer |
| **product-description** | Product copy | Product Name, Features |
| **blog-headline** | Blog post titles | Topic, Format, SEO Keyword |

---

## Tone Options

- **Professional** — Formal, authoritative, business-appropriate
- **Casual** — Conversational, friendly, relatable language
- **Creative** — Imaginative, vivid, unique perspectives
- **Technical** — Precise, detailed, specification-focused

---

## Features

### Dashboard
- Real-time statistics (today, month, total)
- Intuitive content generator
- Recent generations sidebar
- Quick navigation

### History Browser
- View all generated content
- Group by content type
- Search & filter
- Sort by date
- Expandable item details
- Show input parameters

### Settings
- Default preferences (tone, model)
- Account management
- Notification controls
- Data & privacy options

### Components
- Type-safe with TypeScript
- Responsive design (mobile, tablet, desktop)
- Error handling & loading states
- Copy-to-clipboard functionality
- Export to multiple formats

---

## Database Integration (Next Steps)

### Replace In-Memory Storage

Current storage in `src/lib/api/storage.ts` is a simple Map. To use PostgreSQL:

1. Install Prisma:
```bash
npm install @prisma/client
npm install -D prisma
```

2. Initialize Prisma:
```bash
npx prisma init
```

3. Update `.env.local`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/brandspark"
```

4. Create schema in `prisma/schema.prisma`:
```prisma
model Generation {
  id        String   @id @default(cuid())
  type      String
  tone      String
  input     Json
  output    String
  createdAt DateTime @default(now())
  userId    String
}
```

5. Run migrations:
```bash
npx prisma migrate dev --name init
```

6. Update API routes to use Prisma instead of in-memory storage

---

## Rate Limiting

Currently implements basic IP-based rate limiting (30 requests/minute).

To use Redis for distributed rate limiting:

1. Install Redis client:
```bash
npm install redis
```

2. Update `src/lib/ai/client.ts` to use Redis

---

## Environment Variables

```
# Required
OPENAI_API_KEY=sk-proj-xxxxx

# Optional
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

---

## Development

### Run Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

---

## Production Deployment

### Build
```bash
npm run build
```

### Start
```bash
npm run start
```

### Environment for Production

Set in your hosting platform (Vercel, AWS, etc.):
- `OPENAI_API_KEY` — Your production API key
- `DATABASE_URL` — PostgreSQL connection string
- `NODE_ENV` — Set to `production`

---

## Key Files

| File | Purpose |
|------|---------|
| `API_STRUCTURE.md` | API architecture & integration details |
| `DASHBOARD_STRUCTURE.md` | Dashboard layout & components |
| `src/lib/ai/prompts.ts` | All AI prompts (8 content types) |
| `src/lib/api/constants.ts` | Content types & input field schemas |
| `src/app/api/generate/route.ts` | Content generation endpoint |
| `src/components/generator/content-generator.tsx` | Main UI component |

---

## Support

For issues or questions:
1. Check the documentation files
2. Review API_STRUCTURE.md for integration help
3. Check console for error messages
4. Verify .env.local is configured

---

## License

Private project - Developed for BrandSpark AI
- `DATABASE_URL` - PostgreSQL connection string (optional)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Features

- ✨ AI-powered content generation
- 📝 Multiple content types (brand names, slogans, social posts, etc.)
- 🎨 Tone selector (professional, casual, creative, technical)
- 💾 Generation history
- 📋 Content templates
- 👥 Team workspaces (planned)
- 📊 Usage analytics
- 🔄 Regenerate sections
- 📥 Export to PDF/TXT

## Development

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Components

The app uses shadcn/ui for UI components. To add a new component:

```bash
npx shadcn@latest add [component-name]
```

## API Routes

- `POST /api/generate` - Generate content
- `GET /api/history` - Fetch generation history
- `POST /api/history` - Save generation to history

## Database Setup (Optional)

For full functionality, set up PostgreSQL:

```sql
CREATE DATABASE brandspark;

-- Tables will be created via migrations
-- (TODO: Add migration scripts)
```

## Integrations

### AI Models

Currently configured for OpenAI, but can be extended to support:
- Anthropic Claude
- Google Gemini
- Open-source models (Llama, Mistral)

Update `src/lib/ai/` to switch providers.

## Roadmap

- [ ] Database integration (PostgreSQL)
- [ ] User authentication
- [ ] Team collaborations
- [ ] Advanced analytics
- [ ] Webhook integrations
- [ ] API for external use
- [ ] Mobile app

## Contributing

Contributions welcome! Please create an issue or submit a PR.

## License

MIT

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
