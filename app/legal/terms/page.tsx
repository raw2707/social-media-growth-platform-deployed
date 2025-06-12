import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-8 flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Home
          </Button>
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Effective Date: January 1, 2025</p>

          <div className="prose max-w-none">
            <p className="mb-6">
              Welcome to SocialGrow. By using our website and services, you agree to the following terms:
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Services Provided</h2>
            <p className="mb-4">
              We provide monthly follower growth services on platforms like Instagram, TikTok, YouTube, and X (Twitter).
              Growth is achieved through strategic promotion, not bots.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">User Responsibilities</h2>
            <p className="mb-4">
              You must provide valid login info, avoid spam behavior, and comply with each platform's terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Subscriptions</h2>
            <p className="mb-4">
              All plans auto-renew monthly or yearly unless canceled. You can cancel anytime via your dashboard.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Limitations of Liability</h2>
            <p className="mb-4">
              We are not responsible for changes in platform algorithms or unexpected account changes.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Modifications</h2>
            <p className="mb-4">We may update these terms at any time. Continued use constitutes agreement.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
