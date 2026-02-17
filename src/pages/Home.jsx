import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Ana container - flex ile ikiye böl */}
      <div className="flex flex-col md:flex-row h-screen">
        
        {/* SOL TARAF - Tanıtım / Görsel */}
        <div className="flex-1 bg-blue-500 text-white flex items-center justify-center p-12">
          <div className="max-w-md">
            {/* Twitter logosu veya ikonu */}
            <div className="text-6xl mb-8">🐦</div>
            
            <h1 className="text-5xl font-bold mb-6">
              Şimdi olup bitenler
            </h1>
            
            <p className="text-2xl mb-8">
              Twitter'a bugün katıl.
            </p>
            
            {/* Özellik listesi */}
            <div className="space-y-4">
              <div className="flex items-center text-xl">
                <span className="mr-4">🔍</span>
                İlgi alanlarına göre takip et
              </div>
              <div className="flex items-center text-xl">
                <span className="mr-4">💬</span>
                İnsanlarla bağlantı kur
              </div>
              <div className="flex items-center text-xl">
                <span className="mr-4">🌍</span>
                Dünyada olup biteni öğren
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ TARAF - Giriş / Kayıt */}
        <div className={`flex-1 flex items-center justify-center p-12 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="max-w-md w-full">
            
            {/* Logo ve başlık */}
            <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Twitter'a Hoş Geldin
            </h2>
            
            {/* Giriş Yap Butonu */}
            <Link
              to="/login"
              className="block w-full bg-blue-500 text-white text-center py-3 rounded-full font-semibold hover:bg-blue-600 transition mb-4"
            >
              Giriş Yap
            </Link>
            
            {/* Kayıt Ol Butonu */}
            <Link
              to="/register"
              className={`block w-full border-2 text-center py-3 rounded-full font-semibold hover:bg-gray-100 transition ${
                isDark 
                  ? 'border-gray-700 text-white hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Hesap Oluştur
            </Link>
            
            {/* Alt bilgi */}
            <p className={`text-sm text-center mt-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Kaydolarak, Hizmet Şartları'nı ve Gizlilik Politikası'nı kabul etmiş olursun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}