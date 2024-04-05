import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    collapsible: false,
}

export const collapsibleSlice = createSlice(
    {
        name: 'collapsible',
        initialState,
        reducers: {
            toggleCollapsible: (state) => {
                state.collapsible = !state.collapsible
            },
        },
    }
)

export const { toggleCollapsible } = collapsibleSlice.actions
export const collapsibleReducer = collapsibleSlice.reducer;