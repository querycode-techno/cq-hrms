import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Calculator, Receipt } from "lucide-react"

export function CompensationDetailsStep({ formData, handleInputChange, errors }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
        <DollarSign className="h-5 w-5" />
        <span>Compensation Details</span>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Salary Structure</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctc">Cost to Company (CTC) *</Label>
              <Input
                id="ctc"
                type="number"
                value={formData.ctc}
                onChange={(e) => handleInputChange('ctc', e.target.value)}
                placeholder="Enter annual CTC"
                className={errors.ctc ? 'border-red-500' : ''}
              />
              {errors.ctc && (
                <p className="text-sm text-red-500">{errors.ctc}</p>
              )}
              <p className="text-xs text-gray-500">Annual package in INR</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basicSalary">Basic Salary *</Label>
              <Input
                id="basicSalary"
                type="number"
                value={formData.basicSalary}
                onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                placeholder="Enter basic salary"
                className={errors.basicSalary ? 'border-red-500' : ''}
              />
              {errors.basicSalary && (
                <p className="text-sm text-red-500">{errors.basicSalary}</p>
              )}
              <p className="text-xs text-gray-500">Monthly basic salary in INR</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hra">House Rent Allowance (HRA)</Label>
              <Input
                id="hra"
                type="number"
                value={formData.hra}
                onChange={(e) => handleInputChange('hra', e.target.value)}
                placeholder="Enter HRA amount"
              />
              <p className="text-xs text-gray-500">Monthly HRA in INR</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentCycle">Payment Cycle</Label>
              <Select
                value={formData.paymentCycle}
                onValueChange={(value) => handleInputChange('paymentCycle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Tax Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input
                id="panNumber"
                value={formData.panNumber}
                onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                placeholder="Enter PAN number"
                maxLength={10}
                className={errors.panNumber ? 'border-red-500' : ''}
              />
              {errors.panNumber && (
                <p className="text-sm text-red-500">{errors.panNumber}</p>
              )}
              <p className="text-xs text-gray-500">Required for tax deductions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-700">
          <strong>Note:</strong> Compensation details will be used for payroll processing. 
          Please verify all amounts with HR before finalizing.
        </p>
      </div>
    </div>
  )
} 