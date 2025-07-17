import React from 'react'

const PolicyNav = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
                <img
                    src="/logo.avif"
                    alt="Schedulee.app Logo"
                    className="h-10 w-10 rounded-lg"
                />
                <span className="text-2xl font-bold text-gray-900">Schedulee.app</span>
            </a>
            <a href="/" className="text-gray-600 hover:text-blue-500 transition">
                Back to Home
            </a>
        </div>
    </header>
  )
}

export default PolicyNav