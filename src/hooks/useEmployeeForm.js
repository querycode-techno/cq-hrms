import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const initialFormData = {
    // Personal Information
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  personalEmail: '',
  primaryContact: '',
    
    // Employment Details
  designation: '',
  department: '',
  employeeType: 'Full-time',
  reportingManager: '',
  workLocation: 'Office',
  shiftTimings: '9 AM - 5 PM',
  workingHours: 40,
  roleId: '',
    
    // Compensation Details
  ctc: '',
  basicSalary: '',
  hra: '',
  paymentCycle: 'Monthly',
  panNumber: '',
  
  // Bank Account Details
  bankAccount: {
    accountNumber: '',
    accountHolderName: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    accountType: 'Savings'
  },
  
  // Address Details
  addresses: [
    {
      addressType: 'Permanent',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: '',
      country: 'India',
      pinCode: '',
      contactPerson: {
        name: '',
        phoneNumber: '',
        relationship: 'Self'
      }
    }
  ],
  
  // Documents
  documents: [],
  
  // System Compliance
  systemCompliance: {
    softwareAccess: [],
    accessCardRequired: false,
    biometricEnrollment: false,
    codeOfConductAccepted: false,
    hrPoliciesAccepted: false,
    leavePolicyAccepted: false,
    itSecurityPolicyAccepted: false,
    ndaAccepted: false,
    skills: '',
    medicalNeeds: ''
  }
};

