import type { ChangeEvent } from 'react'
import type { FieldDefinition, FormValues } from '../lib/types'
import { cn } from '../lib/utils'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface MetricFieldProps {
  field: FieldDefinition
  value: string
  error?: string
  onChange: (name: keyof FormValues, value: string) => void
}

export function MetricField({ field, value, error, onChange }: MetricFieldProps) {
  const inputId = `metric-${field.key}`

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(field.key, event.target.value)
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={inputId}>{field.label}</Label>
        <span className="text-xs font-medium text-muted-foreground">{field.unit}</span>
      </div>
      <Input
        id={inputId}
        type="number"
        inputMode={field.integer ? 'numeric' : 'decimal'}
        min={field.min}
        max={field.max}
        step={field.step}
        placeholder={field.placeholder}
        value={value}
        onChange={handleInputChange}
        aria-invalid={error ? 'true' : 'false'}
        className={cn(
          'h-12 bg-background/80',
          error && 'border-destructive/60 focus-visible:ring-destructive/20',
        )}
      />
      <div className="flex items-start justify-between gap-4 text-xs leading-5">
        <p className="text-muted-foreground">{field.description}</p>
        <p className="whitespace-nowrap text-muted-foreground">
          {field.min} - {field.max}
        </p>
      </div>
      {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
    </div>
  )
}
