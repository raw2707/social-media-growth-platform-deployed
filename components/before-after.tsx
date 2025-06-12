"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function BeforeAfter() {
  const cases = [
    {
      name: "Client A",
      niche: "Fitness Influencer",
      beforeFollowers: 800,
      afterFollowers: 5000,
      beforeEngagement: "2.1%",
      afterEngagement: "8.4%",
      timeframe: "90 days",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Client B",
      niche: "Food Blogger",
      beforeFollowers: 1200,
      afterFollowers: 7500,
      beforeEngagement: "1.8%",
      afterEngagement: "9.2%",
      timeframe: "120 days",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Client C",
      niche: "Tech Startup",
      beforeFollowers: 450,
      afterFollowers: 3200,
      beforeEngagement: "1.2%",
      afterEngagement: "6.8%",
      timeframe: "75 days",
      image: "/placeholder.svg?height=300&width=300",
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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Real Results from Real Clients</h2>
          <p className="text-xl text-gray-600">See the incredible transformations our clients have achieved</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cases.map((clientCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={clientCase.image || "/placeholder.svg"}
                    alt={`${clientCase.name} profile`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {clientCase.niche}
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{clientCase.name}</h3>

                  <div className="space-y-4">
                    {/* Followers Growth */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="text-purple-600" size={20} />
                        <span className="font-medium text-gray-700">Followers</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 line-through">
                          {clientCase.beforeFollowers.toLocaleString()}
                        </div>
                        <div className="text-lg font-bold text-purple-600">
                          {clientCase.afterFollowers.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Engagement Growth */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Heart className="text-blue-600" size={20} />
                        <span className="font-medium text-gray-700">Engagement</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 line-through">{clientCase.beforeEngagement}</div>
                        <div className="text-lg font-bold text-blue-600">{clientCase.afterEngagement}</div>
                      </div>
                    </div>

                    {/* Growth Indicator */}
                    <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="text-green-600" size={20} />
                      <span className="font-medium text-green-700">Achieved in {clientCase.timeframe}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