export function useEmployeeForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // For individual step saving
  const [errors, setErrors] = useState({});
  const [createdUserId, setCreatedUserId] = useState(null); // Track created user ID
  const [employeeId, setEmployeeId] = useState(null); // Track employee ID for display

  // Handle input changes
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  }, [errors]);

  // Handle nested object changes (like bankAccount, systemCompliance)
  const handleNestedChange = useCallback((section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);

  // Handle array changes (like addresses, documents, softwareAccess)
  const handleArrayChange = useCallback((field, index, subField, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      if (subField) {
        newArray[index] = {
          ...newArray[index],
          [subField]: value
        };
      } else {
        newArray[index] = value;
      }
      return {
        ...prev,
        [field]: newArray
      };
    });
  }, []);

  // Add new item to array
  const addArrayItem = useCallback((field, newItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  }, []);

  // Remove item from array
  const removeArrayItem = useCallback((field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  // Validation functions that don't update state (for use in render/disabled props)
  const isPersonalInfoValid = useCallback(() => {
    return formData.firstName.trim() && 
           formData.lastName.trim() && 
           formData.personalEmail.trim() && 
           /\S+@\S+\.\S+/.test(formData.personalEmail) &&
           formData.primaryContact.trim() && 
           formData.dateOfBirth && 
           formData.gender && 
           formData.roleId;
  }, [formData]);

  const isEmploymentDetailsValid = useCallback(() => {
    return formData.department;
  }, [formData]);

  const isBankAccountValid = useCallback(() => {
    const { bankAccount } = formData;
    if (!bankAccount.accountNumber) return true; // Optional section
    
    return bankAccount.accountHolderName && 
           bankAccount.bankName && 
           bankAccount.ifscCode;
  }, [formData]);

  // Validation functions that update state (for use in event handlers)
  const validatePersonalInfo = useCallback(() => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.personalEmail.trim()) {
      newErrors.personalEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.personalEmail)) {
      newErrors.personalEmail = 'Email is invalid';
    }
    
    if (!formData.primaryContact.trim()) {
      newErrors.primaryContact = 'Phone number is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateEmploymentDetails = useCallback(() => {
    const newErrors = {};
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateBankAccount = useCallback(() => {
    const newErrors = {};
    const { bankAccount } = formData;
    
    if (bankAccount.accountNumber && !bankAccount.accountHolderName) {
      newErrors.accountHolderName = 'Account holder name is required';
    }
    
    if (bankAccount.accountNumber && !bankAccount.bankName) {
      newErrors.bankName = 'Bank name is required';
    }
    
    if (bankAccount.accountNumber && !bankAccount.ifscCode) {
      newErrors.ifscCode = 'IFSC code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Step-by-step save functions (defined before navigation functions)
  const savePersonalInfo = useCallback(async () => {
    if (!validatePersonalInfo()) {
      return false;
    }

    try {
      setIsSaving(true);
      
      const userPayload = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        personalEmail: formData.personalEmail,
        primaryContact: formData.primaryContact,
        roleId: formData.roleId,
        department: formData.department || 'General' // Provide default if not set
      };

      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload),
      });

      const data = await response.json();

      if (response.ok) {
        const userId = data.data.id || data.data._id;
        const empId = data.data.employeeId;
        setCreatedUserId(userId);
        setEmployeeId(empId);
        setErrors({});
        return true;
      } else {
        setErrors({ submit: data.error || 'Failed to create employee' });
        return false;
      }
    } catch (error) {
      console.error('Error saving personal info:', error);
      setErrors({ submit: 'Failed to save personal information' });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData, validatePersonalInfo]);

  const saveAddresses = useCallback(async () => {
    if (!createdUserId) {
      setErrors({ submit: 'User must be created first' });
      return false;
    }

    try {
      setIsSaving(true);
      
      if (formData.addresses && formData.addresses.length > 0) {
        const validAddresses = formData.addresses.filter(addr => 
          addr.addressLine1 && addr.city && addr.state && addr.country && addr.pinCode
        );

        if (validAddresses.length > 0) {
          const response = await fetch(`/api/admin/employees/${createdUserId}/addresses`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ addresses: validAddresses }),
          });

          if (!response.ok) {
            const data = await response.json();
            setErrors({ submit: data.error || 'Failed to save addresses' });
            return false;
          }
        }
      }
      
      setErrors({});
      return true;
    } catch (error) {
      console.error('Error saving addresses:', error);
      setErrors({ submit: 'Failed to save addresses' });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData.addresses, createdUserId]);

  const saveEmploymentDetails = useCallback(async () => {
    if (!createdUserId) {
      setErrors({ submit: 'User must be created first' });
      return false;
    }

    try {
      setIsSaving(true);
      
      const employmentData = {
        designation: formData.designation,
        department: formData.department,
        employeeType: formData.employeeType,
        reportingManager: formData.reportingManager,
        workLocation: formData.workLocation,
        shiftTimings: formData.shiftTimings,
        workingHours: formData.workingHours
      };

      const response = await fetch(`/api/admin/employees/${createdUserId}/employment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employmentData),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to save employment details' });
        return false;
      }
      
      setErrors({});
      return true;
    } catch (error) {
      console.error('Error saving employment details:', error);
      setErrors({ submit: 'Failed to save employment details' });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData, createdUserId]);

  const saveCompensationDetails = useCallback(async () => {
    if (!createdUserId) {
      setErrors({ submit: 'User must be created first' });
      return false;
    }

    try {
      setIsSaving(true);
      
      // Save compensation details only (no bank account here)
      if (formData.ctc || formData.basicSalary) {
        const compensationData = {
          ctc: formData.ctc,
          basicSalary: formData.basicSalary,
          hra: formData.hra,
          paymentCycle: formData.paymentCycle,
          panNumber: formData.panNumber
        };

        const compensationResponse = await fetch(`/api/admin/employees/${createdUserId}/compensation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(compensationData),
        });

        if (!compensationResponse.ok) {
          const data = await compensationResponse.json();
          setErrors({ submit: data.error || 'Failed to save compensation details' });
          return false;
        }
      }
      
      setErrors({});
      return true;
    } catch (error) {
      console.error('Error saving compensation details:', error);
      setErrors({ submit: 'Failed to save compensation details' });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData, createdUserId]);

  const saveBankDetails = useCallback(async () => {
    if (!createdUserId) {
      setErrors({ submit: 'User must be created first' });
      return false;
    }

    try {
      setIsSaving(true);
      
      // Save bank account details
      if (formData.bankAccount && formData.bankAccount.accountNumber) {
        const bankResponse = await fetch(`/api/admin/employees/${createdUserId}/bank-accounts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData.bankAccount),
        });

        if (!bankResponse.ok) {
          const data = await bankResponse.json();
          setErrors({ submit: data.error || 'Failed to save bank account details' });
          return false;
        }
      }
      
      setErrors({});
      return true;
    } catch (error) {
      console.error('Error saving bank details:', error);
      setErrors({ submit: 'Failed to save bank details' });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData.bankAccount, createdUserId]);

  const saveDocuments = useCallback(async () => {
    if (!createdUserId) {
      setErrors({ submit: 'User must be created first' });
      return false;
    }

    try {
      setIsSaving(true);
      
      if (formData.documents && formData.documents.length > 0) {
        const response = await fetch(`/api/admin/employees/${createdUserId}/documents`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ documents: formData.documents }),
        });

        if (!response.ok) {
          const data = await response.json();
          setErrors({ submit: data.error || 'Failed to save documents' });
          return false;
        }
      }
      
      setErrors({});
      return true;
    } catch (error) {
      console.error('Error saving documents:', error);
      setErrors({ submit: 'Failed to save documents' });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData.documents, createdUserId]);

  const saveSystemCompliance = useCallback(async () => {
    if (!createdUserId) {
      setErrors({ submit: 'User must be created first' });
      return false;
    }

    try {
      setIsSaving(true);
      
      if (formData.systemCompliance) {
        const response = await fetch(`/api/admin/employees/${createdUserId}/system-compliance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData.systemCompliance),
        });

        if (!response.ok) {
          const data = await response.json();
          setErrors({ submit: data.error || 'Failed to save system compliance' });
          return false;
        }
      }
      
      setErrors({});
      return true;
    } catch (error) {
      console.error('Error saving system compliance:', error);
      setErrors({ submit: 'Failed to save system compliance' });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData.systemCompliance, createdUserId]);

  // Save current step without moving to next
  const saveCurrentStep = useCallback(async () => {
    switch (currentStep) {
      case 0: // Personal Info
        return await savePersonalInfo();
      case 1: // Address Details
        return await saveAddresses();
      case 2: // Employment Details
        return await saveEmploymentDetails();
      case 3: // Compensation Details
        return await saveCompensationDetails();
      case 4: // Bank Details
        return await saveBankDetails();
      case 5: // Documents
        return await saveDocuments();
      case 6: // System & Compliance
        return await saveSystemCompliance();
      default:
        return true;
    }
  }, [currentStep, savePersonalInfo, saveAddresses, saveEmploymentDetails, saveCompensationDetails, saveBankDetails, saveDocuments, saveSystemCompliance]);

  // Navigation functions (defined after save functions)
  const nextStep = useCallback(async () => {
    let saveSuccess = true;
    
    // Save current step data before moving to next step
    switch (currentStep) {
      case 0: // Personal Info - Create user
        saveSuccess = await savePersonalInfo();
        break;
      case 1: // Address Details
        saveSuccess = await saveAddresses();
        break;
      case 2: // Employment Details
        saveSuccess = await saveEmploymentDetails();
        break;
      case 3: // Compensation Details
        saveSuccess = await saveCompensationDetails();
        break;
      case 4: // Bank Details
        saveSuccess = await saveBankDetails();
        break;
      case 5: // Documents
        saveSuccess = await saveDocuments();
        break;
      case 6: // System & Compliance
        saveSuccess = await saveSystemCompliance();
        break;
      default:
        saveSuccess = true;
    }
    
    // Only proceed to next step if save was successful
    if (saveSuccess && currentStep < 7) { // Now 8 steps total (0-7)
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, savePersonalInfo, saveAddresses, saveEmploymentDetails, saveCompensationDetails, saveBankDetails, saveDocuments, saveSystemCompliance]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipToReview = useCallback(() => {
    setCurrentStep(7); // Review step is now at index 7
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  // Submit function (final step - just redirect since data is already saved)
  const handleSubmit = useCallback(async () => {
    if (!createdUserId) {
      setErrors({ submit: 'No employee data found. Please start over.' });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // All data has already been saved step-by-step
      // Just redirect to employee list or profile
      router.push('/employees');

    } catch (error) {
      console.error('Error completing onboarding:', error);
      setErrors({ submit: 'Failed to complete onboarding' });
    } finally {
      setIsSubmitting(false);
    }
  }, [createdUserId, router]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setErrors({});
  }, []);

  // Update specific sections
  const updatePersonalInfo = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const updateEmploymentDetails = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const updateCompensationDetails = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const updateBankAccount = useCallback((data) => {
    setFormData(prev => ({
      ...prev,
      bankAccount: { ...prev.bankAccount, ...data }
    }));
  }, []);

  const updateSystemCompliance = useCallback((data) => {
    setFormData(prev => ({
      ...prev,
      systemCompliance: { ...prev.systemCompliance, ...data }
    }));
  }, []);

  return {
    // State
    currentStep,
    formData,
    isSubmitting,
    isSaving,
    errors,
    
    // Navigation
    nextStep,
    prevStep,
    skipToReview,
    goToStep,
    
    // Data manipulation
    handleInputChange,
    handleNestedChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    
    // Section updates
    updatePersonalInfo,
    updateEmploymentDetails,
    updateCompensationDetails,
    updateBankAccount,
    updateSystemCompliance,
    
    // Validation
    validatePersonalInfo,
    validateEmploymentDetails,
    validateBankAccount,
    
    // Non-state-updating validation (for render/disabled props)
    isPersonalInfoValid,
    isEmploymentDetailsValid,
    isBankAccountValid,
    
    // Actions
    handleSubmit,
    resetForm,
    
    // Computed values
    isPersonalInfoComplete: isPersonalInfoValid(),
    isEmploymentDetailsComplete: isEmploymentDetailsValid(),
    isCompensationComplete: formData.ctc || formData.basicSalary,
    isBankAccountComplete: isBankAccountValid(),
    hasDocuments: formData.documents.length > 0,
    isSystemComplianceComplete: formData.systemCompliance.codeOfConductAccepted && formData.systemCompliance.hrPoliciesAccepted,
    
    // Tracked IDs
    createdUserId,
    employeeId,
    
    // Step-by-step save functions
    savePersonalInfo,
    saveAddresses,
    saveEmploymentDetails,
    saveCompensationDetails,
    saveBankDetails,
    saveDocuments,
    saveSystemCompliance,
    saveCurrentStep
  };
} 