"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CartButton from "@/components/cart-button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface HeaderProps {
  onOpenAuth: (mode: "login" | "signup") => void
}

export default function Header({ onOpenAuth }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push('/')
  }

  const navItems = [
    { name: "About Us", href: "/about" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Affiliate", href: "/affiliate" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SocialGrow
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300 ${
                  isScrolled ? "text-gray-700" : "text-gray-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <CartButton />
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors duration-300"
                >
                  <User size={16} />
                  <span className="text-sm font-medium">
                    {user?.first_name || 'User'}
                  </span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onOpenAuth("login")}
                  className={`font-medium transition-colors duration-300 ${
                    isScrolled ? "text-gray-700 hover:text-purple-600" : "text-gray-800 hover:text-purple-600"
                  }`}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => onOpenAuth("signup")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <CartButton />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-gray-800 hover:bg-white/20"
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/20 shadow-lg"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-gray-700 hover:text-purple-600 font-medium py-2"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onOpenAuth("login")
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full justify-start text-gray-700 hover:text-purple-600"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        onOpenAuth("signup")
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
