import { pb } from '@/lib/pocketbase';
import type { 
  PBSubscriptionPlan, 
  PBSubscription, 
  PBSubscriptionExpanded 
} from '@/lib/pocketbase-types';

/**
 * Subscription API Service
 * Handles all subscription-related API calls to PocketBase
 */
class SubscriptionApiService {
  /**
   * Get all active subscription plans
   */
  async getActiveSubscriptionPlans(): Promise<PBSubscriptionPlan[]> {
    try {
      const records = await pb.collection('subscription_plans').getFullList<PBSubscriptionPlan>({
        filter: 'isActive = true',
        sort: '+sequence',
      });
      return records;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw new Error('Failed to fetch subscription plans');
    }
  }

  /**
   * Get a specific subscription plan by ID
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

  /**
   * Get user's active subscription
   */
  async getUserActiveSubscription(): Promise<PBSubscriptionExpanded | null> {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const records = await pb.collection('subscriptions').getList<PBSubscription>(1, 1, {
        filter: `user = "${userId}" && status = "active"`,
        sort: '-updated',
        expand: 'subscriptionPlan',
      });

      if (records.items.length === 0) {
        return null;
      }


      return records.items[0] as PBSubscriptionExpanded;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  /**
   * Get all user subscriptions (history)
   */
  async getUserSubscriptions(): Promise<PBSubscriptionExpanded[]> {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const records = await pb.collection('subscriptions').getFullList<PBSubscription>({
        filter: `user = "${userId}"`,
        sort: '-created',
        expand: 'subscriptionPlan',
      });

      return records as PBSubscriptionExpanded[];
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      throw new Error('Failed to fetch subscription history');
    }
  }

  /**
   * Generate a mock QR code (base64 placeholder)
   * In production, this would call QPay API
   */
  private generateMockQRCode(invoiceId: string, amount: number): string {
    // Create a simple SVG QR code placeholder
    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="10" y="10" width="180" height="180" fill="none" stroke="black" stroke-width="2"/>
        <text x="100" y="90" text-anchor="middle" font-family="monospace" font-size="12" fill="black">
          QPay Mock QR
        </text>
        <text x="100" y="110" text-anchor="middle" font-family="monospace" font-size="10" fill="gray">
          Invoice: ${invoiceId.substring(0, 8)}
        </text>
        <text x="100" y="130" text-anchor="middle" font-family="monospace" font-size="10" fill="gray">
          Amount: ${amount.toLocaleString()}₮
        </text>
      </svg>
    `;
    
    // URL encode is simpler and handles Unicode characters properly
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  /**
   * Create a new subscription (initiates payment)
   */
  async createSubscription(planId: string): Promise<PBSubscription> {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Get the plan details
      const plan = await this.getSubscriptionPlanById(planId);

      // Calculate final amount after discount
      let finalAmount = plan.price;
      if (plan.discount && plan.discount > 0) {
        finalAmount = plan.price * (1 - plan.discount / 100);
      }

      // Generate mock QPay invoice ID
      const invoiceId = `QPAY-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
      
      // Generate mock QR code
      const qrImage = this.generateMockQRCode(invoiceId, finalAmount);

      // Create subscription record with pending status
      const data = {
        user: userId,
        subscriptionPlan: planId,
        status: 'pending' as const,
        qpayInvoiceId: invoiceId,
        qpayQRImage: qrImage,
        amount: finalAmount,
        start_date: new Date(),
        end_date: new Date(),
      };

      const subscription = await pb.collection('subscriptions').create<PBSubscription>(data);
      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Verify payment (mock implementation)
   * In production, this would verify with QPay webhook or API
   */
  async verifyPayment(subscriptionId: string): Promise<PBSubscription> {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Get the subscription
      const subscription = await pb.collection('subscriptions').getOne<PBSubscription>(subscriptionId, {
        expand: 'subscriptionPlan',
      });

      // Verify ownership
      if (subscription.user !== userId) {
        throw new Error('Unauthorized');
      }

      // Check if already active
      if (subscription.status === 'active' && subscription.end_date && new Date(subscription.end_date) > new Date()) {
        throw new Error('Subscription is already active');
      }

      // Get plan details
      const plan = await this.getSubscriptionPlanById(subscription.subscriptionPlan);

      // Calculate dates
      const startDate = new Date();
      const expiryDate = new Date(startDate);
      expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

      // Update subscription to active
      const updatedSubscription = await pb.collection('subscriptions').update<PBSubscription>(subscriptionId, {
        status: 'active',
        start_date: startDate,
        end_date: expiryDate.toISOString(),
      });

      // Update user's subscription status
      await pb.collection('users').update(userId, {
        subscription_status: 'active',
        subscription_expiry: expiryDate.toISOString(),
      });

      return updatedSubscription;
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
        status: 'cancelled',
      });

      // Update user's subscription status
      await pb.collection('users').update(userId, {
        subscription_status: 'cancelled',
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
      
      if (user?.subscription_status === 'active' && user?.subscription_expiry) {
        const expiryDate = new Date(user.subscription_expiry);
        const now = new Date();
        
        if (now > expiryDate) {
          // Update user status to expired
          await pb.collection('users').update(userId, {
            subscription_status: 'expired',
          });

          // Update subscription record
          const subscriptions = await pb.collection('subscriptions').getList<PBSubscription>(1, 1, {
            filter: `user = "${userId}" && status = "active"`,
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
}

export const subscriptionApi = new SubscriptionApiService();

