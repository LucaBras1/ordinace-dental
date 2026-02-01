/**
 * Google Calendar OAuth2 Setup Helper
 *
 * This endpoint helps with initial Google Calendar integration setup.
 * Use it to generate authorization URL and exchange code for refresh token.
 *
 * IMPORTANT: This endpoint should be protected or disabled in production!
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAuthorizationUrl, getRefreshToken } from '@/lib/google-calendar'

// ============================================
// GET /api/calendar/setup
// ============================================

/**
 * Returns Google OAuth2 authorization URL for setup.
 *
 * Usage:
 * 1. Visit this endpoint
 * 2. Click the authorization URL
 * 3. Grant calendar access
 * 4. Copy the 'code' parameter from callback URL
 * 5. POST to /api/calendar/setup with code to get refresh token
 */
export async function GET(request: NextRequest) {
  try {
    // Check if already configured
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      return NextResponse.json({
        message: 'Google Calendar is already configured',
        configured: true,
      })
    }

    // Check if client ID and secret are set
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        {
          error: 'Missing Google OAuth2 credentials',
          message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables',
        },
        { status: 400 }
      )
    }

    const authUrl = getAuthorizationUrl()

    return NextResponse.json({
      message: 'Click the URL below to authorize Google Calendar access',
      authorizationUrl: authUrl,
      instructions: [
        '1. Click the authorization URL',
        '2. Sign in with Google account',
        '3. Grant calendar access permissions',
        '4. Copy the "code" parameter from callback URL',
        '5. POST to /api/calendar/setup with { "code": "your_code" }',
      ],
    })

  } catch (error) {
    console.error('[Calendar Setup] Error generating auth URL:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate authorization URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================
// POST /api/calendar/setup
// ============================================

/**
 * Exchanges authorization code for refresh token.
 *
 * Body: { "code": "authorization_code_from_callback" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        {
          error: 'Missing authorization code',
          message: 'Please provide "code" in request body',
        },
        { status: 400 }
      )
    }

    // Exchange code for refresh token
    const refreshToken = await getRefreshToken(code)

    return NextResponse.json({
      message: 'Successfully obtained refresh token!',
      refreshToken,
      instructions: [
        '1. Copy the refresh token below',
        '2. Add it to your .env file as GOOGLE_REFRESH_TOKEN',
        '3. Restart your application',
        '4. Google Calendar integration is now active',
      ],
      warning: 'Keep this token secure! It provides access to your Google Calendar.',
    })

  } catch (error) {
    console.error('[Calendar Setup] Error exchanging code for token:', error)
    return NextResponse.json(
      {
        error: 'Failed to exchange code for refresh token',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
