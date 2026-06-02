# Threat Model

## Assets

- User prompt text
- Selected text from active page
- Generated prompt output
- User-declared locked phrases / must-preserve facts

## Security objectives

- Do not transmit prompt text.
- Do not automatically scrape pages.
- Do not automatically insert, send, submit, or publish.
- Do not use remote code.
- Preserve user control over active-page changes.

## Trust boundaries

| Boundary | Risk | Control |
|---|---|---|
| Webpage → extension | unwanted page reading | selected text only after user action |
| Extension → webpage | unwanted insertion | insert only after user action |
| Extension → network | data exfiltration | no network calls, static scan |
| Candidate output → user workflow | lost facts | preservation controls and report |
| High-stakes content | over-compression | no-op / human review routing |
