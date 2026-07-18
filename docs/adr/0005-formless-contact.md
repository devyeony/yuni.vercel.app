# ADR-0005: A formless contact page — purpose-framed mailto CTAs

- Status: accepted
- Date: 2026-07-19

## Context

The plan originally called for a contact form behind a validated, rate-limited
server boundary as a small backend proof. A full implementation was built and
reviewed on this branch: a React server action with Zod boundary validation,
per-IP rate limiting, a honeypot, and delivery through Resend's HTTP API gated
on `RESEND_API_KEY`.

Evaluating the finished slice surfaced three problems:

1. **The failure state is the likely production state.** Email delivery needs
   a provider account and a key that must be registered and maintained. While
   the key is absent, every submission ends in an (honest) error — and a form
   that errors reads worse to a recruiter than no form at all. The site runs
   on `yuni.vercel.app`, so a verified custom sender domain is permanently
   unavailable; delivery would stay pinned to the provider's sandbox sender.
2. **The proof is redundant.** The exact backend competencies the form was
   meant to showcase — Zod validation at the boundary, per-IP rate limiting,
   defensive API design — are already demonstrated more strongly by the MCP
   server (`/api/mcp`) and its shared `rate-limit` module.
3. **Upside vs. risk.** The same reasoning that removed the RAG chatbot: when
   a feature's differentiation is low and its failure mode is a direct
   penalty in front of the target audience, remove it.

## Decision

`/contact` ships without a form. Each contact purpose — hiring,
collaboration, coffee chat — is an editorial row with a `mailto:` link whose
subject line is prefilled per locale, so the conversation starts in the
visitor's own mail client with zero moving parts on our side. Secondary
channels (plain email, LinkedIn, GitHub) close the page.

The form implementation (server action, schema, tests) lives in this branch's
history should a custom domain ever make real delivery worth revisiting.

## Consequences

- The site keeps zero runtime external service dependencies — the AI layer's
  fully-static story now holds site-wide without an asterisk.
- No key management, no spam handling, no delivery monitoring.
- Visitors without a configured mail client lose the one-click path; the
  visible address and LinkedIn remain as fallbacks. Accepted: the target
  audience (recruiters, engineers) overwhelmingly has working email.
- A latent design-system fix discovered while building the form is kept:
  `Textarea` renders through Base UI `Field.Control`, so label association
  inside a `Field` actually works.
