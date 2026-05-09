import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCredits: (state, action) => {
      state.userData.credits = action.payload;
    },
  },
});

export const { setUserData, setCredits } = userSlice.actions;

export default userSlice.reducer;
