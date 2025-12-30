/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

/**
 * Cấu hình Redux store
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Thêm các reducers khác ở đây
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore các actions có chứa non-serializable values
        ignoredActions: ['auth/loginSuccess'],
      },
    }),
  devTools: import.meta.env.DEV, // Chỉ bật devtools ở môi trường dev
});

// Types cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
