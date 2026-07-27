import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    prepareHeaders: async (headers) => {
      if (window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Destination', 'TourPackage', 'Hotel', 'Itinerary', 'Booking', 'Review', 'User'],
  endpoints: () => ({}),
});
