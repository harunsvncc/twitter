import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === 'dark';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDark: getInitialTheme()
  },
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
      if (state.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;