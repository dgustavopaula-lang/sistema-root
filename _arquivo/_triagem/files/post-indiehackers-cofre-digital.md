# Building Cofre Digital — a password manager born from a real problem, not a business plan

Hi everyone — first post here, so I'll keep it grounded.

I'm a farmer and independent developer based in Brazil. A few weeks ago I sat down and counted: I had over 20 passwords across 10+ bank accounts, scattered between browser autofill, sticky notes, and memory. No pattern, no backup, no real security — just the same reused password everywhere, like most people I know.

So I built **Cofre Digital** ("Digital Vault" in Portuguese) — a simple, local-first password manager with no unnecessary complexity:

- Master password unlocks everything (nothing stored on any server)
- Strong password generator built in
- One-click copy, with automatic clipboard clearing after 20 seconds for security
- Encrypted export/import for backups
- Free tier: 5 passwords. Paid tier planned for unlimited + cloud sync later

**Stack:** vanilla HTML/CSS/JS, no frameworks, no dependencies. LocalStorage only — your data never leaves your browser. Dark UI, mobile responsive.

**Why local-first matters to me:** I've seen firsthand what happens when people trust the wrong system with their credentials — phishing, fake investment platforms, accounts drained with no way to get money back. I wanted something where the only point of failure is a password *I* choose and *I* control, not a company's server.

**What's next:**
- Replacing basic encryption with real AES-256 via Web Crypto API
- A BIP39-style 12-word recovery seed phrase (same principle used in crypto wallets) — if you lose your master password, the seed is the only way back in. No "forgot password" email loophole, by design.
- Publishing to GitHub Pages, then packaging as a PWA for Google Play via TWA

I'm not chasing venture funding or a big launch. I'm building this the way I understand best: diagnose the real problem fast, ship something usable in days, evolve it in honest stages.

If anyone wants to try it and tell me where it breaks, I'd genuinely value that more than praise. First real users matter more to me than a big splash.

Happy to answer anything about the build, the security tradeoffs, or why I chose local-first over a backend.
