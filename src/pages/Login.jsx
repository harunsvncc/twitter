import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // ← EKLE

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isDark } = useTheme(); // ← EKLE

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("Kullanıcı bulunamadı!");
      return;
    }

    if (email === storedUser.email && password === storedUser.password) {
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("fullName", storedUser.fullName);
      localStorage.setItem("username", storedUser.username);
      localStorage.setItem("email", storedUser.email);
      
      navigate("/app");
    } else {
      alert("Hatalı email veya şifre!");
    }
  };

  return (
    <div className={`h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-10 rounded-2xl shadow-xl w-96`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Giriş Yap
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition"
          >
            Giriş Yap
          </button>
        </form>

        <p className={`text-center mt-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Hesabın yok mu?{" "}
          <Link to="/register" className="text-blue-500 font-semibold">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}