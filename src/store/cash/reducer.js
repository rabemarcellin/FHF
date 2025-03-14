import { createSlice } from "@reduxjs/toolkit";
import { createCash } from "./action";

const initialState = []
const cashSlice = createSlice({
    name: "cash",
    initialState,
    reducers: {
        createCashAction: createCash
    }
})

export default cashSlice.reducer
export const { createCashAction } = cashSlice.actions