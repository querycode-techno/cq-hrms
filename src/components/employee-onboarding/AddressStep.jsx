import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

export function AddressStep({ formData, handleArrayChange, addArrayItem, removeArrayItem, errors }) {
  const addNewAddress = () => {
    const newAddress = {
      addressType: 'Current',
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
    addArrayItem('addresses', newAddress)
  }

  const handleAddressChange = (index, field, value) => {
    if (field.includes('.')) {
      // Handle nested fields like contactPerson.name
      const [parent, child] = field.split('.')
      const currentAddress = formData.addresses[index]
      const updatedAddress = {
        ...currentAddress,
        [parent]: {
          ...currentAddress[parent],
          [child]: value
        }
      }
      handleArrayChange('addresses', index, null, updatedAddress)
    } else {
      handleArrayChange('addresses', index, field, value)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Address Information</h3>
          <p className="text-sm text-muted-foreground">
            Add permanent and current addresses for the employee
          </p>
        </div>
        <Button onClick={addNewAddress} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {formData.addresses.map((address, index) => (
        <Card key={index}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Address {index + 1}
              </CardTitle>
              {formData.addresses.length > 1 && (
                <Button
                  onClick={() => removeArrayItem('addresses', index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Address Type *</Label>
                <Select 
                  value={address.addressType} 
                  onValueChange={(value) => handleAddressChange(index, 'addressType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select address type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Permanent">Permanent</SelectItem>
                    <SelectItem value="Current">Current</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`country-${index}`}>Country *</Label>
                <Select 
                  value={address.country} 
                  onValueChange={(value) => handleAddressChange(index, 'country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor={`addressLine1-${index}`}>Address Line 1 *</Label>
              <Input
                id={`addressLine1-${index}`}
                value={address.addressLine1}
                onChange={(e) => handleAddressChange(index, 'addressLine1', e.target.value)}
                placeholder="House/Flat number, Building name"
              />
            </div>

            <div>
              <Label htmlFor={`addressLine2-${index}`}>Address Line 2</Label>
              <Input
                id={`addressLine2-${index}`}
                value={address.addressLine2}
                onChange={(e) => handleAddressChange(index, 'addressLine2', e.target.value)}
                placeholder="Street, Area, Locality"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`landmark-${index}`}>Landmark</Label>
                <Input
                  id={`landmark-${index}`}
                  value={address.landmark}
                  onChange={(e) => handleAddressChange(index, 'landmark', e.target.value)}
                  placeholder="Near landmark"
                />
              </div>
              <div>
                <Label htmlFor={`city-${index}`}>City *</Label>
                <Input
                  id={`city-${index}`}
                  value={address.city}
                  onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                  placeholder="City name"
                />
              </div>
              <div>
                <Label htmlFor={`pinCode-${index}`}>PIN Code *</Label>
                <Input
                  id={`pinCode-${index}`}
                  value={address.pinCode}
                  onChange={(e) => handleAddressChange(index, 'pinCode', e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`state-${index}`}>State *</Label>
              <Input
                id={`state-${index}`}
                value={address.state}
                onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                placeholder="State name"
              />
            </div>

            {/* Contact Person Details */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Contact Person (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`contactName-${index}`}>Contact Name</Label>
                  <Input
                    id={`contactName-${index}`}
                    value={address.contactPerson.name}
                    onChange={(e) => handleAddressChange(index, 'contactPerson.name', e.target.value)}
                    placeholder="Contact person name"
                  />
                </div>
                <div>
                  <Label htmlFor={`contactPhone-${index}`}>Contact Phone</Label>
                  <Input
                    id={`contactPhone-${index}`}
                    value={address.contactPerson.phoneNumber}
                    onChange={(e) => handleAddressChange(index, 'contactPerson.phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Select 
                    value={address.contactPerson.relationship} 
                    onValueChange={(value) => handleAddressChange(index, 'contactPerson.relationship', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Self">Self</SelectItem>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {formData.addresses.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-muted-foreground mb-4">No addresses added yet</p>
          <Button onClick={addNewAddress} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add First Address
          </Button>
        </div>
      )}
    </div>
  )
} 