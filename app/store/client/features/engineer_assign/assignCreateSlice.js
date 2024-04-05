import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    customer_id: '',
    project_id: '',
    start_date: '',
    end_date: '',
    projectEmployees: [],
}

export const assignCreateSlice = createSlice({
    name: 'assignCreate',
    initialState,
    reducers: {
        addCustomerId: (state, action) => {
            state.customer_id = action.payload
        },
        addProjectId: (state, action) => {
            state.project_id = action.payload
        },
        addStartDate: (state, action) => {
            state.start_date = action.payload
        },
        addEndDate: (state, action) => {
            state.end_date = action.payload
        },
        addprojectEmployees: (state, action) => {
            state.projectEmployees = [...state.projectEmployees, action.payload]
        },
        clearAssignCreateState: () => {
            return initialState
        },
        removeEmployeeData: (state, action) => {
            const { id } = action.payload;
            state.projectEmployees = state.projectEmployees?.map(emp => ({
                ...emp,
                employeesId: emp?.employeesId?.filter(empId => empId !== id)
            }));
        }
    },
})

export const {
    addCustomerId,
    addProjectId,
    addStartDate,
    addEndDate,
    addprojectEmployees,
    clearAssignCreateState,
    removeEmployeeData
} = assignCreateSlice.actions

export const assignCreateReducer = assignCreateSlice.reducer
