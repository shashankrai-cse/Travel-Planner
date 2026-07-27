import { apiSlice } from './apiSlice';

export const itinerariesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItineraryByPackage: builder.query({
      query: (packageId) => `/itineraries/${packageId}`,
      providesTags: (result, error, packageId) => [{ type: 'Itinerary', id: packageId }],
    }),
    updateItinerary: builder.mutation({
      query: ({ packageId, days }) => ({
        url: `/itineraries/${packageId}`,
        method: 'PATCH',
        body: { days },
      }),
      invalidatesTags: (result, error, { packageId }) => [
        { type: 'Itinerary', id: packageId },
        'TourPackage',
      ],
    }),
  }),
});

export const {
  useGetItineraryByPackageQuery,
  useUpdateItineraryMutation,
} = itinerariesApi;
