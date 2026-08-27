"use client";
import { useState, useRef, useEffect } from "react";
import {
  CalendarCheck,
  Zap,
  Clock,
  ShieldCheck,
  Globe,
  Sparkles,
  Mail,
  Youtube,
  Instagram,
  Menu,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Check,
} from "lucide-react";
import { FaPinterestP } from "react-icons/fa";

const trackPinterestSignup = () => {
  if (window.pintrk) {
    pintrk("track", "signup", {
      event_id: "eventId0001",
    });
  } else {
    console.warn("Pinterest tracking not loaded");
  }
};

const handleFreeTrialClick = (e) => {
  e.preventDefault();
  trackPinterestSignup();
  window.location.href = "/dashboard/bookings";
};

export default function ScheduleeLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-100">
      <Header />
      <main>
        <HeroSection />
        <VideoSection />
        <FeaturesSection />
        {/* <TestimonialsSection /> */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-solid border-zinc-200">
      <div className="flex justify-between items-center px-4 py-0 mx-auto h-16 max-w-[1200px]">
        <div className="flex gap-2 items-center">
          <img
            alt="Schedulee.app logo"
            src="/logo.png"
            className="object-cover overflow-hidden w-8 h-8"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold text-neutral-800">
            Schedulee.app
          </span>
        </div>
        <nav
          className="hidden md:flex flex-1 gap-8 justify-center items-center"
          role="navigation"
          aria-label="Main navigation"
        >
          <a
            className="text-sm font-medium no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="#testimonials"
          >
            Testimonials
          </a>
          <a
            className="text-sm font-medium no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="#waitlist"
          >
            Join Beta
          </a>
          <a
            className="text-sm font-medium no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="#contact"
          >
            Contact
          </a>
        </nav>
        <div className="flex gap-3 items-center">
          <button
            className="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md cursor-pointer text-white bg-blue-500 hover:bg-blue-600 active:scale-95 hidden md:block"
            aria-label="Start your 30-day free trial"
            onClick={handleFreeTrialClick}
          >
            Start Free Trial
          </button>
          <button
            className="block p-2 cursor-pointer md:hidden"
            aria-label="Toggle mobile menu"
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleMobileMenu();
              }
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <div
        className={`px-4 py-4 bg-white border-t border-solid border-zinc-200 ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
        id="mobile-navigation"
      >
        <nav
          role="navigation"
          aria-label="Mobile navigation"
          className="flex flex-col gap-4"
        >
          <a
            className="text-base font-medium no-underline text-zinc-500 hover:text-zinc-700"
            href="#features"
            onClick={toggleMobileMenu}
          >
            Features
          </a>
          <a
            className="text-base font-medium no-underline text-zinc-500 hover:text-zinc-700"
            href="#testimonials"
            onClick={toggleMobileMenu}
          >
            Testimonials
          </a>
          <a
            className="text-base font-medium no-underline text-zinc-500 hover:text-zinc-700"
            href="#waitlist"
            onClick={toggleMobileMenu}
          >
            Join Beta
          </a>
          <a
            className="text-base font-medium no-underline text-zinc-500 hover:text-zinc-700"
            href="#contact"
            onClick={toggleMobileMenu}
          >
            Contact
          </a>
          <button
            className="w-full px-4 py-3 mt-2 text-base font-medium transition-all duration-200 rounded-md cursor-pointer text-white bg-blue-500 hover:bg-blue-600 active:scale-95"
            aria-label="Start your 30-day free trial"
            onClick={(e) => {
              handleFreeTrialClick(e);
              toggleMobileMenu();
            }}
          >
            Start Free Trial
          </button>
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="px-4 py-20 mx-auto max-w-[1200px] sm:py-16">
      <div className="px-6 py-12 text-center bg-white rounded-xl shadow-sm sm:px-4 sm:py-8">
        <div className="inline-flex items-center px-3 py-1.5 mb-6 text-xs font-medium bg-blue-100 rounded-full text-blue-600">
          <Sparkles size={14} className="mr-1" />
          Schedulee.app launches with 30-day free trial
        </div>
        <h1 className="mb-6 text-5xl font-bold leading-tight text-neutral-800 sm:text-4xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
            Stop wasting time
          </span>{" "}
          on scheduling headaches
        </h1>
        <p className="mx-auto mb-8 text-xl leading-relaxed text-zinc-500 max-w-[600px] sm:text-lg">
          Automate your appointment booking, eliminate no-shows, and get paid
          faster—all while saving 10+ hours every week.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            className="w-full min-w-[220px] px-6 py-3 text-base font-semibold transition-all duration-200 bg-blue-500 rounded-lg cursor-pointer text-white hover:bg-blue-600 active:scale-95 sm:w-auto"
            aria-label="Start your 30-day free trial - no credit card required"
            onClick={handleFreeTrialClick}
          >
            Start 30-Day Free Trial
          </button>
          <a href="#see-how-it-works" className="w-full sm:w-auto no-underline">
            <button
              className="w-full min-w-[220px] px-6 py-3 text-base font-semibold transition-all duration-200 bg-white border rounded-lg cursor-pointer text-zinc-700 border-zinc-300 hover:border-zinc-400 active:scale-95"
              aria-label="See how it works"
            >
              See how it works
            </button>
          </a>
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
}

function VideoSection() {
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Check if mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Handle play/pause
  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Playback error:", err);
      videoRef.current.muted = true;
      setMuted(true);
      await videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Toggle mute
  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  // Toggle fullscreen with landscape orientation for mobile
  const toggleFullscreen = async (e) => {
    e.stopPropagation();
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        }

        setIsFullscreen(true);

        // Lock to landscape on mobile devices when in fullscreen
        if (isMobile && screen.orientation && screen.orientation.lock) {
          try {
            await screen.orientation.lock("landscape");
          } catch (err) {
            console.log("Orientation lock failed:", err);
          }
        }
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    } else {
      try {
        // Unlock orientation when exiting fullscreen
        if (isMobile && screen.orientation && screen.orientation.unlock) {
          await screen.orientation.unlock();
        }

        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }

        setIsFullscreen(false);
      } catch (err) {
        console.error("Exit fullscreen error:", err);
      }
    }
  };

  // Check when fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreen = !!document.fullscreenElement;
      setIsFullscreen(fullscreen);

      // Lock to landscape when entering fullscreen on mobile
      if (
        fullscreen &&
        isMobile &&
        screen.orientation &&
        screen.orientation.lock
      ) {
        try {
          screen.orientation.lock("landscape");
        } catch (err) {
          console.log("Orientation lock failed:", err);
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, [isMobile]);

  return (
    <section
      id="see-how-it-works"
      className="px-4 py-20 mx-auto max-w-[1200px] sm:py-16"
    >
      <div className="px-6 py-12 text-center bg-white rounded-xl shadow-sm sm:px-4 sm:py-8">
        <div className="inline-flex items-center px-3 py-1.5 mb-6 text-xs font-medium bg-gray-200 rounded-full text-neutral-800">
          <Zap size={14} className="mr-1" />
          See it in action
        </div>
        <h2 className="mb-4 text-3xl font-bold text-neutral-800 sm:text-2xl">
          Watch how Schedulee.app works
        </h2>
        <p className="mx-auto mb-8 text-lg leading-normal text-zinc-500 max-w-[600px] sm:text-base">
          See how easy it is to set up your booking page and start accepting
          appointments in seconds.
        </p>
        <div
          ref={containerRef}
          className="relative overflow-hidden mx-auto w-full rounded-xl aspect-[16/9] bg-zinc-900 max-w-[800px]"
          onClick={togglePlayPause}
        >
          {/* Video element */}
          <video
            ref={videoRef}
            className={`absolute top-0 left-0 w-full h-full ${
              isFullscreen ? "object-contain" : "object-cover"
            }`}
            playsInline
            muted={muted}
            loop
            preload="auto"
            controls={false}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Center Play/Pause Button */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
              isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
            }`}
          >
            <button
              className="flex items-center justify-center w-12 h-12 transition-all duration-200 bg-white rounded-full shadow-md hover:bg-gray-100 active:scale-95"
              aria-label={isPlaying ? "Pause video" : "Play video"}
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
            >
              {isPlaying ? (
                <Pause size={24} className="text-black" />
              ) : (
                <Play size={24} className="text-black" fill="currentColor" />
              )}
            </button>
          </div>

          {/* Bottom Right Controls - Mute and Fullscreen */}
          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="flex items-center justify-center w-8 h-8 transition-all duration-200 bg-white rounded-full shadow-md hover:bg-gray-100 active:scale-95"
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? (
                <VolumeX size={16} className="text-black" />
              ) : (
                <Volume2 size={16} className="text-black" />
              )}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center w-8 h-8 transition-all duration-200 bg-white rounded-full shadow-md hover:bg-gray-100 active:scale-95"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Maximize2
                  size={16}
                  className="text-black transform rotate-45"
                />
              ) : (
                <Maximize2 size={16} className="text-black" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <CalendarCheck size={24} className="text-blue-500" />,
      title: "Never Miss a Booking",
      description:
        "Your booking page works 24/7, accepting appointments even while you sleep. Clients can schedule at their convenience without you lifting a finger.",
    },
    {
      icon: <Sparkles size={24} className="text-blue-500" />,
      title: "Look Professional Online",
      description:
        "Create a stunning, branded booking page that reflects your business. Customize colors, add your logo, and impress clients from their first visit.",
    },
    {
      icon: <Zap size={24} className="text-blue-500" />,
      title: "No Tech Skills Needed",
      description:
        "Get up and running in under 10 minutes with our intuitive setup wizard. No coding or complex configurations required.",
    },
    {
      icon: <Clock size={24} className="text-blue-500" />,
      title: "Flexible Availability",
      description:
        "Define complex availability patterns with ease. Set different hours for different days, block vacations, and create recurring schedules.",
    },
    {
      icon: <ShieldCheck size={24} className="text-blue-500" />,
      title: "Smart Conflict Prevention",
      description:
        "Automatically prevents double bookings and respects your buffer times, travel time between appointments, and personal blocks.",
    },
    {
      icon: <Globe size={24} className="text-blue-500" />,
      title: "Timezone Awareness",
      description:
        "Clients always see times in their timezone. Automatic daylight saving handling makes global business effortless.",
    },
  ];

  return (
    <section
      id="features"
      className="flex flex-col gap-0 px-4 py-20 mx-auto max-w-[1200px] sm:py-16"
    >
      <div className="mb-12 text-center">
        <div className="inline-flex items-center px-3 py-1.5 mb-4 text-xs font-medium bg-gray-200 rounded-full text-neutral-800">
          <Zap size={14} className="mr-1" />
          Features
        </div>
        <h2 className="mb-4 text-4xl font-bold text-neutral-800 sm:text-3xl">
          Everything you need to manage appointments
        </h2>
        <p className="mx-auto text-lg text-zinc-500 max-w-[600px]">
          Powerful features designed for businesses who value their time.
        </p>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <article className="flex flex-col p-6 transition-all duration-200 bg-white rounded-xl hover:shadow-md">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-50">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-neutral-800">{title}</h3>
      <p className="text-base leading-relaxed text-zinc-500">{description}</p>
    </article>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Schedulee made managing my salon appointments effortless. Sharing a simple booking link means fewer calls and no more scheduling headaches.",
      name: "Sarah M.",
      business: "Salon Owner",
      avatar: "https://randomuser.me/api/portraits/thumb/women/44.jpg",
    },
    {
      quote:
        "The 30-day free trial helped me move clients and see real results before paying a dime. It gave me the confidence to fully commit to Schedulee.",
      name: "David K.",
      business: "Consultant",
      avatar: "https://randomuser.me/api/portraits/thumb/men/45.jpg",
    },
    {
      quote:
        "At just $8.99 a month, Schedulee is an incredible value. It's the perfect affordable tool for my tutoring business.",
      name: "Mike R.",
      business: "Tutor",
      avatar: "https://randomuser.me/api/portraits/thumb/men/32.jpg",
    },
  ];

  return (
    <section
      id="testimonials"
      className="px-4 py-20 mx-auto max-w-[1200px] sm:py-16"
    >
      <div className="mb-12 text-center">
        <div className="inline-flex items-center px-3 py-1.5 mb-4 text-xs font-medium bg-gray-200 rounded-full text-neutral-800">
          <Sparkles size={14} className="mr-1" />
          Testimonials
        </div>
        <h2 className="mb-4 text-4xl font-bold text-neutral-800 sm:text-3xl">
          Loved by business owners everywhere
        </h2>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            quote={testimonial.quote}
            name={testimonial.name}
            business={testimonial.business}
            avatar={testimonial.avatar}
          />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ quote, name, business, avatar }) {
  return (
    <article className="flex flex-col p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-4 text-2xl text-blue-500">&quot;</div>
      <p className="mb-6 text-base italic leading-relaxed text-neutral-800">
        {quote}
      </p>
      <div className="flex items-center mt-auto">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 mr-3 rounded-full"
          width={40}
          height={40}
        />
        <div>
          <div className="mb-1 font-semibold text-neutral-800">{name}</div>
          <div className="text-sm text-zinc-500">{business}</div>
        </div>
      </div>
    </article>
  );
}

