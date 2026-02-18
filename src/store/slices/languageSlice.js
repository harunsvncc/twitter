import { createSlice } from '@reduxjs/toolkit';

const getInitialLanguage = () => {
  return localStorage.getItem('language') || 'tr';
};

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    language: getInitialLanguage()
  },
  reducers: {
    changeLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    }
  }
});

export const { changeLanguage } = languageSlice.actions;
export default languageSlice.reducer;