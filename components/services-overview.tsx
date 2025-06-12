"use client"

import { motion } from "framer-motion"
import { Users, Shield, Target, Headphones, BarChart3, CheckCircle } from "lucide-react"

export default function ServicesOverview() {
  const services = [
    {
      icon: Users,
      title: "Organic Follower Growth",
      description: "Real, engaged followers who are genuinely interested in your content",
    },
    {
      icon: Shield,
      title: "No Bots or Fake Accounts",
      description: "We guarantee 100% authentic followers from real, active users",
    },
    {
      icon: Target,
      title: "Real Targeting by Niche",
      description: "Advanced targeting to reach your ideal audience based on interests and demographics",
    },
    {
      icon: Headphones,
      title: "24/7 Human Support",
      description: "Our dedicated support team is available around the clock to help you",
    },
    {
      icon: BarChart3,
      title: "Monthly Growth Reports",
      description: "Detailed analytics and insights to track your growth progress",
    },
    {
      icon: CheckCircle,
      title: "Account Safety Guaranteed",
      description: "Your account security is our priority with safe, compliant growth methods",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide authentic, sustainable growth that builds real engagement and lasting results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6 mx-auto">
                <service.icon className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{service.title}</h3>
              <p className="text-gray-600 text-center leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
