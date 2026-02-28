import { pb } from '@/lib/pocketbase';
import type { 
  PBSubscriptionPlan, 
  PBSubscription, 
  PBSubscriptionExpanded, 
  PBSubscriptionWithInvoice
} from '@/lib/pocketbase-types';
import axios from 'axios';

// Use Vite proxy in development, direct URL in production
const PAYMENT_API_BASE = import.meta.env.DEV 
  ? '/api/payment'  // Proxy through Vite server (hides actual endpoint)
  : import.meta.env.VITE_PAYMENT_ENDPOINT_URL || 'http://localhost:3000';

class PaymentApiService {

  async createSubscription(planId: string): Promise<PBSubscriptionWithInvoice> {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Request goes through Vite proxy, so network tab shows /api/payment/invoice/create
      // instead of the real payment provider URL
      const response = await axios.post(`${PAYMENT_API_BASE}/invoice/create`, {
        userId,
        subscriptionPlan: planId,
      });
      const data = response.data.data;
      console.log('data', data)
      const subscription = await pb.collection('subscriptions').create<PBSubscription>({
        invoiceNo: data.invoiceNo,
        providerInvoiceNo: data.providerInvoiceNo,
        user: userId,
        amount: data.amount,
        status: data.status,
        subscriptionPlan: planId,
        start_date: new Date(),
        end_date: new Date(),
        invoice: data.id,
      });

      return {
        ...subscription,
        invoice: data,
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Verify payment (mock implementation)
   * In production, this would verify with QPay webhook or API
   */
  async verifyPayment(invoiceNo: string): Promise<void> {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${PAYMENT_API_BASE}/invoice/check/${invoiceNo}`);

      return response.data.invoice;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<PBSubscription> {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Get the subscription
      const subscription = await pb.collection('subscriptions').getOne<PBSubscription>(subscriptionId);

      // Verify ownership
      if (subscription.user !== userId) {
        throw new Error('Unauthorized');
      }

      // Update subscription status
      const updatedSubscription = await pb.collection('subscriptions').update<PBSubscription>(subscriptionId, {
        status: 'CANCELLED',
      });

      // Update user's subscription status
      await pb.collection('users').update(userId, {
        subscription_status: 'CANCELLED',
      });

      return updatedSubscription;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Check and update expired subscriptions
   * This should ideally run on backend, but for mock we can call it from frontend
   */
  async checkExpiredSubscription(): Promise<void> {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        return;
      }

      const user = pb.authStore.model;
      
      if (user?.subscription_status === 'ACTIVE' && user?.subscription_expiry) {
        const expiryDate = new Date(user.subscription_expiry);
        const now = new Date();
        
        if (now > expiryDate) {
          // Update user status to expired
          await pb.collection('users').update(userId, {
            subscription_status: 'expired',
          });

          // Update subscription record
          const subscriptions = await pb.collection('subscriptions').getList<PBSubscription>(1, 1, {
            filter: `user = "${userId}" && status = "ACTIVE"`,
            sort: '-created',
          });

          if (subscriptions.items.length > 0) {
            await pb.collection('subscriptions').update(subscriptions.items[0].id, {
              status: 'expired',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking expired subscription:', error);
    }
  }

  /**
   * Get subscription plan by ID
   */
  async getSubscriptionPlanById(planId: string): Promise<PBSubscriptionPlan> {
    try {
      const plan = await pb.collection('subscription_plans').getOne<PBSubscriptionPlan>(planId);
      return plan;
    } catch (error) {
      console.error('Error fetching subscription plan:', error);
      throw new Error('Failed to fetch subscription plan');
    }
  }
}

export const paymentApi = new PaymentApiService();

