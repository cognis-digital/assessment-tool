import { NextApiRequest, NextApiResponse } from 'next';
import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

type PackageDetails = {
  name: string;
  price: number;
  description: string;
};

type Packages = {
  [key in 'basic' | 'pro' | 'enterprise']: PackageDetails;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { packages, userId } = req.body as { packages: string[]; userId: string };

    // Create line items for selected packages
    const lineItems = packages.map(packageId => {
      const packageDetails = getPackageDetails(packageId as keyof Packages);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: packageDetails.name,
            description: packageDetails.description,
          },
          unit_amount: packageDetails.price * 100, // Convert to cents
        },
        quantity: 1,
      };
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/assessment-results`,
      customer_email: req.user?.email, // From Clerk auth
      metadata: {
        userId,
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
}

function getPackageDetails(packageId: keyof Packages): PackageDetails {
  const packages: Packages = {
    basic: {
      name: 'Basic Package',
      price: 499,
      description: 'Essential digital transformation tools and guidance',
    },
    pro: {
      name: 'Professional Package',
      price: 999,
      description: 'Advanced features and dedicated consultation',
    },
    enterprise: {
      name: 'Enterprise Package',
      price: 1999,
      description: 'Full-scale transformation support and implementation',
    },
  };

  return packages[packageId];
}
