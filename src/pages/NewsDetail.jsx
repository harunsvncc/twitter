import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../store/hooks";
import { useLanguage } from "../store/hooks";

export default function NewsDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  
  const news = location.state?.news;

  if (!news) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <p className={`text-xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('newsNotFound')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            {t('back')}
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      
      {/* Üst navigasyon */}
      <nav className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-10`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-500 font-semibold hover:underline flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('back')}
            </button>
            <h1 className="text-xl font-bold text-blue-500 ml-4">{t('appName')}</h1>
          </div>
        </div>
      </nav>

      {/* Haber içeriği */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
          
          {/* Haber Görseli */}
          {news.image && (
            <div className="relative h-96 w-full">
              <img 
                src={!imageError ? news.image : 'https://via.placeholder.com/1200x600?text=📰+News'}
                alt={news.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="inline-block bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                  {news.source || t('source')}
                </span>
              </div>
            </div>
          )}

          {/* Haber içeriği */}
          <div className="p-8">
            {/* Haber başlığı */}
            <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {news.title}
            </h1>
            
            {/* Tarih ve kaynak */}
            <div className="flex items-center text-sm mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <span className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {news.source || t('source')}
              </span>
              <span className={`mx-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>•</span>
              <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                {formatDate(news.date || news.publishedAt || new Date())}
              </span>
            </div>

            {/* Haber metni - GÜNCELLENDİ */}
            <div className="space-y-4">
              {/* Özet (varsa) */}
              {news.description && (
                <div>
                  <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('summary')}
                  </h2>
                  <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {news.description}
                  </p>
                </div>
              )}
              
              {/* Tam metin (varsa) */}
              {news.content && (
                <div>
                  <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('fullNews')}
                  </h2>
                  <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {news.content}
                  </p>
                </div>
              )}
              
              {/* Eğer içerik yoksa placeholder */}
              {!news.description && !news.content && (
                <p className={`text-lg text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Haber içeriği bulunamadı.
                </p>
              )}
              
              {/* Kaynak linki */}
              {news.url && (
                <div className="mt-8 p-6 bg-blue-50 dark:bg-gray-700 rounded-lg">
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('goToSource')}
                  </p>
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                  >
                    {t('goToSource')}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {/* Paylaş butonları */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('share')}
              </h3>
              <div className="flex space-x-3">
                <button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(news.url)}`, '_blank')}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </button>
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(news.url)}`, '_blank')}
                  className="bg-blue-400 text-white p-2 rounded-lg hover:bg-blue-500"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button 
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(news.title + ' ' + news.url)}`, '_blank')}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.93.54 3.72 1.48 5.26L2.1 21.9l4.64-1.38C8.28 21.46 10.08 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.51 0-2.93-.41-4.16-1.12l-.3-.18-2.76.82.82-2.76-.18-.3C6.41 14.93 6 13.51 6 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}