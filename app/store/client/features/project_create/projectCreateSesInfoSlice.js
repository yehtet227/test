const { createSlice } = require("@reduxjs/toolkit");

const initialState =  {
  sesProjectLeader: '',
  sesPMManMonth: '',
  sesPMUnitPrice: '',
  sesPLManMonth: '',
  sesPLUnitPrice: '',
  sesSEManMonth: '',
  sesSEUnitPrice: '',
  sesPGManMonth: '',
  sesPGUnitPrice: '',
  sesOHManMonth: '',
  sesOHUnitPrice: '',
  sesEstimateNumber: '',
  sesApprovalNumber: '',
  sesOrderNumber: '',
  sesDeliveryDate: '',
  sesManMonth: '',
  sesAvgUnitPrice: '',
  sesOrderAmount: '',
  sesAcceptanceBillingDate: '',
  sesPaymentDate: '',
}

const projectCreateSesInfoSlice = createSlice({
  name: 'projectCreateSesInfo',
  initialState,
  reducers: {
    setSesProjectLeader: (state, action) => {
      state.sesProjectLeader = action.payload;
    },
    setSesPMManMonth: (state, action) => {
      state.sesPMManMonth = action.payload;
    },
    setSesPMUnitPrice: (state, action) => {
      state.sesPMUnitPrice = action.payload;
    },
    setSesPLManMonth: (state, action) => {
      state.sesPLManMonth = action.payload;
    },
    setSesPLUnitPrice: (state, action) => {
      state.sesPLUnitPrice = action.payload;
    },
    setSesSEManMonth: (state, action) => {
      state.sesSEManMonth = action.payload;
    },
    setSesSEUnitPrice: (state, action) => {
      state.sesSEUnitPrice = action.payload;
    },
    setSesPGManMonth: (state, action) => {
      state.sesPGManMonth = action.payload;
    },
    setSesPGUnitPrice: (state, action) => {
      state.sesPGUnitPrice = action.payload;
    },
    setSesOHManMonth: (state, action) => {
      state.sesOHManMonth = action.payload;
    },
    setSesOHUnitPrice: (state, action) => {
      state.sesOHUnitPrice = action.payload;
    },
    setSesEstimateNumber: (state, action) => {
      state.sesEstimateNumber = action.payload;
    },
    setSesApprovalNumber: (state, action) => {
      state.sesApprovalNumber = action.payload;
    },
    setSesOrderNumber: (state, action) => {
      state.sesOrderNumber = action.payload;
    },
    setSesDeliveryDate: (state, action) => {
      state.sesDeliveryDate = action.payload;
    },
    setSesManMonth: (state, action) => {
      state.sesManMonth = action.payload;
    },
    setSesAvgUnitPrice: (state, action) => {
      state.sesAvgUnitPrice = action.payload;
    },
    setSesOrderAmount: (state, action) => {
      state.sesOrderAmount = action.payload;
    },
    setSesAcceptanceBillingDate: (state, action) => {
      state.sesAcceptanceBillingDate = action.payload;
    },
    setSesPaymentDate: (state, action) => {
      state.sesPaymentDate = action.payload;
    },
    setAllSESOrderInfo: (state, action) => {
      Object.assign(state, action.payload);
    },
    clearSESState: () => {
      return initialState;
    }
  },
});

export const {
  setSesProjectLeader,
  setSesPMManMonth,
  setSesPMUnitPrice,
  setSesPLManMonth,
  setSesPLUnitPrice,
  setSesSEManMonth,
  setSesSEUnitPrice,
  setSesPGManMonth,
  setSesPGUnitPrice,
  setSesOHManMonth,
  setSesOHUnitPrice,
  setSesEstimateNumber,
  setSesApprovalNumber,
  setSesOrderNumber,
  setSesDeliveryDate,
  setSesManMonth,
  setSesAvgUnitPrice,
  setSesOrderAmount,
  setSesAcceptanceBillingDate,
  setSesPaymentDate,
  setAllSESOrderInfo,
  clearSESState
} = projectCreateSesInfoSlice.actions;

export const projectCreateSesInfoReducer =  projectCreateSesInfoSlice.reducer;
