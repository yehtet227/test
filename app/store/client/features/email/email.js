import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userEmail: '',
}

const emailSlice = createSlice({
    name: 'email',
    initialState,
    reducers: {
        setUserEmail: (state, action) => {
            state.userEmail = action.payload
        },
        resetEmailState: () => {
            return initialState
        },
    },
});

export const {
    setUserEmail,
    resetEmailState
} = emailSlice.actions;

export const emailReducer = emailSlice.reducer;