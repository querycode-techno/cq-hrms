import { Card, CardContent } from "@/components/ui/card"

export function StepProgress({ steps, currentStep, currentTheme }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? `${currentTheme.primary.split(' ')[0]} border-transparent text-white`
                      : isActive
                      ? `border-2 ${currentTheme.border} ${currentTheme.accent}`
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${isActive ? currentTheme.accent : "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                  {index === 0 && (
                    <span className="text-xs text-red-600 font-medium">Required</span>
                  )}
                  {index > 0 && index < steps.length - 1 && (
                    <span className="text-xs text-gray-500">Optional</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 