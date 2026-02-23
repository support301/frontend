import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/app/validations/user";

const BASE_URL = "https://backend-g0z1.onrender.com/api/userManagers/";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const userManagerApi = createApi({
  reducerPath: "userManagerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    /** GET ALL USERS */
    getAllUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => "getAll",
      providesTags: ["Users"],
    }),

    /** CREATE USER */
    createUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: "createUser",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),


    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `get/${id}`, // adjust if your backend path differs
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    /** UPDATE USER */
    updateUser: builder.mutation<User, { id: string; body: Partial<User> }>({
      query: ({ id, body }) => ({
        url: `update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    /** DELETE USER */
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `deleteAdmin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useDeleteUserMutation,
} = userManagerApi;