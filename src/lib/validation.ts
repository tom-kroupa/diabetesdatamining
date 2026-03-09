import { diabetesFields } from '../data/diabetes-fields'
import type { DiabetesInput, FieldDefinition, FormValues, ValidationErrors } from './types'

const fieldMap = diabetesFields.reduce(
  (accumulator, field) => {
    accumulator[field.key] = field
    return accumulator
  },
  {} as Record<keyof DiabetesInput, FieldDefinition>,
)

export function getEmptyFormValues(): FormValues {
  return diabetesFields.reduce(
    (accumulator, field) => {
      accumulator[field.key] = ''
      return accumulator
    },
    {} as FormValues,
  )
}

export function validateFormValues(formValues: FormValues): {
  data: DiabetesInput | null
  errors: ValidationErrors
} {
  const errors: ValidationErrors = {}
  const normalizedInput = {} as DiabetesInput

  for (const [key, rawValue] of Object.entries(formValues) as Array<[keyof DiabetesInput, string]>) {
    const field = fieldMap[key]
    const value = rawValue.trim()

    if (!value) {
      errors[key] = `${field.label} is required.`
      continue
    }

    const numericValue = Number(value)

    if (!Number.isFinite(numericValue)) {
      errors[key] = `${field.label} must be a valid number.`
      continue
    }

    if (field.integer && !Number.isInteger(numericValue)) {
      errors[key] = `${field.label} must be a whole number.`
      continue
    }

    if (numericValue < field.min || numericValue > field.max) {
      errors[key] = `${field.label} must be between ${field.min} and ${field.max}.`
      continue
    }

    normalizedInput[key] = numericValue
  }

  if (Object.keys(errors).length > 0) {
    return {
      data: null,
      errors,
    }
  }

  return {
    data: normalizedInput,
    errors: {},
  }
}
