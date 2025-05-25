"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, Settings } from 'lucide-react';

export default function SetupPage() {
  const [setupStatus, setSetupStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setupData, setSetupData] = useState({
    adminEmail: 'admin@cqams.com',
    adminPassword: 'Admin@123',
    adminFirstName: 'Super',
    adminLastName: 'Admin',
    force: false
  });
  const [result, setResult] = useState(null);

  // Check setup status on component mount
  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('/api/admin/setup');
      const data = await response.json();
      setSetupStatus(data.setupStatus);
    } catch (error) {
      console.error('Failed to check setup status:', error);
    }
  };

  const handleSetup = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setupData),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Refresh setup status
        await checkSetupStatus();
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Setup request failed',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSetupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Settings className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CQAMS System Setup</h1>
          <p className="text-gray-600 mt-2">Initialize your employee management system</p>
        </div>

        {/* Setup Status Card */}
        {setupStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {setupStatus.isSetupComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                )}
                Setup Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Permissions</p>
                  <p className="text-gray-600">{setupStatus.permissions}</p>
                </div>
                <div>
                  <p className="font-medium">Roles</p>
                  <p className="text-gray-600">{setupStatus.roles}</p>
                </div>
                <div>
                  <p className="font-medium">Users</p>
                  <p className="text-gray-600">{setupStatus.users}</p>
                </div>
                <div>
                  <p className="font-medium">Super Admin</p>
                  <p className="text-gray-600">
                    {setupStatus.superAdminExists ? '✅ Exists' : '❌ Missing'}
                  </p>
                </div>
              </div>
              
              {setupStatus.superAdmin && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Super Admin Details:</p>
                  <p className="text-sm text-green-700">
                    Email: {setupStatus.superAdmin.email} | 
                    Role: {setupStatus.superAdmin.role} | 
                    ID: {setupStatus.superAdmin.employeeId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Setup Form */}
        <Card>
          <CardHeader>
            <CardTitle>System Setup Configuration</CardTitle>
            <CardDescription>
              Configure the super admin account and initialize the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={setupData.adminFirstName}
                  onChange={(e) => handleInputChange('adminFirstName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={setupData.adminLastName}
                  onChange={(e) => handleInputChange('adminLastName', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={setupData.adminEmail}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={setupData.adminPassword}
                onChange={(e) => handleInputChange('adminPassword', e.target.value)}
              />
            </div>

            {setupStatus?.isSetupComplete && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="force"
                  checked={setupData.force}
                  onChange={(e) => handleInputChange('force', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="force" className="text-sm">
                  Force setup (recreate existing data)
                </Label>
              </div>
            )}

            <Button 
              onClick={handleSetup} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Run Setup'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result Display */}
        {result && (
          <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <AlertCircle className={`h-4 w-4 ${result.success ? 'text-green-600' : 'text-red-600'}`} />
            <AlertDescription>
              <div className="space-y-2">
                <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </p>
                
                {result.success && result.data && (
                  <div className="text-sm space-y-2">
                    <div>
                      <p className="font-medium">Setup Results:</p>
                      <ul className="list-disc list-inside text-green-700 space-y-1">
                        <li>Permissions: {result.data.setupResults.permissions.created} created, {result.data.setupResults.permissions.existing} existing</li>
                        <li>Roles: {result.data.setupResults.roles.created} created, {result.data.setupResults.roles.existing} existing</li>
                        <li>Super Admin: {result.data.setupResults.superAdmin.fullName} ({result.data.setupResults.superAdmin.employeeId})</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="font-medium text-blue-800">Login Credentials:</p>
                      <p className="text-blue-700">Email: {result.data.credentials.email}</p>
                      <p className="text-blue-700">Password: {result.data.credentials.password}</p>
                      <p className="text-xs text-blue-600 mt-1">{result.data.credentials.note}</p>
                    </div>
                  </div>
                )}
                
                {!result.success && result.error && (
                  <p className="text-sm text-red-700">Error: {result.error}</p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
} 