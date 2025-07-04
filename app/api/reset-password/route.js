// app/api/reset-password/route.js
import { createSupabaseServerClient } from "@/lib/supabase/server";


export async function POST(request) {

  const supabase = createSupabaseServerClient();
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
    });

    if (error) {
      // Convert Supabase errors to more user-friendly messages
      let userError;
      switch (error.message) {
        case 'User not found':
          userError = 'No account found with this email address';
          break;
        case 'Email rate limit exceeded':
          userError = 'Too many requests. Please try again later';
          break;
        default:
          userError = 'Failed to send reset email. Please try again';
      }
      return new Response(JSON.stringify({ error: userError }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (err) {
    console.error('Password reset error:', err);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT(request) {
  const { password, access_token } = await request.json()

  try {
    const supabase = createSupabaseServerClient()

    // First set the session using the access token
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token: '' // Refresh token not available in password reset flow
    })

    if (sessionError) throw sessionError

    // Then update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password
    })

    if (updateError) throw updateError

    // Construct success URL
    const message = encodeURIComponent("Password Reset Successfully")
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/success?message=${message}`

    return new Response(JSON.stringify({
      success: true,
      redirectUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    let userError;
    switch (error.message) {
      case 'Password reset requires an authentication factor':
        userError = 'Invalid or expired reset link. Please request a new one.'
      case 'New password should be different from the old password':
        userError = 'New password must be different from your current password'
      default:
        userError = 'Failed to reset password. Please try again.'
    }
    return new Response(JSON.stringify({
      error: userError,
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}