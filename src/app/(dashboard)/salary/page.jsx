"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, DollarSign, Download, Search, Filter, CheckCircle, Clock, AlertCircle } from "lucide-react"

const salaryRecords = [
  {
    id: 1,
    employee: "John Doe",
    employeeId: "EMP001",
    month: "January 2024",
    basicSalary: 6250,
    allowances: 500,
    bonus: 500,
    deductions: 250,
    netSalary: 7000,
    status: "Paid",
    payDate: "2024-01-31",
    avatar: ""
  },
  {
    id: 2,
    employee: "Sarah Wilson",
    employeeId: "EMP002",
    month: "January 2024",
    basicSalary: 7500,
    allowances: 750,
    bonus: 1000,
    deductions: 500,
    netSalary: 8750,
    status: "Paid",
    payDate: "2024-01-31",
    avatar: ""
  },
  {
    id: 3,
    employee: "Mike Johnson",
    employeeId: "EMP003",
    month: "January 2024",
    basicSalary: 5500,
    allowances: 300,
    bonus: 0,
    deductions: 200,
    netSalary: 5600,
    status: "Pending",
    payDate: null,
    avatar: ""
  },
  {
    id: 4,
    employee: "Emily Davis",
    employeeId: "EMP004",
    month: "January 2024",
    basicSalary: 8000,
    allowances: 1000,
    bonus: 1500,
    deductions: 600,
    netSalary: 9900,
    status: "Processing",
    payDate: null,
    avatar: ""
  },
  {
    id: 5,
    employee: "Alex Chen",
    employeeId: "EMP005",
    month: "January 2024",
    basicSalary: 6800,
    allowances: 600,
    bonus: 800,
    deductions: 350,
    netSalary: 7850,
    status: "Paid",
    payDate: "2024-01-31",
    avatar: ""
  }
]

export default function SalaryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("January 2024")
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const filteredRecords = salaryRecords.filter(record =>
    record.employee.toLowerCase().includes(searchTerm.toLowerCase()) &&
    record.month === selectedMonth
  )

  const getStatusBadge = (status) => {
    const variants = {
      "Paid": { class: "bg-green-100 text-green-800", icon: CheckCircle },
      "Pending": { class: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Processing": { class: "bg-blue-100 text-blue-800", icon: AlertCircle },
    }
    const variant = variants[status]
    const Icon = variant.icon
    
    return (
      <Badge variant="secondary" className={variant.class}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleProcessPayment = (record) => {
    setSelectedEmployee(record)
    setIsProcessDialogOpen(true)
  }

  const handleDownloadSlip = (record) => {
    // Handle salary slip download
    console.log("Download salary slip for:", record.employee)
  }

  const totalPayroll = filteredRecords.reduce((sum, record) => sum + record.netSalary, 0)
  const paidCount = filteredRecords.filter(r => r.status === "Paid").length
  const pendingCount = filteredRecords.filter(r => r.status === "Pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Salary & Payments</h2>
        <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Process Salary
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Process Salary Payment</DialogTitle>
              <DialogDescription>
                Review and process salary payment for {selectedEmployee?.employee}
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Employee</Label>
                    <p className="text-sm text-muted-foreground">{selectedEmployee.employee}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Month</Label>
                    <p className="text-sm text-muted-foreground">{selectedEmployee.month}</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Basic Salary:</span>
                    <span>{formatCurrency(selectedEmployee.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Allowances:</span>
                    <span className="text-green-600">+{formatCurrency(selectedEmployee.allowances)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bonus:</span>
                    <span className="text-green-600">+{formatCurrency(selectedEmployee.bonus)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deductions:</span>
                    <span className="text-red-600">-{formatCurrency(selectedEmployee.deductions)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Net Salary:</span>
                      <span>{formatCurrency(selectedEmployee.netSalary)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsProcessDialogOpen(false)}>
                Process Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPayroll)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Employees</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCount}</div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalPayroll / filteredRecords.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Per employee</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary Records</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January 2024">January 2024</SelectItem>
                <SelectItem value="December 2023">December 2023</SelectItem>
                <SelectItem value="November 2023">November 2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Allowances</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {record.employee.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{record.employee}</div>
                        <div className="text-sm text-muted-foreground">{record.employeeId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(record.basicSalary)}</TableCell>
                    <TableCell className="text-green-600">
                      +{formatCurrency(record.allowances)}
                    </TableCell>
                    <TableCell className="text-green-600">
                      +{formatCurrency(record.bonus)}
                    </TableCell>
                    <TableCell className="text-red-600">
                      -{formatCurrency(record.deductions)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(record.netSalary)}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {record.status === "Paid" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadSlip(record)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {record.status !== "Paid" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleProcessPayment(record)}
                            className="text-blue-600"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 