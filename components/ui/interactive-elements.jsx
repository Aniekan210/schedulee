// components/ui/interactive-elements.jsx
"use client"

import { useRef, useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, Share2 } from 'lucide-react'

const Lottie = dynamic(
  () => import('react-lottie')
    .then(mod => mod.default)
    .catch(() => {
      console.error("Lottie animation library failed to load")
      return () => null
    }),
  { ssr: false }
)

export function Placeholder({ name = "content", className = "", children }) {
  return (
    <div className={`bg-gray-100/20 rounded-lg flex flex-col items-center justify-center p-4 ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-10 w-10 text-gray-400 mb-2" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-gray-500 text-center">
        {name || children || 'Placeholder content'}
      </span>
    </div>
  )
}

export function TestimonialCarousel({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadingError, setLoadingError] = useState(false)
  const carouselRef = useRef(null)

  const safeTestimonials = Array.isArray(testimonials) ? testimonials : []

  useEffect(() => {
    try {
      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`
      }
    } catch (e) {
      console.error("Error with carousel animation:", e)
      setLoadingError(true)
    }
  }, [currentIndex])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % safeTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + safeTestimonials.length) % safeTestimonials.length)
  }

  if (loadingError) {
    return (
      <Placeholder name="Testimonials" className="w-full h-64">
        Failed to load testimonials
      </Placeholder>
    )
  }

  return (
    <div className="relative w-full">
      <div className="relative h-full overflow-hidden">
        {safeTestimonials.length > 0 ? (
          <>
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ width: `${safeTestimonials.length * 100}%` }}
            >
              {safeTestimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <Card className="bg-white border border-gray-100 hover:border-indigo-100 transition-all h-full group hover:shadow-sm min-h-[300px] flex flex-col">
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex flex-col items-center text-center h-full">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-indigo-100">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-grow flex flex-col justify-center">
                          <p className="text-gray-700 italic text-lg mb-6 group-hover:text-gray-800 transition-colors line-clamp-4">
                            "{testimonial.quote}"
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {testimonial.author}
                          </p>
                          <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                            Verified User
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {safeTestimonials.length > 1 && (
              <div className="flex justify-center mt-8 gap-3">
                <button
                  className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm hover:shadow-md group"
                  onClick={prevTestimonial}
                  aria-label="Previous testimonial"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-1">
                  {safeTestimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'}`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm hover:shadow-md group"
                  onClick={nextTestimonial}
                  aria-label="Next testimonial"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white border border-gray-100 h-full group hover:shadow-sm min-h-[300px] flex flex-col">
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-indigo-100">
                      <Image
                        src={`https://randomuser.me/api/portraits/thumb/${i % 2 === 0 ? 'women' : 'men'}/${i * 10}.jpg`}
                        alt="User"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <p className="text-gray-700 italic text-lg mb-6 group-hover:text-gray-800 transition-colors line-clamp-4">
                        "This is a placeholder testimonial that would show real user feedback"
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        Sample User
                      </p>
                      <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                        Verified User
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function DemoVideo({ className = "" }) {
  return (
    <div className={`lg:w-1/2 mt-8 lg:mt-0 ${className}`}>
      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
        <Placeholder name="Demo video coming soon" />
      </div>
    </div>
  )
}

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!isAutoRotating) return

    const rotateSteps = () => {
      setActiveStep(prev => (prev + 1) % 3)
      timeoutRef.current = setTimeout(rotateSteps, 5000)
    }

    timeoutRef.current = setTimeout(rotateSteps, 5000)
    return () => clearTimeout(timeoutRef.current)
  }, [isAutoRotating])

  const handleStepChange = (index) => {
    setActiveStep(index)
    setIsAutoRotating(false)
    clearTimeout(timeoutRef.current)
  }

  const steps = [
    {
      icon: <CalendarDays className="h-8 w-8 text-indigo-600" />,
      title: "Customize Your Booking Page",
      description: "Match your brand colors and add your services in just a few clicks."
    },
    {
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      title: "Set Your Availability",
      description: "Define your working hours and block off personal time as needed."
    },
    {
      icon: <Share2 className="h-8 w-8 text-indigo-600" />,
      title: "Share Your Link",
      description: "Start accepting bookings immediately by sharing your unique page."
    }
  ]

  return (
    <section id="how-it-works" className="py-12 md:py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-[1.2] tracking-[-0.02em]">
            How Schedulee.app Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-[1.5]">
            Get set up and start accepting bookings in minutes
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex gap-6 p-6 rounded-xl transition-all cursor-pointer ${activeStep === index ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50'}`}
                  onMouseEnter={() => handleStepChange(index)}
                  onClick={() => handleStepChange(index)}
                >
                  <div className="flex items-center justify-center h-full">
                    <div className={`p-3 rounded-lg ${activeStep === index ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 transition-colors leading-[1.2] tracking-[-0.02em] ${activeStep === index ? 'text-indigo-600' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                    <p className={`transition-colors leading-[1.5] ${activeStep === index ? 'text-gray-700' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="relative aspect-video w-full h-full rounded-xl overflow-hidden">
              {activeStep === 0 && <LottieAnimation animationName="setup-step1" isActive />}
              {activeStep === 1 && <LottieAnimation animationName="setup-step2" isActive />}
              {activeStep === 2 && <LottieAnimation animationName="setup-step3" isActive />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <button
      className={`fixed bottom-6 right-6 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  )
}

export function LottieAnimation({ animationName, className = "", isActive = false }) {
  const [animationError, setAnimationError] = useState(false)
  const [animationData, setAnimationData] = useState(null)

  useEffect(() => {
    try {
      import(`@/public/animations/${animationName}.json`)
        .then(data => setAnimationData(data.default))
        .catch(() => {
          console.error(`Animation "${animationName}" not found`)
          setAnimationError(true)
        })
    } catch (e) {
      console.error(`Animation import error: ${e.message}`)
      setAnimationError(true)
    }
  }, [animationName])

  if (animationError || !animationData) {
    return (
      <Placeholder 
        name={`Animation: ${animationName}`} 
        className={`w-full h-48 ${className}`}
      />
    )
  }

  if (!Lottie) {
    return (
      <Placeholder 
        name="Animation player loading..." 
        className={`w-full h-48 ${className}`}
      />
    )
  }

  const options = {
    loop: true,
    autoplay: isActive,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Lottie 
        options={options} 
        height="100%" 
        width="100%"
        isStopped={!isActive}
        isPaused={!isActive}
      />
    </div>
  )
}

export function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [navVisible, setNavVisible] = useState(true)
  const [logoError, setLogoError] = useState(false)

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
    <nav className={`fixed w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-all duration-300 ease-out ${navVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link href="#" className="flex items-center group" aria-label="schedulee.app Home">
          <div className="relative w-10 h-10 mr-3 transition-transform group-hover:scale-105">
            {logoError ? (
              <Placeholder name="Logo" className="w-10 h-10" />
            ) : (
              <Image
                src="/logo.avif"
                alt="schedulee.app Logo"
                width={40}
                height={40}
                className="object-contain rounded-md"
                priority
                onError={() => setLogoError(true)}
              />
            )}
          </div>
          <span className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Schedulee.app</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium flex items-center gap-1.5 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium flex items-center gap-1.5 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            How It Works
          </Link>
          <Link href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium flex items-center gap-1.5 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            Testimonials
          </Link>
          <Link href="/dashboard/bookings">
            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-indigo-400/20 transition-all group">
              <span className="group-hover:scale-105 transition-transform">Get Started</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden text-gray-600 focus:outline-none transition-transform hover:scale-110"
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

      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm py-4 px-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col space-y-4">
            <Link
              href="#features"
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium py-2 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium py-2 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium py-2 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              Testimonials
            </Link>
            <Link
              href="/dashboard/bookings"
              className="w-full mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 group">
                <span className="group-hover:scale-105 transition-transform">Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}