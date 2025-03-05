import { configureStore } from '@reduxjs/toolkit';
import layout from './slices/layout';
import ride from './slices/ride';
import trip from './slices/trip';
import account from './slices/account';
import user from './slices/user';


export const store = configureStore({
    reducer: {
        layout,
        ride,
        trip,
        account,
        user,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat()
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch