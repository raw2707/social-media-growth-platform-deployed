import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function RefundPolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund Policy</h1>
          <p className="text-gray-600 mb-8">Effective Date: January 1, 2025</p>

          <div className="prose max-w-none">
            <p className="mb-6">We offer refunds under the following conditions:</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Eligible for Refund</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>If no followers were delivered within 14 days of payment</li>
              <li>If a technical error occurred on our side</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Not Eligible for Refund</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Services already fulfilled (followers delivered)</li>
              <li>Cancellations after the renewal period has begun</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">How to Request a Refund</h2>
            <p className="mb-4">
              To request a refund, contact support within 7 days of the issue. Please include your account email, the
              date of purchase, and a detailed explanation of why you're requesting a refund.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Refund Processing</h2>
            <p className="mb-4">
              Approved refunds will be processed within 5-7 business days. Refunds will be issued to the original
              payment method used for the purchase.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our refund policy, please contact our support team at{" "}
              <span className="text-purple-600">support@socialgrow.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
