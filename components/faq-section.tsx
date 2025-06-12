"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Are the followers real?",
      answer:
        "Yes, absolutely! We guarantee 100% real followers from authentic, active social media users. We never use bots, fake accounts, or any artificial methods. All followers are real people who are genuinely interested in your content niche.",
    },
    {
      question: "Do followers stay after canceling?",
      answer:
        "Yes, the followers you gain through our service will remain on your account even after canceling your subscription. Since these are real people who chose to follow you based on genuine interest, they typically stay engaged with your content long-term.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "You can cancel your subscription at any time with no cancellation fees or penalties. Your subscription will remain active until the end of your current billing period, and you can reactivate whenever you want.",
    },
    {
      question: "How fast is the growth?",
      answer:
        "Growth speed varies by plan and platform, but most clients see noticeable results within the first 7-14 days. Our Starter plan delivers around 30-35 followers per day, while our Ultimate plan can deliver 150+ followers daily. Growth is gradual and organic to maintain account safety.",
    },
    {
      question: "Is my account safe?",
      answer:
        "Account safety is our top priority. We use only organic, compliant growth methods that align with all social media platform guidelines. We never ask for your password and only require your username to target relevant audiences.",
    },
    {
      question: "What platforms do you support?",
      answer:
        "We currently support Instagram, TikTok, YouTube, and X (Twitter). Each platform has specialized targeting strategies to ensure you reach the most relevant audience for your content type and niche.",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Everything you need to know about our growth platform</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                <ChevronDown
                  className={`text-purple-600 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  size={24}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
