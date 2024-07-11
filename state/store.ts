import { configureStore } from '@reduxjs/toolkit';
import layout from './slices/layout';
import ride from './slices/ride';
import account from './slices/account';


export const store = configureStore({
    reducer: {
        layout,
        ride,
        account,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat()
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch