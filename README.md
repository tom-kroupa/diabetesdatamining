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

## Where to paste the BigML model

Open `src/lib/predict-diabetes.ts` and replace `runBigMlDecisionTree()` with the nested if/else code exported from BigML.

Keep the public helper name as `predictDiabetes(data)` so the UI stays unchanged.

## Project structure

- `src/App.tsx`: page layout, form state, submit handling
- `src/components/`: UI primitives and reusable form field
- `src/data/diabetes-fields.ts`: field metadata and biological ranges
- `src/lib/validation.ts`: parsing and input validation
- `src/lib/predict-diabetes.ts`: decision tree integration point

## Deployment

1. Push the repository to GitHub.
2. Import the repository into Vercel or Netlify.
3. Redeploy automatically on each push.

## Note

The current repository includes the full app shell and validation flow, but the actual prediction tree is still a placeholder until the BigML export is pasted in.
