"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Mail,
  User,
  Globe,
  Instagram,
  Youtube,
  Twitter,
  Music,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface AffiliateSignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AffiliateSignupModal({ isOpen, onClose }: AffiliateSignupModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",

    // Business Information
    businessName: "",
    website: "",
    audienceSize: "",
    primaryPlatform: "",
    monthlyTraffic: "",

    // Social Media Presence
    socialMedia: {
      instagram: "",
      youtube: "",
      twitter: "",
      tiktok: "",
      other: "",
    },

    // Experience & Marketing
    experience: "",
    promotionMethods: [] as string[],
    previousAffiliate: "",

    // Payment Information
    paymentMethod: "",
    paypalEmail: "",
    bankDetails: "",
    taxId: "",

    // Agreements
    agreeToTerms: false,
    agreeToMarketing: false,
  })

  const totalSteps = 4

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-500" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-600" },
    { id: "twitter", name: "X (Twitter)", icon: Twitter, color: "bg-blue-500" },
    { id: "tiktok", name: "TikTok", icon: Music, color: "bg-black" },
  ]

  const promotionMethodOptions = [
    "Social Media Posts",
    "Blog Articles",
    "Email Marketing",
    "YouTube Videos",
    "Paid Advertising",
    "Influencer Partnerships",
    "Content Marketing",
    "SEO/Organic Traffic",
  ]

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handlePromotionMethodToggle = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      promotionMethods: prev.promotionMethods.includes(method)
        ? prev.promotionMethods.filter((m) => m !== method)
        : [...prev.promotionMethods, method],
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)

    // Show success message and close
    alert("🎉 Welcome to the SocialGrow Affiliate Program! Check your email for next steps.")
    onClose()
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Information"
      case 2:
        return "Business & Audience"
      case 3:
        return "Marketing Experience"
      case 4:
        return "Payment & Agreement"
      default:
        return "Affiliate Signup"
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <Card className="shadow-2xl">
            <CardHeader className="relative bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="text-purple-600" size={28} />
                <div>
                  <CardTitle className="text-2xl">Join Our Affiliate Program</CardTitle>
                  <p className="text-gray-600">{getStepTitle()}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center justify-between">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        currentStep > i + 1
                          ? "bg-green-500 text-white"
                          : currentStep === i + 1
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > i + 1 ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    {i < totalSteps - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 transition-colors ${
                          currentStep > i + 1 ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center mt-2">
                <Badge variant="outline">
                  Step {currentStep} of {totalSteps}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Business & Audience */}
              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business/Brand Name</Label>
                    <Input
                      id="businessName"
                      placeholder="Your business or personal brand name"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website/Blog URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        id="website"
                        placeholder="https://yourwebsite.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="audienceSize">Total Audience Size *</Label>
                      <Select
                        value={formData.audienceSize}
                        onValueChange={(value) => handleInputChange("audienceSize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1k">0 - 1,000</SelectItem>
                          <SelectItem value="1k-5k">1,000 - 5,000</SelectItem>
                          <SelectItem value="5k-10k">5,000 - 10,000</SelectItem>
                          <SelectItem value="10k-50k">10,000 - 50,000</SelectItem>
                          <SelectItem value="50k-100k">50,000 - 100,000</SelectItem>
                          <SelectItem value="100k+">100,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="primaryPlatform">Primary Platform *</Label>
                      <Select
                        value={formData.primaryPlatform}
                        onValueChange={(value) => handleInputChange("primaryPlatform", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="twitter">X (Twitter)</SelectItem>
                          <SelectItem value="website">Website/Blog</SelectItem>
                          <SelectItem value="email">Email Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Social Media Handles</Label>
                    <div className="space-y-3 mt-2">
                      {platforms.map((platform) => (
                        <div key={platform.id}>
                          <Label className="flex items-center gap-2 text-sm">
                            <div className={`w-4 h-4 ${platform.color} rounded flex items-center justify-center`}>
                              <platform.icon size={10} className="text-white" />
                            </div>
                            {platform.name}
                          </Label>
                          <Input
                            placeholder={`@your${platform.id}handle`}
                            value={formData.socialMedia[platform.id as keyof typeof formData.socialMedia]}
                            onChange={(e) => handleInputChange(`socialMedia.${platform.id}`, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Marketing Experience */}
              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <Label htmlFor="experience">Marketing Experience *</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => handleInputChange("experience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
                        <SelectItem value="expert">Expert (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>How do you plan to promote SocialGrow? *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {promotionMethodOptions.map((method) => (
                        <div key={method} className="flex items-center space-x-2">
                          <Checkbox
                            id={method}
                            checked={formData.promotionMethods.includes(method)}
                            onCheckedChange={() => handlePromotionMethodToggle(method)}
                          />
                          <Label htmlFor={method} className="text-sm">
                            {method}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="previousAffiliate">Previous Affiliate Experience</Label>
                    <Textarea
                      id="previousAffiliate"
                      placeholder="Tell us about your previous affiliate marketing experience, successful campaigns, or relevant achievements..."
                      value={formData.previousAffiliate}
                      onChange={(e) => handleInputChange("previousAffiliate", e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthlyTraffic">Monthly Website/Content Traffic</Label>
                    <Select
                      value={formData.monthlyTraffic}
                      onValueChange={(value) => handleInputChange("monthlyTraffic", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select traffic range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1k">0 - 1,000 views</SelectItem>
                        <SelectItem value="1k-10k">1,000 - 10,000 views</SelectItem>
                        <SelectItem value="10k-50k">10,000 - 50,000 views</SelectItem>
                        <SelectItem value="50k-100k">50,000 - 100,000 views</SelectItem>
                        <SelectItem value="100k+">100,000+ views</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Payment & Agreement */}
              {currentStep === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod">Preferred Payment Method *</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleInputChange("paymentMethod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="wise">Wise (TransferWise)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.paymentMethod === "paypal" && (
                    <div>
                      <Label htmlFor="paypalEmail">PayPal Email *</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        placeholder="your-paypal@email.com"
                        value={formData.paypalEmail}
                        onChange={(e) => handleInputChange("paypalEmail", e.target.value)}
                      />
                    </div>
                  )}

                  {(formData.paymentMethod === "bank" || formData.paymentMethod === "stripe") && (
                    <div>
                      <Label htmlFor="bankDetails">Bank Account Details</Label>
                      <Textarea
                        id="bankDetails"
                        placeholder="Please provide your bank account details (we'll send secure forms later)"
                        value={formData.bankDetails}
                        onChange={(e) => handleInputChange("bankDetails", e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="taxId">Tax ID / SSN (Optional)</Label>
                    <Input
                      id="taxId"
                      placeholder="For tax reporting purposes"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange("taxId", e.target.value)}
                    />
                  </div>

                  {/* Commission Info */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">💰 Your Earning Potential</h3>
                    <div className="text-sm text-purple-700 space-y-1">
                      <p>
                        • <strong>Bronze Tier:</strong> 15% commission ($0-$299 monthly revenue)
                      </p>
                      <p>
                        • <strong>Silver Tier:</strong> 20% commission ($300-$999 monthly revenue)
                      </p>
                      <p>
                        • <strong>Gold Tier:</strong> 25% commission ($1,000-$4,999 monthly revenue)
                      </p>
                      <p>
                        • <strong>Platinum Tier:</strong> 30% commission ($5,000+ monthly revenue)
                      </p>
                    </div>
                  </div>

                  {/* Agreements */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                        I agree to the{" "}
                        <a
                          href="/legal/affiliate-terms"
                          className="text-purple-600 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Affiliate Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="/legal/privacy"
                          className="text-purple-600 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Privacy Policy
                        </a>
                      </Label>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="agreeToMarketing"
                        checked={formData.agreeToMarketing}
                        onCheckedChange={(checked) => handleInputChange("agreeToMarketing", checked)}
                      />
                      <Label htmlFor="agreeToMarketing" className="text-sm">
                        I agree to receive marketing materials, affiliate updates, and promotional content from
                        SocialGrow
                      </Label>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>

            {/* Footer with Navigation */}
            <div className="border-t p-6">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  >
                    Next
                    <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.agreeToTerms || isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Join Affiliate Program
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
