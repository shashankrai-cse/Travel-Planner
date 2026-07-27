import { apiSlice } from './apiSlice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    updateSelfRole: builder.mutation({
      query: (role) => ({
        url: '/users/me/role',
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    getAllUsersAdmin: builder.query({
      query: () => '/admin/users',
      providesTags: ['User'],
    }),
    updateUserRoleAdmin: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateSelfRoleMutation,
  useGetAllUsersAdminQuery,
  useUpdateUserRoleAdminMutation,
} = usersApi;
