Deep Learning Interactive Web
=============================

A browser-first companion to **Bishop & Bishop, *Deep Learning: Foundations and Concepts***, covering Chapters 1–20 and Appendices A–C with interactive demos, equations, and quizzes.

Target deployment
-----------------
- GitHub Pages: https://georgec77.github.io/deep-learning-interactive-web/
- Vite base:    `/deep-learning-interactive-web/`
- HashRouter is used so all client routes work on GitHub Pages refresh.

Tech stack
----------
- React 19 + TypeScript
- Vite + Tailwind CSS
- shadcn/ui
- KaTeX for math
- D3 for data visualizations

Coverage tracking
-----------------
- `src/course/manifest.ts`      – course outline, chapter status, and routing paths
- `src/course/coverage_matrix.json` – generated mapping to Bishop sections
- `scripts/build-coverage-matrix.cjs` – regenerate the matrix
- `scripts/check-coverage.cjs`      – audit routing & metadata consistency

Useful commands
---------------
- `npm run dev`                – start local dev server
- `npm run build`              – production build (must pass before push)
- `npm run coverage:build`     – regenerate coverage matrix
- `npm run coverage:check`     – run audit (reads App.tsx + generated pages)

Notes
-----
- Website chapter numbers do **not** equal Bishop chapter numbers.  The UI labels each chapter as `Bishop Ch N` where applicable (e.g. website ch01 = Bishop Ch 4).
- All section pages should include `<SectionMetadata />` with bishop chapter/section, learning objectives, common mistakes, and a short quiz.
