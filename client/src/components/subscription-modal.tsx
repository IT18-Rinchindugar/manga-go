import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const handleViewPlans = () => {
    onOpenChange(false);
    setLocation('/subscription');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl text-foreground">
            {t('subscription.notification.title')}
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2 text-foreground">
            {t('subscription.notification.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Button
            onClick={handleViewPlans}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
          >
            {t('subscription.notification.button')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

