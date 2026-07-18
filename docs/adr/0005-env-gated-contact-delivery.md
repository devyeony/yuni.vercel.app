# ADR-0005: Contact delivery through an env-gated Resend HTTP call

- Status: accepted
- Date: 2026-07-19

## Context

The contact page needs to deliver form submissions to a private inbox. Email
delivery is the one capability a static-first site cannot provide itself, and
this repo's standing principles constrain the options: no paid services, no
secrets in the client, and the AI layer's "zero runtime dependencies" story
should not be quietly diluted by an unrelated always-on service. A `mailto:`
link alone was rejected — the plan calls for a real form behind a validated,
rate-limited server boundary as a small backend proof.

## Decision

The form posts to a React server action (no public API route) that validates
with Zod, rate-limits per IP, and filters bots with a honeypot. Delivery is a
single `fetch` to Resend's HTTP API — no SDK — gated on `RESEND_API_KEY`:

- Key present: the message is sent with `reply_to` set to the submitter, to
  `CONTACT_TO_EMAIL` (default: the public site email). Free tier; with the
  sandbox `onboarding@resend.dev` sender, Resend only delivers to the account
  owner's address — exactly the shape of this use case.
- Key absent (dev, CI, forks): the action returns an honest failure state and
  the UI offers the direct email link. Never a fake success — a recruiter's
  message silently dropped is the worst outcome this feature can produce.

This mirrors the `ANTHROPIC_API_KEY` precedent from Phase 0: optional paid-ish
infrastructure is env-gated, everything degrades cleanly without it, and the
verification loop covers the ungated path (the e2e suite asserts the fallback
behavior, not the provider call).

## Consequences

- The only runtime external dependency on the site is one outbound HTTPS call
  behind a server action, executed solely on form submission. The AI layer
  remains 100% build-time static.
- Provider swap is one function edit: the boundary (schema, rate limit,
  honeypot, state shape) is provider-agnostic.
- The provider call itself is untested by CI (no key in the loop); regressions
  there surface only in production use. Accepted for a personal contact form.
