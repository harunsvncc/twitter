import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import languageReducer from './slices/languageSlice';
import newsReducer from './slices/newsSlice';
import authReducer from './slices/authSlice'; // YENİ

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    news: newsReducer,
    auth: authReducer, // YENİ
  },
});