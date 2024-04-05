import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
}

export const modalOpenSlice = createSlice(
    {
        name: 'modalOpen',
        initialState,
        reducers: {
            toggleModal: (state) => {
                state.isOpen = !state.isOpen
            },
        },
    }
)

export const { toggleModal } = modalOpenSlice.actions
export const modalOpenReducer = modalOpenSlice.reducer;