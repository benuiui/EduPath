import React, { useState } from "react";
import { GraduationCap, Mail, Lock, Eye, EyeOff, Sparkles, Award } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
  onBackToLanding: () => void;
}

export default function LoginPage({ onLoginSuccess, onBackToLanding }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState("");

  const handleQuickLogin = () => {
    onLoginSuccess("alex.rivers@univ.ac.id");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Alamat email mahasiswa wajib diisi.");
      return;
    }
    if (!password || password.length < 5) {
      setError("Kata sandi harus terdiri dari minimal 5 karakter.");
      return;
    }
    setError("");
    onLoginSuccess(email);
  };

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#131b2e] flex items-center justify-center p-4 md:p-6 font-sans">
      
      <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200/80 shadow-2xl overflow-hidden w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* LEFT COMPONENT: FORM MODULE */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={onBackToLanding}>
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-sora text-lg font-bold text-blue-900 tracking-tight">EduPath KRS</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-sora text-2xl md:text-3xl font-extrabold tracking-tight text-blue-950">
                {isRegistering ? "Daftar Akun Baru" : "Selamat Datang Kembali"}
              </h2>
              <p className="text-gray-500 text-xs md:text-sm">
                Masuk ke akun akademik Anda untuk mengelola plans dan sinkronisasi data rencana studi secara efisien.
              </p>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
                {error}
              </div>
            )}

            {/* GOOGLE LOG IN */}
            <button 
              id="btn-google-sign"
              type="button"
              onClick={handleQuickLogin}
              className="w-full h-11 px-4 border border-gray-200 bg-white hover:bg-gray-50 text-[#131b2e] font-sora font-semibold rounded text-sm transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.144-5.136 4.144-3.41 0-6.173-2.784-6.173-6.22s2.762-6.22 6.173-6.22c1.554 0 2.964.57 4.047 1.503l3.073-3.073C19.1 2.38 15.918 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.892 0 10.61-4.26 10.61-10.285 0-.585-.054-1.15-.147-1.693H12.24z"
                />
              </svg>
              Masuk dengan Google (Demo Akses)
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-100" />
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest font-mono">atau email</span>
              <div className="flex-grow border-t border-gray-100" />
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Nama Lengkap Mahasiswa</label>
                  <input
                    type="text"
                    required
                    placeholder="nama mahasiswa"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Alamat Email Mahasiswa</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="contoh@univ.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-[#f8fafc] border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-9 pr-10 bg-[#f8fafc] border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME & FORGOT PASSWORD */}
              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Ingat Saya
                </label>
                <button
                  type="button"
                  onClick={() => setError("Fitur reset kata sandi sedang dievaluasi oleh Registrar.")}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Lupa Password?
                </button>
              </div>

              {/* ACTION SUBMIT BUTTON */}
              <button
                id="btn-login-submit"
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-sm transition-all shadow-md mt-6 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isRegistering ? "Daftar Akun Baru" : "Masuk ke Dashboard"}
              </button>
            </form>

            {/* SINKRONISASI AKADEMIK INSTAN LINK */}
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-center">
              <span className="text-[11px] text-blue-800 block">
                💡 <strong>Akses Cepat Demo</strong>: Klik tombol Google Sign-In diatas untuk langsung masuk sebagai mahasiswa contoh (Alex Rivers).
              </span>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-gray-50 text-xs text-gray-500">
            {isRegistering ? (
              <p>
                Sudah memiliki akun?{" "}
                <button
                  onClick={() => setIsRegistering(false)}
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Masuk Sekarang
                </button>
              </p>
            ) : (
              <p>
                Belum memiliki akun?{" "}
                <button
                  onClick={() => setIsRegistering(true)}
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Daftar Akun Baru
                </button>
              </p>
            )}
          </div>

        </div>

        {/* RIGHT SYSTEM COMPONENT: ACCENT HERO BANNER */}
        <div className="md:col-span-5 bg-blue-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-400 via-blue-600 to-blue-900 opacity-90 z-0" />
          
          <div className="relative z-10" />

          <div className="relative z-10 space-y-6">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md inline-block">
              <Sparkles className="w-8 h-8 text-blue-200" />
            </div>

            <blockquote className="font-sora text-xl md:text-2xl font-bold italic leading-relaxed">
              "Precision in academic planning is the first step toward excellence."
            </blockquote>

            <div className="flex items-center gap-3 pt-6 border-t border-white/20">
              <div className="bg-white/10 p-2 rounded-lg">
                <Award className="w-5 h-5 text-blue-200" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-100">
                Akreditasi Unggul Institusi
              </span>
            </div>
          </div>

          <div className="relative z-10 text-[10px] text-blue-200 uppercase font-mono tracking-widest">
            © 2026 Academic Trust Portal
          </div>
        </div>

      </div>

    </div>
  );
}
