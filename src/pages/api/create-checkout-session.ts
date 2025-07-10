import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const PACKAGES = {
  basic: {
    name: 'Basic Package',
    price: 499,
    description: 'Essential digital transformation tools and guidance',
    timeline: '2-4 weeks',
    process: [
      'Initial consultation within 48 hours',
      'Assessment review and roadmap creation: 1 week',
      'Implementation guidance: 2-3 weeks',
    ]
  },
  pro: {
    name: 'Professional Package',
    price: 999,
    description: 'Advanced features and dedicated consultation',
    timeline: '4-8 weeks',
    process: [
      'Priority consultation within 24 hours',
      'Comprehensive assessment review: 1 week',
      'Detailed roadmap and strategy: 1-2 weeks',
      'Implementation support: 2-5 weeks',
    ]
  },
  enterprise: {
    name: 'Enterprise Package',
    price: 1999,
    description: 'Full-scale transformation support and implementation',
    timeline: '8-12 weeks',
    process: [
      'Immediate priority consultation',
      'Executive team assessment review: 1 week',
      'Comprehensive strategy development: 2-3 weeks',
      'Full implementation support: 4-8 weeks',
    ]
  }
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
      const packageDetails = PACKAGES[packageId as keyof typeof PACKAGES];
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: packageDetails.name,
            description: `${packageDetails.description}\nTimeline: ${packageDetails.timeline}`,
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
