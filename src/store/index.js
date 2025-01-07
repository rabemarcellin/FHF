import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./article/reducer";

const store = configureStore({
  reducer: {
    article: articleReducer,
  },
});

export default store;
