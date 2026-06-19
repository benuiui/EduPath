import React, { useState } from "react";
import { GraduationCap, ArrowRight, Search, Sparkles, MessageSquare, ShieldCheck, Database, Calendar, HelpCircle, Activity, BookOpen, Layers } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const krsFeatures = [
    {
      icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
      title: "Chat dengan AI",
      description: "Konsultasi akademik 24/7. Tanya asisten AI kami tentang prasyarat, jadwal, hingga tips belajar efektif.",
      linkText: "Mulai Konsultasi",
      onClick: onLogin
    },
    {
      icon: <Sparkles className="w-5 h-5 text-white" />,
      title: "Akses Mudah",
      description: "Masuk atau daftar sekarang untuk menyimpan progres perencanaan dan sinkronisasi data SIAKAD Anda secara instan.",
      isDarkBlue: true,
      onClick: onLogin
    },
    {
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      title: "Recommendation Engine",
      description: "Algoritma cerdas kami menganalisis ribuan data mata kuliah untuk menyarankan jalur studi yang paling efisien.",
      linkText: "Lihat Cara Kerja",
      onClick: onGetStarted
    }
  ];

  const previewCourses = [
    { code: "IF2240", name: "Basis Data Lanjut", sks: 4, type: "WAJIB" },
    { code: "IF3150", name: "Kecerdasan Buatan", sks: 3, type: "PILIHAN" },
    { code: "IF2110", name: "Struktur Data", sks: 4, type: "WAJIB" },
    { code: "IF4021", name: "Keamanan Informasi", sks: 3, type: "PILIHAN" }
  ];

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#131b2e] selection:bg-blue-100 font-sans">
      
      {/* HEADER / NAVIGATION */}
      <nav id="landing-navbar" className="bg-white border-b border-[#e2e7ff] sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-sora text-xl font-bold text-blue-900 tracking-tight">EduPath KRS</span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <a href="#beranda" className="text-blue-600 hover:text-blue-800">Beranda</a>
            <a href="#fitur" className="text-[#434653] hover:text-blue-600 transition-colors">Fitur</a>
            <a href="#katalog" className="text-[#434653] hover:text-blue-600 transition-colors">Katalog</a>
          </div>

          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari info akademik..." 
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button 
              id="btn-login-header"
              onClick={onLogin} 
              className="px-4 py-2 font-semibold text-blue-700 hover:text-blue-900 transition-colors text-sm"
            >
              Masuk
            </button>
            <button 
              id="btn-register-header"
              onClick={onLogin} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-sm"
            >
              Daftar
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="beranda" className="px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#eaedff] text-blue-800 rounded-full text-xs font-semibold tracking-wide border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Platform Perencanaan Akademik Cerdas
            </div>

            <h1 className="font-sora text-4xl md:text-5xl lg:text-[48px] font-extrabold leading-[1.1] tracking-tight text-[#131b2e]">
              Optimalkan Masa Studi Anda dengan <span className="text-blue-600">EduPath KRS</span>
            </h1>

            <p className="text-[#434653] text-[16px] md:text-[18px] leading-[1.6] max-w-2xl">
              EduPath KRS adalah asisten akademik cerdas yang membantu mahasiswa memetakan rencana studi, mengelola prasyarat mata kuliah, dan memastikan kelulusan tepat waktu melalui rekomendasi berbasis AI yang dipersonalisasi.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button 
                id="btn-start-hero"
                onClick={onGetStarted}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-sora font-semibold rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                Mulai Perencanaan
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                id="btn-demo-hero"
                onClick={onGetStarted}
                className="h-12 px-8 border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-sora font-semibold rounded-lg text-sm transition-all flex items-center justify-center gap-2"
              >
                Lihat Demo
              </button>
            </div>

            {/* TRUST BADGE */}
            <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" alt="avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100&h=100" alt="avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" alt="avatar" />
                <div className="w-8 h-8 rounded-full bg-blue-900 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white uppercase font-sora">
                  15k+
                </div>
              </div>
              <p className="text-sm text-gray-600">
                <strong className="font-semibold text-blue-900">15.000+ Mahasiswa</strong> telah mempercayakan rencana studinya kepada kami.
              </p>
            </div>
          </div>

          {/* RIGHT GRAPHIC PANEL */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="space-y-0.5">
                  <h4 className="font-sora font-bold text-lg text-blue-900">Target Kelulusan</h4>
                  <p className="text-xs text-gray-400 font-mono">SEMESTER 6 / 8</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded-full border border-blue-100">
                  Semester 8
                </span>
              </div>

              {/* SKS PROGRESS */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">SKS Ditempuh</span>
                  <span className="text-blue-900 font-bold font-sora text-xl">70%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full w-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: "70%" }} />
                </div>
                <p className="text-xs text-gray-600 font-mono">102 dari 144 SKS</p>
              </div>

              {/* GPA & OPTIMIZER */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-500 font-medium block mb-1">IPK Saat Ini</span>
                  <span className="font-sora text-2xl font-bold text-blue-900">3.82</span>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <span className="text-xs text-blue-600 font-semibold block mb-1">Proyeksi IPK</span>
                  <span className="font-sora text-2xl font-bold text-blue-700">3.85</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURE SECTION */}
      <section id="fitur" className="bg-white border-y border-[#e2e7ff] py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-sora text-3xl font-extrabold tracking-tight text-[#131b2e]">
              Fitur Unggulan Kami
            </h2>
            <p className="text-gray-500">
              Solusi cerdas untuk setiap tantangan akademik yang Anda hadapi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {krsFeatures.map((feat, index) => (
              <div 
                key={index} 
                className={`p-6 md:p-8 rounded-xl border transition-all ${
                  feat.isDarkBlue 
                    ? "bg-blue-600 text-white border-blue-700 shadow-xl" 
                    : "bg-[#faf8ff] text-[#131b2e] border-[#e2e7ff] hover:shadow-lg"
                }`}
              >
                <div className={`p-3 rounded-lg inline-block mb-6 ${feat.isDarkBlue ? "bg-white/10" : "bg-blue-50"}`}>
                  {feat.icon}
                </div>
                
                <h3 className={`font-sora text-lg font-bold mb-3 ${feat.isDarkBlue ? "text-white" : "text-blue-900"}`}>
                  {feat.title}
                </h3>
                
                <p className={`text-sm leading-relaxed mb-6 ${feat.isDarkBlue ? "text-blue-100" : "text-gray-500"}`}>
                  {feat.description}
                </p>

                {feat.isDarkBlue ? (
                  <div className="flex gap-2">
                    <button id={`btn-feat-signin-${index}`} onClick={feat.onClick} className="px-4 py-2 bg-white text-blue-600 hover:bg-neutral-50 font-semibold rounded text-sm transition-all">
                      Sign In
                    </button>
                    <button id={`btn-feat-signup-${index}`} onClick={feat.onClick} className="px-4 py-2 border border-white/40 hover:bg-white/10 text-white font-semibold rounded text-sm transition-all">
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <button 
                    id={`btn-feat-link-${index}`}
                    onClick={feat.onClick}
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-all cursor-pointer"
                  >
                    {feat.linkText}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PETA PRASYARAT VISUAL & SIAKAD INTEGRATION */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-16">
        
        {/* INTERACTIVE STUDY GRAPH PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl border border-gray-200 p-6 md:p-10">
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-sora text-2xl font-bold text-blue-900">Peta Prasyarat Visual</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Pahami hubungan antar mata kuliah dengan visualisasi graph yang memudahkan Anda melihat mata kuliah pengunci semester depan.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg font-bold text-xs tracking-wide">
                STRUKTUR DATA
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="px-4 py-2.5 bg-blue-50 border border-blue-100 text-blue-800 rounded-lg font-bold text-xs tracking-wide">
                ALGORITMA LANJUT
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-6 flex justify-center">
            {/* Visual simulation */}
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-100/50 w-full max-w-md relative">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded shadow-sm border border-gray-100 text-center space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold">IF2210</div>
                  <div className="text-[11px] font-bold text-blue-900 truncate">Strukdat</div>
                </div>
                <div className="flex items-center justify-center text-blue-600">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div className="p-3 bg-blue-600 text-white rounded shadow-sm text-center space-y-1">
                  <div className="text-[10px] text-blue-200 font-bold">IF3110</div>
                  <div className="text-[11px] font-bold truncate">Web Dev</div>
                </div>
                <div className="p-3 bg-white rounded shadow-sm border border-gray-100 text-center space-y-1 col-span-1 mt-2">
                  <div className="text-[10px] text-gray-400 font-bold font-mono">GP: 3.82</div>
                </div>
                <div className="p-2 col-span-2 text-xs text-gray-500 flex items-center">
                  Unlock semester berikutnya secara otomatis.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIAKAD SYSTEM CONGESTION */}
        <div className="bg-blue-600 text-white rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-blue-600 to-blue-900 opacity-60 z-0" />
          
          <div className="lg:col-span-8 space-y-4 relative z-10">
            <div className="p-2.5 bg-white/10 rounded-lg inline-block">
              <Database className="w-6 h-6 text-blue-200" />
            </div>
            <h3 className="font-sora text-3xl font-extrabold">Integrasi SIAKAD</h3>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-2xl">
              Hubungkan data akademik Anda secara aman. EduPath mengambil transkrip dan jadwal secara real-time untuk akurasi rekomendasi 99.9%.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end relative z-10">
            <button 
              id="btn-siakad-landing"
              onClick={onLogin}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-blue-700 font-sora font-semibold rounded-lg text-sm transition-all shadow-md cursor-pointer"
            >
              Hubungkan Sekarang
            </button>
          </div>
        </div>

      </section>

      {/* CATALOG PREVIEW */}
      <section id="katalog" className="bg-gray-50 border-t border-gray-200/80 py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-sora text-3xl font-extrabold text-[#131b2e]">
                Katalog Mata Kuliah
              </h2>
              <p className="text-gray-500 text-sm">
                Eksplorasi mata kuliah pilihan dan wajib dengan detail lengkap.
              </p>
            </div>
            <button 
              id="btn-explore-landing"
              onClick={onLogin}
              className="inline-flex items-center gap-2 px-4 py-2 border border-blue-200 bg-white text-blue-700 font-bold rounded-lg text-sm hover:bg-blue-50 transition-all"
            >
              Eksplorasi Semua
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewCourses.map((c, index) => (
              <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 bg-card hover:shadow-md transition-all space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs text-blue-600 font-bold font-mono bg-blue-50 px-2 py-0.5 rounded">
                    {c.code}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold px-2 py-0.5 bg-gray-100 rounded">
                    {c.type}
                  </span>
                </div>
                <h4 className="font-sora font-bold text-[#131b2e] group-hover:text-blue-600 transition-colors">
                  {c.name}
                </h4>
                <div className="pt-2 border-t border-gray-50 text-xs text-gray-600 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                    {c.sks} SKS
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CALL TO ACTION ACCENT */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-blue-900 text-white rounded-3xl p-10 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[#00327d] opacity-90" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold leading-[1.3]">
              Siap Meraih Prestasi Akademik Tertinggi?
            </h2>
            <p className="text-blue-100 max-w-lg mx-auto text-sm md:text-base">
              Gabung sekarang dan biarkan AI kami membantu Anda menyusun rencana masa depan yang lebih terukur dan pasti.
            </p>
            <div className="pt-4">
              <button 
                id="btn-register-cta"
                onClick={onLogin}
                className="px-8 py-4 bg-white text-blue-950 font-sora font-semibold rounded-lg text-sm hover:bg-neutral-50 transition-all shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
              >
                Daftar Gratis Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-200/80 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-gray-200">
          
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-sora text-lg font-bold text-blue-900 tracking-tight">EduPath KRS</span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm">
              Platform cerdas untuk membantu mahasiswa menavigasi kurikulum akademik dengan percaya diri dan efisiensi tinggi.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h5 className="font-sora text-xs font-bold text-blue-900 uppercase tracking-widest">Sumber Daya</h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><button onClick={onLogin} className="hover:text-blue-600">Panduan Akademik</button></li>
              <li><button onClick={onLogin} className="hover:text-blue-600">Katalog Mata Kuliah</button></li>
              <li><button onClick={onLogin} className="hover:text-blue-600">Peta Prasyarat</button></li>
              <li><button onClick={onLogin} className="hover:text-blue-600">FAQ</button></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h5 className="font-sora text-xs font-bold text-blue-900 uppercase tracking-widest">Legal</h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><button onClick={onLogin} className="hover:text-blue-600">Kebijakan Privasi</button></li>
              <li><button onClick={onLogin} className="hover:text-blue-600">Syarat & Ketentuan</button></li>
              <li><button onClick={onLogin} className="hover:text-blue-600">Kontak Registrar</button></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 UNIVERSITY ACADEMIC PORTAL • EDUPATH KRS V2.4.1</p>
          <p>Secured by Academic Trust</p>
        </div>
      </footer>

    </div>
  );
}
