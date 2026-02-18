import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (category) => {
    try {
      const response = await fetch(`https://api.collectapi.com/news/getNews?country=tr&tag=${category}`, {
        headers: {
          'content-type': 'application/json',
          'authorization': import.meta.env.VITE_COLLECTAPI_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error('API hatası');
      }
      
      const data = await response.json();
      console.log("API'den gelen ham veri:", data); 
      
      if (data.success && data.result) {
        // API'den gelen veriyi doğrudan kullan (işleme yapma)
        // Sadece eksik alanları tamamla
        const processedNews = data.result.map(item => ({
          // API'den gelen orijinal alanları koru
          ...item,
          // Eksik alanlar için varsayılan değerler
          title: item.title,
          description: item.description || '',
          content: item.content || '',
          source: item.source || 'Haber Kaynağı',
          url: item.url || '#',
          image: item.image || `https://picsum.photos/seed/${Math.random()}/400/200`,
          date: item.date || new Date().toISOString(),
        }));
        
        console.log("İşlenmiş haberler:", processedNews); 
        return processedNews;
      }
      
      return [];
    } catch (error) {
      console.error("Haber çekme hatası:", error);
      throw error;
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedCategory: 'general'
  },
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearNews: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.error.message;
      });
  }
});

export const { setCategory, clearNews } = newsSlice.actions;
export default newsSlice.reducer;