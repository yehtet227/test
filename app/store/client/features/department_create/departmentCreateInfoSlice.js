const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
    deptName: '',
    deptHead: '',
    marketingName: '',
}

const departmentCreateInfoSlice = createSlice({
    name: 'departmentCreateInfo',
    initialState,
    reducers: {
        setDeptName: (state, action) => {
            state.deptName = action.payload
        },
        setDeptHead: (state, action) => {
            state.deptHead = action.payload
        },
        setMarketingName: (state, action) => {
            state.marketingName = action.payload
        },
        setAllDeptInfo: (state, action) => {
            Object.assign(state, action.payload)
        },
        clearDepartmentCreateInfoState: () => {
            return initialState
        },
    },
})

export const {
    setDeptName,
    setDeptHead,
    setMarketingName,
    setAllDeptInfo,
    clearDepartmentCreateInfoState,
} = departmentCreateInfoSlice.actions

export const departmentCreateInfoReducer = departmentCreateInfoSlice.reducer
