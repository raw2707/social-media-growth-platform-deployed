"use client"

import { Instagram, Youtube, Twitter, Facebook } from "lucide-react"
import Link from "next/link"

interface FooterProps {
  onOpenAuth: (mode: "login" | "signup") => void
}

export default function Footer({ onOpenAuth }: FooterProps) {
  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "#contact" },
        { name: "Affiliate Program", href: "/affiliate" },
        { name: "Careers", href: "#careers" },
      ],
    },
    {
      title: "Product",
      links: [
        { name: "Pricing", href: "#pricing" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "Dashboard", href: "#", onClick: () => onOpenAuth("login") },
        { name: "Growth Calculator", href: "#calculator" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/legal/terms" },
        { name: "Privacy Policy", href: "/legal/privacy" },
        { name: "Cookie Policy", href: "/legal/cookies" },
        { name: "Refund Policy", href: "/legal/refunds" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ]

  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SocialGrow
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Accelerate your social media growth with real followers and authentic engagement.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors duration-300"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-300">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 SocialGrow. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <Link href="/legal/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms
              </Link>
              <Link href="/legal/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy
              </Link>
              <Link href="/legal/cookies" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
