import { useState, useEffect } from "react"

// Mock function to simulate fetching employee data
const fetchEmployeeData = async (employeeId) => {
  // This would typically be an API call
  // For demo purposes, returning mock data based on ID
  const mockEmployees = {
    "1": {
      firstName: "John",
      middleName: "",
      lastName: "Doe",
      dateOfBirth: "1990-05-15",
      gender: "Male",
      bloodGroup: "O+",
      nationality: "Indian",
      maritalStatus: "Single",
      primaryContact: "+1-555-0123",
      alternateContact: "",
      personalEmail: "john.doe@personal.com",
      officialEmail: "john.doe@company.com",
      emergencyContactName: "Jane Doe",
      emergencyContactNumber: "+1-555-0124",
      permanentAddress: "123 Main St, Anytown, ST 12345",
      currentAddress: "123 Main St, Anytown, ST 12345",
      
      // Employment Details
      employeeId: "EMP001",
      designation: "Software Engineer",
      department: "Engineering",
      reportingManager: "Sarah Wilson",
      workLocation: "Office",
      dateOfJoining: "2023-01-15",
      employeeType: "Full-time",
      employmentStatus: "Active",
      shiftTimings: "9 AM - 5 PM",
      workingHours: "40",
      
      // Compensation Details
      ctc: "1200000",
      basicSalary: "600000",
      hra: "240000",
      paymentCycle: "Monthly",
      bankAccount: "1234567890",
      ifscCode: "SBIN0001234",
      bankName: "State Bank of India",
      panNumber: "ABCDE1234F",
      uanNumber: "123456789012",
      esicNumber: "ESI123456",
      
      // System Access
      laptopDeviceId: "LAP001",
      softwareAccess: ["ERP System", "Slack", "GitHub"],
      accessCardRequired: true,
      biometricEnrollment: true,
      
      // Compliance
      codeOfConductAccepted: true,
      hrPoliciesAccepted: true,
      leavePolicyAccepted: true,
      itSecurityPolicyAccepted: true,
      ndaAccepted: true,
      
      // Optional Fields
      skills: "JavaScript, React, Node.js, Python",
      linkedinProfile: "https://linkedin.com/in/johndoe",
      githubProfile: "https://github.com/johndoe",
      hobbies: "Reading, Gaming, Photography",
      languages: "English, Hindi",
      medicalNeeds: "None"
    },
    "2": {
      firstName: "Sarah",
      lastName: "Wilson",
      dateOfBirth: "1988-11-20",
      gender: "Female",
      primaryContact: "+1-555-0125",
      personalEmail: "sarah.wilson@personal.com",
      permanentAddress: "456 Oak Ave, Somewhere, ST 67890",
      designation: "Product Manager",
      department: "Product",
      dateOfJoining: "2022-11-20",
      employeeType: "Full-time",
      ctc: "1500000",
      basicSalary: "750000",
      softwareAccess: ["ERP System", "CRM", "Slack"],
      skills: "Product Management, Strategy, Data Analysis"
    }
  }

  return mockEmployees[employeeId] || null
}

export function useEmployeeEditForm(employeeId) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    nationality: "Indian",
    maritalStatus: "",
    primaryContact: "",
    alternateContact: "",
    personalEmail: "",
    officialEmail: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    permanentAddress: "",
    currentAddress: "",
    
    // Employment Details
    employeeId: "",
    designation: "",
    department: "",
    reportingManager: "",
    workLocation: "",
    dateOfJoining: "",
    employeeType: "",
    employmentStatus: "Active",
    shiftTimings: "",
    workingHours: "40",
    
    // Compensation Details
    ctc: "",
    basicSalary: "",
    hra: "",
    paymentCycle: "Monthly",
    bankAccount: "",
    ifscCode: "",
    bankName: "",
    panNumber: "",
    uanNumber: "",
    esicNumber: "",
    
    // System Access
    laptopDeviceId: "",
    softwareAccess: [],
    accessCardRequired: false,
    biometricEnrollment: false,
    
    // Compliance
    codeOfConductAccepted: false,
    hrPoliciesAccepted: false,
    leavePolicyAccepted: false,
    itSecurityPolicyAccepted: false,
    ndaAccepted: false,
    
    // Probation & Review
    probationDuration: "6",
    probationReviewDate: "",
    initialGoals: "",
    buddyMentor: "",
    
    // Optional Fields
    skills: "",
    linkedinProfile: "",
    githubProfile: "",
    hobbies: "",
    languages: "",
    medicalNeeds: ""
  })

  // Load employee data on mount
  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true)
        const data = await fetchEmployeeData(employeeId)
        
        if (data) {
          setFormData(prev => ({ ...prev, ...data }))
        } else {
          setError("Employee not found")
        }
      } catch (err) {
        setError("Failed to load employee data")
        console.error("Error loading employee:", err)
      } finally {
        setLoading(false)
      }
    }

    if (employeeId) {
      loadEmployeeData()
    }
  }, [employeeId])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipToReview = () => {
    setCurrentStep(5) // Review step
  }

  // Non-state-updating validation (for use in render/disabled props)
  const isPersonalInfoValid = () => {
    const required = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'primaryContact', 'personalEmail', 'permanentAddress']
    return required.every(field => formData[field] && formData[field].trim() !== '')
  }

  // State-updating validation (for use in event handlers)
  const validatePersonalInfo = () => {
    const required = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'primaryContact', 'personalEmail', 'permanentAddress']
    return required.every(field => formData[field] && formData[field].trim() !== '')
  }

  const handleSubmit = async () => {
    if (!validatePersonalInfo()) {
      alert("Please fill in all required personal information fields.")
      return
    }
    
    try {
      // Here you would typically send the updated data to your backend
      console.log("Updated employee data:", formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert("Employee information updated successfully!")
      
      // Example: await updateEmployeeData(employeeId, formData)
    } catch (err) {
      console.error("Error updating employee:", err)
      alert("Failed to update employee information. Please try again.")
    }
  }

  return {
    currentStep,
    setCurrentStep,
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
  }
} 