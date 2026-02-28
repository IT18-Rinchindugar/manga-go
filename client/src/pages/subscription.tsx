import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Loader2, ArrowLeft, QrCode, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { subscriptionApi } from '@/services/subscription-api';
import { useAuth } from '@/context/auth-context';
import { useLoginModal } from '@/hooks/use-login-modal';
import { toast } from 'sonner';
import type { PBSubscriptionPlan, PBSubscription, PBSubscriptionExpanded, PBSubscriptionWithInvoice } from '@/lib/pocketbase-types';
import { useUser } from '@/context/user-context';
import { paymentApi } from '@/services/payment-api';

export default function Subscription() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { refreshSubscription } = useUser();
  const { hasSubscriptionAccess, subscription } = useUser();
  const { openLoginModal } = useLoginModal();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<PBSubscriptionPlan | null>(null);
  const [pendingSubscription, setPendingSubscription] = useState<PBSubscriptionWithInvoice | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch subscription plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionApi.getActiveSubscriptionPlans(),
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: (planId: string) => paymentApi.createSubscription(planId),
    onSuccess: (data) => {
      console.log("data", data)
      setPendingSubscription(data);
      setShowPayment(true);
      toast.success(t('subscription.messages.subscriptionCreated'));
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create subscription');
    },
  });

  const handleSubscribe = (plan: PBSubscriptionPlan) => {
    if (!user) {
      openLoginModal();
      return;
    }

    // Check if user already has an active subscription
    if (hasSubscriptionAccess()) {
      toast.error(t('subscription.messages.alreadySubscribed'));
      return;
    }

    setSelectedPlan(plan);
    createSubscriptionMutation.mutate(plan.id);
  };

  const handleVerifyPayment = async () => {
    if (!pendingSubscription) return;

    setIsVerifying(true);
    try {
      const data: any = await paymentApi.verifyPayment(pendingSubscription?.invoice.invoiceNo);

      if (data.status === 'PAID') {
        await refreshSubscription();
        toast.success(t('subscription.messages.paymentVerified'));
        setIsSuccess(true);
      } else {
        toast.error(t('subscription.payment.failed'));
        setIsSuccess(false);
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast.error(error.message || t('subscription.payment.failed'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBackToPlans = () => {
    setShowPayment(false);
    setSelectedPlan(null);
    setPendingSubscription(null);
  };

  const calculateFinalPrice = (plan: PBSubscriptionPlan) => {
    if (plan.discount && plan.discount > 0) {
      return plan.price * (1 - plan.discount / 100);
    }
    return plan.price;
  };

  const getPlanBadge = (index: number, totalPlans: number) => {
    if (totalPlans === 3) {
      if (index === 1) return { text: t('subscription.popularPlan'), variant: 'default' as const };
    }
    return null;
  };

  const isCurrentPlan = (planId: string) => {
    return hasSubscriptionAccess() && subscription?.expand?.subscriptionPlan?.id === planId;
  };

  return (
    <Layout>
      <section className="relative py-16 md:py-24 overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          
          <AnimatePresence mode="wait">
            {!showPayment ? (
              /* PLANS VIEW */
              <motion.div
                key="plans"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Hero Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center max-w-3xl mx-auto mb-16"
                >
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Crown className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
                    {t('subscription.title')}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {t('subscription.subtitle')}
                  </p>
                </motion.div>

                {/* Current Subscription Status */}
                {user && hasSubscriptionAccess() && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto mb-12"
                  >
                    <Card className="border-primary/50 bg-primary/5">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                              <Check className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{t('subscription.currentPlan')}</p>
                              <p className="text-sm text-muted-foreground">
                                {subscription?.expand?.subscriptionPlan?.name || 'Premium'}
                              </p>
                            </div>
                          </div>
                          {subscription?.end_date && (
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {t('subscription.messages.expiresOn')}
                              </p>
                              <p className="font-semibold">
                                {new Date(subscription?.end_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Pricing Cards */}
                {plansLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader className="space-y-4">
                          <div className="h-6 bg-muted rounded w-1/2" />
                          <div className="h-8 bg-muted rounded w-3/4" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="h-4 bg-muted rounded" />
                          <div className="h-4 bg-muted rounded" />
                          <div className="h-4 bg-muted rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => {
                      const finalPrice = calculateFinalPrice(plan);
                      const badge = getPlanBadge(index, plans.length);
                      const isCurrent = isCurrentPlan(plan.id);

                      return (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <Card
                            className={`relative h-full transition-all hover:shadow-xl ${
                              badge ? 'border-primary shadow-lg scale-105' : 'border-white/10'
                            } ${isCurrent ? 'ring-2 ring-primary' : ''}`}
                          >
                            {badge && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <Badge variant={badge.variant} className="px-4 py-1 font-bold">
                                  {badge.text}
                                </Badge>
                              </div>
                            )}

                            <CardHeader className="text-center pb-8">
                              <CardTitle className="text-2xl font-display mb-2">
                                {plan.name}
                              </CardTitle>
                              <div className="space-y-2">
                                {plan.discount && plan.discount > 0 ? (
                                  <>
                                    <div className="flex items-center justify-center gap-2">
                                      <span className="text-3xl md:text-4xl font-bold">
                                        {finalPrice.toLocaleString()}₮
                                      </span>
                                      <Badge variant="destructive" className="font-semibold">
                                        {plan.discountTitle || `-${plan.discount}%`}
                                      </Badge>
                                    </div>
                                    <p className="text-muted-foreground line-through text-sm">
                                      {plan.price.toLocaleString()}₮
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-3xl md:text-4xl font-bold">
                                    {plan.price.toLocaleString()}₮
                                  </p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                  {plan.durationDays === 30 && t('subscription.perMonth')}
                                  {plan.durationDays === 90 && t('subscription.perQuarter')}
                                  {plan.durationDays === 365 && t('subscription.perYear')}
                                </p>
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                              {plan.features && plan.features.length > 0 ? (
                                <ul className="space-y-3">
                                  {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                      <span className="text-sm">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <ul className="space-y-3">
                                  <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">{t('subscription.benefits.unlimitedReading')}</span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">{t('subscription.benefits.adFree')}</span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">{t('subscription.benefits.hdQuality')}</span>
                                  </li>
                                </ul>
                              )}
                            </CardContent>

                            <CardFooter>
                              <Button
                                onClick={() => handleSubscribe(plan)}
                                disabled={createSubscriptionMutation.isPending || isCurrent || false}
                                className="w-full h-12"
                                variant={badge ? 'default' : 'outline'}
                                size="lg"
                              >
                                {createSubscriptionMutation.isPending && selectedPlan?.id === plan.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t('subscription.subscribing')}
                                  </>
                                ) : isCurrent ? (
                                  <>
                                    <Check className="mr-2 h-5 w-5" />
                                    {t('subscription.currentPlan')}
                                  </>
                                ) : (
                                  t('subscription.subscribe')
                                )}
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* FAQ Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="max-w-3xl mx-auto mt-20"
                >
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8">
                    {t('subscription.faq.title')}
                  </h2>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border border-white/10 rounded-lg px-6">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('subscription.faq.q1')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {t('subscription.faq.a1')}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border border-white/10 rounded-lg px-6">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('subscription.faq.q2')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {t('subscription.faq.a2')}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border border-white/10 rounded-lg px-6">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('subscription.faq.q3')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {t('subscription.faq.a3')}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="border border-white/10 rounded-lg px-6">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {t('subscription.faq.q4')}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {t('subscription.faq.a4')}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              </motion.div>
            ) : (
              /* PAYMENT VIEW */
              <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={handleBackToPlans}
                className="mb-6"
                disabled={isVerifying}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back')}
              </Button>

              {/* Single Card with Everything */}
              <Card className="border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl font-display text-center">
                    {t('subscription.payment.title')}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {selectedPlan?.name}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {isSuccess ? (
                    /* Success State */
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <CheckCircle2 className="h-20 w-20 text-green-500" />
                      <p className="text-xl font-semibold text-center">
                        {t('subscription.payment.success')}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Plan Summary */}
                      <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">{t('subscription.currentPlan')}:</span>
                          <span className="font-semibold">{selectedPlan?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">{t('subscription.payment.amount')}:</span>
                          <span className="text-2xl font-bold">
                            {pendingSubscription?.invoice?.amount.toLocaleString()}₮
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      {/* {selectedPlan?.features && selectedPlan.features.length > 0 && (
                        <div className="space-y-3 p-4 bg-primary/5 rounded-lg">
                          <h3 className="font-semibold">{t('subscription.benefits.title') || 'What you get'}:</h3>
                          <ul className="space-y-2">
                            {selectedPlan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )} */}

                      {/* Divider */}
                      <div className="border-t border-white/10" />

                      {/* QR Code */}
                      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
                        {pendingSubscription?.invoice?.qrImage ? (
                          <img 
                            src={`data:image/png;base64,${pendingSubscription.invoice.qrImage}`} 
                            alt="QPay QR Code" 
                            className="w-full max-w-[240px] h-auto"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center w-[240px] h-[240px] border-2 border-dashed border-gray-300 rounded-lg">
                            <QrCode className="h-20 w-20 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">QR Code</p>
                          </div>
                        )}
                      </div>

                      {/* Payment Apps */}
                      {pendingSubscription?.invoice?.urls && pendingSubscription.invoice.urls.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-center">
                            {t('subscription.payment.bankApps')}
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                            {pendingSubscription.invoice.urls.map((app, index) => (
                              <a
                                key={index}
                                href={app.link}
                                target="_blank"
                                className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-colors group"
                                title={app.description}
                              >
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shadow-sm group-hover:shadow-md transition-shadow">
                                  <img 
                                    src={app.logo} 
                                    alt={app.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-[10px] text-center text-muted-foreground line-clamp-2 max-w-[60px]">
                                  {app.name}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Instructions */}
                      {/* <div className="space-y-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-sm font-semibold text-primary">
                          {t('subscription.payment.scanQR')}
                        </p>
                        <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                          <li>Open QPay app</li>
                          <li>Scan the QR code</li>
                          <li>Complete the payment</li>
                          <li>Click 'Verify Payment' button below</li>
                        </ol>
                      </div> */}

                      {/* Status */}
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <div className="animate-pulse h-2 w-2 bg-primary rounded-full"></div>
                          {!isVerifying && t('subscription.payment.waiting')}
                          {isVerifying && t('subscription.payment.verifying')}
                        </div>

                      {/* Verify Button */}
                      <Button
                        onClick={handleVerifyPayment}
                        disabled={isVerifying}
                        className="w-full h-12"
                        size="lg"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t('subscription.payment.verifying')}
                          </>
                        ) : (
                          t('subscription.payment.verifyButton')
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}