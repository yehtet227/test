import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  company: '',
  project: '',
  role: '',
  roleid: '',
  pricePerEngineer: 0,
  numberOfHours: 0,
  startDate: '',
  endDate: '',
  engineerList: [],
  roleData: {}
};

const engineerSlice = createSlice({
  name: 'engineerAssign',
  initialState,
  reducers: {
    updateCompany: (state, action) => {
      state.company = action.payload;
    },
    updateProject: (state, action) => {
      state.project = action.payload;
    },
    updateRole: (state, action) => {
      state.role = action.payload;
    },
    updateRoleId: (state,action) =>{
      state.roleid = action.payload;
    },
    updatePricePerEngineer: (state, action) => {
      state.roleData[state.role] = {
        ...state.roleData[state.role],
        pricePerEngineer: action.payload,
      };
    },
    updateNumberOfHours: (state, action) => {
      state.roleData[state.role] = {
        ...state.roleData[state.role],
        numberOfHours: action.payload,
      };
    },
    updateStartDate: (state, action) => {
      state.roleData[state.role] = {
        ...state.roleData[state.role],
        startDate: action.payload,
      };
    },
    updateEndDate: (state, action) => {
      state.roleData[state.role] = {
        ...state.roleData[state.role],
        endDate: action.payload,
      };
    },
    updateEngineerList: (state, action) => {
      const currentRole = state.role;
      const existingEngineerList =
      state.roleData[currentRole]?.engineerList || [];
      state.roleData[currentRole] = {
        ...state.roleData[currentRole],
        engineerList: [...existingEngineerList, ...action.payload],
      };
    },
    clearEngineerAssignState: () => {
      return initialState;
    },
    removeEmployee: (state, action) => {
      const { role, id } = action.payload
      state.roleData[role].engineerList = state?.roleData[role]?.engineerList?.filter(employee => employee.id !== id);
    },
  },
});

export const {
  updateCompany,
  updateProject,
  updateRole,
  updateRoleId,
  updatePricePerEngineer,
  updateNumberOfHours,
  updateStartDate,
  updateEndDate,
  updateEngineerList,
  clearEngineerAssignState,
  removeEmployee
} = engineerSlice.actions;

export const engineerAssignReducer = engineerSlice.reducer;
