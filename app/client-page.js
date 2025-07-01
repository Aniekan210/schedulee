"use client"
import { useRef, useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

// Dynamically import Lottie with error handling
const Lottie = dynamic(() => import('react-lottie').then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading animation...</span>
    </div>
})

export default function ClientPage({ testimonials }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [navVisible, setNavVisible] = useState(true)
    const [animationError, setAnimationError] = useState(false)
    const [videoError, setVideoError] = useState(false)
    const [currentTestimonials, setCurrentTestimonials] = useState(testimonials.slice(0, 3))
    const [currentIndex, setCurrentIndex] = useState(0)
    const videoRef = useRef(null)

    // Animation options with error handling
    const getAnimationOptions = (animationName) => {
        try {
            return {
                loop: true,
                autoplay: true,
                animationData: require(`@/public/animations/${animationName}.json`),
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                }
            }
        } catch (e) {
            console.error(`Failed to load animation: ${animationName}`, e)
            setAnimationError(true)
            return null
        }
    }

    const calendarOptions = getAnimationOptions('calendar')
    const customizationOptions = getAnimationOptions('customization')
    const noLoginOptions = getAnimationOptions('no-login')
    const setupOptions = getAnimationOptions('setup')

    // Handle scroll for navbar hide/show
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                setNavVisible(false)
            } else {
                setNavVisible(true)
            }
            setLastScrollY(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    const nextTestimonials = () => {
        const newIndex = (currentIndex + 1) % (testimonials.length - 2)
        setCurrentIndex(newIndex)
        setCurrentTestimonials(testimonials.slice(newIndex, newIndex + 3))
    }

    const prevTestimonials = () => {
        const newIndex = (currentIndex - 1 + (testimonials.length - 2)) % (testimonials.length - 2)
        setCurrentIndex(newIndex)
        setCurrentTestimonials(testimonials.slice(newIndex, newIndex + 3))
    }

    const DemoButton = () => (
        <Button
            variant="outline"
            className="px-6 py-5 md:px-8 md:py-6 text-lg border-2 hover:bg-gray-50"
            onClick={() => {
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
            }}
            aria-label="Watch demo video"
        >
            Watch Demo
        </Button>
    )

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className={`fixed w-full bg-white shadow-sm z-50 transition-transform duration-300 ${navVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                    <Link href="#" className="flex items-center" aria-label="schedulee.app Home">
                        <div className="relative w-10 h-10 mr-2">
                            <Image
                                src="/logo.avif"
                                alt="schedulee.app Logo"
                                fill
                                className="object-contain"
                                priority
                                onError={() => console.error("Logo failed to load")}
                            />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Schedulee.app</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="#features" className="text-gray-600 hover:text-blue-500 transition-colors font-medium" aria-label="View Features">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-gray-600 hover:text-blue-500 transition-colors font-medium" aria-label="See How It Works">
                            How It Works
                        </Link>
                        <Link href="#testimonials" className="text-gray-600 hover:text-blue-500 transition-colors font-medium" aria-label="Read Testimonials">
                            Testimonials
                        </Link>
                        <Link href="/dashboard/bookings" aria-label="Get Started with schedulee.app">
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
                            <DemoButton />
                        </div>
                        <p className="text-gray-500 font-medium">Only $8.99 CAD/month after trial</p>
                    </div>
                    <div className="md:w-1/2 mt-8 md:mt-0">
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                            {videoError ? (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-500">Video failed to load</span>
                                </div>
                            ) : (
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                    poster="/images/booking-preview-poster.jpg"
                                    onError={() => setVideoError(true)}
                                >
                                    <source src="/videos/booking-preview.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
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
                                    {animationError || !calendarOptions ? (
                                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-500">Calendar animation</span>
                                        </div>
                                    ) : (
                                        <Lottie
                                            options={calendarOptions}
                                            height="100%"
                                            width="100%"
                                            isStopped={animationError}
                                        />
                                    )}
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
                                    {animationError || !customizationOptions ? (
                                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-500">Customization animation</span>
                                        </div>
                                    ) : (
                                        <Lottie
                                            options={customizationOptions}
                                            height="100%"
                                            width="100%"
                                            isStopped={animationError}
                                        />
                                    )}
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
                                    {animationError || !noLoginOptions ? (
                                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-500">No-login animation</span>
                                        </div>
                                    ) : (
                                        <Lottie
                                            options={noLoginOptions}
                                            height="100%"
                                            width="100%"
                                            isStopped={animationError}
                                        />
                                    )}
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
                                {animationError || !setupOptions ? (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-500">Setup animation</span>
                                    </div>
                                ) : (
                                    <Lottie
                                        options={setupOptions}
                                        height="100%"
                                        width="100%"
                                        isStopped={animationError}
                                    />
                                )}
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

            {/* Demo Video Section */}
            <section id="demo-video" className="py-12 md:py-20 bg-gray-100">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <div className="max-w-4xl mx-auto mb-8 md:mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">See Schedulee.app in Action</h2>
                        <p className="text-lg md:text-xl text-gray-600">
                            Watch how easy it is to set up and use Schedulee.app
                        </p>
                    </div>
                    <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto">
                        {videoError ? (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-500">Demo video failed to load</span>
                            </div>
                        ) : (
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                poster="/images/demo-poster.jpg"
                                controls
                                onError={() => setVideoError(true)}
                            >
                                <source src="/videos/product-demo.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
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

                    <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentTestimonials.map((testimonial, index) => (
                                <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-colors h-full">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center mb-4">
                                            {[...Array(testimonial.stars)].map((_, i) => (
                                                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            {[...Array(5 - testimonial.stars)].map((_, i) => (
                                                <svg key={i + testimonial.stars} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="italic mb-4 text-lg">"{testimonial.quote}"</p>
                                        <p className="font-semibold">{testimonial.author}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

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
                    </div>
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
                            <DemoButton />
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
                                        fill
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
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base" aria-label="Terms of Service">
                                    Terms
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base" aria-label="Privacy Policy">
                                    Privacy
                                </Link>
                                <a href="mailto:support@schedulee.app" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base" aria-label="Contact Support">
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