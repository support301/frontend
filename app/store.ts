import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from '@/app/services/userauth'
import { userManagerApi } from '@/app/services/userManager'
import { trainerApi } from '@/app/services/trainersAPI'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userManagerApi.reducerPath]: userManagerApi.reducer,
    [trainerApi.reducerPath]: trainerApi.reducer,

  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(authApi.middleware, userManagerApi.middleware, trainerApi.middleware),
})

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

