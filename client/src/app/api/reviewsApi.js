import { apiSlice } from './apiSlice';

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPackageReviews: builder.query({
      query: (packageId) => `/reviews/package/${packageId}`,
      providesTags: ['Review'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const { useGetPackageReviewsQuery, useCreateReviewMutation } = reviewsApi;
