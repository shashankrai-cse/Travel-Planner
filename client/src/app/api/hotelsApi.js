import { apiSlice } from './apiSlice';

export const hotelsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: (params) => ({
        url: '/hotels',
        params,
      }),
      providesTags: ['Hotel'],
    }),
    getHotelById: builder.query({
      query: (id) => `/hotels/${id}`,
      providesTags: (result, error, id) => [{ type: 'Hotel', id }],
    }),
    createHotel: builder.mutation({
      query: (data) => ({
        url: '/hotels',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Hotel'],
    }),
    updateHotel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/hotels/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Hotel'],
    }),
    deleteHotel: builder.mutation({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hotel'],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelsApi;
