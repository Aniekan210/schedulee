// app/page.js
import { Button } from "@/components/ui/button"
import { Link } from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { MobileMenu, TestimonialCarousel, DemoVideo, LottieAnimation } from "@/components/ui/interactive-elements"


// Static data that doesn't require client-side rendering
const DEFAULT_TESTIMONIALS = [
  {
    quote: "schedulee.app has saved me hours each week. My clients love how easy it is to book, and I love having all my appointments in one place.",
    author: "Sarah K., Freelance Designer",
    stars: 5
  },
  {
    quote: "The no-login feature is a game changer. My older clients were struggling with other systems, but now they book with just a phone call's worth of information.",
    author: "Michael T., Consultant",
    stars: 4
  },
  {
    quote: "For $8.99/month, this is a no-brainer. I was paying triple for a more complex system I didn't need.",
    author: "Jessica L., Massage Therapist",
    stars: 5
  },
  {
    quote: "Setup took 10 minutes and I was accepting bookings the same day. The trial convinced me to stay.",
    author: "David R., Tutor",
    stars: 4
  },
  {
    quote: "My no-show rate dropped by 60% since using schedulee.app. The automated reminders are perfect.",
    author: "Emma S., Hair Stylist",
    stars: 5
  },
  {
    quote: "Finally a booking system that doesn't overwhelm my clients with accounts and logins. Simple and effective.",
    author: "James P., Photographer",
    stars: 4
  }
]

export default function Home() {
  // In a real app, you might fetch this from an API
  const testimonials = DEFAULT_TESTIMONIALS

  return (
    <div className="min-h-screen bg-white">
      <MobileMenu testimonials={testimonials} />

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Effortless Scheduling <br />
              with <span className="text-blue-500">Schedulee.app</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
              Beautiful booking pages that match your brand. Clients book in seconds - no accounts needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center md:justify-start">
              <Link href="/dashboard/bookings" aria-label="Start free trial">
                <Button className="bg-blue-500 hover:bg-blue-600 px-6 py-5 md:px-8 md:py-6 text-lg shadow-lg hover:shadow-blue-500/30 transition-all">
                  Start 14-Day Free Trial
                </Button>
              </Link>
              <DemoVideo />
            </div>
            <p className="text-gray-500 font-medium">Only $8.99 CAD/month after trial</p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <Placeholder name="Product preview" className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need in One Place</h2>
            <p className="text-lg md:text-xl text-gray-600">
              Schedulee.app gives you all the tools without the complexity
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="w-full h-48 mb-4">
                  <LottieAnimation animationName="calendar" />
                </div>
                <CardTitle className="text-xl">Smart Availability</CardTitle>
                <CardDescription>
                  Set your working hours and time off. We handle the rest automatically.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="w-full h-48 mb-4">
                  <LottieAnimation animationName="customization" />
                </div>
                <CardTitle className="text-xl">Brand Customization</CardTitle>
                <CardDescription>
                  Customize your booking page with your branding in minutes.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="w-full h-48 mb-4">
                  <LottieAnimation animationName="no-login" />
                </div>
                <CardTitle className="text-xl">No Login Required</CardTitle>
                <CardDescription>
                  Clients book with just name and phone number - no accounts needed.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Schedulee.app Works</h2>
            <p className="text-lg md:text-xl text-gray-600">
              Get set up and start accepting bookings in minutes
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <LottieAnimation animationName="setup" />
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="space-y-6 md:space-y-8">
                <div className="flex gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">Customize Your Booking Page</h3>
                    <p className="text-gray-600">
                      Match your brand colors and add your services in just a few clicks.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">Set Your Availability</h3>
                    <p className="text-gray-600">
                      Define your working hours and block off personal time as needed.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">Share Your Link</h3>
                    <p className="text-gray-600">
                      Start accepting bookings immediately by sharing your unique page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 md:py-20 bg-blue-500 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Professionals Worldwide</h2>
            <p className="text-lg md:text-xl opacity-90">
              Join thousands who have simplified their scheduling
            </p>
          </div>

          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Transform Your Scheduling?</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who save hours every week with Schedulee.app
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard/bookings" aria-label="Start free trial">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-5 md:px-8 md:py-6 text-lg shadow-lg hover:shadow-white/30 transition-all">
                  Start 14-Day Free Trial
                </Button>
              </Link>
              <DemoVideo />
            </div>
            <p className="mt-4 text-blue-100 text-sm md:text-base">Only $8.99 CAD/month after trial. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <Link href="#" className="flex items-center mb-4" aria-label="Schedulee.app Home">
                <div className="relative w-10 h-10 mr-2">
                  <Image
                    src="/logo.avif"
                    alt="Schedulee.app Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                    onError={() => console.error("Footer logo failed to load")}
                  />
                </div>
                <span className="text-xl font-bold">Schedulee.app</span>
              </Link>
              <p className="text-gray-400 text-center md:text-left">
                The simplest way to manage appointments.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  Terms
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  Privacy
                </Link>
                <a href="mailto:support@schedulee.app" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  Support
                </a>
              </div>
              <button
                className="mt-2 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Schedulee.app. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}