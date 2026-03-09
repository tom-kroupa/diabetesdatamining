import type { DiabetesInput, PredictionResult } from './types'

function buildBigMlInput(input: DiabetesInput) {
  return {
    glucose: input.glucose,
    bloodPressure: input.bloodPressure,
    skinfoldThickness: input.skinfoldThickness,
    insulin: input.insulin,
    bmi: input.bmi,
    diabetesPedigreeFunction: input.diabetesPedigreeFunction,
    age: input.age,
    Glucose: input.glucose,
    BloodPressure: input.bloodPressure,
    SkinfoldThickness: input.skinfoldThickness,
    Insulin: input.insulin,
    BMI: input.bmi,
    DiabetesPedigreeFunction: input.diabetesPedigreeFunction,
    Age: input.age,
  }
}

function runBigMlDecisionTree(_features: ReturnType<typeof buildBigMlInput>): boolean {
  void _features

  throw new Error(
    'BigML decision tree not configured. Replace runBigMlDecisionTree() in src/lib/predict-diabetes.ts with your exported nested if/else logic.',
  )

  /*
  Example structure:

  if (_features.glucose > 127) {
    return true
  }

  return false
  */
}

export function predictDiabetes(input: DiabetesInput): PredictionResult {
  try {
    const hasDiabetes = runBigMlDecisionTree(buildBigMlInput(input))

    if (hasDiabetes) {
      return {
        status: 'positive',
        headline: 'High Probability of Diabetes Detected',
        detail:
          'The current decision tree classified this profile as likely positive. Review the metrics carefully and follow up with a qualified clinician for real assessment.',
        note: 'This is a machine learning demo and not medical advice.',
      }
    }

    return {
      status: 'negative',
      headline: 'Low Probability of Diabetes Detected',
      detail:
        'The current decision tree classified this profile as lower risk in this demo. A low-probability result does not rule out diabetes or replace medical screening.',
      note: 'This is a machine learning demo and not medical advice.',
    }
  } catch (error) {
    return {
      status: 'unavailable',
      headline: 'Model Logic Needed',
      detail:
        error instanceof Error
          ? error.message
          : 'The BigML decision tree is missing. Paste the exported logic into src/lib/predict-diabetes.ts.',
      note: 'This is a machine learning demo and not medical advice.',
    }
  }
}

export const bigMlIntegrationHint =
  'Open src/lib/predict-diabetes.ts and replace runBigMlDecisionTree() with your exported BigML nested if/else logic.'
