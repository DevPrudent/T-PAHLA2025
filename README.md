# TPAHLA 2025 - The Pan-African Humanitarian Leadership Award

## Project Overview

TPAHLA 2025 is a web platform for The Pan-African Humanitarian Leadership Award, an event recognizing excellence in humanitarian leadership across Africa. The platform facilitates nominations, registrations, and sponsorships for the 2025 award ceremony.

## Features

- Award nominations submission and management
- Event registration with multiple participation types
- Sponsorship opportunities
- Payment integration with Paystack
- Email notifications for various events
- Admin dashboard for managing nominations, registrations, and payments

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage)
- **Serverless Functions**: Supabase Edge Functions
- **Payment Processing**: Paystack
- **Email Service**: Resend

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account
- Paystack account
- Resend account (for email functionality)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Paystack
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

For Supabase Edge Functions, set these environment variables in the Supabase dashboard:

```
PAYSTACK_SECRET_KEY=your_paystack_secret_key
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Deployment

#### Deploying Edge Functions

To deploy the Supabase Edge Functions:

```bash
supabase functions deploy send-email
supabase functions deploy registration-confirmation
supabase functions deploy payment-confirmation
supabase functions deploy verify-payment
```

#### Deploying the Frontend

The project is configured for deployment with Netlify. Simply connect your repository to Netlify and it will automatically build and deploy the site.

## Email Configuration

This project uses Resend for sending emails. To set up email functionality:

1. Create an account at [Resend](https://resend.com)
2. Verify your domain or use Resend's test email (onboarding@resend.dev)
3. Get your API key and set it as the `RESEND_API_KEY` environment variable in Supabase
4. Set your sender email as the `FROM_EMAIL` environment variable

## Payment Integration

The project uses Paystack for payment processing. To set up:

1. Create an account at [Paystack](https://paystack.com)
2. Get your public and secret keys
3. Set the public key as `VITE_PAYSTACK_PUBLIC_KEY` in your frontend environment
4. Set the secret key as `PAYSTACK_SECRET_KEY` in your Supabase Edge Functions environment

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For inquiries, please contact:
- Email: tpahla@ihsd-ng.org
- Phone: +234-810-490-6878 (WhatsApp)