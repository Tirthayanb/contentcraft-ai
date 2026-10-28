<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
## ContentCraft AI — Project Instructions

### 1. Project Context
- Build ContentCraft AI, a clean, modern AI-powered content creation workspace.
- Follow the existing stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.
- Before using Next.js APIs or conventions, read the relevant documentation under `node_modules/next/dist/docs/`.

### 2. Design System
- Treat `public/design-assets/` as the source of truth for the existing design.
- Maintain the warm cream background, muted olive-green palette, rounded cards, clean typography, and responsive layouts.
- Reuse existing components and utilities whenever practical; avoid unnecessary dependencies.
- Keep the landing page's existing appearance and behavior unchanged unless explicitly requested.

### 3. Development Workflow
- Work in small, focused milestones. Do not implement multiple unrelated features at once.
- Before editing, inspect the relevant files and understand the existing implementation.
- Make only the changes necessary for the current task.
- Prioritize UI and responsive behavior before backend, authentication, persistence, or real AI integration.
- Never claim a feature works unless it has been implemented and verified. Clearly identify placeholder or mock functionality.

### 4. Quality Checks
- Run `npm run lint`, `npm run build`, and `git diff --check` after meaningful changes.
- Fix issues introduced by your changes and report any checks that could not pass.
- Summarize changed files, implemented behavior, test results, and known limitations.

### 5. Git and File Safety
- Never commit, push, reset, or discard changes unless explicitly instructed.
- Preserve unrelated user changes and inspect `git status` before modifying or staging files.
- Do not remove or modify the auto-generated `nextjs-agent-rules` block in this file.
- Do not overwrite existing design assets or configuration without a clear need.

### 6. Communication
- Explain the current step briefly before making substantial changes.
- If a requirement is ambiguous or risks breaking existing behavior, ask before proceeding.
- Prefer simple, maintainable solutions over unnecessary abstraction.