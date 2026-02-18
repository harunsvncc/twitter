import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme, useLanguage, useNews, useAuth } from "../store/hooks";

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const { t, language, changeLanguage } = useLanguage();
  const { news, loading, error, selectedCategory, fetchNews, setCategory } = useNews();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const categories = [
    { id: "general", name: t('general'), icon: "🌍" },
    { id: "technology", name: t('technology'), icon: "💻" },
    { id: "sports", name: t('sports'), icon: "⚽" },
    { id: "economy", name: t('economy'), icon: "📈" },
    { id: "health", name: t('health'), icon: "🏥" },
    { id: "culture", name: t('culture'), icon: "🎭" }
  ];

  // Kategori değişince haberleri çek
  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  // Tarihi formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / 3600000);
    
    if (diffHours < 1) return language === 'tr' ? 'Az önce' : 'Just now';
    if (diffHours < 24) return language === 'tr' ? `${diffHours} saat önce` : `${diffHours} hours ago`;
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      
      {/* Üst Navigasyon */}
      <nav className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-blue-500">
              {t('appName')}
            </Link>
            
            <div className="flex items-center space-x-2">
              {/* Tema değiştir butonu */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition ${
                  isDark 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={isDark ? t('lightTheme') : t('darkTheme')}
              >
                {isDark ? '☀️' : '🌙'}
              </button>

              {/* Dil seçici */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className={`px-3 py-2 rounded-lg transition flex items-center ${
                    isDark 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <span className="mr-1">{language === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
                  {language === 'tr' ? 'TR' : 'EN'}
                </button>

                {showLanguageMenu && (
                  <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg ${
                    isDark ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    <button
                      onClick={() => {
                        changeLanguage('tr');
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 first:rounded-t-lg last:rounded-b-lg ${
                        language === 'tr' 
                          ? 'bg-blue-500 text-white' 
                          : isDark 
                            ? 'text-gray-300 hover:bg-gray-600' 
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🇹🇷 Türkçe
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('en');
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 first:rounded-t-lg last:rounded-b-lg ${
                        language === 'en' 
                          ? 'bg-blue-500 text-white' 
                          : isDark 
                            ? 'text-gray-300 hover:bg-gray-600' 
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                )}
              </div>

              {/* Kullanıcı menüsü */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
                      isDark 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <span className="text-xl">👤</span>
                    <span>{user?.fullName || 'Kullanıcı'}</span>
                  </button>

                  {showUserMenu && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                      isDark ? 'bg-gray-700' : 'bg-white'
                    }`}>
                      <div className={`px-4 py-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {user?.fullName}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          @{user?.username}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 rounded-b-lg ${
                          isDark 
                            ? 'text-red-400 hover:bg-gray-600' 
                            : 'text-red-600 hover:bg-gray-100'
                        }`}
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>

          {/* Kategori sekmeleri (Desktop) */}
          <div className="hidden md:flex py-3 space-x-4 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500 text-white'
                    : isDark 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Mobil kategori seçici */}
          <div className="md:hidden py-2 overflow-x-auto flex space-x-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500 text-white'
                    : isDark 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-200 text-gray-700'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Sayfa başlığı */}
        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {categories.find(c => c.id === selectedCategory)?.name} {t('showing')}
        </h2>

        {/* Yükleme durumu */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow animate-pulse`}>
                <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-t-xl"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hata durumu */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('errorTitle')}
            </p>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
            <button
              onClick={() => fetchNews(selectedCategory)}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              {t('tryAgain')}
            </button>
          </div>
        )}

        {/* Haber Listesi */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news?.length > 0 ? (
              news.map((item, index) => (
                <Link
                  key={index}
                  to={`/haber/${index}`}
                  state={{ news: item }}
                  className={`group ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-xl shadow-lg overflow-hidden transition duration-200`}
                >
                  {/* Haber Görseli */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image || 'https://via.placeholder.com/400x200?text=📰+Haber'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=📰+Haber';
                      }}
                    />
                    {/* Kategori etiketi */}
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      {categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                  </div>

                  {/* Haber İçeriği */}
                  <div className="p-4">
                    {/* Haber başlığı */}
                    <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                    
                    {/* Haber özeti */}
                    <p className={`text-sm mb-3 line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.description || item.content || 'Haber içeriğini görüntülemek için tıklayın...'}
                    </p>
                    
                    {/* Kaynak ve tarih */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {item.source || t('source')}
                      </span>
                      <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                        {formatDate(item.date || new Date())}
                      </span>
                    </div>

                    {/* Okuma süresi */}
                    <div className="mt-2 text-xs text-gray-400 flex items-center">
                      <span>📖</span>
                      <span className="ml-1">
                        {Math.ceil((item.description?.length || item.content?.length || 100) / 500)} {t('minRead')}
                      </span>
                    </div>

                    {/* Giriş yapmamış kullanıcılar için uyarı */}
                    {!isAuthenticated && (
                      <div className="mt-3 text-xs text-yellow-600 dark:text-yellow-400 flex items-center">
                        <span>🔒</span>
                        <span className="ml-1">Detayları görmek için giriş yapın</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p className={`col-span-3 text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Bu kategoride haber bulunamadı.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}