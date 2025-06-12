"use client"

import { motion } from "framer-motion"
import { CreditCard, UserPlus, TrendingUp } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: CreditCard,
      title: "Choose Your Plan",
      description: "Select the perfect growth package that matches your goals and budget",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: UserPlus,
      title: "Add Your Social Account",
      description: "Securely connect your social media profiles to our growth platform",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Watch Your Followers Grow",
      description: "Sit back and watch as your audience grows with real, engaged followers",
      color: "from-pink-500 to-pink-600",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Get started in just 3 simple steps</p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="relative z-10 mx-auto mb-6">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg mx-auto mb-4`}
                  >
                    <step.icon className="text-white" size={32} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
