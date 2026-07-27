import { apiSlice } from './apiSlice';

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (bookingId) => ({
        url: '/payments/create-intent',
        method: 'POST',
        body: { bookingId },
      }),
    }),
    confirmPayment: builder.mutation({
      query: (data) => ({
        url: '/payments/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} = paymentsApi;
