import { Button } from "@/components/ui/button"
import { RoleButton } from "@/components/ui/role-button"
import { Loader2, Save } from "lucide-react"

export function NavigationButtons({ 
  currentStep, 
  steps, 
  prevStep, 
  nextStep, 
  skipToReview, 
  handleSubmit, 
  isPersonalInfoValid, 
  currentUser,
  isSaving,
  isSubmitting,
  createdUserId,
  employeeId,
  saveCurrentStep
}) {
  const handleNextStep = async () => {
    await nextStep();
  };

  const handleSaveOnly = async () => {
    if (saveCurrentStep) {
      await saveCurrentStep();
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = isFirstStep ? isPersonalInfoValid : true; // Only validate first step
  const showEmployeeId = employeeId && currentStep > 0;
  const canSave = isFirstStep ? isPersonalInfoValid : createdUserId; // Can save if user exists (except first step)

  return (
    <div className="space-y-4">
      {/* Employee ID Display */}
      {showEmployeeId && (
        <div className="flex justify-center">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <p className="text-sm text-green-800">
              <span className="font-medium">Employee ID:</span> {employeeId}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={isFirstStep || isSaving || isSubmitting}
        >
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {/* Save Only Button (for non-first and non-last steps) */}
          {!isFirstStep && !isLastStep && (
            <Button
              variant="outline"
              onClick={handleSaveOnly}
              disabled={!canSave || isSaving || isSubmitting}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          )}

          {isFirstStep && (
            <Button
              variant="outline"
              onClick={skipToReview}
              disabled={!isPersonalInfoValid || isSaving || isSubmitting}
              className="text-blue-600"
            >
              Skip to Review
            </Button>
          )}
          
          {isLastStep ? (
            <RoleButton
              role={currentUser?.role}
              onClick={handleSubmit}
              className="px-8"
              disabled={!createdUserId || isSubmitting || isSaving}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finalizing...
                </>
              ) : (
                'Complete Onboarding'
              )}
            </RoleButton>
          ) : (
            <RoleButton
              role={currentUser?.role}
              onClick={handleNextStep}
              disabled={!canProceed || isSaving || isSubmitting}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isFirstStep ? 'Creating Employee...' : 'Saving...'}
                </>
              ) : (
                isFirstStep ? 'Create & Next' : 'Save & Next'
              )}
            </RoleButton>
          )}
        </div>
      </div>
    </div>
  )
} 