const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  mmProjectLeader: '',
  mmPMManMonth: '',
  mmPMUnitPrice: '',
  mmPLManMonth: '',
  mmPLUnitPrice: '',
  mmSEManMonth: '',
  mmSEUnitPrice: '',
  mmPGManMonth: '',
  mmPGUnitPrice: '',
  mmOHManMonth: '',
  mmOHUnitPrice: '',
  mmEsitmateNumber: '',
  mmApprovalNumber: '',
  mmDeliveryDate: '',
  mmManMonth: '',
  mmAvgUnitPrice: '',
  gicjFee: '',
  mmOrderAmount: '',
  mmOrderNumber: '',
  mmBilledAmount: '',
  mmAcceptanceBillingDate: '',
  mmPaymentDate: '',
}

const projectCreateMMOrderSlice = createSlice({
  name: 'projectCreateMMOrderInfo',
  initialState,
  reducers: {
    setMmProjectLeader: (state, action) => {
      state.mmProjectLeader = action.payload;
    },
    setMmPMManMonth: (state, action) => {
      state.mmPMManMonth = action.payload;
    },
    setMmPMUnitPrice: (state, action) => {
      state.mmPMUnitPrice = action.payload;
    },
    setMmPLManMonth: (state, action) => {
      state.mmPLManMonth = action.payload;
    },
    setMmPLUnitPrice: (state, action) => {
      state.mmPLUnitPrice = action.payload;
    },
    setMmSEManMonth: (state, action) => {
      state.mmSEManMonth = action.payload;
    },
    setMmSEUnitPrice: (state, action) => {
      state.mmSEUnitPrice = action.payload;
    },
    setMmPGManMonth: (state, action) => {
      state.mmPGManMonth = action.payload;
    },
    setMmPGUnitPrice: (state, action) => {
      state.mmPGUnitPrice = action.payload;
    },
    setMmOHManMonth: (state, action) => {
      state.mmOHManMonth = action.payload;
    },
    setMmOHUnitPrice: (state, action) => {
      state.mmOHUnitPrice = action.payload;
    },
    setMmEsitmateNumber: (state, action) => {
      state.mmEsitmateNumber = action.payload;
    },
    setMmApprovalNumber: (state, action) => {
      state.mmApprovalNumber = action.payload;
    },
    setMmDeliveryDate: (state, action) => {
      state.mmDeliveryDate = action.payload;
    },
    setMmManMonth: (state, action) => {
      state.mmManMonth = action.payload;
    },
    setMmAvgUnitPrice: (state, action) => {
      state.mmAvgUnitPrice = action.payload;
    },
    setGicjFee: (state, action) => {
      state.gicjFee = action.payload;
    },
    setMmOrderAmount: (state, action) => {
      state.mmOrderAmount = action.payload;
    },
    setMmBilledAmount: (state, action) => {
      state.mmBilledAmount = action.payload;
    },
    setMmOrderNumber: (state, action) => {
      state.mmOrderNumber = action.payload;
    },
    setMmAcceptanceBillingDate: (state, action) => {
      state.mmAcceptanceBillingDate = action.payload;
    },
    setMmPaymentDate: (state, action) => {
      state.mmPaymentDate = action.payload;
    },
    clearMMOrderState: () => {
      return initialState;
    },
    setAllMMOrderInfo: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  setMmProjectLeader,
  setMmPMManMonth,
  setMmPMUnitPrice,
  setMmPLManMonth,
  setMmPLUnitPrice,
  setMmSEManMonth,
  setMmSEUnitPrice,
  setMmPGManMonth,
  setMmPGUnitPrice,
  setMmOHManMonth,
  setMmOHUnitPrice,
  setMmEsitmateNumber,
  setMmApprovalNumber,
  setMmDeliveryDate,
  setMmManMonth,
  setMmAvgUnitPrice,
  setGicjFee,
  setMmOrderAmount,
  setMmBilledAmount,
  setMmOrderNumber,
  setMmAcceptanceBillingDate,
  setMmPaymentDate,
  clearMMOrderState,
  setAllMMOrderInfo
} = projectCreateMMOrderSlice.actions;

export const projectCreateMMOrderReducer = projectCreateMMOrderSlice.reducer;
