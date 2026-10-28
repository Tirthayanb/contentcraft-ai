# ContentCraft AI

> Turn ideas into impactful content.

ContentCraft AI is a clean, modern AI-powered content creation workspace built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui. The current implementation focuses on the landing page UI with a deterministic in-page preview.

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [Database](#database)
- [Development Workflow](#development-workflow)
- [Docs](#docs)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Configuration

Create a local environment file from the example (never commit secrets):

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/contentcraft?retryWrites=true&w=majority
```

- Use `.env.local.example` as the template.
- Do **not** commit `.env.local` or credentials.
- Authentication and API keys are not currently implemented.

## Project Structure

```
src/
├── app/              # Next.js App Router pages/layouts
├── components/       # Reusable UI components (shadcn/ui)
├── lib/
│   ├── db/mongodb.ts # Server-only cached MongoDB Native Driver connection
│   └── utils.ts      # Utility functions
└── models/           # Database model types/helpers (native driver)
    ├── User.ts
    ├── Subscription.ts
    ├── Usage.ts
    └── UploadedFile.ts
```

## Database

Database access uses the official `mongodb` Native Driver (no Mongoose). The connection is cached for serverless/dev hot reload via a global cache in `src/lib/db/mongodb.ts` and uses `MONGODB_URI` from `.env.local`.

### Models

| Model | Purpose | Key Fields | Indexes |
|---|---|---|---|
| **User** | User accounts/roles | `email` (optional, unique/sparse), `role` (`visitor` \| `free_customer` \| `paid_customer`), `name` (optional), `createdAt`, `updatedAt` | `email` (unique, sparse), `role` |
| **Subscription** | Subscription state | `userId`, `status` (`active` \| `past_due` \| `canceled` \| `incomplete` \| `trialing` \| `paused`), `planId`, `currentPeriodStart`, `currentPeriodEnd`, `cancelAtPeriodEnd`, timestamps | `userId`, `status` |
| **Usage** | Usage tracking per period | `userId`, `month` (YYYY-MM), `tokensUsed`, `requestsUsed`, `quotaTokens`, `quotaRequests`, timestamps | `{userId, month}` (unique) |
| **UploadedFile** | Uploaded file metadata | `userId` (optional), `originalName`, `mimeType`, `size`, `storageKey`, `url` (optional), timestamps | `userId`, `createdAt` (desc) |

No passwords or secrets are stored in these documents.

## Development Workflow

```bash
npm run dev    # Start dev server
npm run lint   # Run ESLint
npm run build  # Production build
```

- Preserve the existing landing page (`src/app/page.tsx`).
- Keep `.env.local` private; only `.env.local.example` is tracked.
- Make minimal changes and run lint/build after modifications.

## Docs

- [Product Requirements Document](docs/PRODUCT_REQUIREMENTS.md) — Product vision, roles, features, and open questions.
