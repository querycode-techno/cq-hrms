import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

export function DocumentsStep({ formData, handleInputChange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Resume / CV</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <span className="text-sm text-blue-600 hover:text-blue-800">Upload Resume</span>
            </div>
            <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 5MB</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Government ID Proof</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <span className="text-sm text-blue-600 hover:text-blue-800">Upload ID Proof</span>
            </div>
            <p className="text-xs text-muted-foreground">Aadhar, PAN, Passport</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Address Proof</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <span className="text-sm text-blue-600 hover:text-blue-800">Upload Address Proof</span>
            </div>
            <p className="text-xs text-muted-foreground">Utility bill, Bank statement</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Educational Certificates</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <span className="text-sm text-blue-600 hover:text-blue-800">Upload Certificates</span>
            </div>
            <p className="text-xs text-muted-foreground">Degree, Diploma certificates</p>
          </div>
        </div>
      </div>
    </div>
  )
} 