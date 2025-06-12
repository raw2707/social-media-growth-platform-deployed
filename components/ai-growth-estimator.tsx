"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function AIGrowthEstimator() {
  const [platform, setPlatform] = useState("")
  const [goalFollowers, setGoalFollowers] = useState("")
  const [result, setResult] = useState<any>(null)

  const calculateGrowth = () => {
    if (!platform || !goalFollowers) return

    const goal = Number.parseInt(goalFollowers)
    const monthlyGrowth = 2000 // Average growth rate
    const timeMonths = Math.ceil(goal / monthlyGrowth)
    const estimatedCost = timeMonths * 119 // Pro plan price

    let recommendedPlan = "Pro"
    if (goal <= 1000) recommendedPlan = "Starter"
    else if (goal <= 3500) recommendedPlan = "Pro"
    else if (goal <= 5000) recommendedPlan = "Elite"
    else recommendedPlan = "Ultimate"

    setResult({
      timeMonths,
      estimatedCost,
      recommendedPlan,
      monthlyGrowth,
    })
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="text-purple-600" size={32} />
            <h2 className="text-4xl font-bold text-gray-900">AI Growth Estimator</h2>
          </div>
          <p className="text-xl text-gray-600">Get personalized growth predictions for your social media goals</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Calculate Your Growth</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Platform</label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitter">X (Twitter)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Followers</label>
                  <Input
                    type="number"
                    placeholder="e.g., 10000"
                    value={goalFollowers}
                    onChange={(e) => setGoalFollowers(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={calculateGrowth}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full"
                disabled={!platform || !goalFollowers}
              >
                Calculate Growth Plan
              </Button>

              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="text-purple-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Your Growth Plan</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.timeMonths}</div>
                      <div className="text-gray-600">Months to Goal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">${result.estimatedCost}</div>
                      <div className="text-gray-600">Estimated Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.recommendedPlan}</div>
                      <div className="text-gray-600">Recommended Plan</div>
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Start with {result.recommendedPlan} Plan
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
