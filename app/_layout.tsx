import { Slot } from 'expo-router';
import { SessionProvider } from '../contexts/userSignedInContext';
import { SessionProvider as TokenSessionProvider } from '@/contexts/userTokenContext';

export default function Root() {
  return (
    <TokenSessionProvider>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </TokenSessionProvider>
  );
}
