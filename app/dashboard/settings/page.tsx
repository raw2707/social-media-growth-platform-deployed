"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/auth-context'
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Instagram, 
  Youtube, 
  Twitter, 
  Music,
  Save,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    timezone: 'UTC-8',
  })

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: false,
    weeklyReports: true,
    marketingEmails: false,
  })

  const [socialAccounts, setSocialAccounts] = useState([
    {
      id: '1',
      platform: 'instagram',
      username: '@youraccount',
      connected: true,
      icon: Instagram,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '2',
      platform: 'tiktok', 
      username: '@youraccount',
      connected: true,
      icon: Music,
      color: 'from-black to-gray-800'
    },
    {
      id: '3',
      platform: 'youtube',
      username: 'Your Channel',
      connected: false,
      icon: Youtube,
      color: 'from-red-500 to-red-600'
    },
    {
      id: '4',
      platform: 'twitter',
      username: '',
      connected: false,
      icon: Twitter,
      color: 'from-blue-400 to-blue-500'
    }
  ])

  const handleSaveProfile = () => {
    alert('Profile update functionality will call API')
    setIsEditing(false)
    // In production: call API to update user profile
  }

  const handleConnectAccount = (platform: string) => {
    alert(`Connect ${platform} account - will open OAuth flow`)
    // In production: initiate OAuth flow for platform
  }

  const handleDisconnectAccount = (platform: string) => {
    if (confirm(`Are you sure you want to disconnect your ${platform} account?`)) {
      alert(`Disconnect ${platform} account functionality will call API`)
      // In production: call API to disconnect account
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile and connected accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex space-x-4 pt-4">
                  <Button onClick={handleSaveProfile} className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Updates</p>
                  <p className="text-sm text-gray-600">Receive important account updates via email</p>
                </div>
                <Switch
                  checked={notifications.emailUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailUpdates: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-600">Get notified about growth milestones</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, pushNotifications: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-gray-600">Receive weekly growth analytics</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, weeklyReports: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-600">Receive tips and promotional content</p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, marketingEmails: checked})
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connected Accounts */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Connected Accounts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialAccounts.map((account) => {
                const Icon = account.icon
                return (
                  <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${account.color} text-white`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{account.platform}</p>
                        <p className="text-sm text-gray-600">
                          {account.connected ? account.username : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    
                    {account.connected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnectAccount(account.platform)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConnectAccount(account.platform)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Enable Two-Factor Auth
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 