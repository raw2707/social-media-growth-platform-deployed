"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Globe, TrendingUp } from "lucide-react"

export default function LiveStats() {
  const [stats, setStats] = useState({
    followersDelivered: 0,
    usersOnboarded: 0,
    activeCountries: 0,
  })

  const targetStats = {
    followersDelivered: 47832,
    usersOnboarded: 2156,
    activeCountries: 89,
  }

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStats({
        followersDelivered: Math.floor(targetStats.followersDelivered * progress),
        usersOnboarded: Math.floor(targetStats.usersOnboarded * progress),
        activeCountries: Math.floor(targetStats.activeCountries * progress),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setStats(targetStats)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  const statItems = [
    {
      icon: TrendingUp,
      value: stats.followersDelivered.toLocaleString(),
      label: "Followers Delivered Today",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Users,
      value: stats.usersOnboarded.toLocaleString(),
      label: "Total Users Onboarded",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Globe,
      value: stats.activeCountries.toString(),
      label: "Active Countries",
      color: "from-purple-500 to-violet-600",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Live Growth Statistics</h2>
          <p className="text-xl text-gray-300">Real-time data from our growing community</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div
                className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
              >
                <item.icon size={32} />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {item.value}
              </div>
              <div className="text-gray-300 text-lg">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
