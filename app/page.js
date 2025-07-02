// app/page.js
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  MobileMenu,
  TestimonialCarousel,
  DemoVideo,
  LottieAnimation,
  Placeholder,
  BackToTop
} from "@/components/ui/interactive-elements"

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
  const testimonials = DEFAULT_TESTIMONIALS

  return (
    <div className="min-h-screen bg-white">
      <MobileMenu testimonials={testimonials} />

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Effortless Scheduling <br />
                  <span className="text-indigo-600">with Schedulee.app</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-lg mx-auto lg:mx-0">
                  Beautiful booking pages that match your brand. Clients book in seconds - no accounts needed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/dashboard/bookings" aria-label="Start free trial">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-6 text-lg shadow-sm hover:shadow-md transition-all group">
                    <span className="group-hover:scale-105 transition-transform">Start 14-Day Free Trial</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </Link>
              </div>

              <p className="text-gray-500 font-medium">Only $8.99 CAD/month after trial</p>
            </div>

            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <DemoVideo className="w-full max-w-2xl mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need in One Place</h2>
            <p className="text-lg md:text-xl text-gray-600">
              Schedulee.app gives you all the tools without the complexity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-gray-100 hover:shadow-sm transition-all group">
              <CardHeader className="items-center text-center">
                <div className="w-full h-48 mb-6">
                  <LottieAnimation animationName="calendar" />
                </div>
                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">Smart Availability</CardTitle>
                <CardDescription className="group-hover:text-gray-700 transition-colors">
                  Set your working hours and time off. We handle the rest automatically.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-100 hover:shadow-sm transition-all group">
              <CardHeader className="items-center text-center">
                <div className="w-full h-48 mb-6">
                  <LottieAnimation animationName="customization" />
                </div>
                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">Brand Customization</CardTitle>
                <CardDescription className="group-hover:text-gray-700 transition-colors">
                  Customize your booking page with your branding in minutes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-100 hover:shadow-sm transition-all group">
              <CardHeader className="items-center text-center">
                <div className="w-full h-48 mb-6">
                  <LottieAnimation animationName="no-login" />
                </div>
                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">No Login Required</CardTitle>
                <CardDescription className="group-hover:text-gray-700 transition-colors">
                  Clients book with just name and phone number - no accounts needed.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Schedulee.app Works</h2>
            <p className="text-lg md:text-xl text-gray-600">
              Get set up and start accepting bookings in minutes
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="space-y-8">
                <div className="flex gap-6 group">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-lg font-bold group-hover:bg-indigo-200 transition-colors">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-600 transition-colors">Customize Your Booking Page</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                      Match your brand colors and add your services in just a few clicks.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-lg font-bold group-hover:bg-indigo-200 transition-colors">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-600 transition-colors">Set Your Availability</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                      Define your working hours and block off personal time as needed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-lg font-bold group-hover:bg-indigo-200 transition-colors">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-600 transition-colors">Share Your Link</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                      Start accepting bookings immediately by sharing your unique page.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-2">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <LottieAnimation animationName="setup" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 md:py-20 bg-indigo-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Professionals Worldwide</h2>
            <p className="text-lg md:text-xl text-gray-600">
              Join thousands who have simplified their scheduling
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Transform Your Scheduling?</h2>
              <p className="text-lg md:text-xl mb-8">
                Join thousands of professionals who save hours every week with Schedulee.app
              </p>
              <div className="flex justify-center">
                <Link href="/dashboard/bookings" aria-label="Start free trial">
                  <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-sm hover:shadow-md transition-all group">
                    <span className="group-hover:scale-105 transition-transform">Start 14-Day Free Trial</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-indigo-100 text-sm md:text-base">Only $8.99 CAD/month after trial. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <Link href="#" className="flex items-center group mb-4" aria-label="Schedulee.app Home">
                <div className="relative w-10 h-10 mr-3 transition-transform group-hover:scale-105">
                  <Image
                    src="/logo.avif"
                    alt="Schedulee.app Logo"
                    width={40}
                    height={40}
                    className="object-contain rounded-md"
                  />
                </div>
                <span className="text-xl font-bold group-hover:text-indigo-400 transition-colors">Schedulee.app</span>
              </Link>
              <p className="text-gray-400 text-center md:text-left">
                The simplest way to manage appointments.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex gap-6 flex-wrap justify-center">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  Terms
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Privacy
                </Link>
                <a href="mailto:support@schedulee.app" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Support
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Schedulee.app. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  )
}