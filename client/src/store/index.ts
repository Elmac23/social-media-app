import { configureStore } from "@reduxjs/toolkit";
import aReducer from "./a";
export const store = configureStore({
  reducer: {
    a: aReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
