"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Building, DollarSign, FileText, Settings, CheckCircle, Loader2, AlertCircle, MapPin, CreditCard } from "lucide-react"
import Link from "next/link"
import { usePermissions } from '@/hooks/usePermissions'
import { useEmployeeForm } from "@/hooks/useEmployeeForm"

// Step Components
import { PersonalInfoStep } from "@/components/employee-onboarding/PersonalInfoStep"
import { EmploymentDetailsStep } from "@/components/employee-onboarding/EmploymentDetailsStep"
import { AddressStep } from "@/components/employee-onboarding/AddressStep"
import { CompensationDetailsStep } from "@/components/employee-onboarding/CompensationDetailsStep"
import { BankDetailsStep } from "@/components/employee-onboarding/BankDetailsStep"
import { DocumentsStep } from "@/components/employee-onboarding/DocumentsStep"
import { SystemComplianceStep } from "@/components/employee-onboarding/SystemComplianceStep"
import { ReviewStep } from "@/components/employee-onboarding/ReviewStep"
import { StepProgress } from "@/components/employee-onboarding/StepProgress"
import { NavigationButtons } from "@/components/employee-onboarding/NavigationButtons"

export default function AddEmployeePage() {
  const { canCreate, user } = usePermissions('employees', 'users')
  const [roles, setRoles] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(true)
  
  const {
    currentStep,
    formData,
    isSubmitting,
    isSaving,
    errors,
    handleInputChange,
    handleNestedChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    nextStep,
    prevStep,
    skipToReview,
    validatePersonalInfo,
    isPersonalInfoValid,
    handleSubmit,
    isPersonalInfoComplete,
    isEmploymentDetailsComplete,
    isCompensationComplete,
    isBankAccountComplete,
    hasDocuments,
    isSystemComplianceComplete,
    createdUserId,
    employeeId,
    saveCurrentStep
  } = useEmployeeForm()

  // Check permissions
  if (!canCreate) {
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
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to create employees.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true)
      const response = await fetch('/api/roles')
      const data = await response.json()
      
      if (response.ok) {
        setRoles(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoadingRoles(false)
    }
  }

  const steps = [
    { 
      id: 'personal', 
      label: 'Personal Info', 
      icon: User,
      isComplete: isPersonalInfoComplete,
      isRequired: true
    },
    { 
      id: 'address', 
      label: 'Address Details', 
      icon: MapPin,
      isComplete: formData.addresses.length > 0 && formData.addresses.some(addr => 
        addr.addressLine1 && addr.city && addr.state && addr.country && addr.pinCode
      ),
      isRequired: false
    },
    { 
      id: 'employment', 
      label: 'Employment', 
      icon: Building,
      isComplete: isEmploymentDetailsComplete,
      isRequired: false
    },
    { 
      id: 'compensation', 
      label: 'Compensation', 
      icon: DollarSign,
      isComplete: isCompensationComplete,
      isRequired: false
    },
    { 
      id: 'bank', 
      label: 'Bank Details', 
      icon: CreditCard,
      isComplete: isBankAccountComplete,
      isRequired: false
    },
    { 
      id: 'documents', 
      label: 'Documents', 
      icon: FileText,
      isComplete: hasDocuments,
      isRequired: false
    },
    { 
      id: 'system', 
      label: 'System & Compliance', 
      icon: Settings,
      isComplete: isSystemComplianceComplete,
      isRequired: false
    },
    { 
      id: 'review', 
      label: 'Review', 
      icon: CheckCircle,
      isComplete: false,
      isRequired: true
    }
  ]

  const stepComponents = [
    <PersonalInfoStep 
      key="personal"
      formData={formData} 
      handleInputChange={handleInputChange}
      roles={roles}
      loadingRoles={loadingRoles}
      errors={errors}
    />,
    <AddressStep 
      key="address"
      formData={formData} 
      handleArrayChange={handleArrayChange}
      addArrayItem={addArrayItem}
      removeArrayItem={removeArrayItem}
      errors={errors}
    />,
    <EmploymentDetailsStep 
      key="employment"
      formData={formData} 
      handleInputChange={handleInputChange}
      errors={errors}
    />,
    <CompensationDetailsStep 
      key="compensation"
      formData={formData} 
      handleInputChange={handleInputChange}
      errors={errors}
    />,
    <BankDetailsStep 
      key="bank"
      formData={formData} 
      handleInputChange={handleInputChange}
      handleNestedChange={handleNestedChange}
      errors={errors}
    />,
    <DocumentsStep 
      key="documents"
      formData={formData} 
      handleArrayChange={handleArrayChange}
      addArrayItem={addArrayItem}
      removeArrayItem={removeArrayItem}
      errors={errors}
    />,
    <SystemComplianceStep 
      key="system"
      formData={formData} 
      handleNestedChange={handleNestedChange}
      handleArrayChange={handleArrayChange}
      errors={errors}
    />,
    <ReviewStep 
      key="review"
      formData={formData}
      steps={steps}
      roles={roles}
    />
  ]

  const currentTheme = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-100 text-gray-700",
    badge: "bg-blue-100 text-blue-800"
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
          <h2 className="text-3xl font-bold tracking-tight">Employee Onboarding</h2>
          <Badge className={currentTheme.badge}>
            Step {currentStep + 1} of {steps.length}
          </Badge>
          {employeeId && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ID: {employeeId}
            </Badge>
          )}
        </div>
        
        {createdUserId && (
          <div className="text-sm text-muted-foreground">
            {isSaving ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <span>✓ Data saved automatically</span>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {errors.submit && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
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
            {steps[currentStep].isRequired && (
              <Badge variant="destructive" className="text-xs">Required</Badge>
            )}
            {!steps[currentStep].isRequired && (
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {stepComponents[currentStep]}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <NavigationButtons
        currentStep={currentStep}
        steps={steps}
        prevStep={prevStep}
        nextStep={nextStep}
        skipToReview={skipToReview}
        handleSubmit={handleSubmit}
        isPersonalInfoValid={isPersonalInfoValid}
        currentUser={user}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
        createdUserId={createdUserId}
        employeeId={employeeId}
        saveCurrentStep={saveCurrentStep}
      />
    </div>
  )
}