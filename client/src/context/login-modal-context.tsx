import { createContext, useContext, useState, type ReactNode } from 'react';
import { LoginModal } from '@/components/login-modal';
import { SubscriptionModal } from '@/components/subscription-modal';

interface LoginModalContextType {
  isOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isSubscriptionModalOpen: boolean;
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const openLoginModal = () => setIsOpen(true);
  const closeLoginModal = () => setIsOpen(false);

  const openSubscriptionModal = () => setIsSubscriptionModalOpen(true);
  const closeSubscriptionModal = () => setIsSubscriptionModalOpen(false);

  return (
    <LoginModalContext.Provider value={{ 
      isOpen, 
      openLoginModal, 
      closeLoginModal,
      isSubscriptionModalOpen,
      openSubscriptionModal,
      closeSubscriptionModal
    }}>
      {children}
      {/* Global Login Modal - accessible from anywhere */}
      <LoginModal open={isOpen} onOpenChange={closeLoginModal} />
      {/* Global Subscription Modal - accessible from anywhere */}
      <SubscriptionModal open={isSubscriptionModalOpen} onOpenChange={closeSubscriptionModal} />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  }
  return context;
}

export function useSubscriptionModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error('useSubscriptionModal must be used within a LoginModalProvider');
  }
  return {
    isOpen: context.isSubscriptionModalOpen,
    openSubscriptionModal: context.openSubscriptionModal,
    closeSubscriptionModal: context.closeSubscriptionModal,
  };
}

