import bigMlTreeSource from '../../Decision tree - code from BigML.txt?raw'
import type { DiabetesInput, PredictionResult } from './types'

type ModelField =
  | 'glucose'
  | 'blood_pressure'
  | 'skinfold'
  | 'insulin'
  | 'bmi'
  | 'diabetes_pedigree'
  | 'age'

type Operator = 'is-none' | '>' | '<='

interface ConditionNode {
  type: 'if'
  condition: {
    field: ModelField
    operator: Operator
    value?: number
  }
  children: TreeNode[]
}

interface ReturnNode {
  type: 'return'
  value: boolean
}

type TreeNode = ConditionNode | ReturnNode

type ModelFeatures = Record<ModelField, number | null>

const fieldNameMap: Record<string, ModelField> = {
  glucose: 'glucose',
  blood_pressure: 'blood_pressure',
  skinfold: 'skinfold',
  insulin: 'insulin',
  bmi: 'bmi',
  diabetes_pedigree: 'diabetes_pedigree',
  age: 'age',
}

let parsedTreeCache: TreeNode[] | null = null

function buildBigMlInput(input: DiabetesInput): ModelFeatures {
  return {
    glucose: input.glucose,
    blood_pressure: input.bloodPressure,
    skinfold: input.skinfoldThickness,
    insulin: input.insulin,
    bmi: input.bmi,
    diabetes_pedigree: input.diabetesPedigreeFunction,
    age: input.age,
  }
}

function parseBigMlTree(source: string): TreeNode[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const root: { children: TreeNode[] } = { children: [] }
  const stack: Array<{ indent: number; children: TreeNode[] }> = [{ indent: -1, children: root.children }]
  let insideDocstring = false
  let insideSignature = false
  let baseIndent: number | null = null

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()

    if (!trimmed) {
      continue
    }

    if (trimmed.startsWith('"""')) {
      insideDocstring = !insideDocstring
      continue
    }

    if (trimmed.startsWith('def predict_diabetes')) {
      insideSignature = !trimmed.endsWith('):')
      continue
    }

    if (insideSignature) {
      if (trimmed.endsWith('):')) {
        insideSignature = false
      }
      continue
    }

    if (insideDocstring) {
      continue
    }

    const rawIndent = Math.floor((rawLine.match(/^ */)?.[0].length ?? 0) / 4)

    if (baseIndent == null) {
      baseIndent = rawIndent
    }

    const indent = rawIndent - baseIndent

    while (stack.length > indent + 1) {
      stack.pop()
    }

    if (trimmed.startsWith('if ')) {
      const condition = parseCondition(trimmed)
      const node: ConditionNode = {
        type: 'if',
        condition,
        children: [],
      }

      stack.at(-1)?.children.push(node)
      stack.push({ indent, children: node.children })
      continue
    }

    if (trimmed.startsWith('return ')) {
      stack.at(-1)?.children.push(parseReturn(trimmed))
      continue
    }

    throw new Error(`Unsupported BigML line: ${trimmed}`)
  }

  return root.children
}

function getParsedTree(): TreeNode[] {
  if (!parsedTreeCache) {
    parsedTreeCache = parseBigMlTree(bigMlTreeSource)
  }

  return parsedTreeCache
}

function parseCondition(line: string): ConditionNode['condition'] {
  const match = line.match(/^if \((.+)\):$/)

  if (!match) {
    throw new Error(`Could not parse condition: ${line}`)
  }

  const expression = match[1]
  const noneMatch = expression.match(/^([a-z_]+) is None$/)

  if (noneMatch) {
    return {
      field: parseField(noneMatch[1]),
      operator: 'is-none',
    }
  }

  const numericMatch = expression.match(/^([a-z_]+) (<=|>) ([0-9.]+)$/)

  if (!numericMatch) {
    throw new Error(`Unsupported condition expression: ${expression}`)
  }

  return {
    field: parseField(numericMatch[1]),
    operator: numericMatch[2] as Operator,
    value: Number(numericMatch[3]),
  }
}

function parseField(field: string): ModelField {
  const mappedField = fieldNameMap[field]

  if (!mappedField) {
    throw new Error(`Unsupported BigML field: ${field}`)
  }

  return mappedField
}

function parseReturn(line: string): ReturnNode {
  if (line === "return 'true'") {
    return { type: 'return', value: true }
  }

  if (line === "return 'false'") {
    return { type: 'return', value: false }
  }

  throw new Error(`Unsupported return expression: ${line}`)
}

function matchesCondition(
  condition: ConditionNode['condition'],
  features: ModelFeatures,
): boolean {
  const currentValue = features[condition.field]

  if (condition.operator === 'is-none') {
    return currentValue == null
  }

  if (currentValue == null || condition.value == null) {
    return false
  }

  if (condition.operator === '>') {
    return currentValue > condition.value
  }

  return currentValue <= condition.value
}

function evaluateNodes(nodes: TreeNode[], features: ModelFeatures): boolean | undefined {
  for (const node of nodes) {
    if (node.type === 'return') {
      return node.value
    }

    if (matchesCondition(node.condition, features)) {
      const result = evaluateNodes(node.children, features)

      if (typeof result === 'boolean') {
        return result
      }
    }
  }

  return undefined
}

function runBigMlDecisionTree(features: ModelFeatures): boolean {
  const result = evaluateNodes(getParsedTree(), features)

  if (typeof result !== 'boolean') {
    throw new Error('The BigML decision tree did not produce a final prediction.')
  }

  return result
}

export function predictDiabetes(input: DiabetesInput): PredictionResult {
  try {
    const hasDiabetes = runBigMlDecisionTree(buildBigMlInput(input))

    if (hasDiabetes) {
      return {
        status: 'positive',
        headline: 'High Probability of Diabetes Detected',
        detail:
          'The BigML decision tree classified this profile as likely positive. Review the metrics carefully and follow up with a qualified clinician for actual diagnosis.',
        note: 'This is a machine learning demo and not medical advice.',
      }
    }

    return {
      status: 'negative',
      headline: 'Low Probability of Diabetes Detected',
      detail:
        'The BigML decision tree classified this profile as lower risk in this demo. A low-probability result does not rule out diabetes or replace medical screening.',
      note: 'This is a machine learning demo and not medical advice.',
    }
  } catch (error) {
    return {
      status: 'unavailable',
      headline: 'Model Could Not Run',
      detail:
        error instanceof Error
          ? error.message
          : 'The BigML decision tree could not be evaluated from the pasted export file.',
      note: 'This is a machine learning demo and not medical advice.',
    }
  }
}

export const bigMlIntegrationHint =
  'The predictor is loaded from Decision tree - code from BigML.txt and evaluated in the browser.'
