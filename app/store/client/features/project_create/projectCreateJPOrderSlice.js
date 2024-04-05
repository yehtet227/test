const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  jpProjectLeader: '',
  jpPMManMonth: '',
  jpPMUnitPrice: '',
  jpPLManMonth: '',
  jpPLUnitPrice: '',
  jpSEManMonth: '',
  jpSEUnitPrice: '',
  jpPGManMonth: '',
  jpPGUnitPrice: '',
  jpOHManMonth: '',
  jpOHUnitPrice: '',
  jpEsitmateNumber: '',
  jpApprovalNumber: '',
  jpOrderNumber: '',
  jpDeliveryDate: '',
  jpManMonth: '',
  jpAvgUnitPrice: '',
  jpOrderAmount: '',
  jpAcceptanceBillingDate: '',
  jpPaymentDate: '',
}

const projectCreateJPOrderSlice = createSlice({
  name: 'projectCreateJPOrderInfo',
  initialState,
  reducers: {
    setJpProjectLeader: (state, action) => {
      state.jpProjectLeader = action.payload;
    },
    setJpPMManMonth: (state, action) => {
      state.jpPMManMonth = action.payload;
    },
    setJpPMUnitPrice: (state, action) => {
      state.jpPMUnitPrice = action.payload;
    },
    setJpPLManMonth: (state, action) => {
      state.jpPLManMonth = action.payload;
    },
    setJpPLUnitPrice: (state, action) => {
      state.jpPLUnitPrice = action.payload;
    },
    setJpSEManMonth: (state, action) => {
      state.jpSEManMonth = action.payload;
    },
    setJpSEUnitPrice: (state, action) => {
      state.jpSEUnitPrice = action.payload;
    },
    setJpPGManMonth: (state, action) => {
      state.jpPGManMonth = action.payload;
    },
    setJpPGUnitPrice: (state, action) => {
      state.jpPGUnitPrice = action.payload;
    },
    setJpOHManMonth: (state, action) => {
      state.jpOHManMonth = action.payload;
    },
    setJpOHUnitPrice: (state, action) => {
      state.jpOHUnitPrice = action.payload;
    },
    setJpEsitmateNumber: (state, action) => {
      state.jpEsitmateNumber = action.payload;
    },
    setJpApprovalNumber: (state, action) => {
      state.jpApprovalNumber = action.payload;
    },
    setJpOrderNumber: (state, action) => {
      state.jpOrderNumber = action.payload;
    },
    setJpDeliveryDate: (state, action) => {
      state.jpDeliveryDate = action.payload;
    },
    setJpManMonth: (state, action) => {
      state.jpManMonth = action.payload;
    },
    setJpAvgUnitPrice: (state, action) => {
      state.jpAvgUnitPrice = action.payload;
    },
    setJpOrderAmount: (state, action) => {
      state.jpOrderAmount = action.payload;
    },
    setJpAcceptanceBillingDate: (state, action) => {
      state.jpAcceptanceBillingDate = action.payload;
    },
    setJpPaymentDate: (state, action) => {
      state.jpPaymentDate = action.payload;
    },
    clearJPOrderState: () => {
      return initialState;
    },
    setAllJPOrderInfo: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  setJpProjectLeader,
  setJpPMManMonth,
  setJpPMUnitPrice,
  setJpPLManMonth,
  setJpPLUnitPrice,
  setJpSEManMonth,
  setJpSEUnitPrice,
  setJpPGManMonth,
  setJpPGUnitPrice,
  setJpOHManMonth,
  setJpOHUnitPrice,
  setJpEsitmateNumber,
  setJpApprovalNumber,
  setJpOrderNumber,
  setJpDeliveryDate,
  setJpManMonth,
  setJpAvgUnitPrice,
  setJpOrderAmount,
  setJpAcceptanceBillingDate,
  setJpPaymentDate,
  clearJPOrderState,
  setAllJPOrderInfo
} = projectCreateJPOrderSlice.actions;

export const projectCreateJPOrderReducer = projectCreateJPOrderSlice.reducer;
