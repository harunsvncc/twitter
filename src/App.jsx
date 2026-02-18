import { Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Provider store={store}>
      <Routes>
        {/* Herkes erişebilir */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Sadece giriş yapanlar erişebilir */}
        <Route
          path="/haber/:id"
          element={
            <ProtectedRoute>
              <NewsDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Provider>
  );
}