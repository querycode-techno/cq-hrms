import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EmploymentDetailsStep({ formData, handleInputChange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="designation">Designation / Job Title</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => handleInputChange('designation', e.target.value)}
            placeholder="e.g., Software Engineer"
          />
        </div>
        <div>
          <Label>Department</Label>
          <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfJoining">Date of Joining</Label>
          <Input
            id="dateOfJoining"
            type="date"
            value={formData.dateOfJoining}
            onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
          />
        </div>
        <div>
          <Label>Employee Type</Label>
          <Select value={formData.employeeType} onValueChange={(value) => handleInputChange('employeeType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Intern">Intern</SelectItem>
              <SelectItem value="Consultant">Consultant</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reportingManager">Reporting Manager</Label>
          <Input
            id="reportingManager"
            value={formData.reportingManager}
            onChange={(e) => handleInputChange('reportingManager', e.target.value)}
            placeholder="Manager's name"
          />
        </div>
        <div>
          <Label htmlFor="workLocation">Work Location</Label>
          <Select value={formData.workLocation} onValueChange={(value) => handleInputChange('workLocation', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select work location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
} 