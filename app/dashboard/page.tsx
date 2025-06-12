"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, Instagram, Youtube, Twitter, Music, Eye, Heart, MessageCircle, Share } from 'lucide-react'

export default function DashboardPage() {
  // Mock data - replace with real data from your API
  const stats = [
    { title: 'Total Followers', value: '47,832', change: '+12%', icon: Users, color: 'text-blue-600' },
    { title: 'Monthly Growth', value: '2,847', change: '+8%', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Engagement Rate', value: '4.2%', change: '+0.5%', icon: Heart, color: 'text-pink-600' },
    { title: 'Active Campaigns', value: '3', change: 'Active', icon: Share, color: 'text-purple-600' },
  ]

  const socialAccounts = [
    { platform: 'Instagram', username: '@youraccount', followers: '28.5K', growth: '+15%', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { platform: 'TikTok', username: '@youraccount', followers: '12.3K', growth: '+22%', icon: Music, color: 'bg-black' },
    { platform: 'YouTube', username: 'Your Channel', followers: '5.8K', growth: '+8%', icon: Youtube, color: 'bg-red-500' },
    { platform: 'Twitter', username: '@youraccount', followers: '1.2K', growth: '+5%', icon: Twitter, color: 'bg-blue-400' },
  ]

  const recentActivity = [
    { type: 'follower_gain', message: 'Gained 234 new Instagram followers', time: '2 hours ago' },
    { type: 'engagement', message: 'TikTok engagement increased by 18%', time: '4 hours ago' },
    { type: 'milestone', message: 'Reached 25K Instagram followers!', time: '1 day ago' },
    { type: 'campaign', message: 'New growth campaign started', time: '2 days ago' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Track your social media growth across all platforms</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          Upgrade Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Social Media Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Social Media Accounts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialAccounts.map((account) => {
              const Icon = account.icon
              return (
                <div key={account.platform} className="flex items-center space-x-4 p-4 rounded-lg border hover:shadow-md transition-shadow">
                  <div className={`p-3 rounded-full text-white ${account.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{account.platform}</h3>
                    <p className="text-sm text-gray-600">{account.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{account.followers}</p>
                    <p className="text-sm text-green-600">{account.growth}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              View Growth Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="w-4 h-4 mr-2" />
              Manage Comments
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Share className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Analyze Audience
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Plan Status */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Premium Growth Plan</h3>
              <p className="text-gray-600 mt-1">You're on the Premium plan with unlimited growth features</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="text-sm">
                  <span className="text-gray-600">Next billing: </span>
                  <span className="font-medium">February 15, 2024</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Status: </span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="bg-white">
              Manage Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
