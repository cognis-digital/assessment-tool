import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { X, CreditCard, Wallet } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  package: {
    name: string;
    price: string;
    monthlyPrice: number;
  };
};

export function PaymentModal({ isOpen, onClose, package: selectedPackage }: PaymentModalProps) {
  if (!isOpen) return null;

  const handlePayment = async (method: string) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Here you would typically call your backend to create a payment intent
      // For now, we'll just show a success message
      console.log(`Processing ${method} payment for ${selectedPackage.name}`);
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Payment Options</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-lg font-medium mb-2">{selectedPackage.name}</div>
          <div className="text-neutral-600">
            ${selectedPackage.monthlyPrice}/month
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handlePayment('card')}
            className="w-full flex items-center justify-center space-x-2 bg-royal text-white p-4 rounded-lg hover:bg-royal-dark transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span>Pay with Card</span>
          </button>

          <button
            onClick={() => handlePayment('wallet')}
            className="w-full flex items-center justify-center space-x-2 border border-neutral-200 p-4 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Wallet className="w-5 h-5" />
            <span>Digital Wallet</span>
          </button>

          <div className="text-center text-sm text-neutral-600">
            Secure payment powered by Stripe
          </div>
        </div>
      </div>
    </div>
  );
}