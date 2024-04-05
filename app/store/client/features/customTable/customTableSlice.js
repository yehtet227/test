const { createSlice } = require("@reduxjs/toolkit")
const currentYear = new Date().getFullYear()
const initialState = {
    empcode:'',
    year:currentYear,
}

export const customTableSlice = createSlice({
    name: 'customTable',
    initialState,
    reducers: {
        saveYear: (state,action) => {
            state.year = action.payload
        },
        saveEmpCode: (state,action) => {
            state.empcode = action.payload
        }
    },
})

export const { saveYear,saveEmpCode } = customTableSlice.actions

export const customTableReducer = customTableSlice.reducer