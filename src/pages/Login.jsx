import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useTheme } from "../store/hooks";
import { useLanguage } from "../store/hooks";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Kayıtlı kullanıcıları kontrol et
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Giriş başarılı
      dispatch(login({
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email
      }));
      navigate("/");
    } else {
      setError("E-posta veya şifre hatalı!");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-lg w-96`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Giriş Yap
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Giriş Yap
          </button>
        </form>

        <p className={`text-center mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Hesabın yok mu?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}