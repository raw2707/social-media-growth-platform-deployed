"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Star, Instagram, Youtube, Twitter, Music, Percent, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/providers/cart-provider"

// TypeScript interface for API plan data
interface Plan {
  id: string
  name: string
  slug: string
  monthly_price: number
  yearly_price: number
  followers_per_month: number
  yearly_bonus_followers: number
  features: string[]
  is_popular: boolean
  is_active: boolean
  stripe_monthly_price_id: string | null
  stripe_yearly_price_id: string | null
}

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram")
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-500" },
    { id: "tiktok", name: "TikTok", icon: Music, color: "bg-black" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-600" },
    { id: "twitter", name: "X (Twitter)", icon: Twitter, color: "bg-blue-500" },
  ]

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/plans')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch plans: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }
        
        setPlans(data.plans || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching plans:', err)
        setError(err instanceof Error ? err.message : 'Failed to load pricing plans')
        
        // Fallback to hardcoded plans if API fails
        setPlans([
          {
            id: "fallback-starter",
            name: "Starter",
            slug: "starter",
            monthly_price: 5900,
            yearly_price: 3540,
            followers_per_month: 1000,
            yearly_bonus_followers: 2000,
            features: ["1 social media account", "Basic growth analytics", "Email support", "Monthly growth reports", "Content suggestions"],
            is_popular: false,
            is_active: true,
            stripe_monthly_price_id: null,
            stripe_yearly_price_id: null
          },
          {
            id: "fallback-pro",
            name: "Pro",
            slug: "pro",
            monthly_price: 11900,
            yearly_price: 7140,
            followers_per_month: 3000,
            yearly_bonus_followers: 6000,
            features: ["3 social media accounts", "Advanced analytics", "Priority support", "Weekly growth reports", "AI content optimization", "Hashtag research"],
            is_popular: true,
            is_active: true,
            stripe_monthly_price_id: null,
            stripe_yearly_price_id: null
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handleAddToCart = (plan: Plan) => {
    const selectedPlatformInfo = platforms.find((p) => p.id === selectedPlatform)

    addToCart({
      id: `${plan.slug}-${selectedPlatform}-${isYearly ? "yearly" : "monthly"}`,
      name: `${plan.name} Plan`,
      platform: selectedPlatformInfo?.name || "Instagram",
      billingCycle: isYearly ? "yearly" : "monthly",
      price: isYearly ? plan.yearly_price / 100 : plan.monthly_price / 100, // Convert from cents
      originalPrice: isYearly ? plan.monthly_price / 100 : undefined,
      followers: plan.followers_per_month + (isYearly ? plan.yearly_bonus_followers : 0),
      features: plan.features,
      discount: isYearly ? 50 : undefined,
    })
  }

  // Direct Stripe checkout for immediate purchase
  const handleDirectCheckout = async (plan: Plan) => {
    try {
      console.log('🚀 Starting direct checkout for plan:', plan.name)
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: plan.id,
          userId: 'current-user-id', // Replace with real user ID from auth context
          billingCycle: isYearly ? 'yearly' : 'monthly',
          platform: selectedPlatform
        })
      })

      if (response.ok) {
        const { url } = await response.json()
        console.log('✅ Redirecting to Stripe checkout:', url)
        window.location.href = url
      } else {
        const error = await response.json()
        console.error('❌ Checkout error:', error)
        alert('Failed to start checkout. Please try again.')
      }
    } catch (error) {
      console.error('❌ Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    }
  }

  // Calculate yearly savings
  const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCostPerYear = monthlyPrice * 12
    const yearlyCost = yearlyPrice * 12
    const savings = (monthlyCostPerYear - yearlyCost) / 100 // Convert from cents
    const savingsPercentage = Math.round((savings * 100) / (monthlyCostPerYear / 100))
    return { savings, savingsPercentage }
  }

  // Loading state
  if (loading) {
    return (
      <section className="py-20 px-4 bg-gray-50" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Loader2 className="animate-spin" size={24} />
              <span>Loading pricing plans...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error && plans.length === 0) {
    return (
      <section className="py-20 px-4 bg-gray-50" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="font-medium">Failed to load pricing plans</p>
              <p className="text-sm mt-1">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-3 bg-red-600 hover:bg-red-700"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-gray-50" id="pricing">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 mb-8">Start growing your social media presence today</p>
          
          {/* Show API connection status */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto mb-6">
              <p className="text-yellow-800 text-sm">
                ⚠️ Using fallback pricing. API: {error}
              </p>
            </div>
          )}

          {/* Platform Selector */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 ${
                  selectedPlatform === platform.id
                    ? "bg-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 shadow hover:shadow-md"
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center`}>
                  <platform.icon size={18} className="text-white" />
                </div>
                <span className="font-medium">{platform.name}</span>
              </button>
            ))}
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg ${!isYearly ? "text-purple-600 font-semibold" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                isYearly ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  isYearly ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-lg ${isYearly ? "text-purple-600 font-semibold" : "text-gray-500"}`}>Yearly</span>
            {isYearly && (
              <div className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                <Percent size={14} className="text-red-800" />
                <span>50% OFF</span>
              </div>
            )}
          </div>

          {/* Discount Banner */}
          {isYearly && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl max-w-2xl mx-auto mb-8 shadow-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="text-2xl font-bold">LIMITED TIME OFFER:</div>
                <div className="text-2xl font-bold">50% OFF</div>
                <div>on all yearly plans!</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => {
            const monthlyPriceInDollars = plan.monthly_price / 100
            const yearlyPriceInDollars = plan.yearly_price / 100
            const { savings, savingsPercentage } = calculateYearlySavings(plan.monthly_price, plan.yearly_price)

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`relative h-full ${plan.is_popular ? "ring-2 ring-purple-600 shadow-xl" : "shadow-lg"} hover:shadow-xl transition-shadow duration-300`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star size={16} fill="currentColor" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {isYearly && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
                        <div className="text-center">
                          <div className="text-xs font-medium">SAVE</div>
                          <div className="text-lg font-bold">50%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>

                    {/* Platform Icon */}
                    <div className="mt-2">
                      {platforms.map((platform) => {
                        if (platform.id === selectedPlatform) {
                          return (
                            <div key={platform.id} className="flex items-center justify-center gap-1">
                              <div
                                className={`w-6 h-6 rounded-full ${platform.color} flex items-center justify-center`}
                              >
                                <platform.icon size={14} className="text-white" />
                              </div>
                              <span className="text-sm text-gray-600">{platform.name}</span>
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>

                    <div className="mt-4">
                      {isYearly ? (
                        <>
                          <div className="flex items-center justify-center gap-2">
                            <div className="text-sm text-gray-500 line-through">${monthlyPriceInDollars}</div>
                            <div className="text-4xl font-bold text-gray-900">
                              ${yearlyPriceInDollars}
                              <span className="text-lg text-gray-600">/mo</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            ${Math.round(yearlyPriceInDollars * 12)} billed yearly
                          </div>
                          <div className="text-sm text-green-600 font-medium mt-1">
                            Save ${savings.toFixed(0)} ({savingsPercentage}%)
                          </div>
                        </>
                      ) : (
                        <div className="text-4xl font-bold text-gray-900">
                          ${monthlyPriceInDollars}
                          <span className="text-lg text-gray-600">/month</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">
                      {(plan.followers_per_month + (isYearly ? plan.yearly_bonus_followers : 0)).toLocaleString()} followers/month
                    </p>
                    {isYearly && plan.yearly_bonus_followers > 0 && (
                      <p className="text-green-600 text-sm font-medium">+{plan.yearly_bonus_followers.toLocaleString()} bonus followers/month</p>
                    )}
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <Check size={20} className="text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-3">
                      <Button
                        onClick={() => handleDirectCheckout(plan)}
                        className={`w-full py-3 rounded-full transition-all duration-300 ${
                          plan.is_popular
                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
                            : "bg-gray-900 hover:bg-gray-800 text-white"
                        }`}
                      >
                        Buy Now - Start Growing
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(plan)}
                        variant="outline"
                        className="w-full py-2 rounded-full transition-all duration-300 border-gray-300 hover:border-purple-600 hover:text-purple-600"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
