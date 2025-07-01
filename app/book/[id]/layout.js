export const metadata = {
    title: "Book an Appointment",
    description: "Book an appointment with a business — powered by schedulee.app",
    openGraph: {
        title: "Book an Appointment",
        description: "Easily schedule an appointment with a business using schedulee.app.",
        images: [
            {
                url: "https://schedulee.app/logo.png",
                width: 1200,
                height: 1200,
                alt: "Schedulee Logo",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Book an Appointment",
        description: "Easily schedule an appointment with a business using schedulee.app.",
        images: ["https://schedulee.app/logo.png"],
    },
};

export default function BookingLayout({ children }) {
    return <>{children}</>;
}