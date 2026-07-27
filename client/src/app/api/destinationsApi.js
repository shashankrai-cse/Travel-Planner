import { apiSlice } from './apiSlice';

export const destinationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDestinations: builder.query({
      query: () => '/destinations',
      providesTags: ['Destination'],
    }),
    getDestinationBySlug: builder.query({
      query: (slug) => `/destinations/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Destination', id: slug }],
    }),
    createDestination: builder.mutation({
      query: (data) => ({
        url: '/destinations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Destination'],
    }),
    updateDestination: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/destinations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Destination'],
    }),
    deleteDestination: builder.mutation({
      query: (id) => ({
        url: `/destinations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Destination'],
    }),
  }),
});

export const {
  useGetDestinationsQuery,
  useGetDestinationBySlugQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} = destinationsApi;
