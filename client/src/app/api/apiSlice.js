import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Helper to reliably get the Clerk session token
const getClerkToken = async () => {
  try {
    // 1. Direct session on window.Clerk
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) return token;
    }

    // 2. Active session on window.Clerk.client
    if (window.Clerk?.client?.sessions?.[0]) {
      const token = await window.Clerk.client.sessions[0].getToken();
      if (token) return token;
    }
  } catch (err) {
    console.warn('Failed to retrieve Clerk token from SDK:', err.message);
  }
  return null;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    credentials: 'include',
    prepareHeaders: async (headers) => {
      let token = await getClerkToken();

      const HAS_CLERK = Boolean(
        import.meta.env.VITE_CLERK_PUBLISHABLE_KEY &&
          import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_')
      );

      // Fallback for dev mode when Clerk key is not present
      if (!token && !HAS_CLERK) {
        token = 'dev_user_123';
      }

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Destination', 'TourPackage', 'Hotel', 'Itinerary', 'Booking', 'Review', 'User'],
  endpoints: () => ({}),
});
