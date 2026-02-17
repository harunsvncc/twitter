import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function Profile() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  
  // Kullanıcı bilgileri
  const [allUserTweets, setAllUserTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [stats, setStats] = useState({
    tweets: 0,
    followers: 0,
    following: 0
    // likes kaldırıldı
  });
  
  // Beğeni ve retweet durumları
  const [likedTweetsState, setLikedTweetsState] = useState({});
  const [retweetedTweetsState, setRetweetedTweetsState] = useState({});
  
  // Profil düzenleme modu
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedWebsite, setEditedWebsite] = useState("");
  
  // Aktif sekme (tweetler veya beğeniler)
  const [activeTab, setActiveTab] = useState("tweets");
  
  // Mevcut kullanıcı bilgileri
  const currentUsername = localStorage.getItem("username") || "kullanici";
  const currentFullName = localStorage.getItem("fullName") || "Anonim";
  
  useEffect(() => {
    loadAllData();
  }, []);

  // TÜM VERİLERİ TEK FONKSİYONDA YÜKLE
  const loadAllData = () => {
    console.log("Tüm veriler yükleniyor...");
    
    // 1. Beğeni ve retweet durumlarını yükle
    const savedLikes = JSON.parse(localStorage.getItem(`likes_${currentUsername}`)) || {};
    const savedRetweets = JSON.parse(localStorage.getItem(`retweets_${currentUsername}`)) || {};
    
    console.log("Retweet durumları:", savedRetweets);
    
    setLikedTweetsState(savedLikes);
    setRetweetedTweetsState(savedRetweets);
    
    // 2. Tüm tweetleri yükle
    const allTweets = JSON.parse(localStorage.getItem("tweets")) || [];
    
    // 3. Kullanıcının kendi tweetleri
    const userOwnTweets = allTweets.filter(t => t.user?.username === currentUsername);
    
    // 4. Retweetlenen tweetler
    const retweetedIds = Object.keys(savedRetweets).filter(id => savedRetweets[id] === true);
    console.log("Retweet ID'leri:", retweetedIds);
    
    const retweetedTweets = allTweets.filter(t => retweetedIds.includes(t.id.toString()));
    console.log("Bulunan retweetler:", retweetedTweets);
    
    // 5. Retweetlenen tweetlere "retweet" bilgisi ekle
    const retweetedWithInfo = retweetedTweets.map(tweet => ({
      ...tweet,
      isRetweet: true,
      retweetedBy: currentUsername
    }));
    
    // 6. İki listeyi birleştir
    const combined = [...userOwnTweets, ...retweetedWithInfo];
    
    // 7. Aynı tweet'ten iki tane varsa (hem kendi tweeti hem retweet) - kendi tweetini tut
    const uniqueTweets = [];
    const seenIds = new Set();
    
    combined.forEach(tweet => {
      if (!seenIds.has(tweet.id)) {
        seenIds.add(tweet.id);
        uniqueTweets.push(tweet);
      }
    });
    
    // 8. Tarihe göre sırala
    const sortedTweets = uniqueTweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 9. Yorum sayılarını ekle
    const tweetsWithComments = sortedTweets.map(tweet => {
      const comments = JSON.parse(localStorage.getItem(`comments_${tweet.id}`)) || [];
      return {
        ...tweet,
        comments: comments.length
      };
    });
    
    console.log("Final tweet listesi:", tweetsWithComments);
    setAllUserTweets(tweetsWithComments);
    
    // 10. Beğenilen tweetleri yükle
    const likedIds = Object.keys(savedLikes).filter(id => savedLikes[id]);
    const likedTweetsList = allTweets.filter(t => likedIds.includes(t.id.toString()));
    
    const likedWithComments = likedTweetsList.map(tweet => {
      const comments = JSON.parse(localStorage.getItem(`comments_${tweet.id}`)) || [];
      return {
        ...tweet,
        comments: comments.length,
        isLiked: true
      };
    });
    
    setLikedTweets(likedWithComments);
    
    // 11. İstatistikleri güncelle - RETWEET SAYISI DA EKLENDİ
    // Kendi tweetleri + retweetlediği tweetler = toplam tweet sayısı
    const totalTweets = userOwnTweets.length + retweetedTweets.length;
    
    setStats({
      tweets: totalTweets, // Kendi tweetleri + retweetler
      followers: 42, // Mock veri
      following: 69 // Mock veri
    });
    
    // 12. Profil bilgilerini yükle
    const profileInfo = JSON.parse(localStorage.getItem(`profile_${currentUsername}`)) || {
      bio: "Henüz bir biyografi eklenmemiş.",
      location: "Türkiye",
      website: "",
      joinDate: new Date().toISOString()
    };
    
    setEditedBio(profileInfo.bio);
    setEditedLocation(profileInfo.location);
    setEditedWebsite(profileInfo.website);
  };

  // Profil bilgilerini kaydet
  const handleSaveProfile = () => {
    const profileInfo = {
      bio: editedBio,
      location: editedLocation,
      website: editedWebsite,
      joinDate: JSON.parse(localStorage.getItem(`profile_${currentUsername}`))?.joinDate || new Date().toISOString()
    };
    
    localStorage.setItem(`profile_${currentUsername}`, JSON.stringify(profileInfo));
    setIsEditing(false);
  };

  // Tweet silme fonksiyonu
  const handleDeleteTweet = (tweetId) => {
    if (window.confirm("Bu tweeti silmek istediğine emin misin?")) {
      const allTweets = JSON.parse(localStorage.getItem("tweets")) || [];
      const updatedTweets = allTweets.filter(t => t.id !== tweetId);
      localStorage.setItem("tweets", JSON.stringify(updatedTweets));
      
      // Tüm verileri yeniden yükle
      loadAllData();
    }
  };

  // Beğeni işlemi
  const handleLike = (tweetId, currentLikes) => {
    const isLiked = likedTweetsState[tweetId];
    const newLikeCount = isLiked ? currentLikes - 1 : currentLikes + 1;
    
    // Tweet'in like sayısını güncelle
    const allTweets = JSON.parse(localStorage.getItem("tweets")) || [];
    const updatedTweets = allTweets.map(t => {
      if (t.id === tweetId) {
        return { ...t, likes: newLikeCount };
      }
      return t;
    });
    localStorage.setItem("tweets", JSON.stringify(updatedTweets));
    
    // Kullanıcının beğeni durumunu güncelle
    const updatedLikes = { ...likedTweetsState, [tweetId]: !isLiked };
    localStorage.setItem(`likes_${currentUsername}`, JSON.stringify(updatedLikes));
    
    // Tüm verileri yeniden yükle
    loadAllData();
  };

  // Retweet işlemi - GÜNCELLENDİ (tweet sayısını artırmak için)
  const handleRetweet = (tweetId, currentRetweets) => {
    const isRetweeted = retweetedTweetsState[tweetId];
    const newRetweetCount = isRetweeted ? currentRetweets - 1 : currentRetweets + 1;
    
    // Tweet'in retweet sayısını güncelle
    const allTweets = JSON.parse(localStorage.getItem("tweets")) || [];
    const updatedTweets = allTweets.map(t => {
      if (t.id === tweetId) {
        return { ...t, retweets: newRetweetCount };
      }
      return t;
    });
    localStorage.setItem("tweets", JSON.stringify(updatedTweets));
    
    // Kullanıcının retweet durumunu güncelle
    const updatedRetweets = { ...retweetedTweetsState, [tweetId]: !isRetweeted };
    localStorage.setItem(`retweets_${currentUsername}`, JSON.stringify(updatedRetweets));
    
    // Tüm verileri yeniden yükle
    loadAllData();
  };

  // Tarihi formatla
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

  // Katılma tarihini formatla
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", { year: 'numeric', month: 'long' });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      
      {/* Üst navigasyon */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 font-semibold hover:underline mr-4"
          >
            ← Geri
          </button>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Profil
          </h1>
        </div>
      </div>

      {/* Profil içeriği */}
      <div className="max-w-4xl mx-auto p-4">
        
        {/* Kapak fotoğrafı (placeholder) */}
        <div className="h-48 bg-blue-500 rounded-t-xl"></div>
        
        {/* Profil kartı */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-b-xl shadow-lg p-6 -mt-1`}>
          
          {/* Profil fotoğrafı ve düzenle butonu */}
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full border-4 border-white dark:border-gray-800 -mt-12 flex items-center justify-center text-5xl">
                👤
              </div>
              <div className="ml-4">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {currentFullName}
                </h2>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  @{currentUsername}
                </p>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className={`px-4 py-2 rounded-full border font-semibold transition ${
                  isDark 
                    ? 'border-gray-600 text-white hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Profili Düzenle
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`px-4 py-2 rounded-full border font-semibold ${
                    isDark 
                      ? 'border-gray-600 text-white hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  İptal
                </button>
              </div>
            )}
          </div>

          {/* İstatistikler - BEĞENİ KALDIRILDI */}
          <div className="flex space-x-8 my-4">
            <div>
              <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.tweets}
              </span>
              <span className={`ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tweet</span>
            </div>
            <div>
              <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.followers}
              </span>
              <span className={`ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Takipçi</span>
            </div>
            <div>
              <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.following}
              </span>
              <span className={`ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Takip</span>
            </div>
          </div>

          {/* Biyografi ve detaylar */}
          <div className="space-y-2 mb-4">
            {!isEditing ? (
              <>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {editedBio}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  {editedLocation && (
                    <span className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      📍 {editedLocation}
                    </span>
                  )}
                  {editedWebsite && (
                    <a 
                      href={editedWebsite.startsWith('http') ? editedWebsite : `https://${editedWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-500 hover:underline"
                    >
                      🔗 {editedWebsite}
                    </a>
                  )}
                  <span className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    📅 Katılma Tarihi: {formatJoinDate(JSON.parse(localStorage.getItem(`profile_${currentUsername}`))?.joinDate || new Date())}
                  </span>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Biyografi
                  </label>
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    rows="3"
                    className={`w-full border rounded-lg p-2 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Kendin hakkında bir şeyler yaz..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Konum
                  </label>
                  <input
                    type="text"
                    value={editedLocation}
                    onChange={(e) => setEditedLocation(e.target.value)}
                    className={`w-full border rounded-lg p-2 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Şehir, Ülke"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Website
                  </label>
                  <input
                    type="text"
                    value={editedWebsite}
                    onChange={(e) => setEditedWebsite(e.target.value)}
                    className={`w-full border rounded-lg p-2 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="example.com"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tweetler/Beğeniler sekmeleri */}
        <div className="mt-6">
          <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} mb-4 flex space-x-4`}>
            <button 
              onClick={() => setActiveTab("tweets")}
              className={`px-4 py-2 font-semibold ${
                activeTab === "tweets" 
                  ? `border-b-2 border-blue-500 ${isDark ? 'text-white' : 'text-gray-900'}` 
                  : `${isDark ? 'text-gray-400' : 'text-gray-600'}`
              }`}
            >
              Tweetler ({allUserTweets.length})
            </button>
            <button 
              onClick={() => setActiveTab("likes")}
              className={`px-4 py-2 font-semibold ${
                activeTab === "likes" 
                  ? `border-b-2 border-blue-500 ${isDark ? 'text-white' : 'text-gray-900'}` 
                  : `${isDark ? 'text-gray-400' : 'text-gray-600'}`
              }`}
            >
              Beğeniler ({likedTweets.length})
            </button>
          </div>

          {/* Tweetler sekmesi */}
          {activeTab === "tweets" && (
            <div className="space-y-3">
              {allUserTweets.length === 0 ? (
                <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Henüz tweet yok. İlk tweetini at!
                </p>
              ) : (
                allUserTweets.map((tweetItem) => (
                  <div key={tweetItem.id} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow ${tweetItem.isRetweet ? 'border-l-4 border-green-500' : ''}`}>
                    
                    {/* Retweet bilgisi */}
                    {tweetItem.isRetweet && (
                      <div className="flex items-center mb-2 text-green-500 text-sm">
                        <span className="mr-2">🔄</span>
                        <span>Retweetledin</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* Kullanıcı bilgileri */}
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">{tweetItem.user?.avatar || '👤'}</span>
                          <div>
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {tweetItem.user?.fullName}{" "}
                              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
                                @{tweetItem.user?.username}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(tweetItem.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Tweet içeriği */}
                        <Link to={`/app/tweet/${tweetItem.id}`} className="hover:underline block mb-3">
                          <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{tweetItem.content}</p>
                        </Link>
                        
                        {/* Etkileşim butonları */}
                        <div className="flex space-x-6 text-gray-500">
                          <Link to={`/app/tweet/${tweetItem.id}`} className="flex items-center space-x-2 hover:text-blue-500">
                            <span>💬</span>
                            <span className="text-sm">{tweetItem.comments || 0}</span>
                          </Link>
                          
                          <button 
                            onClick={() => handleRetweet(tweetItem.id, tweetItem.retweets || 0)}
                            className={`flex items-center space-x-2 transition ${
                              retweetedTweetsState[tweetItem.id] ? 'text-green-500' : 'hover:text-green-500'
                            }`}
                          >
                            <span>🔄</span>
                            <span className="text-sm">{tweetItem.retweets || 0}</span>
                          </button>
                          
                          <button 
                            onClick={() => handleLike(tweetItem.id, tweetItem.likes || 0)}
                            className={`flex items-center space-x-2 transition ${
                              likedTweetsState[tweetItem.id] ? 'text-red-500' : 'hover:text-red-500'
                            }`}
                          >
                            <span>{likedTweetsState[tweetItem.id] ? '❤️' : '🤍'}</span>
                            <span className="text-sm">{tweetItem.likes || 0}</span>
                          </button>
                        </div>
                      </div>

                      {/* Sil butonu - Sadece kendi tweetlerinde */}
                      {tweetItem.user?.username === currentUsername && !tweetItem.isRetweet && (
                        <button
                          onClick={() => handleDeleteTweet(tweetItem.id)}
                          className="text-red-500 font-semibold hover:text-red-700 ml-4"
                          title="Tweeti Sil"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Beğeniler sekmesi */}
          {activeTab === "likes" && (
            <div className="space-y-3">
              {likedTweets.length === 0 ? (
                <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Henüz beğenilen tweet yok.
                </p>
              ) : (
                likedTweets.map((tweetItem) => (
                  <div key={tweetItem.id} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow border-l-4 border-red-500`}>
                    <div className="flex items-center mb-2 text-red-500 text-sm">
                      <span className="mr-2">❤️</span>
                      <span>Beğendin</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* Kullanıcı bilgileri */}
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">{tweetItem.user?.avatar || '👤'}</span>
                          <div>
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {tweetItem.user?.fullName}{" "}
                              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
                                @{tweetItem.user?.username}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(tweetItem.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Tweet içeriği */}
                        <Link to={`/app/tweet/${tweetItem.id}`} className="hover:underline block mb-3">
                          <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{tweetItem.content}</p>
                        </Link>
                        
                        {/* Etkileşim butonları */}
                        <div className="flex space-x-6 text-gray-500">
                          <Link to={`/app/tweet/${tweetItem.id}`} className="flex items-center space-x-2 hover:text-blue-500">
                            <span>💬</span>
                            <span className="text-sm">{tweetItem.comments || 0}</span>
                          </Link>
                          
                          <button 
                            onClick={() => handleRetweet(tweetItem.id, tweetItem.retweets || 0)}
                            className={`flex items-center space-x-2 transition ${
                              retweetedTweetsState[tweetItem.id] ? 'text-green-500' : 'hover:text-green-500'
                            }`}
                          >
                            <span>🔄</span>
                            <span className="text-sm">{tweetItem.retweets || 0}</span>
                          </button>
                          
                          <button 
                            onClick={() => handleLike(tweetItem.id, tweetItem.likes || 0)}
                            className={`flex items-center space-x-2 transition ${
                              likedTweetsState[tweetItem.id] ? 'text-red-500' : 'hover:text-red-500'
                            }`}
                          >
                            <span>{likedTweetsState[tweetItem.id] ? '❤️' : '🤍'}</span>
                            <span className="text-sm">{tweetItem.likes || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}