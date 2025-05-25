import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export function ReviewStep({ formData, currentTheme }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className={`mx-auto h-16 w-16 ${currentTheme.icon} mb-4`} />
        <h3 className="text-xl font-semibold mb-2">Review Employee Information</h3>
        <p className="text-muted-foreground">Please review all the information before submitting.</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information (Required)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Name:</strong> {`${formData.firstName} ${formData.lastName}`.trim()}</div>
              <div><strong>Email:</strong> {formData.personalEmail}</div>
              <div><strong>Phone:</strong> {formData.primaryContact}</div>
              <div><strong>Date of Birth:</strong> {formData.dateOfBirth}</div>
              <div><strong>Gender:</strong> {formData.gender}</div>
              <div><strong>Address:</strong> {formData.permanentAddress}</div>
            </div>
          </CardContent>
        </Card>

        {(formData.designation || formData.department || formData.dateOfJoining || formData.employeeType) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employment Details (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {formData.designation && <div><strong>Designation:</strong> {formData.designation}</div>}
                {formData.department && <div><strong>Department:</strong> {formData.department}</div>}
                {formData.dateOfJoining && <div><strong>Joining Date:</strong> {formData.dateOfJoining}</div>}
                {formData.employeeType && <div><strong>Employee Type:</strong> {formData.employeeType}</div>}
                {formData.reportingManager && <div><strong>Reporting Manager:</strong> {formData.reportingManager}</div>}
                {formData.workLocation && <div><strong>Work Location:</strong> {formData.workLocation}</div>}
              </div>
            </CardContent>
          </Card>
        )}

        {(formData.ctc || formData.basicSalary || formData.panNumber) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compensation Details (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {formData.ctc && <div><strong>CTC:</strong> ₹{formData.ctc}</div>}
                {formData.basicSalary && <div><strong>Basic Salary:</strong> ₹{formData.basicSalary}</div>}
                {formData.hra && <div><strong>HRA:</strong> ₹{formData.hra}</div>}
                {formData.panNumber && <div><strong>PAN:</strong> {formData.panNumber}</div>}
                {formData.bankAccount && <div><strong>Bank Account:</strong> {formData.bankAccount}</div>}
                {formData.ifscCode && <div><strong>IFSC Code:</strong> {formData.ifscCode}</div>}
              </div>
            </CardContent>
          </Card>
        )}

        {formData.softwareAccess.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Access (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.softwareAccess.map((software) => (
                  <span key={software} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {software}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {formData.skills && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {formData.skills && <div><strong>Skills:</strong> {formData.skills}</div>}
                {formData.medicalNeeds && <div className="mt-2"><strong>Medical Requirements:</strong> {formData.medicalNeeds}</div>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 