// app/privacy/page.js
export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: July 3, 2025</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <p className="text-lg text-gray-700 mb-6">
          At Schedulee.app, operated by Aniekan Labs, we take your privacy seriously. 
          This policy explains what information we collect, how we use it, and your rights.
        </p>
      </div>

      <div className="space-y-12">

        {/* Section 1: Information We Collect */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
            Information We Collect
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">a. For Business Owners:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Email address</li>
              <li>Business name</li>
              <li>Password</li>
            </ul>
            <p className="mt-3 text-gray-600">
              These are used to manage your account and send transactional emails.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-3">b. For Clients:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Name</li>
              <li>Email</li>
              <li>Phone number</li>
            </ul>
            <p className="mt-3 text-gray-600">
              This information is passed to the business you're booking with.
            </p>
          </div>
        </section>

        {/* Section 2: How We Use Your Information */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
            How We Use Your Information
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Authenticate business users</li>
              <li>Enable appointment booking</li>
              <li>Send transactional emails</li>
            </ul>
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r">
              <p className="text-gray-700 font-medium flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                We do not sell your data.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Data Storage & Security */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
            Data Storage & Security
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700">
              Your data is stored securely using Supabase infrastructure. We take reasonable precautions to protect your information but cannot guarantee absolute security.
            </p>
          </div>
        </section>

        {/* Section 4: Cookies and Analytics */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
            Cookies and Analytics
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700">
              Schedulee.app may use cookies for authentication or session management. We currently do not use third-party analytics tools.
            </p>
          </div>
        </section>

        {/* Section 5: Data Sharing */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
            Data Sharing
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700">
              We only share data with third parties essential for the operation of the service (e.g., Stripe for payments). We do not sell or share your data with advertisers.
            </p>
          </div>
        </section>

        {/* Section 6: Your Rights */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">6</span>
            Your Rights
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Request access to your personal data</li>
              <li>Request deletion of your account</li>
              <li>Withdraw consent at any time (where applicable)</li>
            </ul>
            <p className="mt-4 text-gray-600">
              To exercise any of these rights, email <a href="mailto:support@schedulee.app" className="text-blue-500 hover:underline">support@schedulee.app</a>.
            </p>
          </div>
        </section>

        {/* Section 7: Children’s Privacy */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">7</span>
            Children’s Privacy
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700">
              Schedulee.app is not intended for individuals under the age of 13. We do not knowingly collect data from children. If we learn that we’ve collected data from a child, we’ll delete it promptly.
            </p>
          </div>
        </section>

        {/* Section 8: Contact */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">8</span>
            Contact
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-2">
              If you have questions or concerns about this policy, contact us:
            </p>
            <a href="mailto:support@schedulee.app" className="text-blue-500 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              support@schedulee.app
            </a>
          </div>
        </section>

      </div>
    </main>
  )
}
