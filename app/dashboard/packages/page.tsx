"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Music, 
  TrendingUp, 
  Users, 
  Calendar,
  Play,
  Pause,
  Settings,
  BarChart3,
  Eye
} from 'lucide-react'

export default function PackagesPage() {
  const [packages] = useState([
    {
      id: '1',
      platform: 'instagram',
      name: 'Instagram Growth Boost',
      status: 'active',
      progress: 75,
      targetFollowers: 2000,
      gainedFollowers: 1500,
      startDate: '2024-05-01',
      endDate: '2024-06-30',
      engagementRate: 4.2,
      dailyGrowth: 25,
      icon: Instagram,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '2', 
      platform: 'tiktok',
      name: 'TikTok Viral Package',
      status: 'active',
      progress: 60,
      targetFollowers: 1500,
      gainedFollowers: 900,
      startDate: '2024-05-15',
      endDate: '2024-07-15',
      engagementRate: 6.8,
      dailyGrowth: 35,
      icon: Music,
      color: 'from-black to-gray-800'
    },
    {
      id: '3',
      platform: 'youtube',
      name: 'YouTube Subscriber Boost',
      status: 'paused',
      progress: 30,
      targetFollowers: 1000,
      gainedFollowers: 300,
      startDate: '2024-04-01',
      endDate: '2024-07-01',
      engagementRate: 3.5,
      dailyGrowth: 8,
      icon: Youtube,
      color: 'from-red-500 to-red-600'
    }
  ])

  const handlePauseResume = (packageId: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'pause' : 'resume'
    alert(`${action} package functionality will call API`)
    // In production: call API to pause/resume package
  }

  const handleViewAnalytics = (packageId: string) => {
    alert(`View analytics for package ${packageId} - will show detailed charts`)
    // In production: navigate to analytics page or open modal
  }

  const handleSettings = (packageId: string) => {
    alert(`Package settings for ${packageId} - will open configuration modal`)
    // In production: open settings modal
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'paused': return 'bg-yellow-100 text-yellow-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Packages</h1>
          <p className="text-gray-600 mt-1">Manage your active growth campaigns across all platforms</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          Add New Package
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Gained</p>
                <p className="text-2xl font-bold text-gray-900">2,700</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Engagement</p>
                <p className="text-2xl font-bold text-gray-900">5.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Days Remaining</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Packages List */}
      <div className="space-y-6">
        {packages.map((pkg) => {
          const Icon = pkg.icon
          return (
            <Card key={pkg.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${pkg.color} text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                      <p className="text-gray-600 capitalize">{pkg.platform} Growth Campaign</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(pkg.status)}>
                    {pkg.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Progress</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{pkg.gainedFollowers} gained</span>
                        <span>{pkg.targetFollowers} target</span>
                      </div>
                      <Progress value={pkg.progress} className="h-2" />
                      <p className="text-xs text-gray-500">{pkg.progress}% complete</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Daily Growth</p>
                    <p className="text-xl font-semibold text-green-600">+{pkg.dailyGrowth}</p>
                    <p className="text-xs text-gray-500">followers/day</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
                    <p className="text-xl font-semibold text-blue-600">{pkg.engagementRate}%</p>
                    <p className="text-xs text-gray-500">avg. engagement</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="text-sm font-medium">{pkg.startDate}</p>
                    <p className="text-sm font-medium">to {pkg.endDate}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handlePauseResume(pkg.id, pkg.status)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      {pkg.status === 'active' ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Resume</span>
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => handleViewAnalytics(pkg.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Analytics</span>
                    </Button>

                    <Button
                      onClick={() => handleSettings(pkg.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {pkg.status === 'active' ? 'Growing now' : 'Campaign paused'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Package CTA */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-8 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a New Growth Campaign</h3>
            <p className="text-gray-600 mb-4">
              Choose from our proven growth packages to expand your audience on any platform
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Browse Packages
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 