import crypto from 'crypto';

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  provider: 'razorpay' | 'stripe';
  providerStatus: 'LIVE' | 'BLOCKED';
}

export class PaymentService {
  public static createOrder(
    amount: number,
    currency: string = 'INR',
    provider: 'razorpay' | 'stripe' = 'razorpay'
  ): PaymentOrderResult {
    const key = provider === 'razorpay' ? process.env.RAZORPAY_KEY_ID : process.env.STRIPE_SECRET_KEY;

    if (!key) {
      console.warn(`Payment provider [${provider.toUpperCase()}] API key is missing. Live checkout is BLOCKED.`);
      return {
        orderId: `mock_order_${crypto.randomBytes(8).toString('hex')}`,
        amount,
        currency,
        provider,
        providerStatus: 'BLOCKED'
      };
    }

    return {
      orderId: `order_${crypto.randomBytes(12).toString('hex')}`,
      amount,
      currency,
      provider,
      providerStatus: 'LIVE'
    };
  }

  public static verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return false;

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === signature;
  }
}
