import { useAppSelector } from "@/hooks/reduxHooks";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { count: number } = {
  count: 0,
};

export const notificationsCounterSlice = createSlice({
  name: "notificationsCount",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      if (state.count > 0) {
        state.count -= 1;
      }
    },
    set: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});
export const { increment, decrement, reset, set } =
  notificationsCounterSlice.actions;
export default notificationsCounterSlice.reducer;

export const useNotificationCount = () =>
  useAppSelector((state) => state.notificationsCount.count);
