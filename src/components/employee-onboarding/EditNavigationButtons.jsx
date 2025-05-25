import { Button } from "@/components/ui/button"
import { RoleButton } from "@/components/ui/role-button"

export function EditNavigationButtons({ 
  currentStep, 
  steps, 
  prevStep, 
  nextStep, 
  skipToReview, 
  handleSubmit, 
  isPersonalInfoValid, 
  currentUser,
  loading 
}) {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === 0 || loading}
      >
        Previous
      </Button>
      
      <div className="flex space-x-2">
        {currentStep === 0 && (
          <Button
            variant="outline"
            onClick={skipToReview}
            disabled={!isPersonalInfoValid || loading}
            className="text-blue-600"
          >
            Skip to Review
          </Button>
        )}
        
        {currentStep === steps.length - 1 ? (
          <RoleButton
            role={currentUser.role}
            onClick={handleSubmit}
            className="px-8"
            disabled={!isPersonalInfoValid || loading}
          >
            {loading ? "Updating..." : "Update Employee"}
          </RoleButton>
        ) : (
          <RoleButton
            role={currentUser.role}
            onClick={nextStep}
            disabled={(currentStep === 0 && !isPersonalInfoValid) || loading}
          >
            Next Step
          </RoleButton>
        )}
      </div>
    </div>
  )
} 