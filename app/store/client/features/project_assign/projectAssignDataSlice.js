import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    empInfoData: {},
    marketingCurentSatus: {},
    careerSheetStatus: {},
    Years: {},
    janProject: {},
    janRole: {},
    febProject: {},
    febRole: {},
    marchProject: {},
    marchRole: {},
    aprilProject: {},
    aprilRole: {},
    mayProject: {},
    mayRole: {},
    juneProject: {},
    juneRole: {},
    julyProject: {},
    julyRole: {},
    augProject: {},
    augRole: {},
    septProject: {},
    septRole: {},
    octProject: {},
    octRole: {},
    novProject: {},
    novRole: {},
    decProject: {},
    decRole: {},
    janMemberType: {},
    febMemberType: {},
    marchMemberType: {},
    aprilMemberType: {},
    mayMemberType: {},
    juneMemberType: {},
    julyMemberType: {},
    augMemberType: {},
    septMemberType: {},
    octMemberType: {},
    novMemberType: {},
    decMemberType: {},
}

export const projectAssignDataSlice = createSlice({
    name: 'projectAssignData',
    initialState,
    reducers: {
        addempInfoData: (state, action) => {
            state.empInfoData = action.payload
        },
        addmarketingCurentSatus: (state, action) => {
            state.marketingCurentSatus = action.payload
        },
        addcareerSheetStatus: (state, action) => {
            state.careerSheetStatus = action.payload
        },
        addYears: (state, action) => {
            state.Years = action.payload
        },
        addjanProject: (state, action) => {
            state.janProject = action.payload
        },
        addjanRole: (state, action) => {
            state.janRole = action.payload
        },
        addfebProject: (state, action) => {
            state.febProject = action.payload
        },
        addfebRole: (state, action) => {
            state.febRole = action.payload
        },
        addmarchProject: (state, action) => {
            state.marchProject = action.payload
        },
        addmarchRole: (state, action) => {
            state.marchRole = action.payload
        },
        addaprilProject: (state, action) => {
            state.aprilProject = action.payload
        },
        addaprilRole: (state, action) => {
            state.aprilRole = action.payload
        },
        addmayProject: (state, action) => {
            state.mayProject = action.payload
        },
        addmayRole: (state, action) => {
            state.mayRole = action.payload
        },
        addjuneProject: (state, action) => {
            state.juneProject = action.payload
        },
        addjuneRole: (state, action) => {
            state.juneRole = action.payload
        },
        addjulyProject: (state, action) => {
            state.julyProject = action.payload
        },
        addjulyRole: (state, action) => {
            state.julyRole = action.payload
        },
        addaugProject: (state, action) => {
            state.augProject = action.payload
        },
        addaugRole: (state, action) => {
            state.augRole = action.payload
        },
        addseptProject: (state, action) => {
            state.septProject = action.payload
        },
        addseptRole: (state, action) => {
            state.septRole = action.payload
        },
        addoctProject: (state, action) => {
            state.octProject = action.payload
        },
        addoctRole: (state, action) => {
            state.octRole = action.payload
        },
        addnovProject: (state, action) => {
            state.novProject = action.payload
        },
        addnovRole: (state, action) => {
            state.novRole = action.payload
        },
        adddecProject: (state, action) => {
            state.decProject = action.payload
        },
        adddecRole: (state, action) => {
            state.decRole = action.payload
        },
        addJanMemberType: (state, action) => {
            state.janMemberType = action.payload
        },
        addFebMemberType: (state, action) => {
            state.febMemberType = action.payload
        },
        addMarchMemberType: (state, action) => {
            state.marchMemberType = action.payload
        },
        addAprilMemberType: (state, action) => {
            state.aprilMemberType = action.payload
        },
        addMayMemberType: (state, action) => {
            state.mayMemberType = action.payload
        },
        addJuneMemberType: (state, action) => {
            state.juneMemberType = action.payload
        },
        addJulyMemberType: (state, action) => {
            state.julyMemberType = action.payload
        },
        addAugMemberType: (state, action) => {
            state.augMemberType = action.payload
        },
        addSeptMemberType: (state, action) => {
            state.septMemberType = action.payload
        },
        addOctMemberType: (state, action) => {
            state.octMemberType = action.payload
        },
        addNovMemberType: (state, action) => {
            state.novMemberType = action.payload
        },
        addDecMemberType: (state, action) => {
            state.decMemberType = action.payload
        },
        clearEmpoyeesAssignState: () => {
            return initialState
        },
    },
})

export const {
    addempInfoData,
    addprojectName,
    addmarketingCurentSatus,
    addcareerSheetStatus,
    addYears,
    addjanProject,
    addjanRole,
    addfebProject,
    addfebRole,
    addmarchProject,
    addmarchRole,
    addaprilProject,
    addaprilRole,
    addmayProject,
    addmayRole,
    addjuneProject,
    addjuneRole,
    addjulyProject,
    addjulyRole,
    addaugProject,
    addaugRole,
    addseptProject,
    addseptRole,
    addoctProject,
    addoctRole,
    addnovProject,
    addnovRole,
    adddecProject,
    adddecRole,
    addJanMemberType,
    addFebMemberType,
    addMarchMemberType,
    addAprilMemberType,
    addMayMemberType,
    addJuneMemberType,
    addJulyMemberType,
    addAugMemberType,
    addSeptMemberType,
    addOctMemberType,
    addNovMemberType,
    addDecMemberType,
    clearEmpoyeesAssignState
} = projectAssignDataSlice.actions

export const projectAssignDataSliceReducer = projectAssignDataSlice.reducer
