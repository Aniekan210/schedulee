// app/page.js
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="#">
          <img src="/logo.avif" alt="schedulee.app Logo" className="h-10" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="#features" className="text-gray-600 hover:text-blue-500 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-blue-500 transition-colors">
            How It Works
          </Link>
          <Link href="#testimonials" className="text-gray-600 hover:text-blue-500 transition-colors">
            Testimonials
          </Link>
          <Link href="/dashboard/bookings">
            <Button className="bg-blue-500 hover:bg-blue-600">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simplify Your Scheduling with <span className="text-blue-500">schedulee.app</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Let your clients book appointments effortlessly while you maintain full control over your availability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard/bookings">
              <Button className="bg-blue-500 hover:bg-blue-600 px-8 py-6 text-lg">
                Start Your 14-Day Free Trial
              </Button>
            </Link>
            <Button variant="outline" className="px-8 py-6 text-lg" onClick={() => document.getElementById('demo-video').scrollIntoView()}>
              Watch Demo
            </Button>
          </div>
          <p className="mt-4 text-gray-500">Just $8.99 CAD/month after trial</p>
        </div>
        <div className="md:w-1/2 bg-gray-100 rounded-xl flex items-center justify-center h-96">
          <div className="text-center p-6">
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gray-500">[Illustration: Calendar interface showing available time slots]</span>
            </div>
            <p className="text-gray-600">No login required for your clients - just name, phone number, and time!</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <CardTitle>Custom Availability</CardTitle>
                <CardDescription>Set your working hours, breaks, and days off with ease.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <CardTitle>No Login Required</CardTitle>
                <CardDescription>Clients book with just name and phone number - no accounts needed.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle>Centralized Management</CardTitle>
                <CardDescription>View and manage all bookings in one simple dashboard.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How schedulee.app Works</h2>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 bg-gray-100 rounded-xl h-80 flex items-center justify-center">
            <span className="text-gray-500">[Animation: Step-by-step booking process]</span>
          </div>
          <div className="md:w-1/2">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Create Your Booking Page</h3>
                  <p className="text-gray-600">
                    Customize your booking page with your availability, services, and branding.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Share Your Link</h3>
                  <p className="text-gray-600">
                    Send your unique booking page link to clients or add it to your website.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Manage Bookings</h3>
                  <p className="text-gray-600">
                    View, confirm, or reschedule appointments all from your dashboard.
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">See schedulee.app in Action</h2>
          <div className="bg-gray-200 rounded-xl aspect-video max-w-4xl mx-auto flex items-center justify-center">
            <span className="text-gray-500">[Demo video placeholder showing booking flow]</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-blue-500 text-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "schedulee.app has saved me hours each week. My clients love how easy it is to book, and I love having all
                  my appointments in one place."
                </p>
                <p className="font-semibold">— Sarah K., Freelance Designer</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "The no-login feature is a game changer. My older clients were struggling with other systems, but now
                  they book with just a phone call's worth of information."
                </p>
                <p className="font-semibold">— Michael T., Consultant</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "For $8.99/month, this is a no-brainer. I was paying triple for a more complex system I didn't need."
                </p>
                <p className="font-semibold">— Jessica L., Massage Therapist</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "Setup took 10 minutes and I was accepting bookings the same day. The trial convinced me to stay."
                </p>
                <p className="font-semibold">— David R., Tutor</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "My no-show rate dropped by 60% since using schedulee.app. The automated reminders are perfect."
                </p>
                <p className="font-semibold">— Emma S., Hair Stylist</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "Finally a booking system that doesn't overwhelm my clients with accounts and logins. Simple and effective."
                </p>
                <p className="font-semibold">— James P., Photographer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-blue-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Simplify Your Scheduling?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust schedulee.app for their booking needs.
          </p>
          <Link href="/dashboard/bookings">
            <Button className="bg-white text-blue-500 hover:bg-gray-100 px-8 py-6 text-lg">
              Start Your 14-Day Free Trial
            </Button>
          </Link>
          <p className="mt-4 text-blue-100">Just $8.99 CAD/month after trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <img src="/logo.avif" alt="schedulee.app Logo" className="h-8 mx-auto mb-6" />
          <p className="text-gray-400 mb-6">The simplest way to manage appointments.</p>
          <div className="flex justify-center gap-6 mb-6">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <a href="mailto:support@schedulee.app" className="text-gray-400 hover:text-white transition-colors">
              Support
            </a>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} schedulee.app. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}