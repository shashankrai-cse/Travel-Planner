import { apiSlice } from './apiSlice';

export const packagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query({
      query: (params) => ({
        url: '/packages',
        params,
      }),
      providesTags: ['TourPackage'],
    }),
    getPackageBySlug: builder.query({
      query: (slug) => `/packages/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'TourPackage', id: slug }],
    }),
    createPackage: builder.mutation({
      query: (data) => ({
        url: '/packages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TourPackage'],
    }),
    updatePackage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/packages/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['TourPackage'],
    }),
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TourPackage'],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useGetPackageBySlugQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packagesApi;
