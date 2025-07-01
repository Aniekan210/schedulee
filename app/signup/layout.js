export const metadata = {
    title: "Sign Up | Schedulee.app - Get Started in Seconds",
    description: "Create your Schedulee.app account and start accepting bookings in minutes. No credit card required for the free trial.",
    alternates: {
        canonical: '/signup',
    },
    openGraph: {
        title: "Sign Up | Schedulee.app - Get Started in Seconds",
        description: "Create your account and start accepting bookings in minutes. 14 day Free Trial.",
        url: "https://schedulee.app/signup",
        images: [
            {
                url: "https://schedulee.app/logo.png", // Consider creating a dedicated signup OG image
                width: 1200,
                height: 1200, // Rectangular for better OG display
                alt: "Schedulee.app Sign Up",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sign Up | Schedulee.app - Get Started in Seconds",
        description: "Create your account and start accepting bookings in minutes. 14 day Free Trial.",
        images: "https://schedulee.app/logo.png",
    },
}

export default function SignupLayout({ children }) {
    return <>{children}</>;
}