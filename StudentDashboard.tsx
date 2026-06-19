import React, { useState, useEffect, useRef } from "react";
import { 
  GraduationCap, LayoutDashboard, Compass, BookOpen, User, 
  HelpCircle, MessageSquare, Send, Sparkles, Plus, Trash2, 
  Download, Calendar, AlertCircle, TrendingUp, Search, Filter, 
  ChevronRight, LogOut, FileText, CheckCircle2, ShieldAlert
} from "lucide-react";
import { Message, RecommendedCourse, StudentProfile, KrsPlan } from "../types";

interface StudentDashboardProps {
  onLogout: () => void;
  studentEmail: string;
}

export default function StudentDashboard({ onLogout, studentEmail }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "pemetaan" | "katalog" | "profil" | "bantuan">("dashboard");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Student Context State
  const [student, setStudent] = useState<StudentProfile>({
    name: "Alex Rivers",
    major: "Teknik Informatika",
    year: "Tahun 3",
    currentGpa: 3.82,
    completedSks: 112,
    totalSksRequired: 144,
    semesterBerjalan: 7,
    semesterTotal: 8
  });

  const [activeKrsPlan, setActiveKrsPlan] = useState<KrsPlan>({
    id: "plan_sem_7",
    name: "Rencana Studi Semester 7",
    status: "Draf",
    lastUpdated: "Hari ini, 10:45",
    sks: 0,
    courses: [],
    focusMinat: "Kecerdasan Buatan"
  });

  // Recommendation Parameters
  const [selectedFocus, setSelectedFocus] = useState("Kecerdasan Buatan");
  const [maxSksLimit, setMaxSksLimit] = useState(24);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<{
    rationale: string;
    recommendedCourses: RecommendedCourse[];
    estimatedGPAPrognosis: string;
  } | null>(null);

  // Master Courses Directory
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogFilter, setCatalogFilter] = useState<"Semua" | "Wajib" | "Pilihan">("Semua");
  const [masterCourses, setMasterCourses] = useState<RecommendedCourse[]>([
    { code: "IF2210", name: "Struktur Data", sks: 4, category: "Wajib", alignment: "90%", description: "Penyimpanan dan representasi data efisien di memori komputer.", prerequisite: "Pemrograman Dasar" },
    { code: "IF2240", name: "Basis Data", sks: 4, category: "Wajib", alignment: "88%", description: "Desain konseptual, normalisasi, optimasi query, dan DBMS terdistribusi.", prerequisite: "Pemrograman Dasar" },
    { code: "IF3110", name: "Pengembangan Aplikasi Web", sks: 3, category: "Wajib", alignment: "92%", description: "Pengembangan aplikasi modern menggunakan React, Node, dan Express.", prerequisite: "Struktur Data" },
    { code: "IF3220", name: "Analisis & Desain Perangkat Lunak", sks: 3, category: "Wajib", alignment: "90%", description: "Metodologi OOM, diagram UML, design patterns, dan software architecture.", prerequisite: "Struktur Data" },
    { code: "IF3150", name: "Kecerdasan Buatan", sks: 3, category: "Pilihan", alignment: "96%", description: "Konsep dasar agen cerdas, logika pencarian, dan machine learning dasar.", prerequisite: "Struktur Data" },
    { code: "IF4021", name: "Keamanan Informasi", sks: 3, category: "Pilihan", alignment: "94%", description: "Enkripsi, keamanan komunikasi data, kontrol akses, dan audit sistem.", prerequisite: "Struktur Data" },
    { code: "CS402", name: "Pembelajaran Mesin Lanjut", sks: 4, category: "Pilihan", alignment: "98%", description: "Optimasi model Deep Learning, jaringan saraf tiruan, dan visual komputer lanjutan.", prerequisite: "Kecerdasan Buatan" },
    { code: "CS405", name: "Arsitektur Komputasi Awan", sks: 3, category: "Pilihan", alignment: "90%", description: "Integrasi cloud computing AWS dan Azure untuk deployment microservices skala besar.", prerequisite: "Jaringan Komputer" },
    { code: "CS410", name: "Keamanan Siber", sks: 3, category: "Pilihan", alignment: "95%", description: "Penetration testing komprehensif, investigasi forensik, keamanan malware.", prerequisite: "Keamanan Informasi" },
    { code: "IF4040", name: "Sistem Terdistribusi", sks: 3, category: "Wajib", alignment: "84%", description: "Konsensus data, arsitektur RPC, microservices modular, toleransi kesalahan.", prerequisite: "Arsitektur Komputer" },
    { code: "IF4090", name: "Kriptografi Terapan", sks: 3, category: "Pilihan", alignment: "91%", description: "Matematika kripto terapan, enkripsi modern, sertifikat TLS, dan blockchain dasar.", prerequisite: "Basis Data" },
    { code: "IF4092", name: "Visi Komputer", sks: 3, category: "Pilihan", alignment: "93%", description: "Convolutional Neural Networks (CNN), segmentasi citra, klasifikasi multi-label.", prerequisite: "Kecerdasan Buatan" },
    { code: "IF4999", name: "Skripsi / Tugas Akhir", sks: 6, category: "Wajib", alignment: "100%", description: "Riset mandiri formal tingkat akhir di bawah bimbingan dosen pembina.", prerequisite: "Lulus 110 SKS" }
  ]);

  // Chat Advisor State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Halo Alex! Saya adalah asisten penasihat akademik cerdas EduPath KRS Anda. Ada yang bisa saya bantu terkait penyusunan mata kuliah Semester 7 Anda? Kita bisa mendiskusikan kaitan antara matkul, prasyarat, maupun penyesuaian dengan topik tugas akhir.",
      timestamp: "Baru saja"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatOpen]);

  // Handle generating AI recommendations
  const generateAiRecommendations = async () => {
    setIsGeneratingRecs(true);
    setRecommendationResult(null);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathInterests: selectedFocus,
          maxSks: maxSksLimit,
          studentGpa: student.currentGpa.toString(),
          studentSksEarned: student.completedSks.toString()
        })
      });

      if (!response.ok) throw new Error("HTTP error " + response.status);
      const data = await response.json();
      setRecommendationResult(data);
    } catch (e) {
      console.error(e);
      // Failover fallback in state
      setRecommendationResult({
        rationale: "Rencana studi ini dioptimalkan berdasarkan minat dan beban SKS yang diharapkan dengan fallback dinamis.",
        recommendedCourses: masterCourses.filter(c => c.sks <= maxSksLimit).slice(0, 4),
        estimatedGPAPrognosis: "3.84"
      });
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  // Add recommendations directly to KRS plan
  const applyRecommendationsToPlan = (courses: RecommendedCourse[]) => {
    const totalSks = courses.reduce((sum, c) => sum + c.sks, 0);
    setActiveKrsPlan({
      ...activeKrsPlan,
      courses: [...courses],
      sks: totalSks,
      focusMinat: selectedFocus,
      lastUpdated: "Hari ini, baru saja diperbarui AI"
    });
    alert(`💡 Berhasil menerapkan ${courses.length} mata kuliah rekomendasi ke draf KRS Semester 7 Anda! (Total: ${totalSks} SKS)`);
  };

  // Add manual course to plan
  const addCourseToPlan = (course: RecommendedCourse) => {
    if (activeKrsPlan.courses.some(c => c.code === course.code)) {
      alert("⚠️ Mata kuliah ini sudah terdaftar dalam draf KRS Anda.");
      return;
    }
    if (activeKrsPlan.sks + course.sks > 24) {
      alert("❌ Melebihi batas maksimal SKS (maks 24 SKS berdasarkan IPK Anda 3.82).");
      return;
    }

    const updatedCourses = [...activeKrsPlan.courses, course];
    setActiveKrsPlan({
      ...activeKrsPlan,
      courses: updatedCourses,
      sks: activeKrsPlan.sks + course.sks,
      lastUpdated: "Hari ini, baru saja"
    });
  };

  // Remove course from plan
  const removeCourseFromPlan = (code: string, sks: number) => {
    const updatedCourses = activeKrsPlan.courses.filter(c => c.code !== code);
    setActiveKrsPlan({
      ...activeKrsPlan,
      courses: updatedCourses,
      sks: activeKrsPlan.sks - sks,
      lastUpdated: "Hari ini, baru saja"
    });
  };

  // Chat message submit
  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: "Baru saja"
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          focus: activeKrsPlan.focusMinat
        })
      });

      if (!response.ok) throw new Error("HTTP error " + response.status);
      const data = await response.json();

      setMessages(prev => [...prev, {
        id: Date.now().toString() + "_reply",
        role: "assistant",
        content: data.content,
        timestamp: "Baru saja"
      }]);
    } catch (e) {
      console.error(e);
      // Fallback response
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "_reply",
        role: "assistant",
        content: "Maaf, koneksi saya sempat terinterupsi. Namun, jika Anda bertanya mengenai prasyarat: Skripsi (IF4999) mengharuskan Anda lulus minimal 110 SKS, dan Pembelajaran Mesin Lanjut memerlukan pemahaman dasar Aljabar Linier dan Kecerdasan Buatan.",
        timestamp: "Baru saja"
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Export Plan Function
  const exportKrsToCSV = () => {
    if (activeKrsPlan.courses.length === 0) {
      alert("⚠️ Draf KRS Anda masih kosong. Tambahkan mata kuliah terlebih dahulu.");
      return;
    }
    const headers = ["Kode", "Mata Kuliah", "SKS", "Kategori", "Ket. Prasyarat"];
    const rows = activeKrsPlan.courses.map(c => [
      c.code,
      c.name,
      c.sks.toString(),
      c.category,
      c.prerequisite || "-"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EDUPATH_KRS_PLAN_SEM7_${student.name.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter catalog
  const filteredCatalog = masterCourses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (catalogFilter === "Semua") return matchesSearch;
    return matchesSearch && c.category === catalogFilter;
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen text-[#1e293b] flex flex-col md:flex-row relative font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-r border-[#e2e8f0] flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#f1f5f9] flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sora text-sm font-bold text-blue-950 block leading-tight">EduPath KRS</span>
              <span className="text-[10px] text-gray-400 font-mono font-bold tracking-wider">ACADEMIC BOARD</span>
            </div>
          </div>

          {/* Student mini-card */}
          <div className="p-4 mx-3 my-4 bg-blue-50/50 border border-blue-100/50 rounded-xl space-y-2">
            <div className="flex items-center gap-3">
              <img 
                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" 
                referrerPolicy="no-referrer"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" 
                alt="Alex Rivers" 
              />
              <div className="min-w-0">
                <h5 className="font-sora font-bold text-xs text-blue-950 truncate">{student.name}</h5>
                <p className="text-[10px] text-gray-500 font-medium truncate">{student.major}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-blue-100/30 grid grid-cols-2 gap-1 text-[10px] font-semibold text-gray-500">
              <div>GPA: <span className="text-blue-700 font-bold">{student.currentGpa}</span></div>
              <div>SKS: <span className="text-blue-750 font-bold">{student.completedSks}</span></div>
            </div>
          </div>

          {/* Menu navigation */}
          <nav className="px-3 space-y-1">
            <button 
              id="sidebar-btn-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "dashboard" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                  : "text-gray-600 hover:bg-[#f8fafc] hover:text-blue-600"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dasbor
            </button>

            <button 
              id="sidebar-btn-pemetaan"
              onClick={() => setActiveTab("pemetaan")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "pemetaan" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                  : "text-gray-600 hover:bg-[#f8fafc] hover:text-blue-600"
              }`}
            >
              <Compass className="w-4 h-4" />
              Pemetaan KRS (AI)
            </button>

            <button 
              id="sidebar-btn-katalog"
              onClick={() => setActiveTab("katalog")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "katalog" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                  : "text-gray-600 hover:bg-[#f8fafc] hover:text-blue-600"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Katalog Matkul
            </button>

            <button 
              id="sidebar-btn-profil"
              onClick={() => setActiveTab("profil")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "profil" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                  : "text-gray-600 hover:bg-[#f8fafc] hover:text-blue-600"
              }`}
            >
              <User className="w-4 h-4" />
              Profil Transkrip
            </button>

            <button 
              id="sidebar-btn-bantuan"
              onClick={() => setActiveTab("bantuan")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "bantuan" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                  : "text-gray-600 hover:bg-[#f8fafc] hover:text-blue-600"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Bantuan FAQ
            </button>
          </nav>
        </div>

        {/* LOGOUT SECURE */}
        <div className="p-4 border-t border-[#f1f5f9]">
          <button 
            id="sidebar-btn-logout"
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* MAIN MAIN CONTENT CONTAINER */}
      <main className="flex-grow p-6 md:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto">
        
        {/* TOP STATUS HEADER WITH TOTAL ACTIVE KRS SKS COUNTER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#e2e8f0]">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block font-mono">SEMESTER GENAP 2026</span>
            <h1 className="font-sora text-xl md:text-2xl font-extrabold text-blue-950">
              Selamat Datang Kembali, {student.name}!
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              id="btn-toggle-chatbot-floating"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 animate-bounce" />
              Konsultasi AI Advisor
            </button>

            <button 
              id="btn-export-krs-top"
              onClick={exportKrsToCSV}
              className="px-4 py-2 border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Ekspor Draft CSV
            </button>
          </div>
        </header>

        {/* ACTIVE DRAFT TRACKING STATS */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 rounded-2xl border border-gray-200/80">
          
          <div className="md:col-span-8 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 font-mono">
                <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                DRAF KRS SEMENTARA — WAITING REGISTRAR APPROVAL
              </div>
              <h3 className="font-sora text-lg font-bold text-blue-950">{activeKrsPlan.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
                Ini adalah visualisasi draf mata kuliah Anda. Batasan IPK Anda mengizinkan maksimal <strong>24 SKS</strong>. Anda berkewajiban mengambil Skripsi (IF4999) karena SKS terkumpul Anda telah melampaui batas minimum pendaftaran.
              </p>
            </div>

            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold block mb-1">TERENCANA SKS</span>
                <span className="font-sora text-xl font-extrabold text-blue-900">{activeKrsPlan.sks} / 24</span>
              </div>
              
              <div className="bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold block mb-1">FOKUS AKADEMIK</span>
                <span className="font-sora text-[11px] font-extrabold text-indigo-750 truncate block mt-1.5">{activeKrsPlan.focusMinat}</span>
              </div>

              <div className="bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold block mb-1">PROGRES KELULUSAN</span>
                <span className="font-sora text-xl font-extrabold text-emerald-600">{Math.round((student.completedSks / student.totalSksRequired) * 100)}%</span>
              </div>

              <div className="bg-[#f8fafc] p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold block mb-1">STATUS PLAN</span>
                <span className="px-2 py-0.5 bg-yellow-50 text-yellow-850 font-bold text-[10px] rounded border border-yellow-200 mt-1 inline-block">
                  {activeKrsPlan.status}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6 space-y-4">
            <h4 className="font-sora font-semibold text-xs text-blue-950 uppercase tracking-widest">Mata Kuliah Draf:</h4>
            
            {activeKrsPlan.courses.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400">
                Belum ada mata kuliah terdaftar. Gunakan Pemetaan KRS atau Katalog untuk menambahkan.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeKrsPlan.courses.map((c) => (
                  <div key={c.code} className="flex justify-between items-center bg-[#f8fafc] p-2.5 rounded-lg border border-gray-100 text-xs">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-blue-950 truncate">{c.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{c.code} • {c.sks} SKS</div>
                    </div>
                    <button 
                      id={`btn-remove-course-${c.code}`}
                      onClick={() => removeCourseFromPlan(c.code, c.sks)}
                      className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>

        {/* DYNAMIC TABS AREA */}

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Academic Calendar & Milestones */}
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200/80 space-y-6">
                <div>
                  <h3 className="font-sora text-sm font-bold text-blue-950 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Agenda & Timeline Akademik Semester 7
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Siklus pengisian KRS hingga kuliah perdana Universitas.</p>
                </div>

                <div className="relative border-l-2 border-blue-100 pl-6 space-y-6">
                  
                  {/* Item 1 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 bg-emerald-600 rounded-full border-4 border-white shadow" />
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-blue-950 font-bold">Mulai Pengisian KRS</span>
                      <span className="text-gray-400 font-mono">18 Juni - 30 Juni 2026</span>
                    </div>
                    <p className="text-xs text-gray-500">Mahasiswa Informatika wajib merencanakan mata kuliah pendaftaran di portal EduPath.</p>
                  </div>

                  {/* Item 2 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 bg-blue-650 rounded-full border-4 border-white shadow animate-pulse" />
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-blue-900 font-bold">Asistensi Konsultasi & AI Validation</span>
                      <span className="text-blue-600 font-mono">Sekarang Berjalan</span>
                    </div>
                    <p className="text-xs text-gray-500">Mendiskusikan keselarasan matkul pilihan dengan AI Advisor.</p>
                  </div>

                  {/* Item 3 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 bg-gray-300 rounded-full border-4 border-white shadow" />
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-600 font-medium">Batas Verifikasi Dosbing</span>
                      <span className="text-gray-400 font-mono">03 Juli 2026</span>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 bg-gray-300 rounded-full border-4 border-white shadow" />
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-600 font-medium font-sora">Kuliah Perdana</span>
                      <span className="text-gray-400 font-mono">15 Juli 2026</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Key Alerts / Prerequisites Warning */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200/80 space-y-4">
                <h4 className="font-sora text-sm font-bold text-blue-950 uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Prasyarat Penting
                </h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-1.5 text-xs">
                    <div className="font-bold text-red-950 flex items-center gap-1.5">
                      Pembelajaran Mesin Lanjut (CS402)
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">
                      Memerlukan kelulusan minimal nilai B+ pada matkul **Kecerdasan Buatan (IF3150)**. Silakan verifikasi di tab Profil.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1.5 text-xs">
                    <div className="font-bold text-blue-950 flex items-center gap-1.5">
                      Skripsi / Tugas Akhir (IF4999)
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">
                      SKS Lulus terkumpul (Minimum 110 SKS). Anda saat ini memiliki **112 SKS** (Memenuhi kriteria pendaftaran).
                    </p>
                  </div>
                </div>

                <button 
                  id="btn-shortcut-getrecs"
                  onClick={() => setActiveTab("pemetaan")}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Gunakan Optimasi AI KRS
                </button>
              </div>

            </div>

            {/* QUICK STATS IN BRIEF */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 space-y-2">
                <span className="text-xs font-bold text-gray-400">JUMLAH MATKUL SELESAI</span>
                <div className="font-sora text-2xl font-bold text-blue-950">28 Mata Kuliah</div>
                <p className="text-[11px] text-[#2563eb]">Lulus Evaluasi Kurikulum</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 space-y-2">
                <span className="text-xs font-bold text-gray-400">RATA-RATA NILAI HURUF</span>
                <div className="font-sora text-2xl font-bold text-blue-950">A / A- Dominan</div>
                <p className="text-[11px] text-emerald-600">Predikat Pujian (Cum Laude)</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 space-y-2">
                <span className="text-xs font-bold text-gray-400">DOSEN PEMBIMBING AKADEMIK</span>
                <div className="font-sora text-xs font-bold text-blue-950 mt-2">Dr. Ir. Hermawan Kartajaya, M.T.</div>
                <p className="text-[11px] text-gray-600 font-mono">NIP. 19740523199901</p>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PEMETAAN KRS (AI GENERATION ENGINE) */}
        {activeTab === "pemetaan" && (
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 space-y-6">
              <div>
                <h3 className="font-sora text-lg font-bold text-blue-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  AI Recommendation & Cursor Planner Engine
                </h3>
                <p className="text-xs text-gray-500 mt-1">Sesuaikan preferensi konsentrasi minat Anda untuk melahirkan kurikulum semester yang harmonis.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Interest Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Konsentrasi Minat Studi</label>
                  <select 
                    id="select-path-focus"
                    value={selectedFocus}
                    onChange={(e) => setSelectedFocus(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Kecerdasan Buatan">Kecerdasan Buatan (Data Science & Intelligent Agents)</option>
                    <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak (Full-stack Engineering & SaaS Architecture)</option>
                    <option value="Keamanan Siber & Jaringan">Keamanan Siber & Jaringan (Penetration Testing, Encryptions, Cloud Security)</option>
                    <option value="Keseimbangan Workload">Keseimbangan Workload (Beban Studi Ramah IPK Proyeksi Maksimum)</option>
                  </select>
                </div>

                {/* SKS slider */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">SKS Maksimal Diambil Semester Ini: <span className="text-blue-700 font-bold">{maxSksLimit} SKS</span></label>
                  <input 
                    type="range"
                    min="12"
                    max="24"
                    step="1"
                    value={maxSksLimit}
                    onChange={(e) => setMaxSksLimit(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600 my-3"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>MIN: 12 SKS</span>
                    <span>STANDAR: 20 SKS</span>
                    <span>MAKS: 24 SKS</span>
                  </div>
                </div>

              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-end">
                <button 
                  id="btn-trigger-ai-planner"
                  onClick={generateAiRecommendations}
                  disabled={isGeneratingRecs}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-sora font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {isGeneratingRecs ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Merespons Parameter Kurikulum...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Dapatkan Rekomendasi Teroptimal
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RENDER RECOMMENDATION RESULT */}
            {isGeneratingRecs && (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-4 animate-pulse">
                <div className="h-4 bg-gray-105 rounded w-1/3 mx-auto" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto" />
              </div>
            )}

            {recommendationResult && (
              <div className="space-y-6">
                
                {/* Strategy Summary Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  <div className="lg:col-span-8 space-y-3">
                    <h4 className="font-sora font-bold text-blue-950 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                      Rasionalisasi Rencana AI - {selectedFocus}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed border-l-2 border-indigo-400 pl-4 py-1 bg-indigo-50/20 rounded-r-lg">
                      {recommendationResult.rationale}
                    </p>
                  </div>

                  <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-center items-center text-center space-y-2 bg-[#f8fafc] rounded-xl p-4">
                    <span className="text-[10px] text-gray-400 font-bold uppercase font-mono tracking-widest">
                      PROYEKSI IPK SEMESTER 7
                    </span>
                    <div className="font-sora text-3xl font-extrabold text-blue-900">
                      {recommendationResult.estimatedGPAPrognosis}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Peluang Cum-Laude Meningkat
                    </span>
                  </div>

                </div>

                {/* Course Grid output */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="font-sora font-semibold text-xs text-blue-950 uppercase tracking-widest">Mata Kuliah Rekomendasi AI:</h4>
                    <button 
                      id="btn-apply-all-recs"
                      onClick={() => applyRecommendationsToPlan(recommendationResult.recommendedCourses)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-750 border border-indigo-100 hover:bg-indigo-100 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Terapkan Semua ke Draf KRS
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendationResult.recommendedCourses.map((c, index) => (
                      <div key={index} className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[10px] text-blue-700 font-bold font-mono bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100/50">
                              {c.code}
                            </span>
                            <span className="text-[10px] text-indigo-700 font-extrabold bg-[#f5f3ff] px-2.5 py-0.5 rounded-full border border-indigo-100">
                              Kecocokan {c.alignment}
                            </span>
                          </div>

                          <h5 className="font-sora font-semibold text-sm text-blue-950">
                            {c.name}
                          </h5>

                          <p className="text-xs text-gray-500 leading-relaxed">
                            {c.description}
                          </p>

                          <div className="pt-2 text-[10px] text-gray-400 font-medium">
                            {c.prerequisite ? `Prasyarat: ${c.prerequisite}` : "Prasyarat: Tidak ada"}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-bold uppercase font-mono">
                            {c.sks} SKS • {c.category}
                          </span>

                          <button 
                            id={`btn-add-rec-${c.code}`}
                            onClick={() => addCourseToPlan({
                              code: c.code,
                              name: c.name,
                              sks: c.sks,
                              category: c.category as "Wajib" | "Pilihan",
                              description: c.description,
                              prerequisite: c.prerequisite || "None",
                              alignment: c.alignment
                            })}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Pilih
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 3: COMPLETE COURSE CATALOG */}
        {activeTab === "katalog" && (
          <div className="space-y-6">
            
            {/* Search and Filters */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Cari berdasarkan kode atau nama matkul..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="w-4 h-4 text-gray-400" />
                <div className="flex bg-gray-100 p-1 rounded-lg text-xs">
                  {(["Semua", "Wajib", "Pilihan"] as const).map((filterVal) => (
                    <button 
                      key={filterVal}
                      id={`btn-filter-${filterVal.toLowerCase()}`}
                      onClick={() => setCatalogFilter(filterVal)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        catalogFilter === filterVal ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {filterVal}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Catalog Grid output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((c) => {
                const isAlreadySelected = activeKrsPlan.courses.some(pc => pc.code === c.code);

                return (
                  <div key={c.code} className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] text-blue-700 font-bold font-mono bg-blue-50 px-2 py-0.5 rounded">
                          {c.code}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase font-mono px-2 py-0.5 bg-gray-100 rounded">
                          {c.category}
                        </span>
                      </div>

                      <h4 className="font-sora font-semibold text-sm text-blue-950">
                        {c.name}
                      </h4>

                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                        {c.description}
                      </p>

                      <div className="text-[10px] text-gray-400">
                        Prasyarat: <strong className="text-gray-600 font-semibold">{c.prerequisite || "None"}</strong>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-bold font-mono">
                        {c.sks} SKS
                      </span>

                      {isAlreadySelected ? (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-150">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Terpilih
                        </span>
                      ) : (
                        <button 
                          id={`btn-catalog-add-${c.code}`}
                          onClick={() => addCourseToPlan(c)}
                          className="px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 rounded-lg text-xs font-bold transition-all"
                        >
                          + Tambah
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredCatalog.length === 0 && (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-xs text-gray-400 space-y-2">
                Tidak ada mata kuliah yang cocok dengan kata pencarian Anda.
              </div>
            )}

          </div>
        )}

        {/* TAB 4: STUDENT PROFILE & SIMULATION TRANSCRIPT */}
        {activeTab === "profil" && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left detail card */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200/80 text-center space-y-4">
                <div className="relative inline-block mx-auto">
                  <img 
                    className="w-24 h-24 rounded-full border-4 border-blue-100 object-cover shadow" 
                    referrerPolicy="no-referrer"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150" 
                    alt="Alex Rivers" 
                  />
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-sora text-sm font-bold text-blue-950">Alex Rivers</h3>
                  <p className="text-xs text-gray-500 font-mono">NIM. 101230004561 • ANGKATAN 2023</p>
                  <p className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                    Fakultas Ilmu Komputer
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 text-xs text-left space-y-3 text-gray-600">
                  <div>Alamat Email: <span className="font-bold text-blue-950 block">{studentEmail || "alex.rivers@univ.ac.id"}</span></div>
                  <div>IPK Kumulatif: <span className="font-bold text-blue-950 block">3.82 / 4.00</span></div>
                  <div>Total SKS Selesai: <span className="font-bold text-blue-950 block">112 SKS (Wajib Lulus: 144 SKS)</span></div>
                  <div>Dosen Pembimbing: <span className="font-bold text-blue-950 block">Dr. Ir. Hermawan Kartajaya, M.T.</span></div>
                </div>

              </div>

              {/* Simulation Transcript */}
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200/80 space-y-6">
                <div>
                  <h3 className="font-sora text-sm font-bold text-blue-950 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Ringkasan Hasil Studi Transkrip (Mata Kuliah Utama)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Guna memverifikasi pemenuhan prasyarat otomatis sebelum pengisian SKS baru.</p>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {[
                    { code: "IF1101", name: "Pemrograman Dasar", sks: 4, grade: "A" },
                    { code: "IF1202", name: "Aljabar Linier & Matriks", sks: 3, grade: "A-" },
                    { code: "IF2110", name: "Struktur Data & Implementasi", sks: 4, grade: "A" },
                    { code: "IF2204", name: "Matematika Diskrit", sks: 3, grade: "B+" },
                    { code: "IF2240", name: "Desain Sistem Basis Data", sks: 4, grade: "A" },
                    { code: "IF3110", name: "Pengembangan Aplikasi Web", sks: 3, grade: "A" },
                    { code: "IF3130", name: "Jaringan Komputer Utama", sks: 3, grade: "B" },
                    { code: "IF3250", name: "Kecerdasan Buatan Dasar", sks: 3, grade: "A-" },
                    { code: "IF3220", name: "Analisis Desain Perangkat Lunak", sks: 3, grade: "A" }
                  ].map((sub, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 text-xs rounded-lg border border-gray-100">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] text-gray-400 font-mono font-bold">{sub.code}</span>
                        <div className="font-bold text-blue-950 truncate">{sub.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{sub.sks} SKS</div>
                      </div>
                      <div className="px-3 py-1 bg-white border border-gray-200 text-blue-900 font-extrabold rounded-lg font-mono text-center min-w-[32px]">
                        {sub.grade}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 5: BANTUAN & TUTORIAL SERVICE */}
        {activeTab === "bantuan" && (
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 space-y-6">
              <div>
                <h3 className="font-sora text-sm font-bold text-blue-950 uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Pusat Bantuan EduPath KRS & FAQ
                </h3>
                <p className="text-xs text-gray-500 mt-1">Panduan praktis pengisian studi dan kriteria kelulusan program.</p>
              </div>

              <div className="space-y-4">
                
                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <h4 className="font-sora font-semibold text-xs text-blue-950">1. Bagaimana AI merekomendasikan mata kuliah untuk saya?</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Sistem rekomendasi EduPath KRS menganalisis data historis transkrip, mengidentifikasi prasyarat mata kuliah yang belum terpenuhi, dan menyelaraskan dengan target minat yang Anda pilih (AI, RPL, dll.) untuk menyeimbangkan SKS agar tidak melebihi kapasitas maksimum IPK Anda.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <h4 className="font-sora font-semibold text-xs text-blue-950">2. Berapa batas SKS maksimum yang boleh saya ambil?</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Berdasarkan peraturan akademik Universitas, batasan SKS ditentukan oleh IP Semester sebelumnya. Karena IPK Anda saat ini sangat prima (3.82), Anda berhak mengambil beban akademik maksimal sebesar **24 SKS**.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <h4 className="font-sora font-semibold text-xs text-blue-950">3. Apakah KRS yang saya rekomendasikan AI otomatis disetujui?</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Tidak otomatis. Rekomendasi di EduPath berstatus draf internal. Mahasiswa tetap berkewajiban melakukan pengajuan draf akhir ini agar disetujui secara formal oleh Dosen Pembimbing Akademik (Dosbing) Anda.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* CHAT CHAT MESSENGER ADVISOR FLOATING/INNER MODULE */}
      {isChatOpen && (
        <div 
          id="chatbot-drawer"
          className="fixed bottom-0 right-0 md:right-6 md:bottom-6 w-full md:w-96 bg-white border border-[#e2e8f0] md:rounded-2xl shadow-2xl z-55 flex flex-col max-h-[500px]"
        >
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white md:rounded-t-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-blue-200" />
              </div>
              <div>
                <h5 className="font-sora font-bold text-xs">AI Academic Advisor</h5>
                <p className="text-[9px] text-blue-100 font-mono tracking-wide">EDUPATH CHATBOT (ACTIVE)</p>
              </div>
            </div>
            
            <button 
              id="btn-close-chatbot-drawer"
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-blue-100 font-bold text-sm h-6 w-6 bg-white/10 rounded-full flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Messages layout */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-[#f8fafc]">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                    m.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white border border-[#e1e2ec] text-[#2c2d33] rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-xl rounded-tl-none text-xs text-gray-400">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    Menganalisis prasyarat...
                  </div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Preset Buttons helper */}
          <div className="p-2 border-t border-[#f1f5f9] bg-white flex flex-wrap gap-1">
            <button 
              id="chat-btn-prasyarat"
              onClick={() => {
                setChatInput("Bagaimana dengan prasyarat matkul Keamanan Siber?");
              }}
              className="px-2 py-1 bg-gray-50 border border-gray-200 text-gray-500 rounded text-[9px] font-bold hover:bg-gray-100 transition-colors"
            >
              Cek Prasyarat Siber
            </button>
            <button 
              id="chat-btn-skripsi"
              onClick={() => {
                setChatInput("Apakah saya sudah berhak berkonsultasi untuk Skripsi / Tugas Akhir?");
              }}
              className="px-2 py-1 bg-gray-50 border border-gray-200 text-gray-500 rounded text-[9px] font-bold hover:bg-gray-100 transition-colors"
            >
              Tentang Skripsi
            </button>
          </div>

          {/* Form input */}
          <form onSubmit={sendChatMessage} className="p-3 border-t border-[#f1f5f9] bg-white flex gap-2">
            <input 
              id="chatbot-input"
              type="text" 
              placeholder="Ketik pertanyaan akademik..." 
              className="flex-grow px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button 
              id="chatbot-btn-submit"
              type="submit" 
              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
