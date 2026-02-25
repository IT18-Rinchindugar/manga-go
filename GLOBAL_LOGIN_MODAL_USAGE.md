# Global Login Modal Usage Guide

The login modal is now globally accessible from any page in your application!

## How to Use

### 1. Import the hook
```tsx
import { useLoginModal } from '@/hooks/use-login-modal';
```

### 2. Use it in your component
```tsx
function YourComponent() {
  const { openLoginModal } = useLoginModal();
  
  const handleProtectedAction = () => {
    // Check if user needs to login
    if (!user) {
      openLoginModal(); // Opens the global modal
      return;
    }
    
    // Proceed with the action
    doSomething();
  };
  
  return (
    <Button onClick={handleProtectedAction}>
      Protected Action
    </Button>
  );
}
```

## Example Usage in Different Pages

### In any component:
```tsx
import { useAuth } from '@/context/auth-context';
import { useLoginModal } from '@/hooks/use-login-modal';

export default function AnyPage() {
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  
  const handleAction = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    // Do authenticated action
  };
  
  return <Button onClick={handleAction}>Click Me</Button>;
}
```

## What Was Changed

1. **Created** `login-modal-context.tsx` - Global context that manages modal state
2. **Updated** `App.tsx` - Added `LoginModalProvider` wrapper
3. **Updated** `use-login-modal.ts` - Now exports from context
4. **Simplified** `manga-details.tsx` - Removed local modal component

## Benefits

✅ Use from any page without importing the modal component
✅ Single modal instance across the entire app
✅ Consistent behavior everywhere
✅ Cleaner code - no need to manage modal state locally
✅ Automatic cleanup when user logs in

