import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins, CreditCard } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const COIN_PACKAGES = [
  { amount: 50, price: 0.99, bonus: 0 },
  { amount: 150, price: 2.99, bonus: 10 },
  { amount: 550, price: 9.99, bonus: 50, popular: true },
  { amount: 1200, price: 19.99, bonus: 200 },
];

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState<number | null>(null);
  const { refetchUser } = useAuth();

  const handlePurchase = async (index: number, amount: number) => {
    setLoading(index);
    try {
      await api.purchaseCoins(amount);
      await refetchUser();
      toast.success(`Successfully purchased ${amount} coins!`);
      onSuccess(amount);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to purchase coins');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center pb-2">Top Up Coins</DialogTitle>
          <DialogDescription className="text-center">
            Purchase coins to unlock premium chapters and support creators.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {COIN_PACKAGES.map((pkg, index) => (
            <button
              key={index}
              onClick={() => handlePurchase(index, pkg.amount + pkg.bonus)}
              disabled={loading !== null}
              className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                pkg.popular 
                  ? 'border-primary bg-primary/10' 
                  : 'border-white/10 bg-secondary/50 hover:border-primary/50'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 px-3 py-0.5 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Best Value
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                <span className="text-2xl font-bold">{pkg.amount}</span>
              </div>
              
              {pkg.bonus > 0 && (
                <span className="text-xs text-primary font-bold mb-3">+{pkg.bonus} Bonus Coins</span>
              )}
              
              <Button 
                variant={pkg.popular ? "default" : "secondary"} 
                className="w-full mt-auto"
                disabled={loading !== null}
              >
                {loading === index ? 'Processing...' : `$${pkg.price}`}
              </Button>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CreditCard className="h-3 w-3" />
          <span>Secure payment processed by Stripe (Mock)</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
