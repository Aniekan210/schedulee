// app/terms/page.js
export default function TermsOfService() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                <p className="text-gray-600">Last updated: July 3, 2025</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                <p className="text-lg text-gray-700 mb-6">
                    Welcome to Schedulee.app, a product by Aniekan Labs. By using this service, you agree to these terms.
                </p>
            </div>

            <div className="space-y-12">
                {/* Section 1: Overview */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                        Overview
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700">
                            Schedulee.app allows businesses to share a customizable booking page with clients, who can book appointments without creating an account. These terms govern your use of the platform.
                        </p>
                    </div>
                </section>

                {/* Section 2: Use of the Service */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                        Use of the Service
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700 mb-4">By using Schedulee.app, you agree that:</p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>You are legally able to enter into a contract in your country.</li>
                            <li>You will not use the service for any illegal or harmful activity.</li>
                            <li>You are responsible for managing your booking page and availability accurately.</li>
                        </ul>
                    </div>
                </section>

                {/* Section 3: Payments */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                        Payments
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700">
                            The service is free for 30 days. After the trial, a paid subscription of $8.99 CAD/month is required to continue using the service. Payments are processed securely through Stripe. After your trial ends, access to your account will be restricted until payment is made.
                        </p>
                    </div>
                </section>

                {/* Section 4: Cancellations & Refunds */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                        Cancellations & Refunds
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700">
                            You may cancel your subscription anytime via the cancel page. Refunds are not guaranteed and are handled on a case-by-case basis. Please contact <a href="mailto:support@schedulee.app" className="text-blue-500 hover:underline">support@schedulee.app</a> for assistance.
                        </p>
                    </div>
                </section>

                {/* Section 5: Data and Content */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                        Data and Content
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700">
                            You retain ownership of all content and data you input into the service. You grant Schedulee.app the right to store and display this data to provide the service. You are responsible for ensuring the accuracy of your availability and bookings.
                        </p>
                    </div>
                </section>

                {/* Section 6: Account Security */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">6</span>
                        Account Security
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700">
                            You are responsible for maintaining the confidentiality of your login credentials. If you suspect unauthorized access, please reset your password or contact support.
                        </p>
                    </div>
                </section>

                {/* Section 7: Changes to Service */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">7</span>
                        Changes to Service
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700">
                            We may update or change features at any time. We will aim to give reasonable notice if major changes are made.
                        </p>
                    </div>
                </section>

                {/* Section 8: Termination */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">8</span>
                        Termination
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700">
                            We reserve the right to suspend or terminate accounts that violate these terms or misuse the service.
                        </p>
                    </div>
                </section>

                {/* Section 9: Disclaimer */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">9</span>
                        Disclaimer
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700">
                            Schedulee.app is provided "as is" without warranties of any kind. We are not responsible for missed appointments, data loss, or any indirect damages.
                        </p>
                    </div>
                </section>

                {/* Section 10: Limitation of Liability */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">10</span>
                        Limitation of Liability
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700">
                            To the fullest extent permitted by law, Aniekan Labs will not be liable for any indirect, incidental, or consequential damages arising out of your use of Schedulee.app.
                        </p>
                    </div>
                </section>

                {/* Section 11: Contact */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">11</span>
                        Contact
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700 mb-2">
                            For questions, email us at:
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
