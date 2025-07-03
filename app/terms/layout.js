// app/privacy/layout.js
import PolicyNav from "@/components/ui/policyNav"
export const metadata = {
    title: 'Terms of Service | Schedulee.app',
    description: 'Schedulee.app Terms of Service',
}

export default function TermsLayout({ children }) {
    return (
        <div className="bg-white min-h-screen">
            <PolicyNav />
            {children}
        </div>
    )
}