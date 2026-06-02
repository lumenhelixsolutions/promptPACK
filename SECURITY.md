# Security Policy

## Reporting a vulnerability

Please open a private security advisory or contact the maintainer directly.

## Current prototype safety boundaries

- No network calls
- No remote code
- No automatic scraping
- No automatic insertion
- No automatic sending or publishing
- User-triggered selected-text import only
- User-triggered insertion only

## Sensitive behavior

Any change involving host permissions, remote APIs, storage of prompt history, page scraping, insertion behavior, or publishing must be reviewed carefully before merge.
