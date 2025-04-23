const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
require('dotenv').config();

class PaymentService {
  static async createCustomer(userId, email, name) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { userId }
      });

      // Update user with Stripe customer ID
      await User.findByIdAndUpdate(userId, { stripeCustomerId: customer.id });

      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  static async createPaymentIntent(amount, currency, customerId, metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        metadata,
        automatic_payment_methods: { enabled: true }
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  static async createSubscription(customerId, priceId) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  static async cancelSubscription(subscriptionId) {
    try {
      const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
      return canceledSubscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  static async createDonation(userId, amount, currency, description) {
    try {
      const user = await User.findById(userId);
      if (!user.stripeCustomerId) {
        await this.createCustomer(userId, user.email, user.name);
      }

      const paymentIntent = await this.createPaymentIntent(
        amount,
        currency,
        user.stripeCustomerId,
        { type: 'donation', description }
      );

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Error creating donation:', error);
      throw new Error('Failed to process donation');
    }
  }

  static async verifyWebhookSignature(signature, body) {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return event;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw new Error('Invalid webhook signature');
    }
  }
}

module.exports = PaymentService;