function CTASection() {
  return (
    <section className="px-4 py-20 mx-auto max-w-[1200px] sm:py-16">
      <div className="px-8 py-12 text-center bg-white rounded-xl shadow-sm sm:px-6 sm:py-8">
        <h2 className="mb-4 text-3xl font-bold text-neutral-800 sm:text-2xl">
          Ready to simplify your scheduling?
        </h2>
        <p className="mx-auto mb-8 text-lg text-zinc-500 max-w-[500px]">
          Transform your appointment booking process today.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            className="w-full min-w-[220px] px-6 py-3 text-base font-semibold transition-all duration-200 bg-blue-500 rounded-lg cursor-pointer text-white hover:bg-blue-600 active:scale-95 sm:w-auto"
            aria-label="Start your free trial today"
            onClick={handleFreeTrialClick}
          >
            Start Your Free Trial
          </button>
          <a href="#features" className="w-full sm:w-auto no-underline">
            <button
              className="w-full min-w-[220px] px-6 py-3 text-base font-semibold transition-all duration-200 bg-white border rounded-lg cursor-pointer text-zinc-700 border-zinc-300 hover:border-zinc-400 active:scale-95"
              aria-label="Learn more about features"
            >
              Learn More
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      id="contact"
      className="px-4 pt-12 pb-6 bg-white border-t border-solid border-zinc-200"
    >
      <div className="mx-auto text-center max-w-[1200px]">
        <div className="flex gap-2 justify-center items-center mb-6">
          <img
            alt="Schedulee.app logo"
            src="/logo.png"
            className="object-cover overflow-hidden w-6 h-6"
            width={24}
            height={24}
          />
          <span className="text-lg font-bold text-neutral-800">
            Schedulee.app
          </span>
        </div>
        <nav
          role="navigation"
          aria-label="Footer navigation"
          className="flex flex-wrap gap-6 justify-center mb-6"
        >
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="/terms"
          >
            Terms
          </a>
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="/privacy"
          >
            Privacy
          </a>
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="mailto:support@schedulee.app"
          >
            <Mail size={14} />
            Contact
          </a>
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="https://www.instagram.com/schedulee_app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Schedulee.app on Instagram"
          >
            <Instagram size={14} />
            Instagram
          </a>
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="https://www.youtube.com/@schedulee_app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Schedulee.app on Youtube"
          >
            <Youtube size={14} />
            Youtube
          </a>
          <a
            className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 text-zinc-500 hover:text-zinc-700"
            href="https://www.pinterest.com/schedulee_app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Schedulee.app on Pinterest"
          >
            <FaPinterestP size={14} />
            Pinterest
          </a>
        </nav>
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Schedulee.app. All rights reserved.
        </p>
      </div>
    </footer>
  );
}