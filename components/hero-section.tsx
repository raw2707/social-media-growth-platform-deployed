"use client"

import { motion } from "framer-motion"
import { Instagram, Youtube, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onOpenAuth: (mode: "login" | "signup") => void
}

export default function HeroSection({ onOpenAuth }: HeroSectionProps) {
  const socialIcons = [
    { Icon: Instagram, color: "text-pink-500", delay: 0 },
    { Icon: Youtube, color: "text-red-500", delay: 0.2 },
    { Icon: Twitter, color: "text-blue-500", delay: 0.4 },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50" />

      {/* Animated Social Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {socialIcons.map(({ Icon, color, delay }, index) => (
          <motion.div
            key={index}
            className={`absolute ${color} opacity-10`}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              left: `${20 + index * 30}%`,
              top: `${30 + index * 20}%`,
            }}
          >
            <Icon size={120} />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Accelerate Your{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Social Media Growth
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Real followers. Real results. Grow your audience every month.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => onOpenAuth("signup")}
          >
            Start Growing
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300"
          >
            Explore Packages
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
