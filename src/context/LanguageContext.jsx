import { createContext, useState, useEffect, useContext } from "react";

// Dil dosyaları
const translations = {
  tr: {
    // Genel
    appName: "Twitter",
    settings: "Ayarlar",
    home: "Anasayfa",
    profile: "Profil",
    messages: "Mesajlar",
    logout: "Çıkış Yap",
    save: "Kaydet",
    
    // Home Page
    welcome: "Twitter Clone'a Hoş Geldin",
    welcomeDesc: "Düşüncelerini paylaş, insanlarla bağlantı kur",
    login: "Giriş Yap",
    register: "Kayıt Ol",
    
    // Tweet
    tweetPlaceholder: "Ne düşünüyorsun?",
    tweetButton: "Tweet At",
    delete: "Sil",
    tweetNotFound: "Tweet bulunamadı 😢",
    noTweets: "Henüz tweet yok. İlk tweeti sen at!",
    
    // Settings
    appearance: "Görünüm",
    lightTheme: "Açık Tema",
    darkTheme: "Koyu Tema",
    themeActive: "tema aktif",
    notifications: "Bildirimler",
    notificationsAllow: "Bildirimlere izin ver",
    account: "Hesap",
    profileSettings: "Profil Ayarları",
    name: "İsim",
    username: "Kullanıcı Adı",
    email: "Email",
    password: "Şifre",
    currentPassword: "Mevcut Şifre",
    newPassword: "Yeni Şifre",
    confirmPassword: "Şifre Tekrar",
    
    // Login/Register
    loginTitle: "Giriş Yap",
    registerTitle: "Hesap Oluştur",
    noAccount: "Hesabın yok mu?",
    haveAccount: "Zaten hesabın var mı?",
    passwordMismatch: "Şifreler eşleşmiyor!",
    loginSuccess: "Giriş başarılı",
    registerSuccess: "Kayıt başarılı 🎉",
    
    // Languages
    language: "Dil",
    turkish: "Türkçe",
    english: "İngilizce",
    
    // Back
    back: "Geri"
  },
  en: {
    // General
    appName: "Twitter",
    settings: "Settings",
    home: "Home",
    profile: "Profile",
    messages: "Messages",
    logout: "Logout",
    save: "Save",
    
    // Home Page
    welcome: "Welcome to Twitter Clone",
    welcomeDesc: "Share your thoughts, connect with people",
    login: "Login",
    register: "Register",
    
    // Tweet
    tweetPlaceholder: "What's happening?",
    tweetButton: "Tweet",
    delete: "Delete",
    tweetNotFound: "Tweet not found 😢",
    noTweets: "No tweets yet. Be the first to tweet!",
    
    // Settings
    appearance: "Appearance",
    lightTheme: "Light Theme",
    darkTheme: "Dark Theme",
    themeActive: "theme active",
    notifications: "Notifications",
    notificationsAllow: "Allow notifications",
    account: "Account",
    profileSettings: "Profile Settings",
    name: "Name",
    username: "Username",
    email: "Email",
    password: "Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    
    // Login/Register
    loginTitle: "Login",
    registerTitle: "Create Account",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    passwordMismatch: "Passwords do not match!",
    loginSuccess: "Login successful",
    registerSuccess: "Registration successful 🎉",
    
    // Languages
    language: "Language",
    turkish: "Turkish",
    english: "English",
    
    // Back
    back: "Back"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // LocalStorage'dan dil tercihini al
    return localStorage.getItem("language") || "tr";
  });

  useEffect(() => {
    // Dil değişince localStorage'a kaydet
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}