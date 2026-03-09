import { useMemo, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, GitBranch, ShieldPlus } from 'lucide-react'
import { MetricField } from './components/metric-field'
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { diabetesFields } from './data/diabetes-fields'
import { bigMlIntegrationHint, predictDiabetes } from './lib/predict-diabetes'
import type { FormValues, PredictionResult, ValidationErrors } from './lib/types'
import { getEmptyFormValues, validateFormValues } from './lib/validation'

const initialValues = getEmptyFormValues()

function App() {
  const [formValues, setFormValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [result, setResult] = useState<PredictionResult | null>(null)

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors])

  function handleChange(name: keyof FormValues, value: string) {
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => {
      if (!current[name]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })

    if (result) {
      setResult(null)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validation = validateFormValues(formValues)
    setErrors(validation.errors)

    if (!validation.data) {
      setResult(null)
      return
    }

    setResult(predictDiabetes(validation.data))
  }

  function handleReset() {
    setFormValues(getEmptyFormValues())
    setErrors({})
    setResult(null)
  }

  const resultVariant =
    result?.status === 'positive'
      ? 'destructive'
      : result?.status === 'negative'
        ? 'success'
        : 'warning'

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(21,94,99,0.18),_transparent_28%),linear-gradient(180deg,_#f8f4ed_0%,_#efe5d5_46%,_#f7f3eb_100%)]">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden border-white/70 bg-white/80 shadow-[0_28px_80px_rgba(120,92,47,0.12)] backdrop-blur">
              <CardHeader className="space-y-6 p-7 sm:p-9">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                    Decision Tree Demo
                  </span>
                  <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 font-medium text-muted-foreground">
                    React + Tailwind + shadcn/ui style
                  </span>
                </div>
                <div className="space-y-4">
                  <CardTitle className="max-w-3xl text-4xl leading-tight sm:text-5xl">
                    Diabetes risk screening, packaged as a clean web app.
                  </CardTitle>
                  <CardDescription className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                    Enter the patient metrics below to run a BigML decision tree in the browser.
                    The interface is responsive, modular, and ready to publish once your model logic is
                    pasted into the helper.
                  </CardDescription>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <Activity className="mb-3 size-5 text-primary" />
                    <p className="text-sm font-semibold">Seven clinical inputs</p>
                    <p className="mt-1 text-sm text-muted-foreground">Validated for realistic ranges.</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <ShieldPlus className="mb-3 size-5 text-primary" />
                    <p className="text-sm font-semibold">Clear result states</p>
                    <p className="mt-1 text-sm text-muted-foreground">Positive, negative, or model-needed.</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <GitBranch className="mb-3 size-5 text-primary" />
                    <p className="text-sm font-semibold">Deployment-ready</p>
                    <p className="mt-1 text-sm text-muted-foreground">Structured for GitHub and Vercel.</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-white/70 bg-white/80 shadow-[0_22px_70px_rgba(120,92,47,0.1)] backdrop-blur">
              <CardHeader className="p-7 pb-0 sm:p-9 sm:pb-0">
                <CardTitle className="text-2xl">Patient Metrics</CardTitle>
                <CardDescription>
                  Use the same feature ordering as your BigML export to keep the helper mapping simple.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-7 sm:p-9">
                <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {diabetesFields.map((field) => (
                      <MetricField
                        key={field.key}
                        field={field}
                        value={formValues[field.key]}
                        error={errors[field.key]}
                        onChange={handleChange}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
                    <Button className="h-12 flex-1 sm:flex-none" type="submit">
                      Run Prediction
                    </Button>
                    <Button
                      className="h-12 flex-1 sm:flex-none"
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                    >
                      Reset Form
                    </Button>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {hasErrors
                        ? 'Validation issues need attention before prediction.'
                        : result
                          ? 'Inputs changed? Re-run the model.'
                          : 'Results appear after a valid submission.'}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-white/70 bg-white/80 shadow-[0_22px_70px_rgba(120,92,47,0.1)] backdrop-blur">
              <CardHeader className="p-7 sm:p-9">
                <CardTitle className="text-2xl">Prediction Output</CardTitle>
                <CardDescription>
                  Binary tree outputs are translated into a user-facing message instead of a raw
                  <span className="mx-1 rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-secondary-foreground">
                    true
                  </span>
                  or
                  <span className="mx-1 rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-secondary-foreground">
                    false
                  </span>
                  value.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-7 pt-0 sm:p-9 sm:pt-0">
                {result ? (
                  <Alert variant={resultVariant}>
                    {result.status === 'positive' ? (
                      <AlertTriangle className="size-5" />
                    ) : result.status === 'negative' ? (
                      <CheckCircle2 className="size-5" />
                    ) : (
                      <AlertTriangle className="size-5" />
                    )}
                    <div className="space-y-2">
                      <AlertTitle>{result.headline}</AlertTitle>
                      <AlertDescription>{result.detail}</AlertDescription>
                      <p className="text-sm text-muted-foreground">{result.note}</p>
                    </div>
                  </Alert>
                ) : (
                  <div className="rounded-3xl border border-dashed border-border bg-background/70 p-6">
                    <p className="text-base font-semibold">Waiting for input</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Submit valid patient metrics to display the prediction summary here.
                    </p>
                  </div>
                )}

                <div className="rounded-3xl bg-secondary/70 p-5">
                  <p className="text-sm font-semibold">Disclaimer</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    This is a machine learning demo and not medical advice.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/80 shadow-[0_22px_70px_rgba(120,92,47,0.1)] backdrop-blur">
              <CardHeader className="p-7 sm:p-9">
                <CardTitle className="text-2xl">Model Integration</CardTitle>
                <CardDescription>
                  The application shell is complete. The actual classifier still needs your exported
                  BigML tree.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-7 pt-0 sm:p-9 sm:pt-0">
                <div className="rounded-3xl border border-border bg-background/80 p-5">
                  <p className="font-mono text-sm text-foreground">{bigMlIntegrationHint}</p>
                </div>
                <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                  <li>Paste the nested if/else export into the prediction helper.</li>
                  <li>
                    Keep the helper name as <span className="font-mono text-foreground">predictDiabetes(data)</span>.
                  </li>
                  <li>Deploy through GitHub, then connect the repo to Vercel or Netlify.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
