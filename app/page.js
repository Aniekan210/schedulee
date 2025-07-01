// app/page.js
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DemoButton, BackToTopButton } from "@/components/ui/interactiveButtons"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  const testimonials = [
    {
      quote: "schedulee.app has saved me hours each week. My clients love how easy it is to book, and I love having all my appointments in one place.",
      author: "Sarah K., Freelance Designer"
    },
    {
      quote: "The no-login feature is a game changer. My older clients were struggling with other systems, but now they book with just a phone call's worth of information.",
      author: "Michael T., Consultant"
    },
    {
      quote: "For $8.99/month, this is a no-brainer. I was paying triple for a more complex system I didn't need.",
      author: "Jessica L., Massage Therapist"
    },
    {
      quote: "Setup took 10 minutes and I was accepting bookings the same day. The trial convinced me to stay.",
      author: "David R., Tutor"
    },
    {
      quote: "My no-show rate dropped by 60% since using schedulee.app. The automated reminders are perfect.",
      author: "Emma S., Hair Stylist"
    },
    {
      quote: "Finally a booking system that doesn't overwhelm my clients with accounts and logins. Simple and effective.",
      author: "James P., Photographer"
    },
    {
      quote: "The customization options let me match my brand perfectly. Clients think it's part of my website!",
      author: "Alex M., Web Developer"
    },
    {
      quote: "I love that I can block off personal time and clients can only see my real availability. No more double bookings!",
      author: "Rachel W., Life Coach"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="#" aria-label="schedulee.app Home">
          <div className="relative w-40 h-10">
            <Image
              src="/logo.avif"
              alt="schedulee.app Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="#features" className="text-gray-600 hover:text-blue-500 transition-colors" aria-label="View Features">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-blue-500 transition-colors" aria-label="See How It Works">
            How It Works
          </Link>
          <Link href="#testimonials" className="text-gray-600 hover:text-blue-500 transition-colors" aria-label="Read Testimonials">
            Testimonials
          </Link>
          <Link href="/dashboard/bookings" aria-label="Get Started with schedulee.app">
            <Button className="bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-blue-500/30 transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Effortless Scheduling <br />
            with <span className="text-blue-500">schedulee.app</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Beautiful booking pages that match your brand. Clients book in seconds - no accounts needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Link href="/dashboard/bookings" aria-label="Start free trial">
              <Button className="bg-blue-500 hover:bg-blue-600 px-8 py-6 text-lg shadow-lg hover:shadow-blue-500/30 transition-all">
                Start 14-Day Free Trial
              </Button>
            </Link>
            <DemoButton />
          </div>
          <p className="text-gray-500 font-medium">Only $8.99 CAD/month after trial</p>
        </div>
        <div className="md:w-1/2">
          <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6 max-w-md">
                <div className="w-full h-48 bg-white rounded-lg flex items-center justify-center mb-4 mx-auto border border-gray-200">
                  <span className="text-gray-500 text-sm">[Booking page preview with brand colors]</span>
                </div>
                <p className="text-gray-600">Clients book with just name and phone number</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need in One Place</h2>
            <p className="text-xl text-gray-600">
              schedulee.app gives you all the tools without the complexity
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle>Smart Availability</CardTitle>
                <CardDescription>
                  Set your working hours and time off. We handle the rest automatically.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <CardTitle>Brand Customization</CardTitle>
                <CardDescription>
                  Customize your booking page with your branding in minutes.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle>No Login Required</CardTitle>
                <CardDescription>
                  Clients book with just name and phone number - no accounts needed.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How schedulee.app Works</h2>
          <p className="text-xl text-gray-600">
            Get set up and start accepting bookings in minutes
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-gray-500">[Animated walkthrough of setup process]</span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Customize Your Booking Page</h3>
                  <p className="text-gray-600">
                    Match your brand colors and add your services in just a few clicks.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Set Your Availability</h3>
                  <p className="text-gray-600">
                    Define your working hours and block off personal time as needed.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Share Your Link</h3>
                  <p className="text-gray-600">
                    Start accepting bookings immediately by sharing your unique page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo-video" className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See schedulee.app in Action</h2>
            <p className="text-xl text-gray-600">
              Watch how easy it is to set up and use schedulee.app
            </p>
          </div>
          <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden border border-gray-300 shadow-lg max-w-4xl mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500">[Demo video showing booking flow]</span>
            </div>
            <button
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="Play demo video"
            >
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-blue-500 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Professionals Worldwide</h2>
            <p className="text-xl opacity-90">
              Join thousands who have simplified their scheduling
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="italic mb-4">{testimonial.quote}</p>
                    <p className="font-semibold">{testimonial.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-12 gap-4">
              <button
                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Scheduling?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who save hours every week with schedulee.app
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard/bookings" aria-label="Start free trial">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-lg hover:shadow-white/30 transition-all">
                Start 14-Day Free Trial
              </Button>
            </Link>
            <Button
              variant="outline"
              className="px-8 py-6 text-lg border-2 border-white text-white hover:bg-white/10"
              onClick={() => document.getElementById('demo-video').scrollIntoView({ behavior: 'smooth' })}
              aria-label="Watch demo video"
            >
              Watch Demo
            </Button>
          </div>
          <p className="mt-4 text-blue-100">Only $8.99 CAD/month after trial. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative w-40 h-10 mb-4">
                <Image
                  src="/logo.avif"
                  alt="schedulee.app Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-gray-400 text-center md:text-left">
                The simplest way to manage appointments.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex gap-6">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Terms of Service">
                  Terms
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Privacy Policy">
                  Privacy
                </Link>
                <a href="mailto:support@schedulee.app" className="text-gray-400 hover:text-white transition-colors" aria-label="Contact Support">
                  Support
                </a>
              </div>
              <BackToTopButton />
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} schedulee.app. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}