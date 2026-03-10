# Diabetes Prediction Demo

React + TypeScript + Vite app for a browser-based diabetes prediction demo powered by a BigML decision tree.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui-style reusable components

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## BigML model source

The app reads the model directly from `Decision tree - code from BigML.txt` and evaluates the exported nested `if/else` tree in the browser.

The public helper remains `predictDiabetes(data)`, so the UI stays unchanged even if you swap in a new export later.

## Project structure

- `src/App.tsx`: page layout, form state, submit handling
- `src/components/`: UI primitives and reusable form field
- `src/data/diabetes-fields.ts`: field metadata and biological ranges
- `src/lib/validation.ts`: parsing and input validation
- `src/lib/predict-diabetes.ts`: parser and evaluator for the BigML decision tree export

## Deployment

### GitHub Pages

This repository now includes `.github/workflows/deploy.yml` for automatic GitHub Pages deployment.

1. Open the repository on GitHub.
2. Go to `Settings -> Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to `main` and GitHub will build and publish the `dist` folder automatically.

Your Pages URL should be:

`https://tom-kroupa.github.io/diabetesdatamining/`

### Vercel or Netlify

If you prefer a simpler UI and automatic preview URLs on every push:

1. Import the GitHub repository into Vercel or Netlify.
2. Keep the default Vite build settings (`npm run build`, output `dist`).
3. Each new push to GitHub will trigger a deployment automatically.

## Note

The current repository includes the pasted BigML export file and evaluates that logic client-side.
