import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { generateMockTweets } from "../utils/mockApis";

export default function AppHome() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [loading, setLoading] = useState(true);
  // Beğeni durumlarını takip etmek için
  const [likedTweets, setLikedTweets] = useState({});
  const [retweetedTweets, setRetweetedTweets] = useState({});

  const fullName = localStorage.getItem("fullName") || "Anonim";
  const username = localStorage.getItem("username") || "kullanici";

  // Sayfa açılınca haberleri ve tweetleri çek
  useEffect(() => {
    fetchNews();
    loadTweets();
    // Beğeni ve retweet durumlarını yükle
    loadInteractionStates();
  }, []);

  // Beğeni ve retweet durumlarını localStorage'dan yükle
  const loadInteractionStates = () => {
    const savedLikes = localStorage.getItem(`likes_${username}`);
    const savedRetweets = localStorage.getItem(`retweets_${username}`);
    
    if (savedLikes) {
      setLikedTweets(JSON.parse(savedLikes));
    }
    if (savedRetweets) {
      setRetweetedTweets(JSON.parse(savedRetweets));
    }
  };

  // Beğeni durumunu kaydet
  const saveLikeState = (tweetId, isLiked) => {
    const updatedLikes = { ...likedTweets, [tweetId]: isLiked };
    setLikedTweets(updatedLikes);
    localStorage.setItem(`likes_${username}`, JSON.stringify(updatedLikes));
  };

  // Retweet durumunu kaydet
  const saveRetweetState = (tweetId, isRetweeted) => {
    const updatedRetweets = { ...retweetedTweets, [tweetId]: isRetweeted };
    setRetweetedTweets(updatedRetweets);
    localStorage.setItem(`retweets_${username}`, JSON.stringify(updatedRetweets));
  };

  // Beğeni işlemi
  const handleLike = (tweetId, currentLikes) => {
    const isLiked = likedTweets[tweetId];
    const newLikeCount = isLiked ? currentLikes - 1 : currentLikes + 1;
    
    // Tweet'in like sayısını güncelle
    const updatedTweets = tweets.map(t => {
      if (t.id === tweetId) {
        return { ...t, likes: newLikeCount };
      }
      return t;
    });
    
    setTweets(updatedTweets);
    localStorage.setItem("tweets", JSON.stringify(updatedTweets));
    
    // Beğeni durumunu kaydet
    saveLikeState(tweetId, !isLiked);
  };

  // Retweet işlemi
  const handleRetweet = (tweetId, currentRetweets) => {
    const isRetweeted = retweetedTweets[tweetId];
    const newRetweetCount = isRetweeted ? currentRetweets - 1 : currentRetweets + 1;
    
    // Tweet'in retweet sayısını güncelle
    const updatedTweets = tweets.map(t => {
      if (t.id === tweetId) {
        return { ...t, retweets: newRetweetCount };
      }
      return t;
    });
    
    setTweets(updatedTweets);
    localStorage.setItem("tweets", JSON.stringify(updatedTweets));
    
    // Retweet durumunu kaydet
    saveRetweetState(tweetId, !isRetweeted);
  };

  const updateTweetsWithCommentCounts = (tweetsArray) => {
    return tweetsArray.map(tweet => {
      const comments = JSON.parse(localStorage.getItem(`comments_${tweet.id}`)) || [];
      return {
        ...tweet,
        comments: comments.length
      };
    });
  };

  const loadTweets = () => {
    const savedTweets = localStorage.getItem("tweets");
    
    if (savedTweets) {
      try {
        const parsedTweets = JSON.parse(savedTweets);
        if (parsedTweets.length > 0) {
          const tweetsWithComments = updateTweetsWithCommentCounts(parsedTweets);
          setTweets(tweetsWithComments);
          localStorage.setItem("tweets", JSON.stringify(tweetsWithComments));
        } else {
          const mockTweets = generateMockTweets(15);
          const tweetsWithComments = updateTweetsWithCommentCounts(mockTweets);
          setTweets(tweetsWithComments);
          localStorage.setItem("tweets", JSON.stringify(tweetsWithComments));
        }
      } catch (error) {
        console.error("Tweetler yüklenemedi:", error);
        const mockTweets = generateMockTweets(15);
        const tweetsWithComments = updateTweetsWithCommentCounts(mockTweets);
        setTweets(tweetsWithComments);
        localStorage.setItem("tweets", JSON.stringify(tweetsWithComments));
      }
    } else {
      console.log("Hiç tweet yok, mock tweetler oluşturuluyor...");
      const mockTweets = generateMockTweets(15);
      const tweetsWithComments = updateTweetsWithCommentCounts(mockTweets);
      setTweets(tweetsWithComments);
      localStorage.setItem("tweets", JSON.stringify(tweetsWithComments));
    }
    
    setLoading(false);
  };

  // GÜNCELLENMİŞ: Haberleri çekme fonksiyonu - 10 haber ve daha fazla bilgi
  const fetchNews = async () => {
    setLoadingNews(true);
    setApiError(false);
    
    try {
      const response = await fetch('https://api.collectapi.com/news/getNews?country=tr&tag=general', {
        headers: {
          'content-type': 'application/json',
          'authorization': import.meta.env.VITE_COLLECTAPI_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`API hatası: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Haberler:", data);
      
      if (data.success && data.result && data.result.length > 0) {
        // İlk 10 haber başlığını al
        const newsTitles = data.result.slice(0, 10).map(item => ({
          title: item.title,
          url: item.url,
          source: item.source,
          description: item.description || item.title,
          date: item.date || new Date().toISOString()
        }));
        setNews(newsTitles);
        setApiError(false);
      } else {
        setApiError(true);
        setNews([]);
      }
    } catch (error) {
      console.error("Haberler yüklenemedi:", error);
      setApiError(true);
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    if (tweets.length > 0) {
      console.log("Tweetler kaydedildi:", tweets.length);
      localStorage.setItem("tweets", JSON.stringify(tweets));
    } else {
      localStorage.setItem("tweets", JSON.stringify([]));
    }
  }, [tweets]);

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    navigate("/");
  };

  const handleDelete = (id) => {
    console.log("Silinen tweet ID:", id);
    const filteredTweets = tweets.filter((t) => t.id !== id);
    setTweets(filteredTweets);
    localStorage.setItem("tweets", JSON.stringify(filteredTweets));
  };

  const handleTweet = () => {
    if (tweet.trim() === "") return;

    const currentFullName = localStorage.getItem("fullName") || "Anonim";
    const currentUsername = localStorage.getItem("username") || "kullanici";

    const newTweet = {
      id: Date.now(),
      content: tweet,
      user: {
        fullName: currentFullName,
        username: currentUsername,
        avatar: "👤"
      },
      likes: 0,
      retweets: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };

    console.log("Yeni tweet atıldı:", newTweet);
    
    const updatedTweets = [newTweet, ...tweets];
    setTweets(updatedTweets);
    localStorage.setItem("tweets", JSON.stringify(updatedTweets));
    setTweet("");
  };

  const refreshCommentCounts = () => {
    setTweets(prevTweets => updateTweetsWithCommentCounts(prevTweets));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays === 1) return "dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString("tr-TR");
  };

  // Tarihi formatla (haberler için)
  const formatNewsDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / 3600000);
    
    if (diffHours < 1) return 'Az önce';
    if (diffHours < 24) return `${diffHours} saat önce`;
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className={`h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <p className={isDark ? 'text-white' : 'text-gray-900'}>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={`h-screen flex ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>

      {/* Sidebar */}
      <div className={`w-1/4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-r'} p-6 flex flex-col justify-between`}>
        <div>
          <h1 className="text-2xl font-bold mb-8 text-blue-500">{t('appName')}</h1>
          <ul className="space-y-4 font-semibold">
            <li>
              <Link 
                to="/app" 
                className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'} cursor-pointer`}
              >
                {t('home')}
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'} cursor-pointer`}
              >
                {t('profile')}
              </Link>
            </li>
            <li className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'} cursor-pointer`}>
              {t('messages')}
            </li>
            <li>
              <Link to="/settings" className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'}`}>
                {t('settings')}
              </Link>
            </li>
          </ul>
        </div>
        <button onClick={handleLogout} className="bg-blue-500 text-white py-2 rounded-full font-semibold">
          {t('logout')}
        </button>
      </div>

      {/* Feed */}
      <div className="w-2/4 p-6 overflow-y-auto">
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('home')}
        </h2>

        {/* Tweet Input */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow mb-4`}>
          <textarea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            placeholder={t('tweetPlaceholder')}
            className={`w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          <button onClick={handleTweet} className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition">
            {t('tweetButton')}
          </button>
        </div>

        {/* Tweet List */}
        {tweets.length === 0 ? (
          <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Henüz tweet yok. İlk tweeti sen at!
          </p>
        ) : (
          tweets.map((tweetItem) => (
            <div key={tweetItem.id} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow mb-3`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Kullanıcı bilgileri */}
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{tweetItem.user?.avatar || '👤'}</span>
                    <div>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {tweetItem.user?.fullName || "Anonim"}{" "}
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
                          @{tweetItem.user?.username || "kullanici"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(tweetItem.createdAt || Date.now())}
                      </p>
                    </div>
                  </div>
                  
                  {/* Tweet içeriği */}
                  <Link 
                    to={`/app/tweet/${tweetItem.id}`} 
                    className="hover:underline block mb-3"
                    onClick={() => {
                      setTimeout(refreshCommentCounts, 100);
                    }}
                  >
                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{tweetItem.content}</p>
                  </Link>
                  
                  {/* Etkileşim butonları */}
                  <div className="flex space-x-6 text-gray-500">
                    <Link 
                      to={`/app/tweet/${tweetItem.id}`}
                      className="flex items-center space-x-2 hover:text-blue-500"
                    >
                      <span>💬</span>
                      <span className="text-sm">{tweetItem.comments || 0}</span>
                    </Link>
                    
                    <button 
                      onClick={() => handleRetweet(tweetItem.id, tweetItem.retweets || 0)}
                      className={`flex items-center space-x-2 transition ${
                        retweetedTweets[tweetItem.id] ? 'text-green-500' : 'hover:text-green-500'
                      }`}
                    >
                      <span>🔄</span>
                      <span className="text-sm">{tweetItem.retweets || 0}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleLike(tweetItem.id, tweetItem.likes || 0)}
                      className={`flex items-center space-x-2 transition ${
                        likedTweets[tweetItem.id] ? 'text-red-500' : 'hover:text-red-500'
                      }`}
                    >
                      <span>{likedTweets[tweetItem.id] ? '❤️' : '🤍'}</span>
                      <span className="text-sm">{tweetItem.likes || 0}</span>
                    </button>
                  </div>
                </div>

                {/* Sil butonu */}
                {tweetItem.user?.username === username && (
                  <button
                    onClick={() => handleDelete(tweetItem.id)}
                    className="text-red-500 font-semibold hover:text-red-700 ml-4"
                  >
                    {t('delete')}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Panel - Haberler (GÜNCELLENDİ) */}
      <div className="w-1/4 p-6">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              📰 Gündemdeki Haberler
            </h3>
            <button 
              onClick={fetchNews} 
              className="text-blue-500 text-sm hover:underline flex items-center"
              disabled={loadingNews}
            >
              {loadingNews ? '🔄' : '↻ Yenile'}
            </button>
          </div>
          
          {loadingNews ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : apiError ? (
            <div className="space-y-2">
              <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Haberler yüklenemedi
              </p>
              <p className="text-xs text-gray-500 text-center">(API limiti aşılmış olabilir)</p>
              {/* Manuel trendler */}
              <div className="mt-4 space-y-2">
                <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>#React</p>
                <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>#Tailwind</p>
                <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>#JavaScript</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {news.map((item, index) => (
                <a 
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-2 rounded-lg transition ${
                    isDark 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {/* Haber sırası */}
                    <span className={`text-sm font-bold mt-0.5 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {index + 1}.
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      {/* Haber başlığı */}
                      <h4 className={`text-sm font-medium line-clamp-2 mb-1 ${
                        isDark ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {item.title}
                      </h4>
                      
                      {/* Kaynak ve zaman */}
                      <div className="flex items-center text-xs">
                        <span className={`font-medium ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          {item.source || 'Haber'}
                        </span>
                        <span className={`mx-1 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>•</span>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                          {formatNewsDate(item.date)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Ok işareti */}
                    <span className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      ↗
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}