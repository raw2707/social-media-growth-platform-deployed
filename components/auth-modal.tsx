"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, Instagram, Youtube, Twitter, Music, User, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "signup"
  onSwitchMode: (mode: "login" | "signup") => void
}

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    socialHandles: {
      instagram: "",
      tiktok: "",
      youtube: "",
      twitter: "",
    },
  })

  const platforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-pink-500",
      placeholder: "@your_instagram",
      prefix: "instagram.com/",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: Music,
      color: "bg-black",
      placeholder: "@your_tiktok",
      prefix: "tiktok.com/@",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "bg-red-600",
      placeholder: "@your_channel",
      prefix: "youtube.com/@",
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: Twitter,
      color: "bg-blue-500",
      placeholder: "@your_twitter",
      prefix: "x.com/",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === "signup") {
        // Validation for signup
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords don't match!")
          setIsLoading(false)
          return
        }
        if (!formData.agreeToTerms) {
          alert("Please agree to the Terms of Service and Privacy Policy")
          setIsLoading(false)
          return
        }
        // Check if at least one social handle is provided
        const hasAtLeastOneHandle = Object.values(formData.socialHandles).some((handle) => handle.trim() !== "")
        if (!hasAtLeastOneHandle) {
          alert("Please provide at least one social media handle")
          setIsLoading(false)
          return
        }

        // Create account using auth context
        const success = await signup({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          socialHandles: formData.socialHandles
        })

        if (success) {
          alert('Account created successfully! Welcome to your dashboard!')
          onClose()
          router.push('/dashboard')
        } else {
          alert('Signup failed. Please try again.')
        }

      } else {
        // Login mode
        const success = await login(formData.email, formData.password)

        if (success) {
          alert('Welcome back!')
          onClose()
          router.push('/dashboard')
        } else {
          alert('Login failed. Please check your credentials.')
        }
      }
    } catch (error: any) {
      console.error('❌ Authentication error:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSocialHandleChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialHandles: {
        ...prev.socialHandles,
        [platform]: value,
      },
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-lg max-h-[90vh] overflow-hidden"
          >
            <Card className="shadow-2xl">
              <CardHeader className="relative bg-gradient-to-r from-purple-50 to-pink-50">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <CardTitle className="text-2xl text-center">
                  {mode === "login" ? "Welcome Back" : "Get Started"}
                </CardTitle>
                <p className="text-gray-600 text-center">
                  {mode === "login" ? "Sign in to your account" : "Create your account and start growing"}
                </p>
              </CardHeader>

              <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <>
                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <div className="relative">
                            <User
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={16}
                            />
                            <Input
                              id="firstName"
                              type="text"
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
                            <User
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={16}
                            />
                            <Input
                              id="lastName"
                              type="text"
                              placeholder="Doe"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email Field */}
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

                  {/* Password Field */}
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={mode === "signup" ? "Create a strong password" : "Enter your password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {mode === "signup" && (
                    <>
                      {/* Confirm Password */}
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      {/* Social Media Handles Section */}
                      <div className="space-y-4">
                        <div className="border-t pt-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Media Accounts</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Add your social media handles for the platforms you want to grow. You need at least one.
                          </p>
                        </div>

                        {platforms.map((platform) => (
                          <div key={platform.id}>
                            <Label htmlFor={platform.id} className="flex items-center gap-2 mb-2">
                              <div className={`w-5 h-5 ${platform.color} rounded flex items-center justify-center`}>
                                <platform.icon size={12} className="text-white" />
                              </div>
                              <span>{platform.name} Handle</span>
                              <span className="text-xs text-gray-500">({platform.prefix})</span>
                            </Label>
                            <div className="relative">
                              <div
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${platform.color} rounded flex items-center justify-center`}
                              >
                                <platform.icon size={12} className="text-white" />
                              </div>
                              <Input
                                id={platform.id}
                                type="text"
                                placeholder={platform.placeholder}
                                value={formData.socialHandles[platform.id as keyof typeof formData.socialHandles]}
                                onChange={(e) => handleSocialHandleChange(platform.id, e.target.value)}
                                className="pl-12"
                              />
                            </div>
                          </div>
                        ))}

                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-blue-700">
                            💡 <strong>Tip:</strong> You can add more platforms later in your dashboard. We'll help you
                            grow all your social media accounts!
                          </p>
                        </div>
                      </div>

                      {/* Terms Agreement */}
                      <div className="flex items-start gap-2 pt-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                        />
                        <Label htmlFor="terms" className="text-sm leading-relaxed">
                          I agree to the{" "}
                          <a
                            href="/legal/terms"
                            className="text-purple-600 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Terms of Service
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
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Please wait..." : (mode === "login" ? "Sign In" : "Create Account")}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={() => onSwitchMode(mode === "login" ? "signup" : "login")}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>

                {mode === "login" && (
                  <div className="mt-4 text-center">
                    <a href="#" className="text-sm text-purple-600 hover:text-purple-700">
                      Forgot your password?
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
