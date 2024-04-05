// engineerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const projectAssignSlice = createSlice({
  name: 'projectAssign',
  initialState: {
    engineerData: {
      name: '',
      id: '',
    },
    marketingInfo: {
      project: '',
      projectType: '',
      marketingStatus: '',
      proposalStatus: '',
      careerSheetStatus: '',
      careerSheetLink: '',
      manHours: 0,
      unitPrice: 0,
    },
    assignInfo: {
      year: 0,
      monthData: [],
    },
  },
  reducers: {
    // Actions for engineerData
    updateEngineerName: (state, action) => {
      state.engineerData.name = action.payload;
    },
    updateEngineerId: (state, action) => {
      state.engineerData.id = action.payload;
    },

    // Actions for marketingInfo
    updateMarketingProject: (state, action) => {
      state.marketingInfo.project = action.payload;
    },
    updateMarketingProjectType: (state, action) => {
      state.marketingInfo.projectType = action.payload;
    },
    updateMarketingStatus: (state, action) => {
      state.marketingInfo.marketingStatus = action.payload;
    },
    updateProposalStatus: (state, action) => {
      state.marketingInfo.proposalStatus = action.payload;
    },
    updateCareerSheetStatus: (state, action) => {
      state.marketingInfo.careerSheetStatus = action.payload;
    },
    updateCareerSheetLink: (state, action) => {
      state.marketingInfo.careerSheetLink = action.payload;
    },
    updateManHours: (state, action) => {
      state.marketingInfo.manHours = action.payload;
    },
    updateUnitPrice: (state, action) => {
      state.marketingInfo.unitPrice = action.payload;
    },

    // Actions for assignInfo
    updateAssignYear: (state, action) => {
      state.assignInfo.year = action.payload;
    },
    addMonthData: (state, action) => {
      state.assignInfo.monthData.push(action.payload);
    },
  },
});

export const {
  // Engineer Data Actions
  updateEngineerName,
  updateEngineerId,

  // Marketing Info Actions
  updateMarketingProject,
  updateMarketingProjectType,
  updateMarketingStatus,
  updateProposalStatus,
  updateCareerSheetStatus,
  updateCareerSheetLink,
  updateManHours,
  updateUnitPrice,

  // Assign Info Actions
  updateAssignYear,
  addMonthData,
} = projectAssignSlice.actions;

export const projectAssignSliceReducer = projectAssignSlice.reducer;
