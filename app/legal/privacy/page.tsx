import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Effective Date: January 1, 2025</p>

          <div className="prose max-w-none">
            <p className="mb-6">
              Your privacy is important to us. This policy explains how we collect and use your data:
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">What We Collect</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Email, password (hashed), and your linked social account</li>
              <li>Analytics (page visits, growth stats, etc.)</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">How We Use It</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>To deliver your follower growth</li>
              <li>To manage subscriptions and support</li>
              <li>To improve our service</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Third Parties</h2>
            <p className="mb-4">We use Stripe for payments and may use analytics tools. Your data is never sold.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Security</h2>
            <p className="mb-4">
              All data is encrypted and stored securely using Firebase and industry-standard practices.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Your Rights</h2>
            <p className="mb-4">You may request deletion or export of your data at any time.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
