"use client"

import Link from "next/link"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Target, Users, BarChart3, Brain, Rocket, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutUs() {
  const differentiators = [
    {
      icon: Users,
      title: "Real Followers Only",
      description:
        "Every follower you gain through SocialGrow is a real person, delivered via strategic content exposure and promotion. No fake profiles. No bots.",
    },
    {
      icon: Target,
      title: "Platform-Specific Strategies",
      description:
        "We customize your growth path based on the algorithmic behavior of each platform — Instagram, TikTok, YouTube, and X (Twitter) — ensuring optimal engagement and retention.",
    },
    {
      icon: BarChart3,
      title: "Transparent Reporting",
      description:
        "You'll receive monthly growth reports and access to a personalized dashboard tracking your plan, stats, and progress in real-time.",
    },
    {
      icon: Brain,
      title: "AI + Human Synergy",
      description:
        "We combine algorithmic intelligence with human oversight to deliver precise targeting, campaign safety, and niche engagement.",
    },
  ]

  const audiences = [
    {
      title: "Creators & Influencers",
      description:
        "Whether you're starting your personal brand or scaling to secure paid collaborations, SocialGrow gives you the visibility you deserve.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Small Businesses & Startups",
      description: "Build an engaged audience for your brand and convert followers into loyal customers.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Agencies & Managers",
      description: "White-label options and multi-client dashboards let you manage multiple accounts with ease.",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={() => {}} />

      <div className="max-w-6xl mx-auto py-16 px-4 pt-32">
        <Link href="/">
          <Button variant="ghost" className="mb-8 flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Home
          </Button>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Globe className="text-purple-600" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">About Us | SocialGrow</h1>
          </div>
          <h2 className="text-2xl md:text-3xl text-gray-700 font-medium mb-8">
            Accelerating Your Digital Presence, the Right Way.
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At SocialGrow, we believe that influence should be earned, not bought. That's why we've created a platform
            designed to help creators, entrepreneurs, and businesses grow their social media presence organically and
            ethically, using real strategies, not bots or gimmicks.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Rocket className="text-purple-600" size={32} />
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            To empower individuals and brands to achieve authentic social media growth through transparent, reliable,
            and scalable services — helping them stand out in a noisy digital world.
          </p>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">💡 What Makes Us Different</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {differentiators.map((item, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Who We Serve */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">🤝 Who We Serve</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {audiences.map((audience, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className={`h-2 bg-gradient-to-r ${audience.gradient}`} />
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{audience.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{audience.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Globe className="text-white" size={32} />
            <h2 className="text-3xl font-bold">Our Vision</h2>
          </div>
          <p className="text-lg leading-relaxed max-w-4xl mx-auto">
            To become the world's most trusted platform for sustainable digital influence, where visibility and growth
            are earned through transparency, strategy, and service excellence.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Growth Journey?</h3>
          <p className="text-gray-600 mb-8">
            Join thousands of creators and businesses who trust SocialGrow for authentic growth.
          </p>
          <Link href="/#pricing">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg">
              View Our Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
