import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react';

const HAS_CLERK = Boolean(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY &&
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_')
);

const getAdminEmails = () => {
  const envEmails = import.meta.env.VITE_ADMIN_EMAILS || 'admin@wayfarer.com';
  return envEmails.split(',').map((e) => e.trim().toLowerCase());
};

export const useSafeAuth = () => {
  if (HAS_CLERK) {
    try {
      return useClerkAuth();
    } catch (e) {
      console.warn('Clerk auth unavailable, using fallback.');
    }
  }

  return {
    isLoaded: true,
    isSignedIn: true,
    userId: 'dev_user_123',
  };
};

export const useSafeUser = () => {
  if (HAS_CLERK) {
    try {
      const clerkUserResult = useClerkUser();
      const email = clerkUserResult.user?.primaryEmailAddress?.emailAddress?.toLowerCase();
      const isAdmin = email && getAdminEmails().includes(email);

      if (clerkUserResult.user) {
        const currentRole = isAdmin ? 'admin' : (clerkUserResult.user.publicMetadata?.role || 'traveler');
        clerkUserResult.user.publicMetadata = {
          ...clerkUserResult.user.publicMetadata,
          role: currentRole,
        };
      }

      return clerkUserResult;
    } catch (e) {
      console.warn('Clerk user unavailable, using fallback.');
    }
  }

  return {
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: 'dev_user_123',
      fullName: 'Demo Admin User',
      primaryEmailAddress: { emailAddress: 'admin@wayfarer.com' },
      publicMetadata: { role: 'admin' },
    },
  };
};
