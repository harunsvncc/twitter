import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // ← EKLE

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const { isDark } = useTheme(); // ← EKLE

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== passwordAgain) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    const user = {
      fullName: name,
      username,
      email,
      password,
    };

    localStorage.setItem("fullName", name);
    localStorage.setItem("username", username);
    localStorage.setItem("user", JSON.stringify(user));

    alert("Kayıt başarılı 🎉");
  };

  return (
    <div className={`h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-10 rounded-2xl shadow-xl w-96`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Hesap Oluştur
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="İsim"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />

          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />

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

          <input
            type="password"
            placeholder="Şifre Tekrar"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
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
            Kayıt Ol
          </button>
        </form>

        <p className={`text-center mt-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Zaten hesabın var mı?{" "}
          <Link to="/login" className="text-blue-500 font-semibold">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}