import { createSlice } from '@reduxjs/toolkit';

const loadUserFromStorage = () => {
  const isAuth = localStorage.getItem('isAuth') === 'true';
  const user = JSON.parse(localStorage.getItem('user')) || null;
  
  console.log("Auth yüklendi:", { isAuth, user }); // Kontrol için
  
  return {
    isAuthenticated: isAuth,
    user: user
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadUserFromStorage(),
  reducers: {
    login: (state, action) => {
      console.log("Login reducer çalıştı", action.payload);
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      console.log("Logout reducer çalıştı");
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('isAuth');
      localStorage.removeItem('user');
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;