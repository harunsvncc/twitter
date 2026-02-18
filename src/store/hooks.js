import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from './slices/themeSlice';
import { changeLanguage } from './slices/languageSlice';
import { fetchNews, setCategory } from './slices/newsSlice';
import { login, logout } from './slices/authSlice'; // logout buradan gelmeli

// Tema hook'u
export const useTheme = () => {
  const isDark = useSelector((state) => state.theme?.isDark || false);
  const dispatch = useDispatch();
  
  return {
    isDark,
    toggleTheme: () => dispatch(toggleTheme())
  };
};

// Dil hook'u
export const useLanguage = () => {
  const language = useSelector((state) => state.language?.language || 'tr');
  const dispatch = useDispatch();
  
  const translations = {
    tr: {
      appName: "📰 Haber Uygulaması",
      general: "Genel",
      technology: "Teknoloji",
      sports: "Spor",
      economy: "Ekonomi",
      health: "Sağlık",
      culture: "Kültür",
      source: "Haber Kaynağı",
      errorTitle: "Haberler yüklenemedi",
      tryAgain: "Tekrar Dene",
      minRead: "dk okuma",
      lightTheme: "Açık Tema",
      darkTheme: "Koyu Tema"
    },
    en: {
      appName: "📰 News App",
      general: "General",
      technology: "Technology",
      sports: "Sports",
      economy: "Economy",
      health: "Health",
      culture: "Culture",
      source: "Source",
      errorTitle: "Failed to load news",
      tryAgain: "Try Again",
      minRead: "min read",
      lightTheme: "Light Theme",
      darkTheme: "Dark Theme"
    }
  };
  
  const t = (key) => {
    return translations[language]?.[key] || key;
  };
  
  return {
    language,
    t,
    changeLanguage: (lang) => dispatch(changeLanguage(lang))
  };
};

// Haber hook'u
export const useNews = () => {
  const news = useSelector((state) => state.news?.items || []);
  const loading = useSelector((state) => state.news?.loading || false);
  const error = useSelector((state) => state.news?.error || null);
  const selectedCategory = useSelector((state) => state.news?.selectedCategory || 'general');
  const dispatch = useDispatch();
  
  return {
    news,
    loading,
    error,
    selectedCategory,
    fetchNews: (category) => dispatch(fetchNews(category)),
    setCategory: (category) => dispatch(setCategory(category))
  };
};

// Auth hook'u - DÜZELTİLDİ
export const useAuth = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  return {
    isAuthenticated,
    user,
    login: (userData) => {
      console.log("Login çağrıldı", userData);
      dispatch(login(userData));
    },
    logout: () => {
      console.log("Logout çağrıldı");
      dispatch(logout());
      // Yedek olarak localStorage temizliği
      localStorage.removeItem('isAuth');
      localStorage.removeItem('user');
    }
  };
};