// components/ui/interactive-elements.jsx
"use client"

import { useRef, useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

// Safe dynamic import for Lottie with robust error handling
const Lottie = dynamic(
  () => import('react-lottie')
    .then(mod => mod.default)
    .catch(() => {
      console.error("Lottie animation library failed to load")
      return () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">Animation player not available</span>
      </div>
    }),
  { ssr: false }
)

// Generic placeholder component - only one declaration
export function Placeholder({ name = "content", className = "" }) {
  return (
    <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
      <span className="text-gray-500">{name} placeholder</span>
    </div>
  )
}

export function MobileMenu({ testimonials = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [navVisible, setNavVisible] = useState(true)
  const [logoError, setLogoError] = useState(false)

  // Handle scroll for navbar hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavVisible(false)
      } else {
        setNavVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <nav className={`fixed w-full bg-white shadow-sm z-50 transition-transform duration-300 ${navVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link href="#" className="flex items-center" aria-label="schedulee.app Home">
          <div className="relative w-10 h-10 mr-2">
            {logoError ? (
              <Placeholder name="Logo" className="w-10 h-10" />
            ) : (
              <Image
                src="/logo.avif"
                alt="schedulee.app Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
                onError={() => setLogoError(true)}
              />
            )}
          </div>
          <span className="text-xl font-bold text-gray-900">Schedulee.app</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-gray-600 hover:text-blue-500 transition-colors font-medium">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-blue-500 transition-colors font-medium">
            How It Works
          </Link>
          <Link href="#testimonials" className="text-gray-600 hover:text-blue-500 transition-colors font-medium">
            Testimonials
          </Link>
          <Link href="/dashboard/bookings">
            <Button className="bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-blue-500/30 transition-all">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link
              href="#features"
              className="text-gray-600 hover:text-blue-500 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-500 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-600 hover:text-blue-500 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/dashboard/bookings"
              className="w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export function TestimonialCarousel({ testimonials = [] }) {
  const [currentTestimonials, setCurrentTestimonials] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Initialize with empty array if testimonials is undefined
  const safeTestimonials = testimonials || []
  
  useEffect(() => {
    setCurrentTestimonials(safeTestimonials.slice(0, 3))
  }, [safeTestimonials])

  const nextTestimonials = () => {
    const newIndex = (currentIndex + 1) % Math.max(1, (safeTestimonials.length - 2))
    setCurrentIndex(newIndex)
    setCurrentTestimonials(safeTestimonials.slice(newIndex, newIndex + 3))
  }

  const prevTestimonials = () => {
    const newIndex = (currentIndex - 1 + Math.max(1, (safeTestimonials.length - 2))) % Math.max(1, (safeTestimonials.length - 2))
    setCurrentIndex(newIndex)
    setCurrentTestimonials(safeTestimonials.slice(newIndex, newIndex + 3))
  }

  return (
    <div className="relative">
      {safeTestimonials.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTestimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-colors h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${i < (testimonial?.stars || 0) ? 'text-yellow-300' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="italic mb-4 text-lg">"{testimonial?.quote || 'Great service!'}"</p>
                  <p className="font-semibold">{testimonial?.author || 'Happy Customer'}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {safeTestimonials.length > 3 && (
            <div className="flex justify-center mt-8 gap-4">
              <button
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                onClick={prevTestimonials}
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                onClick={nextTestimonials}
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white/10 border-white/20 backdrop-blur-sm h-full">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-300"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="italic mb-4 text-lg">"This is a placeholder testimonial that would show real user feedback"</p>
                <p className="font-semibold">Sample User</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export function DemoVideo() {
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef(null)

  const handleDemoClick = () => {
    const demoSection = document.getElementById('demo-video')
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' })
      const video = demoSection.querySelector('video')
      if (video && !videoError) {
        video.play().catch(e => {
          console.error("Video play failed:", e)
          setVideoError(true)
        })
      }
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="px-6 py-5 md:px-8 md:py-6 text-lg border-2 hover:bg-gray-50"
        onClick={handleDemoClick}
        aria-label="Watch demo video"
      >
        Watch Demo
      </Button>

      <div id="demo-video" className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto">
        {videoError ? (
          <Placeholder name="Demo video" className="w-full h-full" />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls
            poster="/video-poster.jpg" // Add a fallback poster image
            onError={() => setVideoError(true)}
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            <source src="/demo-video.webm" type="video/webm" />
            <Placeholder name="Demo video" className="w-full h-full" />
          </video>
        )}
      </div>
    </>
  )
}

export function LottieAnimation({ animationName }) {
  const [animationError, setAnimationError] = useState(false)

  const getAnimationOptions = () => {
    try {
      // Dynamic import for animation data with error handling
      const animationData = require(`@/public/animations/${animationName}.json`)
      return {
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      }
    } catch (e) {
      console.error(`Animation not found: ${animationName}`)
      setAnimationError(true)
      return null
    }
  }

  const options = getAnimationOptions()

  if (!Lottie || animationError || !options) {
    return <Placeholder name={animationName} className="w-full h-48" />
  }

  return <Lottie options={options} height="100%" width="100%" />
}