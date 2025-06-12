"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      handle: "@sarahfitness",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "I landed brand deals after 2 months of growth. The followers are real and actually engage with my content. Best investment I've made for my business!",
      platform: "Instagram",
    },
    {
      name: "Mike Chen",
      handle: "@mikecooks",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "Went from 500 to 8,000 followers in 4 months. The targeting is incredible - I'm getting followers who actually love cooking content.",
      platform: "TikTok",
    },
    {
      name: "Emma Rodriguez",
      handle: "@emmatech",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "As a tech startup founder, authentic followers were crucial. This platform delivered exactly what they promised - real people interested in tech.",
      platform: "X (Twitter)",
    },
    {
      name: "David Park",
      handle: "@davidtravels",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "The growth has been consistent and organic. My engagement rates actually improved as my follower count grew. Highly recommend!",
      platform: "YouTube",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600">Real testimonials from creators who transformed their social presence</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                      <p className="text-purple-600 font-medium">{testimonial.handle}</p>
                      <p className="text-sm text-gray-500">{testimonial.platform}</p>
                    </div>
                    <Quote className="text-purple-200" size={32} />
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={20} />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
