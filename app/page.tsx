"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import PricingSection from "@/components/pricing-section"
import AIGrowthEstimator from "@/components/ai-growth-estimator"
import ServicesOverview from "@/components/services-overview"
import HowItWorks from "@/components/how-it-works"
import LiveStats from "@/components/live-stats"
import BeforeAfter from "@/components/before-after"
import Testimonials from "@/components/testimonials"
import AffiliateProgram from "@/components/affiliate-program"
import AboutSection from "@/components/about-section"
import FAQSection from "@/components/faq-section"
import Footer from "@/components/footer"
import AuthModal from "@/components/auth-modal"
import CheckoutCart from "@/components/checkout-cart"
import { useCart } from "@/providers/cart-provider"
import AffiliateSignupModal from "@/components/affiliate-signup-modal"

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup")
  const { isCartOpen, setIsCartOpen } = useCart()
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false)

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onOpenAuth={openAuthModal} />
      <HeroSection onOpenAuth={openAuthModal} />
      <PricingSection />
      <AIGrowthEstimator />
      <ServicesOverview />
      <HowItWorks />
      <LiveStats />
      <BeforeAfter />
      <Testimonials />
      <AffiliateProgram onOpenAffiliateSignup={() => setIsAffiliateModalOpen(true)} />
      <AboutSection />
      <FAQSection />
      <Footer onOpenAuth={openAuthModal} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />

      <CheckoutCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onOpenAuth={openAuthModal} />

      <AffiliateSignupModal isOpen={isAffiliateModalOpen} onClose={() => setIsAffiliateModalOpen(false)} />
    </div>
  )
}
