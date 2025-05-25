"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Building, DollarSign, FileText, Settings, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { useRole } from "@/components/role-provider"
import { useEmployeeEditForm } from "@/hooks/useEmployeeEditForm"

// Reusing Step Components from add page
import { PersonalInfoStep } from "@/components/employee-onboarding/PersonalInfoStep"
import { EmploymentDetailsStep } from "@/components/employee-onboarding/EmploymentDetailsStep"
import { CompensationDetailsStep } from "@/components/employee-onboarding/CompensationDetailsStep"
import { DocumentsStep } from "@/components/employee-onboarding/DocumentsStep"
import { SystemComplianceStep } from "@/components/employee-onboarding/SystemComplianceStep"
import { ReviewStep } from "@/components/employee-onboarding/ReviewStep"
import { StepProgress } from "@/components/employee-onboarding/StepProgress"
import { EditNavigationButtons } from "@/components/employee-onboarding/EditNavigationButtons"

export default function EditEmployeePage() {
  const { currentUser, currentTheme } = useRole()
  const params = useParams()
  const employeeId = params.id

  const {
    currentStep,
    formData,
    loading,
    error,
    handleInputChange,
    handleArrayChange,
    nextStep,
    prevStep,
    skipToReview,
    isPersonalInfoValid,
    validatePersonalInfo,
    handleSubmit
  } = useEmployeeEditForm(employeeId)

  const steps = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'employment', label: 'Employment', icon: Building },
    { id: 'compensation', label: 'Compensation', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'system', label: 'System & Compliance', icon: Settings },
    { id: 'review', label: 'Review', icon: CheckCircle }
  ]

  const stepComponents = [
    <PersonalInfoStep 
      key="personal"
      formData={formData} 
      handleInputChange={handleInputChange} 
    />,
    <EmploymentDetailsStep 
      key="employment"
      formData={formData} 
      handleInputChange={handleInputChange} 
    />,
    <CompensationDetailsStep 
      key="compensation"
      formData={formData} 
      handleInputChange={handleInputChange} 
    />,
    <DocumentsStep 
      key="documents"
      formData={formData} 
      handleInputChange={handleInputChange} 
    />,
    <SystemComplianceStep 
      key="system"
      formData={formData} 
      handleInputChange={handleInputChange}
      handleArrayChange={handleArrayChange}
    />,
    <ReviewStep 
      key="review"
      formData={formData} 
      currentTheme={currentTheme} 
    />
  ]

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-muted-foreground">Loading employee data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/employees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Error Loading Employee</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Link href="/employees">
              <Button>Return to Employee List</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/employees">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employees
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-3xl font-bold tracking-tight">Edit Employee</h2>
          <Badge className={currentTheme.badge}>
            {formData.firstName && formData.lastName 
              ? `${formData.firstName} ${formData.lastName}` 
              : `Employee #${employeeId}`}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
      </div>

      {/* Employee ID and Status Display */}
      {formData.employeeId && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium">{formData.employeeId}</p>
                </div>
                {formData.designation && (
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{formData.designation}</p>
                  </div>
                )}
                {formData.department && (
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{formData.department}</p>
                  </div>
                )}
              </div>
              <Badge className="bg-green-100 text-green-800">
                {formData.employmentStatus || "Active"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Steps */}
      <StepProgress 
        steps={steps} 
        currentStep={currentStep} 
        currentTheme={currentTheme} 
      />

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{steps[currentStep].label}</span>
            {currentStep === 0 && <Badge variant="destructive" className="text-xs">Required</Badge>}
            {currentStep > 0 && currentStep < steps.length - 1 && <Badge variant="secondary" className="text-xs">Optional</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {stepComponents[currentStep]}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <EditNavigationButtons
        currentStep={currentStep}
        steps={steps}
        prevStep={prevStep}
        nextStep={nextStep}
        skipToReview={skipToReview}
        handleSubmit={handleSubmit}
        isPersonalInfoValid={isPersonalInfoValid}
        currentUser={currentUser}
        loading={loading}
      />
    </div>
  )
}
