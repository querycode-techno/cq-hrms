import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Building2 } from "lucide-react"

export function BankDetailsStep({ formData, handleNestedChange, errors }) {
  const { bankAccount } = formData

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
        <CreditCard className="h-5 w-5" />
        <span>Bank Account Information</span>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Primary Bank Account</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountHolderName">Account Holder Name *</Label>
              <Input
                id="accountHolderName"
                value={bankAccount.accountHolderName}
                onChange={(e) => handleNestedChange('bankAccount', 'accountHolderName', e.target.value)}
                placeholder="Enter account holder name"
                className={errors.accountHolderName ? 'border-red-500' : ''}
              />
              {errors.accountHolderName && (
                <p className="text-sm text-red-500">{errors.accountHolderName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                value={bankAccount.accountNumber}
                onChange={(e) => handleNestedChange('bankAccount', 'accountNumber', e.target.value)}
                placeholder="Enter account number"
                className={errors.accountNumber ? 'border-red-500' : ''}
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-500">{errors.accountNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                value={bankAccount.bankName}
                onChange={(e) => handleNestedChange('bankAccount', 'bankName', e.target.value)}
                placeholder="Enter bank name"
                className={errors.bankName ? 'border-red-500' : ''}
              />
              {errors.bankName && (
                <p className="text-sm text-red-500">{errors.bankName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                value={bankAccount.branchName}
                onChange={(e) => handleNestedChange('bankAccount', 'branchName', e.target.value)}
                placeholder="Enter branch name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code *</Label>
              <Input
                id="ifscCode"
                value={bankAccount.ifscCode}
                onChange={(e) => handleNestedChange('bankAccount', 'ifscCode', e.target.value.toUpperCase())}
                placeholder="Enter IFSC code"
                className={errors.ifscCode ? 'border-red-500' : ''}
              />
              {errors.ifscCode && (
                <p className="text-sm text-red-500">{errors.ifscCode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Select
                value={bankAccount.accountType}
                onValueChange={(value) => handleNestedChange('bankAccount', 'accountType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Salary">Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Bank account details are required for salary processing. 
              Please ensure all information is accurate as per your bank records.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 