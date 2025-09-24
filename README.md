# ReviewReply AI

An AI-powered Google Review Auto-Reply system built with Next.js 14, featuring automatic review monitoring and intelligent response generation.

## Features

- **Automatic Review Monitoring**: Sync reviews from Google Business Profile
- **AI-Powered Responses**: Generate contextual replies to 5-star reviews
- **Multi-Location Support**: Manage multiple business locations
- **Real-time Dashboard**: Monitor review performance and response metrics
- **Smart Analytics**: Track response rates, customer satisfaction, and trends

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **AI**: OpenAI GPT integration
- **Authentication**: Google OAuth 2.0
- **APIs**: Google My Business API integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Google Cloud Console account
- OpenAI API account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd v0-google-review-auto-replies
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your environment variables in `.env.local` (see Environment Setup section below)

5. Run the development server:
\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

### Required Environment Variables

Copy `.env.example` to `.env.local` and configure the following variables:

\`\`\`bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
\`\`\`

### Google OAuth Setup

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Required APIs**:
   - Enable the Google My Business API
   - Enable the Google+ API (for profile information)

3. **Create OAuth 2.0 Credentials**:
   - Go to "Credentials" in the Google Cloud Console
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application" as the application type
   - Add authorized redirect URIs:
     - For development: `http://localhost:3000/api/auth/google/callback`
     - For production: `https://yourdomain.com/api/auth/google/callback`

4. **Configure Environment Variables**:
   - Copy the Client ID and Client Secret from Google Cloud Console
   - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your `.env.local`
   - Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to the same value as `GOOGLE_CLIENT_ID`
   - Set `NEXT_PUBLIC_APP_URL` to your application URL

## Project Structure

\`\`\`
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── google/       # Google Business Profile integration
│   ├── dashboard/         # Dashboard pages
│   └── login/            # Authentication pages
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   └── auth/             # Authentication components
├── lib/                  # Utility functions and configurations
└── public/              # Static assets
\`\`\`

## Authentication

The app supports two authentication methods:

1. **Demo Login**: Use `admin` / `pass12345#` for testing
2. **Google OAuth**: Connect with Google Business Profile for production use

### Authentication Flow

1. Users can log in with demo credentials to explore the dashboard
2. To connect Google Business Profile, users click "Connect Google Business Profile"
3. The app redirects to Google OAuth for authorization
4. After successful authorization, users can sync reviews and manage responses

## API Routes

- `/api/auth/google` - Initiates Google OAuth flow
- `/api/auth/google/callback` - Handles Google OAuth callback
- `/api/auth/logout` - Handles user logout
- `/api/google/auth` - Alternative Google OAuth endpoint
- `/api/google/locations` - Fetches business locations
- `/api/google/reviews/sync` - Syncs reviews from Google
- `/api/generate-reply` - AI response generation

## Troubleshooting

### Common Issues

1. **Google OAuth 404 Error**:
   - Ensure `GOOGLE_CLIENT_ID` is set in environment variables
   - Verify redirect URIs match in Google Cloud Console

2. **Environment Variables Not Loading**:
   - Make sure `.env.local` file exists in the root directory
   - Restart the development server after changing environment variables

3. **Google API Errors**:
   - Verify that required APIs are enabled in Google Cloud Console
   - Check that OAuth consent screen is configured

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
