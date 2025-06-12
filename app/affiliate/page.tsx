"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Header from "@/components/header"
import {
  ChevronLeft,
  DollarSign,
  Users,
  TrendingUp,
  Gift,
  Award,
  BarChart3,
  Target,
  Zap,
  Crown,
  Star,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AffiliateSignupModal from "@/components/affiliate-signup-modal"

export default function AffiliateProgram() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false)

  const tiers = [
    {
      name: "Bronze",
      revenue: "$0 – $299",
      commission: "15%",
      color: "bg-amber-600",
      perks: ["Affiliate badge", "Early access"],
      icon: Award,
    },
    {
      name: "Silver",
      revenue: "$300 – $999",
      commission: "20%",
      color: "bg-gray-400",
      perks: ["Social media shoutout"],
      icon: Star,
    },
    {
      name: "Gold",
      revenue: "$1,000 – $4,999",
      commission: "25%",
      color: "bg-yellow-500",
      perks: ["Priority support", "Branded merch"],
      icon: Crown,
    },
    {
      name: "Platinum",
      revenue: "$5,000+",
      commission: "30%",
      color: "bg-purple-600",
      perks: ["Partner feature", "Personal manager"],
      icon: Zap,
    },
  ]

  const bonusIncentives = [
    {
      title: "Performance Rewards",
      items: [
        "Refer 10+ active users = $100 bonus",
        "Reach $1,000 MRR = Branded hoodie",
        "Hit $10,000 MRR = All-expenses-paid creator retreat invite",
      ],
    },
    {
      title: "Team Earnings",
      items: [
        "Top-tier partners can build sub-affiliate teams (Gold+)",
        "Earn 5% override commissions on their team's earnings",
      ],
    },
    {
      title: "Marketing Kit Included",
      items: [
        "Banners, email templates, swipe files",
        "Video scripts and promo discounts",
        "Conversion optimization tools",
      ],
    },
    {
      title: "Geo Expansion Bonuses",
      items: [
        "Extra 5% commission on referrals from untapped countries",
        "Rotating target countries for maximum opportunity",
      ],
    },
  ]

  const dashboardFeatures = [
    { icon: Users, title: "Total signups and active subscribers" },
    { icon: DollarSign, title: "Monthly earnings & payout history" },
    { icon: BarChart3, title: "Referral source tracking" },
    { icon: Target, title: "Link shortener + UTM tagging" },
    { icon: TrendingUp, title: "Tier status and milestone tracker" },
  ]

  const targetAudience = [
    "Influencers and creators",
    "Agencies and consultants",
    "YouTubers and bloggers",
    "Social media managers",
    "Growth hackers and marketers",
  ]

  const faqs = [
    {
      question: "How long do cookies last?",
      answer:
        "Our affiliate cookies last for 60 days, giving you plenty of time to earn commissions from your referrals.",
    },
    {
      question: "When do I get paid?",
      answer: "Payouts are processed monthly on the 15th via Stripe or PayPal. Minimum payout threshold is $50.",
    },
    {
      question: "Can I track my referrals?",
      answer:
        "Yes! Your dashboard provides real-time tracking of clicks, conversions, and earnings with detailed analytics.",
    },
    {
      question: "Are there any fees?",
      answer:
        "No fees, no contracts, no upfront costs. It's completely free to join and participate in our affiliate program.",
    },
    {
      question: "Can I promote on social media?",
      answer: "We encourage promotion on all platforms. We provide marketing materials to help you succeed.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={() => {}} />

      <div className="max-w-7xl mx-auto py-16 px-4 pt-32">
        <Link href="/">
          <Button variant="ghost" className="mb-8 flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Home
          </Button>
        </Link>

        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <DollarSign className="text-purple-600" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Affiliate Program | SocialGrow</h1>
          </div>
          <h2 className="text-2xl md:text-3xl text-gray-700 font-medium mb-8">Grow With Us. Earn With Us.</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            The SocialGrow Affiliate Program is your opportunity to earn recurring income by helping creators,
            influencers, and brands grow their audience. Whether you're a micro-influencer, content creator, or
            marketing agency — you can monetize your network with zero upfront costs.
          </p>
          <Button
            onClick={() => setIsAffiliateModalOpen(true)}
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full font-semibold"
          >
            Join the Affiliate Program
          </Button>
        </motion.div>

        {/* How It Works */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">🔗 How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Join for Free",
                description: "Sign up to get your custom referral link and dashboard.",
                color: "from-purple-500 to-purple-600",
              },
              {
                step: "2",
                title: "Share Anywhere",
                description: "Post your link on social media, newsletters, websites, or DMs.",
                color: "from-blue-500 to-blue-600",
              },
              {
                step: "3",
                title: "Earn Every Month",
                description: "Get paid for every subscription referred — monthly, passively.",
                color: "from-green-500 to-green-600",
              },
            ].map((item, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Commission Tiers */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">🪜 Scalable, Tiered Commission System</h2>
          <p className="text-center text-gray-600 mb-12">
            🎯 All payouts are recurring — as long as your referrals are active, you earn monthly commissions.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Tier</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Monthly Referred Revenue</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Commission Rate</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Bonus Perks</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${tier.color} rounded-full flex items-center justify-center`}>
                          <tier.icon size={16} className="text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">{tier.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{tier.revenue}</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">{tier.commission}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {tier.perks.map((perk, perkIndex) => (
                          <div key={perkIndex} className="text-sm text-gray-600">
                            {perk}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Bonus Incentives */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">🧠 Bonus Incentives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bonusIncentives.map((bonus, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="text-purple-600" size={24} />
                    {bonus.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {bonus.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Features */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">📊 Affiliate Dashboard Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardFeatures.map((feature, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <feature.icon className="text-purple-600 mx-auto mb-4" size={32} />
                  <p className="text-gray-700 font-medium">{feature.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Target Audience */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">🚀 Who It's For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {targetAudience.map((audience, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
                <span className="text-gray-700 font-medium">{audience}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-lg">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  <ChevronDown
                    className={`text-purple-600 transition-transform duration-300 ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <h2 className="text-3xl font-bold mb-4">📬 Ready to Partner?</h2>
          <p className="text-xl mb-2">Start earning in the next 5 minutes.</p>
          <p className="text-purple-100 mb-8">🔐 No fees, no contracts — just impact and income.</p>
          <Button
            onClick={() => setIsAffiliateModalOpen(true)}
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full font-semibold"
          >
            Join the Affiliate Program
          </Button>
        </motion.div>
        <AffiliateSignupModal isOpen={isAffiliateModalOpen} onClose={() => setIsAffiliateModalOpen(false)} />
      </div>
    </div>
  )
}
