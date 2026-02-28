import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { subscriptionApi } from '@/services/subscription-api';
import type { PBSubscription, PBSubscriptionPlan } from '@/lib/pocketbase-types';

interface QPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: PBSubscription | null;
  plan: PBSubscriptionPlan | null;
  onSuccess: () => void;
}

export function QPayModal({ isOpen, onClose, subscription, plan, onSuccess }: QPayModalProps) {
  const { t } = useTranslation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVerifyPayment = async () => {
    if (!subscription) return;

    setIsVerifying(true);
    try {
      await subscriptionApi.verifyPayment(subscription.id);
      setIsSuccess(true);
      toast.success(t('subscription.messages.paymentVerified'));
      
      // Wait a bit before closing to show success state
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
      }, 1500);
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast.error(error.message || t('subscription.payment.failed'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    if (!isVerifying) {
      onClose();
    }
  };

  if (!subscription || !plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center pb-2">
            {t('subscription.payment.title')}
          </DialogTitle>
          <DialogDescription className="text-center">
            {plan.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Success State */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="text-lg font-semibold text-center">
                {t('subscription.payment.success')}
              </p>
            </div>
          ) : (
            <>
              {/* QR Code Display */}
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
                {subscription.qpayQRImage ? (
                  <div className="relative">
                    <img 
                      src={subscription.qpayQRImage} 
                      alt="QPay QR Code" 
                      className="w-full max-w-[200px] h-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-[200px] h-[200px] border-2 border-dashed border-gray-300 rounded-lg">
                    <QrCode className="h-16 w-16 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">QR Code</p>
                  </div>
                )}
              </div>

              {/* Payment Info */}
              <div className="space-y-2 p-4 bg-secondary/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t('subscription.payment.amount')}:
                  </span>
                  <span className="text-lg font-bold">
                    {subscription.amount.toLocaleString()}₮
                  </span>
                </div>
                {subscription.qpayInvoiceId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t('subscription.payment.invoiceId')}:
                    </span>
                    <span className="text-xs font-mono">
                      {subscription.qpayInvoiceId.substring(0, 20)}...
                    </span>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="space-y-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-semibold text-primary">
                  {t('subscription.payment.scanQR')}
                </p>
                <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                  <li>Open QPay app</li>
                  <li>Scan the QR code</li>
                  <li>Complete the payment</li>
                  <li>Click 'Verify Payment' button below</li>
                </ol>
              </div>

              {/* Status */}
              {subscription.status === 'PENDING' && !isVerifying && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-pulse h-2 w-2 bg-primary rounded-full"></div>
                  {t('subscription.payment.waiting')}
                </div>
              )}

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
        </div>

        {/* Footer Note */}
        {!isSuccess && (
          <div className="mt-4 pt-4 border-t border-white/10 text-center text-xs text-muted-foreground">
            This is a mock implementation for testing purposes
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

