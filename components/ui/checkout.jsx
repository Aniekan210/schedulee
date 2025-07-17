'use client'

import { useEffect, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe-secret'
import { fetchClientSecret } from '@/app/actions/stripe'

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        const secret = await fetchClientSecret()
        setClientSecret(secret)
      } catch (err) {
        console.error('Error fetching client secret:', err)
        setError('Something went wrong while preparing your checkout.')
      }
    }

    getClientSecret()
  }, [])

  if (error) {
    return (
      <div className="text-red-500 font-semibold p-4 text-center">
        {error}
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <></>
    )
  }

  return (
    <div id="checkout" className="min-h-screen flex justify-center items-center">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
