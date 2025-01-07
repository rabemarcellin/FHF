import { createSlice } from "@reduxjs/toolkit";
import { createNewArticleAction, getArticlesAction } from "./action";

const initialState = {
  items: [],
};

const articleSlice = createSlice({
  name: "article",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(getArticlesAction.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(createNewArticleAction.fulfilled, (state, action) => {
      state.items = [...state.items, action.payload];
    });
  },
});

export default articleSlice.reducer;
