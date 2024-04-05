import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    jan_project_type: '',
    jan_customer: '',
    jan_prject: '',
    jan_role: '',
    jan_man_month: '',
    jan_unitprice:'',
    jan_member_type:'',
}

export const projectAssignCreateSlice = createSlice({
    name: 'projectAssignCreate',
    initialState,
    reducers: {
        addJanProjectType: (state,action)=>{
            state.jan_project_type = action.payload
        },
    }
})

export const {
    addJanProjectType
} = projectAssignCreateSlice.actions

export const projectAssignCreateReducer = projectAssignCreateSlice.reducer