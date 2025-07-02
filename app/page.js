// app/page.js
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import {
  MobileMenu,
  TestimonialCarousel,
  LottieAnimation,
  Placeholder,
  BackToTop,
  DemoButton,
  FeatureCard,
  StepItem,
  MainCTA,
  SecondaryCTA
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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <MobileMenu testimonials={DEFAULT_TESTIMONIALS} />

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Modern Scheduling Solution
            </motion.span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <motion.span
                className="block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Effortless Booking,
              </motion.span>
              <motion.span
                className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                More Time For You
              </motion.span>
            </h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Beautiful booking pages that match your brand. Clients book in seconds - no accounts needed.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-4 justify-center md:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/dashboard/bookings" aria-label="Start free trial">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-5 md:px-8 md:py-6 text-lg shadow-lg hover:shadow-blue-500/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start 14-Day Free Trial
                </Button>
              </Link>
              <DemoButton />
            </motion.div>
            <motion.p
              className="text-gray-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Only $8.99 CAD/month after trial
            </motion.p>
          </motion.div>
          <motion.div
            className="md:w-1/2 mt-8 md:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border-0"
              whileHover={{ scale: 1.02 }}
            >
              <LottieAnimation animationName="booking-demo" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
              Powerful Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Schedulee.app gives you all the tools without the complexity
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <FeatureCard
              title="Smart Availability"
              description="Set your working hours and time off. We handle the rest automatically."
              icon="calendar"
              color="text-blue-500"
            />
            <FeatureCard
              title="Brand Customization"
              description="Customize your booking page with your branding in minutes."
              icon="customization"
              color="text-purple-500"
            />
            <FeatureCard
              title="No Login Required"
              description="Clients book with just name and phone number - no accounts needed."
              icon="no-login"
              color="text-green-500"
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
              Simple Setup
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Schedulee.app Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Get set up and start accepting bookings in minutes
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border-0">
                <LottieAnimation animationName="setup-process" />
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6 md:space-y-8">
                <StepItem
                  step="1"
                  title="Customize Your Booking Page"
                  description="Match your brand colors and add your services in just a few clicks."
                  icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
                <StepItem
                  step="2"
                  title="Set Your Availability"
                  description="Define your working hours and block off personal time as needed."
                  icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <StepItem
                  step="3"
                  title="Share Your Link"
                  description="Start accepting bookings immediately by sharing your unique page."
                  icon="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
              Trusted Worldwide
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by professionals across industries
            </h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it - hear from our users
            </p>
          </motion.div>

          <TestimonialCarousel testimonials={DEFAULT_TESTIMONIALS} />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
              Simple Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              One Plan With Everything Included
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              No hidden fees, no complicated tiers
            </p>
          </motion.div>

          <motion.div
            className="max-w-md mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                $8.99<span className="text-lg font-normal text-gray-600">/month</span>
              </p>
              <p className="text-gray-600">Billed monthly. Cancel anytime.</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Unlimited bookings",
                "Custom branding",
                "No client logins required",
                "Calendar sync",
                "Email reminders",
                "24/7 support"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="text-center">
              <Link href="/dashboard/bookings" aria-label="Start free trial">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 w-full py-6 text-lg shadow-lg hover:shadow-blue-500/30 transition-all">
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Primary CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto">
          <MainCTA />
        </div>
      </section>

      {/* Secondary CTA before footer */}
      <section className="py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <SecondaryCTA />
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
              <BackToTop />
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