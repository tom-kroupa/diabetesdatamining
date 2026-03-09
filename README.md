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

1. Push the repository to GitHub.
2. Import the repository into Vercel or Netlify.
3. Redeploy automatically on each push.

## Note

The current repository includes the pasted BigML export file and evaluates that logic client-side.
