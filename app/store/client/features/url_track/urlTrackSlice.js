const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    currentURL: '',
    previousURL: '',
}

const urlTrackSlice = createSlice({
  name: 'urlTrack',
  initialState,
  reducers: {
    setCurrentURL: (state, action) => {
        state.previousURL = state.currentURL;
        state.currentURL = action.payload;
      },
  },
});

export const {
  setCurrentURL
} = urlTrackSlice.actions;

export const urlTrackReducer = urlTrackSlice.reducer;
