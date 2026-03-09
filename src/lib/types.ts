export interface DiabetesInput {
  glucose: number
  bloodPressure: number
  skinfoldThickness: number
  insulin: number
  bmi: number
  diabetesPedigreeFunction: number
  age: number
}

export type DiabetesInputKey = keyof DiabetesInput

export type FormValues = Record<DiabetesInputKey, string>

export type ValidationErrors = Partial<Record<DiabetesInputKey, string>>

export interface FieldDefinition {
  key: DiabetesInputKey
  label: string
  description: string
  placeholder: string
  step: string
  min: number
  max: number
  integer?: boolean
  unit: string
}

export interface PredictionResult {
  status: 'positive' | 'negative' | 'unavailable'
  headline: string
  detail: string
  note: string
}
