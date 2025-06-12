"use client"

import { motion } from "framer-motion"
import { DollarSign, Users, TrendingUp, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AffiliateProgramProps {
  onOpenAffiliateSignup?: () => void
}

export default function AffiliateProgram({ onOpenAffiliateSignup }: AffiliateProgramProps) {
  const benefits = [
    {
      icon: DollarSign,
      title: "30% Commission",
      description: "Earn 30% recurring commission on every referral",
    },
    {
      icon: Users,
      title: "Easy Referrals",
      description: "Share your unique link and start earning immediately",
    },
    {
      icon: TrendingUp,
      title: "Monthly Payouts",
      description: "Get paid monthly via PayPal or bank transfer",
    },
    {
      icon: Gift,
      title: "Bonus Rewards",
      description: "Extra bonuses for top-performing affiliates",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Earn While They Grow</h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Join our affiliate program and earn commission for each subscription you refer. Help others grow their
            social media while building your own income stream.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-purple-100 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <Card className="bg-white text-gray-900 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Join Our Affiliate Program</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">$500+</div>
                    <div className="text-gray-600">Average monthly earnings</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>No minimum payout threshold</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>Real-time tracking dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>Marketing materials provided</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>Dedicated affiliate support</span>
                    </div>
                  </div>

                  <Button
                    onClick={onOpenAffiliateSignup}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full text-lg"
                  >
                    Learn More & Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
