import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./article/reducer";
import cashReducer from "./cash/reducer"

const store = configureStore({
  reducer: {
    article: articleReducer,
    cash: cashReducer
  },
});

export default store;
