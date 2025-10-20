import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TAppSlice = {
  p: string;
  userId: string;
};

const initialState: TAppSlice = {
  p: "",
  userId: "",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updatePhone(state, action: PayloadAction<string>) {
      state.p = action.payload;
    },
    updateUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
    updateBoth(state, action: PayloadAction<{ p: string; userId: string }>) {
      state.p = action.payload.p;
      state.userId = action.payload.userId;
    },
  },
});

export const { updatePhone, updateUserId, updateBoth } = appSlice.actions;
export default appSlice.reducer;
