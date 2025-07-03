// app/privacy/layout.js
import PolicyNav from "@/components/ui/policyNav"
export const metadata = {
    title: 'Privacy Policy | Schedulee.app',
    description: 'Schedulee.app Privacy Policy',
}

export default function PrivacyLayout({ children }) {
    return (
        <div className="bg-white min-h-screen">
            <PolicyNav />
            {children}
        </div>
    )
}