import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../store/hooks";
import { useLanguage } from "../store/hooks";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Şifre kontrolü
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor!");
      return;
    }

    // Mevcut kullanıcıları al
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // E-posta kontrolü
    if (users.some(u => u.email === email)) {
      setError("Bu e-posta zaten kayıtlı!");
      return;
    }

    // Kullanıcı adı kontrolü
    if (users.some(u => u.username === username)) {
      setError("Bu kullanıcı adı zaten alınmış!");
      return;
    }

    // Yeni kullanıcı
    const newUser = {
      id: Date.now(),
      fullName,
      username,
      email,
      password
    };

    // Kullanıcıyı kaydet
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Başarılı mesajı
    alert("Kayıt başarılı! Giriş yapabilirsiniz.");
    navigate("/login");
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-lg w-96`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Kayıt Ol
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Ad Soyad
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full border rounded-lg p-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full border rounded-lg p-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-lg p-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-lg p-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Şifre Tekrar
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border rounded-lg p-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Kayıt Ol
          </button>
        </form>

        <p className={`text-center mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Zaten hesabın var mı?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}