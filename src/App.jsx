import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppHome from "./pages/AppHome";
import TweetDetail from "./pages/TweetDetail";
import Profile from "./pages/Profile"; // ← YENİ
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />

          {/* Protected */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/app/tweet/:id"
            element={
              <ProtectedRoute>
                <TweetDetail />
              </ProtectedRoute>
            }
          />

          {/* YENİ: Profil sayfası */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </LanguageProvider>
    </ThemeProvider>
  );
}