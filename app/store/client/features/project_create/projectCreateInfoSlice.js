const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  year: '',
  projectName: '',
  contractNumber: '',
  customerId: '',
  paymentStatus: '',
  departmentId: '',
  marketingName: '',
  startDate: '',
  endDate: '',
  contractStatus: '',
  userId: '',
  projectType: {},
}

const projectCreateInfoSlice = createSlice({
  name: 'projectCreateInfo',
  initialState,
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
    },
    setProjectName: (state, action) => {
      state.projectName = action.payload;
    },
    setContractNumber: (state, action) => {
      state.contractNumber = action.payload;
    },
    setCustomerId: (state, action) => {
      state.customerId = action.payload;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setDepartmentId: (state, action) => {
      state.departmentId = action.payload;
    },
    setMarketingName: (state, action) => {
      state.marketingName = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setContractStatus: (state, action) => {
      state.contractStatus = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setProjectType: (state, action) => {
      state.projectType = action.payload;
    },
    clearProjectCreateInfoState: () => {
      return initialState;
    },
    setAllProjectInfo: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  setYear,
  setProjectName,
  setContractNumber,
  setCustomerId,
  setPaymentStatus,
  setDepartmentId,
  setMarketingName,
  setStartDate,
  setEndDate,
  setContractStatus,
  setUserId,
  setProjectType,
  clearProjectCreateInfoState,
  setAllProjectInfo
} = projectCreateInfoSlice.actions;

export const projectCreateInfoReducer = projectCreateInfoSlice.reducer;
