import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: `https://backend-g0z1.onrender.com/api/users/`,
    prepareHeaders: (headers) => {
      // Get token directly when preparing headers
      const token = localStorage.getItem('token'); 
      if (token) {
        headers.set('Authorization', `Bearer ${token}` );
      }
      
      headers.set('Content-Type', 'application/json');
      return headers;
    },
   }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (user) => {
        // console.log("Create User Data", user);
        return {
          url: 'register',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json'
          }
        }
      }
    }),
    verifyEmail: builder.mutation({
      query: (user) => {
        return {
          url: `verify-email`,
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json'
          }
        }
      }
    }),
    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: `login`,
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json'
          },
          credentials: 'include'  // It is required to set cookie
        }
      }
    }),
    getUser: builder.query({
      query: (id) => {
    
        return {
          url: `me/${id}`,
          method: 'GET',
          credentials: 'include',

        }
      }
    }),
    logoutUser: builder.mutation({
  query: () => ({
    url: `logout`,
    method: "POST",
    body: {},
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
  }),
  async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      await queryFulfilled;
      localStorage.removeItem("token");

      localStorage.removeItem("refreshToken");

    } catch (err) {
      console.error("Logout failed:", err);
    }
  },
}),

    
    
  }),
})

export const { useCreateUserMutation, useVerifyEmailMutation,
               useLoginUserMutation, useGetUserQuery,
               useLogoutUserMutation  } = authApi
