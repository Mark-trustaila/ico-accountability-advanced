# ICO Accountability Assessment — Comprehensive

A self-service assessment tool covering all **77 expectations** from the ICO's official [Accountability Framework](https://ico.org.uk/for-organisations/accountability-framework/) tracker, across 10 categories.

Built for [AiLA](https://trustaila.com) — the AI legal assistant for data protection.

## What it does

- **77 questions** mapped directly to the ICO's published expectations (1.1 – 10.8)
- Weighted scoring with severity (critical / high / medium / low) and effort (quick / moderate / significant) ratings
- **Prioritised action plan** with remediation steps drawn from the ICO's "Ways to meet our expectations"
- Executive summary, category scores, and summary table
- 80% completion gate before results are shown (spam avoidance)
- Lead capture via Formspree

## Tech stack

- React 18 + Vite
- Single-file component with inline styles (no CSS framework dependency)
- Notion-style design: Source Serif 4 headings, system sans-serif body

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy to Vercel

Push to GitHub and import into [Vercel](https://vercel.com). The `vercel.json` config is included — it will auto-detect Vite and deploy.

Or use the CLI:

```bash
npx vercel
```

## Project structure

```
├── index.html                 # Entry point
├── package.json
├── vite.config.js
├── vercel.json                # Vercel deployment config
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx               # React root
    ├── App.jsx                # App wrapper
    └── ICOAccountabilityAdvanced.jsx  # Full assessment component
```

## ICO Framework coverage

| # | Category | Expectations |
|---|----------|-------------|
| 1 | Leadership & Oversight | 6 |
| 2 | Policies & Procedures | 4 |
| 3 | Training & Awareness | 5 |
| 4 | Individuals' Rights | 11 |
| 5 | Transparency | 7 |
| 6 | Records of Processing & Lawful Basis | 10 |
| 7 | Contracts & Data Sharing | 9 |
| 8 | Risks & DPIAs | 5 |
| 9 | Records Management & Security | 12 |
| 10 | Breach Response & Monitoring | 8 |
| | **Total** | **77** |

## Licence

Proprietary — AiLA AI Ltd.
