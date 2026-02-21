// app/services/trainersAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* =========================================================
   🔹 TYPES & INTERFACES (INLINE)
   ========================================================= */

export type TrainerStatus =
  | "ACTIVE"
  | "HOLD"
  | "INACTIVE"
  | "BLACKLISTED"
  | "PENDING APPROVAL";

export interface HourlyRate {
  currency: string;
  min: number;
  max: number;
}

export interface Trainer {
  _id: string;
  trainerId: string;
  name: string;
  email: string;
  phone: string;
  status: TrainerStatus;
  experienceYears: number;
  education: string;
  hourlyRate: HourlyRate;
  languages?: string;
  skills: string[];
  subjects?: string;
  title?: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/* ---------- API RESPONSE TYPES ---------- */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  trainers?: T[];
}

/* ---------- REQUEST PAYLOADS ---------- */

export interface CreateTrainerPayload {
  trainerId?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  experienceYears: number;
  education: string;
  hourlyRate: HourlyRate;
  languages?: string;
  skills: string[];
  subjects?: string;
  title?: string;
  description?: string;
}



export interface UpdateTrainerPayload {
  id: string;
  name?: string;
  phone?: string;
  status?: TrainerStatus;
  experienceYears?: number;
  education?: string;
  hourlyRate?: HourlyRate;
  languages?: string;
  skills?: string[];
  subjects?: string;
  title?: string;
  description?: string;
}

/* =========================================================
   🔹 RTK QUERY API
   ========================================================= */

export const trainerApi = createApi({
  reducerPath: "trainerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/trainers/",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Trainers"],
  endpoints: (builder) => ({
    // ✅ GET ALL TRAINERS with response transformation
    getAllTrainers: builder.query<Trainer[], void>({
      query: () => "getAll",
      transformResponse: (response: ApiResponse<Trainer> | Trainer[]): Trainer[] => {
        if (Array.isArray(response)) {
          return response;
        } else if (response?.data && Array.isArray(response.data)) {
          return response.data;
        } else if (response?.trainers && Array.isArray(response.trainers)) {
          return response.trainers as Trainer[];
        }
        return [];
      },
      providesTags: ["Trainers"],
    }),

    // ✅ GET SINGLE TRAINER
    getTrainerById: builder.query<Trainer, string>({
      query: (id) => `getTrainer/${id}`,
      transformResponse: (response: ApiResponse<Trainer> | Trainer): Trainer => {
        if ((response as ApiResponse<Trainer>)?.data) {
          return (response as ApiResponse<Trainer>).data!;
        }
        return response as Trainer;
      },
      providesTags: (result, error, id) => [{ type: "Trainers", id }],
    }),

    // ✅ CREATE TRAINER
    createTrainer: builder.mutation<ApiResponse<Trainer>, CreateTrainerPayload>({
      query: (newTrainer) => ({
        url: "createTrainer",
        method: "POST",
        body: newTrainer,
      }),
      invalidatesTags: ["Trainers"],
    }),

    // ✅ UPDATE TRAINER
    updateTrainer: builder.mutation<ApiResponse<Trainer>, UpdateTrainerPayload>({
      query: ({ id, ...patch }) => ({
        url: `updateTrainer/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Trainers",
        { type: "Trainers", id },
      ],
    }),

    // ✅ DELETE TRAINER
    deleteTrainer: builder.mutation<ApiResponse<{ success: boolean }>, string>({
      query: (id) => ({
        url: `deleteTrainer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Trainers"],
    }),
  }),
});

export const {
  useGetAllTrainersQuery,
  useGetTrainerByIdQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
} = trainerApi;