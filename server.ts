import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily to avoid immediate crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("WARN: GEMINI_API_KEY is not configured or uses default template value. Fallbacks will be active.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Master Informatics Courses
const MASTER_COURSES = [
  { code: "IF2210", name: "Struktur Data", sks: 4, category: "Wajib", description: "Penyimpanan, pengorganisasian, dan representasi data efisien di memori komputer.", prerequisite: "Pemrograman Dasar" },
  { code: "IF2240", name: "Basis Data", sks: 4, category: "Wajib", description: "Desain konseptual, normalisasi, optimasi query, transaksi ACID, dan DBMS terdistribusi.", prerequisite: "Pemrograman Dasar" },
  { code: "IF3150", name: "Kecerdasan Buatan", sks: 3, category: "Pilihan", description: "Konsep dasar agen cerdas, logika pencarian, machine learning dasar, dan representasi pengetahuan.", prerequisite: "Struktur Data" },
  { code: "IF4021", name: "Keamanan Informasi", sks: 3, category: "Pilihan", description: "Konsep kriptografi, keamanan jaringan, kontrol akses, dan audit keamanan sistem.", prerequisite: "Struktur Data" },
  { code: "CS402", name: "Pembelajaran Mesin Lanjut", sks: 4, category: "Pilihan", description: "Pilihan utama spesialisasi AI dengan fokus pada deep learning, neural network, dan computer vision.", prerequisite: "Kecerdasan Buatan" },
  { code: "CS405", name: "Arsitektur Komputasi Awan", sks: 3, category: "Pilihan", description: "Praktikum langsung AWS dan Azure untuk merancang infrastruktur modern berskala besar.", prerequisite: "Jaringan Komputer" },
  { code: "CS410", name: "Keamanan Siber", sks: 3, category: "Pilihan", description: "Prasyarat Jaringan Komputer, meliputi audit keamanan mendalam dan kriptografi terapan.", prerequisite: "Keamanan Informasi" },
  { code: "IF3110", name: "Pengembangan Aplikasi Web", sks: 3, category: "Wajib", description: "Praktik pengembangan aplikasi modern menggunakan tumpukan teknologi modern seperti React, Node, Express.", prerequisite: "Struktur Data" },
  { code: "IF3220", name: "Analisis & Desain Perangkat Lunak", sks: 3, category: "Wajib", description: "Metodologi berorientasi objek, diagram UML, design patterns, dan arsitektur perangkat lunak.", prerequisite: "Struktur Data" },
  { code: "IF4040", name: "Sistem Terdistribusi", sks: 3, category: "Wajib", description: "Konsep konsensus data, RPC, message queues, arsitektur microservices, toleransi kesalahan.", prerequisite: "Arsitektur Komputer" },
  { code: "IF4090", name: "Kriptografi Terapan", sks: 3, category: "Pilihan", description: "Algoritma enkripsi simetris/asimetris, fungsi hash, tanda tangan digital, protokol TLS.", prerequisite: "Basis Data" },
  { code: "IF4092", name: "Visi Komputer", sks: 3, category: "Pilihan", description: "Pengolahan citra digital, Convolutional Neural Networks (CNN), deteksi objek, dan segmentasi citra.", prerequisite: "Kecerdasan Buatan" },
  { code: "IF4999", name: "Skripsi / Tugas Akhir", sks: 6, category: "Wajib", description: "Penelitian mandiri atau perancangan sistem komprehensif di bawah bimbingan pembina akademik.", prerequisite: "Lulus 110 SKS" }
];

// 1. RECOMMENDATIONS ENDPOINT (With structured JSON responses from Gemini)
app.post("/api/recommendations", async (req, res) => {
  const { pathInterests, maxSks = 24, studentGpa = "3.82", studentSksEarned = "112" } = req.body;

  const currentFocus = pathInterests || "Kecerdasan Buatan";
  console.log(`Generating KRS recommendations for focus: ${currentFocus}, Max SKS: ${maxSks}`);

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant fallbacks structured precisely in the JSON format so application never breaks
    let fallbackRcourses = [];
    let fallbackGPPrognosis = "3.85";
    let rationaleText = "";

    if (currentFocus.toLowerCase().includes("kecerdasan") || currentFocus.toLowerCase().includes("ai") || currentFocus.toLowerCase().includes("machine")) {
      fallbackRcourses = [
        { code: "CS402", name: "Pembelajaran Mesin Lanjut", sks: 4, category: "Pilihan", alignment: "98%", description: "Sangat dianjurkan untuk mendalami tren Computer Vision, NLP, dan deep neural networks.", prerequisite: "Kecerdasan Buatan" },
        { code: "IF3150", name: "Kecerdasan Buatan", sks: 3, category: "Pilihan", alignment: "95%", description: "Mata kuliah fondasi wajib bagi siswa yang ingin menekuni riset agent system sains data.", prerequisite: "Struktur Data" },
        { code: "CS405", name: "Arsitektur Komputasi Awan", sks: 3, category: "Pilihan", alignment: "90%", description: "Mendukung komputasi skala besar yang diperlukan untuk training model deep learning.", prerequisite: "Jaringan Komputer" },
        { code: "IF4040", name: "Sistem Terdistribusi", sks: 3, category: "Wajib", alignment: "85%", description: "Penting untuk memahami load balancing dan pemrosesan data terdistribusi.", prerequisite: "Arsitektur Komputer" },
        { code: "IF4999", name: "Skripsi / Tugas Akhir", sks: 6, category: "Wajib", alignment: "100%", description: "Penelitian wajib berfokus pada optimasi Deep Learning / Big Data.", prerequisite: "Lulus 110 SKS" }
      ];
      fallbackGPPrognosis = "3.85";
      rationaleText = "Rencana studi ini dioptimalkan khusus untuk minat Kecerdasan Buatan (AI) / Ilmu Data. Kami menyertakan Pembelajaran Mesin Lanjut dan Kecerdasan Buatan untuk mendukung skripsi Anda, dikombinasikan dengan subjek komputasi awan guna deployment model.";
    } else if (currentFocus.toLowerCase().includes("rekayasa") || currentFocus.toLowerCase().includes("rpl") || currentFocus.toLowerCase().includes("software")) {
      fallbackRcourses = [
        { code: "IF3110", name: "Pengembangan Aplikasi Web", sks: 3, category: "Wajib", alignment: "96%", description: "Sangat relevan untuk mempertajam kompetensi rekayasa perangkat lunak modern.", prerequisite: "Struktur Data" },
        { code: "IF3220", name: "Analisis & Desain Perangkat Lunak", sks: 3, category: "Wajib", alignment: "95%", description: "Membekali Anda dengan arsitektur sistem modular dan penerapan design pattern.", prerequisite: "Struktur Data" },
        { code: "CS405", name: "Arsitektur Komputasi Awan", sks: 3, category: "Pilihan", alignment: "92%", description: "Belajar mendesain solusi SaaS, microservices, dan arsitektur serverless.", prerequisite: "Jaringan Komputer" },
        { code: "IF4040", name: "Sistem Terdistribusi", sks: 3, category: "Wajib", alignment: "90%", description: "Memahami konsistensi data, replikasi database, dan middleware.", prerequisite: "Arsitektur Komputer" },
        { code: "IF4999", name: "Skripsi / Tugas Akhir", sks: 6, category: "Wajib", alignment: "100%", description: "Penelitian inovasi pembuatan platform komprehensif skala mikro.", prerequisite: "Lulus 110 SKS" }
      ];
      fallbackGPPrognosis = "3.84";
      rationaleText = "Rencana studi ini dioptimalkan untuk Rekayasa Perangkat Lunak (Software Engineering). Kombinasi Peng. Aplikasi Web, Analisis & Desain Perangkat Lunak, serta Komputasi Awan akan membekali Anda keterampilan backend/frontend industri.";
    } else if (currentFocus.toLowerCase().includes("keamanan") || currentFocus.toLowerCase().includes("jaringan") || currentFocus.toLowerCase().includes("cyber")) {
      fallbackRcourses = [
        { code: "CS410", name: "Keamanan Siber", sks: 3, category: "Pilihan", alignment: "99%", description: "Studi kasus penetrasi sistem, audit kriptografi terapan, dan taktik defensif siber.", prerequisite: "Keamanan Informasi" },
        { code: "IF4021", name: "Keamanan Informasi", sks: 3, category: "Pilihan", alignment: "94%", description: "Mata kuliah prasyarat wajib untuk memahami dasar enkripsi dan kontrol keamanan organisasi.", prerequisite: "Struktur Data" },
        { code: "IF4090", name: "Kriptografi Terapan", sks: 3, category: "Pilihan", alignment: "92%", description: "Penelitian mendalam enkripsi modern, algoritma hash, tanda tangan digital.", prerequisite: "Basis Data" },
        { code: "IF4040", name: "Sistem Terdistribusi", sks: 3, category: "Wajib", alignment: "88%", description: "Mengamankan node komunikasi, toleransi kegagalan dan kripto terdesentralisasi.", prerequisite: "Arsitektur Komputer" },
        { code: "IF4999", name: "Skripsi / Tugas Akhir", sks: 6, category: "Wajib", alignment: "100%", description: "Fokus skripsi pada analisis celah keamanan perangkat IoT atau blockchain.", prerequisite: "Lulus 110 SKS" }
      ];
      fallbackGPPrognosis = "3.83";
      rationaleText = "Rencana studi berfokus pada Keamanan Siber & Kriptografi. Penyelarasan mata kuliah Keamanan Siber yang dipadukan dengan Kriptografi Terapan memastikan Anda memahami teknik perlindungan infrastruktur digital modern secara mendalam.";
    } else {
      // Workload Balance / General
      fallbackRcourses = [
        { code: "IF3110", name: "Pengembangan Aplikasi Web", sks: 3, category: "Wajib", alignment: "92%", description: "Tugas praktikum yang seimbang dan aplikatif secara komparatif.", prerequisite: "Struktur Data" },
        { code: "IF3150", name: "Kecerdasan Buatan", sks: 3, category: "Pilihan", alignment: "88%", description: "Mengenalkan dasar analitik cerdas tanpa beban praktikum berlebih.", prerequisite: "Struktur Data" },
        { code: "IF4021", name: "Keamanan Informasi", sks: 3, category: "Pilihan", alignment: "85%", description: "Teoretis dengan beban coding yang ramah untuk menjaga keseimbangan nilai.", prerequisite: "Struktur Data" },
        { code: "IF4999", name: "Skripsi / Tugas Akhir", sks: 6, category: "Wajib", alignment: "100%", description: "Penyelesaian wajib riset semester akhir.", prerequisite: "Lulus 110 SKS" }
      ];
      fallbackGPPrognosis = "3.86";
      rationaleText = "Rencana studi ini didesain untuk Keseimbangan Workload. Kami mengurangi mata kuliah dengan beban komputasi/praktikum sangat berat dan memilih kombinasi teori-aplikasi agar IPK Anda tetap tinggi dan lulus tepat waktu.";
    }

    // Filter SKS sum based on limit
    let finalCourses = [];
    let sum = 0;
    for (const c of fallbackRcourses) {
      if (sum + c.sks <= maxSks) {
        finalCourses.push(c);
        sum += c.sks;
      }
    }

    return res.json({
      rationale: rationaleText,
      recommendedCourses: finalCourses,
      estimatedGPAPrognosis: fallbackGPPrognosis
    });
  }

  try {
    const prompt = `Student stats:
Current GPA (IPK): ${studentGpa}/4.0
Completed SKS: ${studentSksEarned} SKS
Target graduation: Semester 8 (Current: Semester 7)
Student target preference: ${currentFocus}
Maximum SKS allowed this semester: ${maxSks}

Master Informatics Courses database:
${JSON.stringify(MASTER_COURSES)}

Task:
Generate a selection of recommended courses for Semester 7.
The courses selected MUST sum up to NO MORE THAN ${maxSks} SKS.
Always give high priority to Skripsi / Tugas Akhir (IF4999 - 6 SKS) as they are close to graduation.
Explain why each course matches their selected preference (${currentFocus}). Also compute an alignment index (e.g. 98% for extremely relevant, 75% for moderately relevant).
Provide a concise overall rationale explaining the strategy.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the ultimate smart academic advisor and curriculum planner for Informatics students. Output strict JSON with academic precision.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rationale: {
              type: Type.STRING,
              description: "Summary text explaining the planning choice strategy for the chosen interest."
            },
            recommendedCourses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING, description: "e.g. CS402" },
                  name: { type: Type.STRING, description: "Course Name in Indonesian" },
                  sks: { type: Type.INTEGER, description: "SKS weight" },
                  category: { type: Type.STRING, description: "Wajib or Pilihan" },
                  alignment: { type: Type.STRING, description: "Alignment rating like 94%" },
                  description: { type: Type.STRING, description: "Tailored description mapping to the student focus" },
                  prerequisite: { type: Type.STRING, description: "Prerequisites if any" }
                },
                required: ["code", "name", "sks", "category", "alignment", "description", "prerequisite"]
              }
            },
            estimatedGPAPrognosis: {
              type: Type.STRING,
              description: "Prognosis GPA like 3.86 based on selected courses difficulty"
            }
          },
          required: ["rationale", "recommendedCourses", "estimatedGPAPrognosis"]
        }
      }
    });

    const text = response.text || "{}";
    const resultObj = JSON.parse(text);
    return res.json(resultObj);
  } catch (err: any) {
    console.error("Gemini Recommendations Error:", err);
    return res.status(500).json({ error: "Failed to generate AI recommendations", message: err.message });
  }
});

// 2. CHAT ADVISOR ENDPOINT (Interactive counselor)
app.post("/api/chat", async (req, res) => {
  const { messages, focus } = req.body;
  const ai = getGeminiClient();

  // Create dialogue list
  const conversation = messages || [];
  const latestMessageObj = conversation[conversation.length - 1];
  const userPrompt = latestMessageObj ? latestMessageObj.content : "Halo, bisa bantu jelaskan rekomendasi KRS saya?";

  if (!ai) {
    // Elegant fallback simulation
    let fallbackReply = "Halo! Saya adalah asisten akademik cerdas dari EduPath KRS. ";
    const userPromptLower = userPrompt.toLowerCase();

    if (userPromptLower.includes("prasyarat")) {
      fallbackReply += "Di program studi Informatika, beberapa prasyarat utama adalah:\n\n1. **Pembelajaran Mesin Lanjut (CS402)** membutuhkan **Kecerdasan Buatan (IF3150)**.\n2. **Keamanan Siber (CS410)** membutuhkan **Keamanan Informasi (IF4021)**.\n3. **Analisis & Desain (IF3220)** dan **Pengembangan Web (IF3110)** keduanya mensyaratkan kelulusan **Struktur Data (IF2210)**.\n\nApakah ada mata kuliah spesifik lain yang ingin Anda periksa?";
    } else if (userPromptLower.includes("gpa") || userPromptLower.includes("ipk") || userPromptLower.includes("proyeksi")) {
      fallbackReply += "IPK Anda saat ini sangat unggul, yaitu **3.82**. Berdasarkan analisis kami, jika Anda mengambil mata kuliah berminat tinggi seperti Pembelajaran Mesin Lanjut dan menyelesaikan Skripsi dengan nilai A, proyeksi IPK Anda dapat meningkat ke **3.85**, memperkuat peluang kelulusan dengan predikat Summa Cum Laude!";
    } else if (userPromptLower.includes("skripsi") || userPromptLower.includes("tugas akhir")) {
      fallbackReply += "Mengingat Anda telah menempuh **112 SKS**, Anda berhak mengambil **Skripsi / Tugas Akhir (IF4999 - 6 SKS)** di semester 7 ini. Rekomendasi terbaik adalah menyelaraskan topik skripsi Anda dengan preferensi minat. Contohnya, jika Anda memilih fokus **Kecerdasan Buatan**, Anda bisa meriset tentang 'Optimasi Deep Learning pada IoT'.";
    } else {
      fallbackReply += `Senang sekali membantu Anda merencanakan studi semester 7 untuk bidang **${focus || "Khas Informatika"}**. Apakah Anda ingin membandingkan beban SKS, mendiskusikan topik skripsi, atau mencari rekomendasi mata kuliah pilihan teroptimal?`;
    }

    return res.json({
      role: "assistant",
      content: fallbackReply
    });
  }

  try {
    const formattedHistory = conversation.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }]
    }));

    // Inject system instruction in initialization
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: `Anda adalah EduPath KRS, asisten penasihat akademik cerdas tulus dari Universitas Sains Komputer.
Siswa yang sedang berkonsultasi adalah:
- Nama: Alex Rivers
- Program Studi: Informatika - Tahun 3 (Semester 6 menuju Semester 7)
- Nilai & Progres: IPK Kumulatif 3.82, SKS Berjalan/Selesai 112 dari 144 SKS.
- Target Lulus: Tepat waktu di Semester 8.
- Fokus Minat: ${focus || "Informatika Umum / AI / Rekayasa Perangkat Lunak"}.

Gaya Komunikasi: profesional, membimbing, ilmiah namun ramah, inspiratif. Gunakan bahasa Indonesia yang baik, terstruktur dengan Bullet points jika menjelaskan prasyarat atau perbandingan. Dorong ia menyelesaikan Tugas Akhir dengan tulus.`
      }
    });

    return res.json({
      role: "assistant",
      content: response.text || "Saya siap membantu Anda menyusun rencana KRS."
    });
  } catch (err: any) {
    console.error("Gemini Chat Error:", err);
    return res.status(500).json({ error: "Failed to communicate with AI Advisor", message: err.message });
  }
});

// Serve Master Database
app.get("/api/courses", (req, res) => {
  res.json(MASTER_COURSES);
});

// Vite Setup for Development vs Production
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[DEV] Fullstack server running on http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PROD] Fullstack server running on http://localhost:${PORT}`);
  });
}
