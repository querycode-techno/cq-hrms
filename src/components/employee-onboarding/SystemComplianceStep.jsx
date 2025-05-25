import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

export function SystemComplianceStep({ formData, handleNestedChange, handleArrayChange }) {
  const systemCompliance = formData.systemCompliance || {};
  
  const handleSoftwareAccessChange = (software, checked) => {
    const currentAccess = systemCompliance.softwareAccess || [];
    const newAccess = checked 
      ? [...currentAccess, software]
      : currentAccess.filter(item => item !== software);
    
    handleNestedChange('systemCompliance', 'softwareAccess', newAccess);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Software/Tool Access Required</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['ERP System', 'CRM', 'HRMS', 'Slack', 'Jira', 'GitHub', 'Microsoft Office', 'Google Workspace', 'VPN Access'].map((software) => (
            <div key={software} className="flex items-center space-x-2">
              <Checkbox
                id={software}
                checked={(systemCompliance.softwareAccess || []).includes(software)}
                onCheckedChange={(checked) => handleSoftwareAccessChange(software, checked)}
              />
              <Label htmlFor={software} className="text-sm">{software}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Hardware Requirements</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="accessCardRequired"
              checked={systemCompliance.accessCardRequired || false}
              onCheckedChange={(checked) => handleNestedChange('systemCompliance', 'accessCardRequired', checked)}
            />
            <Label htmlFor="accessCardRequired" className="text-sm">Access Card Required</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="biometricEnrollment"
              checked={systemCompliance.biometricEnrollment || false}
              onCheckedChange={(checked) => handleNestedChange('systemCompliance', 'biometricEnrollment', checked)}
            />
            <Label htmlFor="biometricEnrollment" className="text-sm">Biometric Enrollment</Label>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Compliance & Policy Acknowledgment</h3>
        <div className="space-y-3">
          {[
            { key: 'codeOfConductAccepted', label: 'Code of Conduct Acknowledgement' },
            { key: 'hrPoliciesAccepted', label: 'HR Policies Acknowledgement' },
            { key: 'leavePolicyAccepted', label: 'Leave Policy Accepted' },
            { key: 'itSecurityPolicyAccepted', label: 'IT & Security Policy Accepted' },
            { key: 'ndaAccepted', label: 'NDA / Confidentiality Clause' }
          ].map((policy) => (
            <div key={policy.key} className="flex items-center space-x-2">
              <Checkbox
                id={policy.key}
                checked={systemCompliance[policy.key] || false}
                onCheckedChange={(checked) => handleNestedChange('systemCompliance', policy.key, checked)}
              />
              <Label htmlFor={policy.key}>{policy.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Optional Fields</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="skills">Skills / Certifications</Label>
            <Textarea
              id="skills"
              value={systemCompliance.skills || ''}
              onChange={(e) => handleNestedChange('systemCompliance', 'skills', e.target.value)}
              placeholder="List relevant skills and certifications"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="medicalNeeds">Medical Requirements / Allergies</Label>
            <Textarea
              id="medicalNeeds"
              value={systemCompliance.medicalNeeds || ''}
              onChange={(e) => handleNestedChange('systemCompliance', 'medicalNeeds', e.target.value)}
              placeholder="Any medical requirements or allergies"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 