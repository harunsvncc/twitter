// Rastgele kullanıcı havuzu
export const users = [
  { 
    fullName: "Ahmet Yılmaz", 
    username: "ahmet_dev", 
    avatar: "👨‍💻", 
    job: "Frontend Developer",
    followers: 1234
  },
  { 
    fullName: "Ayşe Demir", 
    username: "ayse_design", 
    avatar: "👩‍🎨", 
    job: "UI/UX Designer",
    followers: 2345
  },
  { 
    fullName: "Mehmet Kaya", 
    username: "mehmet_tech", 
    avatar: "👨‍🔧", 
    job: "Backend Developer",
    followers: 3456
  },
  { 
    fullName: "Zeynep Şahin", 
    username: "zeynep_js", 
    avatar: "👩‍💻", 
    job: "Full Stack Developer",
    followers: 4567
  },
  { 
    fullName: "Can Öztürk", 
    username: "can_codes", 
    avatar: "👨‍🚀", 
    job: "Mobile Developer",
    followers: 5678
  },
  { 
    fullName: "Elif Yıldız", 
    username: "elif_ai", 
    avatar: "👩‍🔬", 
    job: "AI Engineer",
    followers: 6789
  },
  { 
    fullName: "Burak Aydın", 
    username: "burak_ux", 
    avatar: "👨‍🎨", 
    job: "UX Researcher",
    followers: 7890
  },
  { 
    fullName: "Seda Arslan", 
    username: "seda_dev", 
    avatar: "👩‍🏫", 
    job: "DevOps Engineer",
    followers: 8901
  },
  { 
    fullName: "Emre Koç", 
    username: "emre_python", 
    avatar: "🐍", 
    job: "Data Scientist",
    followers: 9012
  },
  { 
    fullName: "Gizem Aydın", 
    username: "gizem_cloud", 
    avatar: "☁️", 
    job: "Cloud Architect",
    followers: 10123
  }
];

// Rastgele tweet içerikleri
const tweetContents = [
  "React 19 ile server componentler çok güzel olmuş! 🚀",
  "Tailwind CSS v4 beta çıktı, yeni özellikler harika",
  "JavaScript'te Promise yapısını anlamak artık çok kolay",
  "Bugün yeni bir projeye başladım, çok heyecanlıyım! 💪",
  "TypeScript öğrenmeye başladım, çok faydalı",
  "Açık kaynak projelere katkıda bulunmak isteyen var mı?",
  "Yeni bir kurs bitirdim, sertifikamı aldım 🎓",
  "Hafta sonu hackathon var, katılacak olan?",
  "Next.js 14 ile app router çok pratik",
  "CSS Grid öğrenmek isteyenlere kaynak önerisi",
  "Bugün 5 yıllık bir bug'ı çözdüm, mutluluk 😊",
  "Yeni bir framework öğrenmeye başladım",
  "İş görüşmesinde sorulan ilginç bir soru",
  "Geliştiriciler için ücretsiz kaynaklar",
  "Kariyer yolculuğumda 3. yıl doldu! 🎉",
  "Bugün hava çok güzel, herkese iyi günler ☀️",
  "Kahve molası ☕",
  "Yeni bir blog yazısı yazdım, okumak ister misiniz?",
  "Stack Overflow'da birine yardım ettim, çok mutluyum",
  "Gece 3'te kod yazmanın verimliliği bambaşka 🌙"
];

// Rastgele tarih üret (son 7 gün içinde)
const generateRandomDate = () => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const randomDaysAgo = Math.floor(Math.random() * 7); // 0-7 gün önce
  const randomHoursAgo = Math.floor(Math.random() * 24); // 0-24 saat önce
  const date = now - (randomDaysAgo * oneDay) - (randomHoursAgo * 60 * 60 * 1000);
  
  return new Date(date).toISOString();
};

// Rastgele beğeni sayısı
const generateRandomLikes = () => Math.floor(Math.random() * 1500) + 50;

// Rastgele retweet sayısı
const generateRandomRetweets = () => Math.floor(Math.random() * 300) + 10;

// Tweet üretme fonksiyonu
export const generateMockTweets = (count = 15) => {
  const tweets = [];
  
  for (let i = 0; i < count; i++) {
    // Rastgele kullanıcı seç
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    // Rastgele içerik seç
    const randomContent = tweetContents[Math.floor(Math.random() * tweetContents.length)];
    
    // Rastgele tarih
    const createdAt = generateRandomDate();
    
    // Rastgele beğeni ve retweet
    const likes = generateRandomLikes();
    const retweets = generateRandomRetweets();
    
    tweets.push({
      id: Date.now() - i * 1000000 + Math.floor(Math.random() * 10000),
      content: randomContent,
      user: randomUser,
      likes: likes,
      retweets: retweets,
      createdAt: createdAt,
      isMock: true,
      comments: Math.floor(Math.random() * 50)
    });
  }
  
  // Tarihe göre sırala (yeniden eskiye)
  return tweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Belirli bir kullanıcının tweetlerini getir
export const getUserTweets = (username, count = 5) => {
  const allTweets = generateMockTweets(30);
  return allTweets
    .filter(tweet => tweet.user.username === username)
    .slice(0, count);
};

