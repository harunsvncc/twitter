import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function TweetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [tweet, setTweet] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [retweeted, setRetweeted] = useState(false);
  const [retweetCount, setRetweetCount] = useState(0);
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const currentUsername = localStorage.getItem("username") || "kullanici";

  useEffect(() => {
    const savedTweets = JSON.parse(localStorage.getItem("tweets")) || [];
    const foundTweet = savedTweets.find((t) => t.id === Number(id));
    setTweet(foundTweet);
    
    if (foundTweet) {
      setLikeCount(foundTweet.likes || 0);
      setRetweetCount(foundTweet.retweets || 0);
    }

    const savedComments = JSON.parse(localStorage.getItem(`comments_${id}`)) || [];
    setComments(savedComments);

    // YENİ: Kullanıcının bu tweet'i beğenip beğenmediğini ve retweetleyip retweetlemediğini kontrol et
    const likedTweets = JSON.parse(localStorage.getItem(`likes_${currentUsername}`)) || {};
    const retweetedTweets = JSON.parse(localStorage.getItem(`retweets_${currentUsername}`)) || {};
    
    setLiked(!!likedTweets[Number(id)]);
    setRetweeted(!!retweetedTweets[Number(id)]);
  }, [id, currentUsername]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    
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

  // YENİ: Beğeni işlemi - GÜNCELLENDİ
  const handleLike = () => {
    const newLikedState = !liked;
    const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
    
    // State'leri güncelle
    setLiked(newLikedState);
    setLikeCount(newLikeCount);
    
    // Tweet'in like sayısını güncelle
    const savedTweets = JSON.parse(localStorage.getItem("tweets")) || [];
    const updatedTweets = savedTweets.map(t => {
      if (t.id === Number(id)) {
        return { ...t, likes: newLikeCount };
      }
      return t;
    });
    localStorage.setItem("tweets", JSON.stringify(updatedTweets));
    
    // Kullanıcının beğeni durumunu kaydet
    const likedTweets = JSON.parse(localStorage.getItem(`likes_${currentUsername}`)) || {};
    if (newLikedState) {
      likedTweets[Number(id)] = true;
    } else {
      delete likedTweets[Number(id)];
    }
    localStorage.setItem(`likes_${currentUsername}`, JSON.stringify(likedTweets));
  };

  // YENİ: Retweet işlemi - GÜNCELLENDİ
  const handleRetweet = () => {
    const newRetweetedState = !retweeted;
    const newRetweetCount = newRetweetedState ? retweetCount + 1 : retweetCount - 1;
    
    // State'leri güncelle
    setRetweeted(newRetweetedState);
    setRetweetCount(newRetweetCount);
    
    // Tweet'in retweet sayısını güncelle
    const savedTweets = JSON.parse(localStorage.getItem("tweets")) || [];
    const updatedTweets = savedTweets.map(t => {
      if (t.id === Number(id)) {
        return { ...t, retweets: newRetweetCount };
      }
      return t;
    });
    localStorage.setItem("tweets", JSON.stringify(updatedTweets));
    
    // Kullanıcının retweet durumunu kaydet
    const retweetedTweets = JSON.parse(localStorage.getItem(`retweets_${currentUsername}`)) || {};
    if (newRetweetedState) {
      retweetedTweets[Number(id)] = true;
    } else {
      delete retweetedTweets[Number(id)];
    }
    localStorage.setItem(`retweets_${currentUsername}`, JSON.stringify(retweetedTweets));
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const currentFullName = localStorage.getItem("fullName") || "Anonim";
    const currentUsername = localStorage.getItem("username") || "kullanici";

    const comment = {
      id: Date.now(),
      content: newComment,
      user: {
        fullName: currentFullName,
        username: currentUsername,
        avatar: "👤"
      },
      createdAt: new Date().toISOString()
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Bu yorumu silmek istediğine emin misin?")) {
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
      localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
    }
  };

  if (!tweet) {
    return (
      <div className={`h-screen flex justify-center items-start ${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-6`}>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow w-full max-w-lg text-center`}>
          <p className={isDark ? 'text-white' : 'text-gray-900'}>Tweet bulunamadı 😢</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-500 font-semibold hover:underline"
          >
            ← Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-6`}>
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow w-full max-w-2xl`}>
        
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 font-semibold mb-6 hover:underline flex items-center"
        >
          ← Geri
        </button>

        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <div className="flex items-start mb-4">
            <span className="text-4xl mr-3">{tweet.user?.avatar || '👤'}</span>
            <div className="flex-1">
              <div className="flex items-center flex-wrap">
                <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {tweet.user?.fullName || "Anonim"}
                </p>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
                  @{tweet.user?.username || "kullanici"}
                </span>
                <span className="mx-2 text-gray-500">·</span>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDate(tweet.createdAt)}
                </span>
              </div>
              
              <p className={`text-2xl mt-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {tweet.content}
              </p>
            </div>
          </div>
        </div>

        <div className={`flex space-x-8 mb-6 py-3 border-y border-gray-200 dark:border-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <div>
            <span className="font-bold text-lg">{likeCount}</span> Beğeni
          </div>
          <div>
            <span className="font-bold text-lg">{retweetCount}</span> Retweet
          </div>
          <div>
            <span className="font-bold text-lg">{comments.length}</span> Yorum
          </div>
        </div>

        <div className="flex justify-around py-3">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition">
            <span className="text-2xl">💬</span>
            <span>Yorum Yap</span>
          </button>

          <button 
            onClick={handleRetweet}
            className={`flex items-center space-x-2 transition ${
              retweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
            }`}
          >
            <span className="text-2xl">🔄</span>
            <span>{retweeted ? 'Retweetlendi' : 'Retweet'}</span>
          </button>

          <button 
            onClick={handleLike}
            className={`flex items-center space-x-2 transition ${
              liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <span className="text-2xl">{liked ? '❤️' : '🤍'}</span>
            <span>{liked ? 'Beğenildi' : 'Beğen'}</span>
          </button>
        </div>

        <div className="mt-8">
          <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Yorumlar ({comments.length})
          </h3>
          
          <div className={`flex items-start space-x-3 mb-6`}>
            <span className="text-2xl">👤</span>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Yorumunu yaz..."
                className={`w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                rows="2"
              />
              
              <button 
                onClick={handleAddComment}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
              >
                Yorum Gönder
              </button>
            </div>
          </div>
          
          <div className="space-y-4 mt-6">
            {comments.length === 0 ? (
              <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Henüz yorum yok. İlk yorumu sen yap!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{comment.user.avatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-wrap">
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {comment.user.fullName}
                          </p>
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
                            @{comment.user.username}
                          </span>
                          <span className="mx-2 text-gray-500">·</span>
                          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        
                        {comment.user.username === currentUsername && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold ml-2"
                            title="Yorumu Sil"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                      <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}