# BrandSpark AI - Core API Infrastructure

## What's Been Built (API Architecture)

### 1. **OpenAI Integration** (`src/lib/ai/client.ts`)
- Initialized OpenAI client with your API key
- Built-in rate limiting (30 requests/min per IP)
- Simple in-memory caching for development

### 2. **Dynamic Prompt System** (`src/lib/ai/prompts.ts`)
Supports 8 content types:
- `brand-name` — Generate unique brand names
- `slogan` — Create brand slogans
- `social-post` — Write social media content
- `landing-copy` — Landing page copy
- `ad-hook` — Ad headlines
- `email-subject` — Email subject lines
- `product-description` — Product copy
- `blog-headline` — Blog post titles

Each prompt includes:
- **System message** — Defines the AI's role and expertise
- **User template** — Contextual question that adapts based on user input
- **Tone modifiers** — Professional, casual, creative, or technical

### 3. **Request Validation** (`src/lib/api/validation.ts`)
- Zod schema validation for all incoming requests
- Type-safe request/response contracts
- Detailed error messages

### 4. **API Endpoints**

#### `POST /api/generate`
Generates content based on user parameters.

```typescript
// Request
{
  type: "brand-name" | "slogan" | "social-post" | ... ,
  tone: "professional" | "casual" | "creative" | "technical",
  input: { [fieldName]: string },
  model?: "gpt-4o-mini" | "gpt-4o" // defaults to gpt-4o-mini
}

// Response
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

#### `GET /api/history?type=optional-filter`
Fetches all generated content from in-memory storage.

```typescript
// Response
{
  success: true,
  data: {
    generations: GenerationItem[],
    count: number
  }
}
```

### 5. **Storage Layer** (`src/lib/api/storage.ts`)
- In-memory Map for storing generations (development only)
- Ready to swap with database later
- Includes methods: `saveGeneration`, `getGeneration`, `getAllGenerations`, `deleteGeneration`

### 6. **Frontend Integration**

#### `useGenerate` Hook (`src/hooks/useGenerate.ts`)
```typescript
const { generate, loading, error, result } = useGenerate();

await generate({
  type: 'brand-name',
  tone: 'creative',
  input: { businessType: 'SaaS', description: '...' }
});
```

#### `ContentGenerator` Component
- Supports all 8 content types
- Dynamic form fields based on selected type
- Copy/export/regenerate actions
- Error handling and loading states

### 7. **Configuration** (`src/lib/api/constants.ts`)
- Content type definitions
- Tone descriptions
- Input field schemas for each content type
- Lookup functions for labels

## Environment Setup

Create `.env.local` in the app root:
```
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Running the App

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run start   # Run production build
```

## What's Production-Ready

✅ Type-safe API layer with validation  
✅ Real OpenAI integration (not mocked)  
✅ Rate limiting  
✅ Error handling  
✅ Dynamic prompt templates  
✅ UI with proper loading/error states  
✅ TypeScript throughout  

## What Needs Database Integration

- [ ] Replace in-memory storage with actual database (PostgreSQL)
- [ ] Add user authentication
- [ ] Track usage/credits per user
- [ ] Persistent generation history

## Notes

- The component uses `<select>` elements (HTML native), not a custom select component
- Error messages are detailed and helpful
- Tone adjusts temperature parameter (0.7-0.9) for varied output
- Each generation gets a unique ID with timestamp + random suffix
