import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function CookiePolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          <p className="text-gray-600 mb-8">Effective Date: January 1, 2025</p>

          <div className="prose max-w-none">
            <p className="mb-6">We use cookies to:</p>

            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Remember login sessions</li>
              <li>Analyze site performance</li>
              <li>Personalize your experience</li>
            </ul>

            <p className="mb-4">You can disable cookies in your browser settings, but this may affect functionality.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Types of Cookies We Use</h2>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Essential Cookies</h3>
            <p className="mb-4">
              These cookies are necessary for the website to function and cannot be switched off in our systems. They
              are usually only set in response to actions made by you which amount to a request for services, such as
              setting your privacy preferences, logging in or filling in forms.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Performance Cookies</h3>
            <p className="mb-4">
              These cookies allow us to count visits and traffic sources so we can measure and improve the performance
              of our site. They help us to know which pages are the most and least popular and see how visitors move
              around the site.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Functional Cookies</h3>
            <p className="mb-4">
              These cookies enable the website to provide enhanced functionality and personalization. They may be set by
              us or by third party providers whose services we have added to our pages.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Managing Cookies</h2>
            <p className="mb-4">
              Most web browsers allow some control of most cookies through the browser settings. To find out more about
              cookies, including how to see what cookies have been set, visit{" "}
              <a href="https://www.allaboutcookies.org" className="text-purple-600 hover:text-purple-800">
                www.allaboutcookies.org
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
