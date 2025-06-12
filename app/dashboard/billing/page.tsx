"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  FileText, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function BillingPage() {
  const [autoRenewal, setAutoRenewal] = useState(true)
  const [currentTab, setCurrentTab] = useState('plan')

  // Mock data - replace with real API calls
  const currentPlan = {
    name: 'Premium Growth Plan',
    price: 119,
    interval: 'month',
    features: [
      '2,000 followers per month',
      'Priority support',
      'Analytics dashboard',
      'Advanced targeting',
      'Weekly reports'
    ],
    nextBilling: '2024-07-01',
    status: 'active'
  }

  const paymentMethods = [
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true
    },
    {
      id: '2', 
      type: 'mastercard',
      last4: '8888',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ]

  const invoices = [
    {
      id: 'inv_001',
      date: '2024-06-01',
      amount: 119,
      status: 'paid',
      description: 'Premium Growth Plan - June 2024'
    },
    {
      id: 'inv_002',
      date: '2024-05-01', 
      amount: 119,
      status: 'paid',
      description: 'Premium Growth Plan - May 2024'
    },
    {
      id: 'inv_003',
      date: '2024-04-01',
      amount: 119,
      status: 'paid', 
      description: 'Premium Growth Plan - April 2024'
    }
  ]

  const handleChangePlan = () => {
    // Redirect to pricing page for plan upgrades
    window.location.href = '/pricing?upgrade=true'
  }

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to all premium features.')) {
      try {
        // Open Stripe Customer Portal for subscription management
        const response = await fetch('/api/customer-portal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'current-user-id' }) // Replace with real user ID
        })
        
        if (response.ok) {
          const { url } = await response.json()
          window.location.href = url
        } else {
          alert('Failed to open billing portal. Please try again.')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Failed to open billing portal. Please try again.')
      }
    }
  }

  const handleAddPaymentMethod = async () => {
    try {
      // Open Stripe Customer Portal for payment method management
      const response = await fetch('/api/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current-user-id' }) // Replace with real user ID
      })
      
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        alert('Failed to open payment portal. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to open payment portal. Please try again.')
    }
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    alert(`Download invoice ${invoiceId} - will call API to generate PDF`)
    // In production: call API to generate and download invoice PDF
  }

  const tabs = [
    { id: 'plan', name: 'Current Plan', icon: Settings },
    { id: 'upgrade', name: 'Upgrade', icon: CheckCircle },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'invoices', name: 'Invoices', icon: FileText }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payment</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and payment methods</p>
      </div>

      {/* Billing Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Billing</p>
                <p className="text-lg font-semibold">{currentPlan.nextBilling}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-lg font-semibold">$476 this year</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-6 border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center space-x-2 pb-4 px-2 border-b-2 transition-colors ${
                    currentTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {currentTab === 'plan' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Auto-renewal enabled</p>
                    <p className="text-sm text-yellow-700">Your subscription will renew automatically</p>
                  </div>
                </div>
                <Switch
                  checked={autoRenewal}
                  onCheckedChange={setAutoRenewal}
                />
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleChangePlan} variant="outline">
                  Change Plan
                </Button>
                <Button onClick={handleCancelSubscription} variant="outline" className="text-red-600 hover:text-red-700">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          )}

          {currentTab === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                <Button onClick={handleAddPaymentMethod} className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Payment Method</span>
                </Button>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {method.type.toUpperCase()} •••• •••• •••• {method.last4}
                        </p>
                        <p className="text-sm text-gray-600">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                      {method.isDefault && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'invoices' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Invoice History</h3>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{invoice.description}</p>
                      <p className="text-sm text-gray-600">{invoice.date}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {invoice.status.toUpperCase()}
                      </Badge>
                      <span className="font-semibold">${invoice.amount}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'upgrade' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">You're on the highest plan!</h3>
              <p className="text-gray-600">You have access to all premium features.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 