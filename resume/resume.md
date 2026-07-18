# Aastha Saini — Résumé (one-page outline)

> Editable source for the one-pager. The polished PDF is **`Aastha-Saini-Resume.pdf`** (rendered from `resume.html`).
> **TODO before sending:** replace the email, phone and LinkedIn placeholders.

---

**Aastha Saini**
Aspiring Product Manager · Builds 0→1 products
📧 your.email@example.com · 📱 +91 XXXXX XXXXX
🔗 github.com/AASTHA381 · Portfolio: github.com/AASTHA381/portfolio · linkedin.com/in/your-handle

---

## Summary
MBA candidate and hands-on builder who ships product end-to-end — **research → PRD → design → build → deploy**. Shipped **8 live products** across AI, fintech, marketplaces, real-time social and productivity, each with a full PRD (personas, metrics, flows, roadmap). Turns ambiguous problems into shipped MVPs and measurable outcomes.

## Core Skills
Product Discovery · PRD & Specs · User Research · Roadmapping · Success Metrics · Prioritisation · Wireframing/UX · AI-native products · Rapid Prototyping · A/B thinking · HTML/CSS/JS · Node.js · Firebase · LLM APIs (Groq) · Data-informed decisions

## Selected Products (self-directed, shipped & live)

**SmartCart — AI purchase decision assistant** · Node + Groq LLM, PWA
- AI-native tool giving an objective **Buy / Wait / Don't-buy** verdict by reasoning over a user's budget, spending and goals — not just price.
- Shipped 3 phases: personalisation & dashboard; watchlist with price-drop tracking + 30-day reminders; product comparison + voice/quick input + share-as-image. Deployed on a Node backend with the API key secured server-side.

**TeamMatch — teammate matching for MBA projects** · Firebase, real-time PWA
- Two-sided matching engine ranking classmates by **complementary** skills, availability and goals; adopted by a live batch (~146 students).
- Auth + server-enforced ownership + real-time sync; privacy-minimised data model.

**DayFlow — schedule-aware sleep planner** · Firebase + on-device ML, PWA
- Computes an “earliest safe bedtime” from timetable, gym intensity and tasks; photo-to-dismiss alarms verified **on-device** (TensorFlow.js).

**YatraYatri — investment planner for a real client** · reactive web app
- Turned a trek-tourism founder's brief into a live financial cockpit: 7-category allocation, 0–100 readiness score, real-time risk alerts.

**Also shipped (each with a full PRD):**
- **FoodMatch** — Tinder-style group restaurant matcher (serverless real-time, OpenStreetMap).
- **LinkVault** — Chrome extension saving links/docs with AI summaries.
- **ClassTrack** — attendance tracker surfacing “safe skips left” per subject.
- **PM Study Planner** — flexible daily planner with streaks, grids & heatmap.

## Education
**MBA**, NMIMS — Product / Marketing focus. Relevant: Product Strategy, Consumer Behaviour, AI for Managers, Analytics.

## What I Bring
0→1 ownership · ships fast & pragmatically · writes crisp PRDs · reasons with metrics · strong AI-product instinct.

---
*Full case studies & live demos → github.com/AASTHA381/portfolio*

---

## How to regenerate the PDF
```bash
cd resume
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="Aastha-Saini-Resume.pdf" "file://$PWD/resume.html"
```
