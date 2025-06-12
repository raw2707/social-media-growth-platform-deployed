"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  CreditCard,
  Lock,
  Check,
  Gift,
  Instagram,
  Youtube,
  Twitter,
  Music,
  ArrowLeft,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/providers/cart-provider"

interface CheckoutCartProps {
  isOpen: boolean
  onClose: () => void
  onOpenAuth: (mode: "login" | "signup") => void
}

export default function CheckoutCart({ isOpen, onClose, onOpenAuth }: CheckoutCartProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<"cart" | "auth" | "checkout" | "payment">("cart")
  const [isSignUp, setIsSignUp] = useState(true)

  const [authInfo, setAuthInfo] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  })

  const [billingInfo, setBillingInfo] = useState({
    company: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  const [socialAccounts, setSocialAccounts] = useState({
    instagram: "",
    tiktok: "",
    youtube: "",
    twitter: "",
  })

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-500" },
    { id: "tiktok", name: "TikTok", icon: Music, color: "bg-black" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-600" },
    { id: "twitter", name: "X (Twitter)", icon: Twitter, color: "bg-blue-500" },
  ]

  const availableCoupons = [
    { code: "WELCOME10", discount: 10, description: "10% off first order" },
    { code: "SAVE20", discount: 20, description: "20% off any plan" },
    { code: "NEWUSER", discount: 15, description: "15% off for new users" },
  ]

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const itemTotal = item.billingCycle === "yearly" ? item.price * 12 : item.price
    return sum + itemTotal * item.quantity
  }, 0)

  const couponDiscountAmount = (subtotal * couponDiscount) / 100
  const tax = (subtotal - couponDiscountAmount) * 0.08 // 8% tax
  const total = subtotal - couponDiscountAmount + tax

  const applyCoupon = () => {
    const coupon = availableCoupons.find((c) => c.code.toLowerCase() === couponCode.toLowerCase())
    if (coupon) {
      setAppliedCoupon(coupon.code)
      setCouponDiscount(coupon.discount)
      setCouponCode("")
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }

  const handleAuth = () => {
    // Simulate authentication
    setCurrentStep("checkout")
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsProcessing(false)
    // Handle successful payment
    alert("Payment successful! Welcome to SocialGrow!")
    clearCart()
    onClose()
  }

  const getPlatformIcon = (platformName: string) => {
    const platform = platforms.find((p) => p.name.toLowerCase().includes(platformName.toLowerCase()))
    return platform ? platform : platforms[0]
  }

  const getStepNumber = () => {
    switch (currentStep) {
      case "cart":
        return 1
      case "auth":
        return 2
      case "checkout":
        return 3
      case "payment":
        return 4
      default:
        return 1
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

        {/* Cart Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden"
        >
          <Card className="shadow-2xl">
            <CardHeader className="relative border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-purple-600" size={24} />
                  <CardTitle className="text-2xl">
                    {currentStep === "cart" && "Shopping Cart"}
                    {currentStep === "auth" && "Sign In / Sign Up"}
                    {currentStep === "checkout" && "Checkout Details"}
                    {currentStep === "payment" && "Payment"}
                  </CardTitle>
                  <Badge variant="outline" className="ml-2">
                    Step {getStepNumber()} of 4
                  </Badge>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isProcessing}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center mt-4">
                {["cart", "auth", "checkout", "payment"].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        currentStep === step
                          ? "bg-purple-600 text-white"
                          : index < ["cart", "auth", "checkout", "payment"].indexOf(currentStep)
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index < ["cart", "auth", "checkout", "payment"].indexOf(currentStep) ? (
                        <Check size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 3 && <div className="w-12 h-0.5 bg-gray-200 mx-2" />}
                  </div>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0 max-h-[70vh] overflow-y-auto">
              {currentStep === "cart" && (
                <div className="p-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                      <p className="text-gray-500 mb-6">Add some plans to get started with your social media growth!</p>
                      <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700 text-white">
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Cart Items */}
                      <div className="space-y-4 mb-6">
                        {cartItems.map((item) => {
                          const platformInfo = getPlatformIcon(item.platform)
                          const itemTotal = item.billingCycle === "yearly" ? item.price * 12 : item.price

                          return (
                            <Card key={item.id} className="border hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-4 flex-1">
                                    <div
                                      className={`w-12 h-12 ${platformInfo.color} rounded-lg flex items-center justify-center`}
                                    >
                                      <platformInfo.icon size={24} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-lg">{item.name}</h3>
                                      <p className="text-gray-600 font-medium">{item.platform}</p>
                                      <p className="text-sm text-gray-500 capitalize">{item.billingCycle} billing</p>
                                      <p className="text-sm text-purple-600 font-medium">
                                        {item.followers.toLocaleString()} followers/month
                                      </p>
                                      {item.discount && (
                                        <Badge className="bg-red-100 text-red-800 mt-1">{item.discount}% OFF</Badge>
                                      )}
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-500">Features:</p>
                                        <ul className="text-xs text-gray-600 list-disc list-inside">
                                          {item.features.slice(0, 2).map((feature, idx) => (
                                            <li key={idx}>{feature}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
                                      >
                                        <Minus size={14} />
                                      </button>
                                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
                                      >
                                        <Plus size={14} />
                                      </button>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                      {item.originalPrice && item.billingCycle === "yearly" && (
                                        <div className="text-sm text-gray-500 line-through">
                                          ${(item.originalPrice * 12 * item.quantity).toFixed(2)}
                                        </div>
                                      )}
                                      <div className="font-semibold">${(itemTotal * item.quantity).toFixed(2)}</div>
                                      <div className="text-xs text-gray-500">
                                        {item.billingCycle === "yearly" ? "per year" : "per month"}
                                      </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>

                      {/* Coupon Section */}
                      <Card className="border-dashed border-2 border-purple-200 bg-purple-50 mb-6">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Gift className="text-purple-600" size={20} />
                            <h3 className="font-semibold">Have a coupon code?</h3>
                          </div>
                          {!appliedCoupon ? (
                            <div className="flex gap-2">
                              <Input
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="flex-1"
                              />
                              <Button onClick={applyCoupon} variant="outline">
                                Apply
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Check className="text-green-600" size={16} />
                                <span className="font-medium">Coupon "{appliedCoupon}" applied</span>
                                <span className="text-green-600">(-{couponDiscount}%)</span>
                              </div>
                              <button onClick={removeCoupon} className="text-red-500 hover:text-red-700">
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Order Summary */}
                      <Card className="bg-gray-50">
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-4 text-lg">Order Summary</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                              <div className="flex justify-between text-green-600">
                                <span>Coupon Discount ({couponDiscount}%)</span>
                                <span>-${couponDiscountAmount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Tax (8%)</span>
                              <span className="font-medium">${tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-bold text-xl">
                              <span>Total</span>
                              <span className="text-purple-600">${total.toFixed(2)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex gap-4 mt-6">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                          Continue Shopping
                        </Button>
                        <Button
                          onClick={() => setCurrentStep("auth")}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Proceed to Checkout
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {currentStep === "auth" && (
                <div className="p-6">
                  <div className="max-w-md mx-auto">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">{isSignUp ? "Create Your Account" : "Welcome Back"}</h3>
                      <p className="text-gray-600">
                        {isSignUp
                          ? "Join SocialGrow to start growing your social media presence"
                          : "Sign in to continue with your purchase"}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {isSignUp && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={authInfo.firstName}
                              onChange={(e) => setAuthInfo({ ...authInfo, firstName: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={authInfo.lastName}
                              onChange={(e) => setAuthInfo({ ...authInfo, lastName: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            value={authInfo.email}
                            onChange={(e) => setAuthInfo({ ...authInfo, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <Input
                            id="password"
                            type="password"
                            className="pl-10"
                            value={authInfo.password}
                            onChange={(e) => setAuthInfo({ ...authInfo, password: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <Button onClick={handleAuth} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3">
                        {isSignUp ? "Create Account & Continue" : "Sign In & Continue"}
                      </Button>

                      <div className="text-center">
                        <button
                          onClick={() => setIsSignUp(!isSignUp)}
                          className="text-purple-600 hover:text-purple-700 text-sm"
                        >
                          {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <Button variant="outline" onClick={() => setCurrentStep("cart")} className="flex-1">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "checkout" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Billing Information */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Billing Information</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="company">Company (Optional)</Label>
                          <Input
                            id="company"
                            value={billingInfo.company}
                            onChange={(e) => setBillingInfo({ ...billingInfo, company: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address *</Label>
                          <Input
                            id="address"
                            value={billingInfo.address}
                            onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              value={billingInfo.city}
                              onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State *</Label>
                            <Input
                              id="state"
                              value={billingInfo.state}
                              onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="zipCode">ZIP Code *</Label>
                            <Input
                              id="zipCode"
                              value={billingInfo.zipCode}
                              onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="country">Country *</Label>
                            <Select
                              value={billingInfo.country}
                              onValueChange={(value) => setBillingInfo({ ...billingInfo, country: value })}
                            >
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
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Media Accounts */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Social Media Accounts</h3>
                      <p className="text-gray-600 mb-4">
                        Enter your social media handles for the platforms you want to grow.
                      </p>
                      <div className="space-y-4">
                        {platforms.map((platform) => (
                          <div key={platform.id}>
                            <Label htmlFor={platform.id} className="flex items-center gap-2">
                              <div className={`w-5 h-5 ${platform.color} rounded flex items-center justify-center`}>
                                <platform.icon size={12} className="text-white" />
                              </div>
                              {platform.name} Handle
                            </Label>
                            <Input
                              id={platform.id}
                              placeholder={`@your${platform.id}handle`}
                              value={socialAccounts[platform.id as keyof typeof socialAccounts]}
                              onChange={(e) =>
                                setSocialAccounts({
                                  ...socialAccounts,
                                  [platform.id]: e.target.value,
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>

                      {/* Order Summary (Sidebar) */}
                      <Card className="mt-6 bg-gray-50">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-3">Order Summary</h4>
                          <div className="space-y-2 text-sm">
                            {cartItems.map((item) => {
                              const itemTotal = item.billingCycle === "yearly" ? item.price * 12 : item.price
                              return (
                                <div key={item.id} className="flex justify-between">
                                  <span>
                                    {item.name} - {item.platform} ({item.billingCycle})
                                  </span>
                                  <span>${(itemTotal * item.quantity).toFixed(2)}</span>
                                </div>
                              )
                            })}
                            <div className="border-t pt-2 flex justify-between font-semibold">
                              <span>Total</span>
                              <span>${total.toFixed(2)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" onClick={() => setCurrentStep("auth")} className="flex-1">
                      <ArrowLeft size={16} className="mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep("payment")}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === "payment" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Payment Information */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="text-purple-600" size={24} />
                        Payment Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="nameOnCard">Name on Card *</Label>
                          <Input
                            id="nameOnCard"
                            value={paymentInfo.nameOnCard}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={paymentInfo.cvv}
                              onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Security Notice */}
                      <div className="mt-6 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <Lock size={16} />
                          <span className="text-sm font-medium">Secure Payment</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Your payment information is encrypted and secure. We use Stripe for payment processing.
                        </p>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="mt-4 flex items-start gap-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <a href="/legal/terms" className="text-purple-600 hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="/legal/privacy" className="text-purple-600 hover:underline">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                    </div>

                    {/* Final Order Summary */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Final Order Review</h3>
                      <Card>
                        <CardContent className="p-4">
                          {cartItems.map((item) => {
                            const itemTotal = item.billingCycle === "yearly" ? item.price * 12 : item.price
                            return (
                              <div key={item.id} className="border-b pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-gray-600">{item.platform}</p>
                                    <p className="text-sm text-purple-600">
                                      {item.followers.toLocaleString()} followers/month
                                    </p>
                                    <p className="text-sm text-gray-500 capitalize">{item.billingCycle} billing</p>
                                    <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">${(itemTotal * item.quantity).toFixed(2)}</div>
                                    <div className="text-sm text-gray-500">
                                      {item.billingCycle === "yearly" ? "per year" : "per month"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}

                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                              <div className="flex justify-between text-green-600">
                                <span>Discount ({couponDiscount}%)</span>
                                <span>-${couponDiscountAmount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Tax</span>
                              <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold text-lg">
                              <span>Total</span>
                              <span className="text-purple-600">${total.toFixed(2)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Customer Information Summary */}
                      <Card className="mt-4">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Customer Information</h4>
                          <div className="text-sm text-gray-600">
                            <p>
                              {authInfo.firstName} {authInfo.lastName}
                            </p>
                            <p>{authInfo.email}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" onClick={() => setCurrentStep("checkout")} className="flex-1">
                      <ArrowLeft size={16} className="mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        `Complete Order - $${total.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
