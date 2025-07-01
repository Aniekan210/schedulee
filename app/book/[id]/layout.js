/**
 * Customer Booking Page Metadata
 * 
 * Defines SEO and social sharing for business booking pages
 * where customers schedule appointments.
 */
export const metadata = {
    title: "Book Your Appointment",
    description: "Schedule directly with this business — powered by schedulee.app",

    openGraph: {
        title: "Book Your Appointment",
        description: "Reserve your spot with this business using schedulee.app",
        images: [
            {
                url: "https://schedulee.app/logo.png",
                width: 1200,
                height: 1200,  // Your square logo
                alt: "Schedulee Logo",
            },
        ],
        type: "website",
        siteName: "Schedulee",
    },

    twitter: {
        card: "summary_large_image",
        title: "Book Your Appointment",
        description: "Schedule your appointment with this business",
        images: ["https://schedulee.app/logo.png"],
    },
};

/**
 * Booking Page Layout
 * 
 * Clean wrapper for customer booking flows.
 */
export default function BookingLayout({ children }) {
    return <>{children}</>;
}