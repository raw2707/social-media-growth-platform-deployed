"use client"

import { motion } from "framer-motion"
import { Shield, Target, Users, Award } from "lucide-react"

export default function AboutSection() {
  const values = [
    {
      icon: Shield,
      title: "Authenticity First",
      description: "We believe in real growth with real people, never bots or fake accounts",
    },
    {
      icon: Target,
      title: "Smart Targeting",
      description: "Our advanced algorithms ensure you reach the right audience for your niche",
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Building genuine communities that engage and support your content",
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Thousands of successful creators trust us to grow their social presence",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Our Platform</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              We help creators, entrepreneurs, and agencies grow their reach without bots or hacks. Our growth methods
              are powered by smart targeting and influencer networks to ensure your audience is authentic.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded by social media experts who understand the challenges of organic growth, we've developed a
              platform that delivers real results while maintaining the integrity of your brand and audience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="text-purple-600" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
