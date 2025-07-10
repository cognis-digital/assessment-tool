# Digital Transformation Platform

This repository powers the *Digital Transformation Platform* assessment tool.

## Features

- Authentication with Clerk
- Stripe payments integration
- Supabase migrations and data storage
- Built with React + Vite + Typescript

## Getting Started

### Prerequisites

- Node.js v18 or newer
- npm

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/cognis-digital/assessment-tool.git
   cd assessment-tool
   ```
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Add environment variables in a `.env` file (see **Environment Variables** below).

### Environment Variables

Create a `.env` in the project root with these keys:

```ini
CLERK_SECRET_KEY=sk_...         # server-side only
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_STRIPE_PUBLIC_KEY=pk_...
```

### Development

Run the dev server:

```bash
npm run dev
```

### Build

Produce a production build:

```bash
npm run build
```

## Deployment

We use GitHub Actions to deploy to **GitHub Pages** on each push to `main` branch. The build artifact (`dist`) is published to the `gh-pages` branch.

### Custom Domain

This repository is configured to publish at the custom domain `cognis.services`. DNS should point your domain (via a CNAME record) to `cognis-digital.github.io`.

Once pushed to `main`, the GitHub Actions workflow will:
1. Install dependencies
2. Build the app
3. Deploy to `gh-pages` with `CNAME` set to `cognis.services`

Learn more: https://docs.github.com/pages
