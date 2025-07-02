// components/ui/interactive-elements.jsx
"use client"

import { useRef, useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// Safe dynamic import for Lottie with robust error handling
const Lottie = dynamic(
  () => import('react-lottie')
    .then(mod => mod.default)
    .catch(() => {
      console.error("Lottie animation library failed to load")
      return () => null
    }),
  { ssr: false }
)

// Enhanced Placeholder component
export function Placeholder({ name = "content", className = "", children }) {
  return (
    <motion.div 
      className={`bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4 ${className}`}
      whileHover={{ scale: 1.02 }}
    >
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
    </motion.div>
  )
}

export function VideoModal({ isOpen, onClose }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'auto'
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(e => console.error("Video play failed:", e))
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
              onClick={onClose}
              aria-label="Close video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <video
              ref={videoRef}
              className="w-full aspect-video"
              controls
              poster="/video-poster.jpg"
              playsInline
              muted
            >
              <source src="/demo-video.mp4" type="video/mp4" />
              <source src="/demo-video.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function DemoButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        variant="outline" 
        className="px-6 py-5 md:px-8 md:py-6 text-lg"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View Demo
        </div>
      </Button>
      <VideoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export function MobileMenu({ testimonials = [] }) {
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
    <nav className={`fixed w-full bg-white shadow-sm z-50 transition-transform duration-300 ${navVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* ... rest of MobileMenu component remains the same ... */}
    </nav>
  )
}

export function TestimonialCarousel({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadingError, setLoadingError] = useState(false)

  const safeTestimonials = Array.isArray(testimonials) ? testimonials : []

  useEffect(() => {
    try {
      if (safeTestimonials.length === 0) {
        setLoadingError(true)
      }
    } catch (e) {
      console.error("Error loading testimonials:", e)
      setLoadingError(true)
    }
  }, [safeTestimonials])

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
    <div className="relative max-w-5xl mx-auto">
      {safeTestimonials.length > 0 ? (
        <>
          <motion.div 
            className="grid grid-cols-1 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {[safeTestimonials[currentIndex]].map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-400"></div>
                  <div className="absolute bottom-0 right-0 text-gray-100 text-8xl font-serif z-0">”</div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-6 w-6 ${i < (testimonial?.stars || 0) ? 'text-amber-400' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    
                    <blockquote className="text-lg md:text-xl text-gray-800 mb-6 italic font-medium">
                      "{testimonial?.quote || 'Great service!'}"
                    </blockquote>
                    
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-1 rounded-full mr-4">
                        <div className="bg-white p-1 rounded-full">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {testimonial?.author?.charAt(0) || 'U'}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial?.author || 'Happy Customer'}</p>
                        <p className="text-blue-500 text-sm">Verified User</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {safeTestimonials.length > 1 && (
            <div className="flex justify-center mt-8 gap-4">
              <button
                className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-600 text-center">No testimonials available</p>
        </div>
      )}
    </div>
  )
}

export function LottieAnimation({ animationName, className = "" }) {
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
    autoplay: true,
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
        isStopped={false}
        isPaused={false}
      />
    </div>
  )
}

export function BackToTop() {
  return (
    <button
      className="mt-2 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  )
}

export function FeatureCard({ title, description, icon, color }) {
  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card className="hover:shadow-lg transition-shadow h-full group">
        <CardHeader>
          <div className="w-full h-48 mb-4">
            <LottieAnimation animationName={icon} />
          </div>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className={`${color} group-hover:scale-110 transition-transform`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            {title}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  )
}

export function StepItem({ step, title, description, icon }) {
  return (
    <motion.div 
      className="flex gap-4 p-4 rounded-lg hover:bg-white hover:shadow-md transition-all"
      whileHover={{ scale: 1.02 }}
    >
      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
        {step}
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </motion.div>
  )
}
export function MainCTA({ className = "" }) {
  return (
    <motion.div 
      className={`relative overflow-hidden rounded-2xl p-0.5 bg-gradient-to-r from-blue-500 to-purple-500 ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="bg-white rounded-[calc(1rem-2px)] p-8 md:p-10 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Ready to revolutionize your scheduling?
        </h3>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of professionals who save hours every week with our intuitive booking system.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard/bookings">
            <Button 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              Start Free Trial
            </Button>
          </Link>
          <DemoButton />
        </div>
      </div>
    </motion.div>
  )
}

export function SecondaryCTA({ className = "" }) {
  return (
    <motion.div 
      className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-10 text-center shadow-sm ${className}`}
      whileHover={{ y: -5 }}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Still not convinced?
      </h3>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Try our interactive demo with no commitment and see how Schedulee.app can transform your workflow.
      </p>
      <DemoButton />
    </motion.div>
  )
}