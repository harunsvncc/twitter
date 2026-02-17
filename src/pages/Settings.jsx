import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext"; // ← Yeni ek

export default function Settings() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { t, language, changeLanguage } = useLanguage(); // ← Yeni ek

  const handleThemeChange = (e) => {
    toggleTheme(e.target.value === "dark");
  };

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-6`}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-500 font-semibold hover:underline flex items-center"
        >
          ← {t('back')}
        </button>

        <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('settings')}
        </h1>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow overflow-hidden`}>
          
          {/* Dil Ayarları - YENİ! */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('language')}
            </h2>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="language" 
                  value="tr" 
                  checked={language === "tr"}
                  onChange={handleLanguageChange}
                />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {t('turkish')} - Türkçe
                </span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="language" 
                  value="en"
                  checked={language === "en"}
                  onChange={handleLanguageChange}
                />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {t('english')} - English
                </span>
              </label>
            </div>

            <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={isDark ? 'text-white' : 'text-gray-900'}>
                {language === "tr" ? "🇹🇷 Türkçe" : "🇬🇧 English"} {t('themeActive')}
              </p>
            </div>
          </div>

          {/* Profil Ayarları */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('profileSettings')}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  {t('name')}
                </label>
                <input
                  type="text"
                  defaultValue={localStorage.getItem("fullName") || ""}
                  className={`w-full border rounded-lg p-2 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  {t('username')}
                </label>
                <input
                  type="text"
                  defaultValue={localStorage.getItem("username") || ""}
                  className={`w-full border rounded-lg p-2 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                {t('save')}
              </button>
            </div>
          </div>

          {/* Görünüm Ayarları */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('appearance')}
            </h2>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="theme" 
                  value="light" 
                  checked={!isDark}
                  onChange={handleThemeChange}
                />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('lightTheme')}</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="theme" 
                  value="dark"
                  checked={isDark}
                  onChange={handleThemeChange}
                />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('darkTheme')}</span>
              </label>
            </div>

            <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={isDark ? 'text-white' : 'text-gray-900'}>
                {isDark ? '🌙 ' + t('darkTheme') : '☀️ ' + t('lightTheme')} {t('themeActive')}
              </p>
            </div>
          </div>

          {/* Bildirim Ayarları */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('notifications')}
            </h2>
            
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked />
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('notificationsAllow')}</span>
            </label>
          </div>

          {/* Hesap İşlemleri */}
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('account')}
            </h2>
            
            <button className="text-red-500 font-semibold hover:underline">
              {t('logout')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}