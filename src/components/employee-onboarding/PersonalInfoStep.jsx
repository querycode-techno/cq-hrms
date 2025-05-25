import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export function PersonalInfoStep({ formData, handleInputChange, roles, loadingRoles, errors }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter first name"
            className={errors?.firstName ? "border-red-500" : ""}
          />
          {errors?.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={formData.middleName}
            onChange={(e) => handleInputChange('middleName', e.target.value)}
            placeholder="Enter middle name"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter last name"
            className={errors?.lastName ? "border-red-500" : ""}
          />
          {errors?.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className={errors?.dateOfBirth ? "border-red-500" : ""}
          />
          {errors?.dateOfBirth && (
            <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>
          )}
        </div>
        <div>
          <Label>Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger className={errors?.gender ? "border-red-500" : ""}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          {errors?.gender && (
            <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
          )}
        </div>
        <div>
          <Label>Blood Group</Label>
          <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="primaryContact">Primary Contact *</Label>
          <Input
            id="primaryContact"
            value={formData.primaryContact}
            onChange={(e) => handleInputChange('primaryContact', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={errors?.primaryContact ? "border-red-500" : ""}
          />
          {errors?.primaryContact && (
            <p className="text-sm text-red-500 mt-1">{errors.primaryContact}</p>
          )}
        </div>
        <div>
          <Label htmlFor="personalEmail">Personal Email *</Label>
          <Input
            id="personalEmail"
            type="email"
            value={formData.personalEmail}
            onChange={(e) => handleInputChange('personalEmail', e.target.value)}
            placeholder="personal@email.com"
            className={errors?.personalEmail ? "border-red-500" : ""}
          />
          {errors?.personalEmail && (
            <p className="text-sm text-red-500 mt-1">{errors.personalEmail}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Role *</Label>
        {loadingRoles ? (
          <div className="flex items-center space-x-2 p-3 border rounded-md">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading roles...</span>
          </div>
        ) : (
          <Select value={formData.roleId} onValueChange={(value) => handleInputChange('roleId', value)}>
            <SelectTrigger className={errors?.roleId ? "border-red-500" : ""}>
              <SelectValue placeholder="Select employee role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors?.roleId && (
          <p className="text-sm text-red-500 mt-1">{errors.roleId}</p>
        )}
      </div>
    </div>
  )
} 