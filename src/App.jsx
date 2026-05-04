import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- RESPONSIVE TYPEWRITER (STRICT 3-LINE STACK) ---
const Typewriter = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2500);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 30 : 80);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="border-r-2 md:border-r-4 border-[#f28d7d] pr-1 whitespace-pre-line break-words text-black">
      {texts[index].substring(0, subIndex)}
    </span>
  );
};

function App() {
  const [showForm, setShowForm] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '', phone: '', address: '',
    program: 'Montessori', grade: 'LKG'
  });

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 60; 
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const col = formData.program === 'Montessori' ? "school_inquiries" : "tuition_inquiries";
    try {
      await addDoc(collection(db, col), { ...formData, submittedAt: serverTimestamp() });
      alert("Inquiry Sent Successfully!");
      setShowForm(false);
    } catch (err) { alert("Error connecting to Database."); }
    setIsSubmitting(false);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] py-6 px-4 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-[20px] md:rounded-[30px] shadow-2xl overflow-hidden border">
          <div className="bg-[#143611] p-4 md:p-6 text-white flex justify-between items-center">
            <h2 className="text-sm md:text-lg font-black uppercase">Admission Inquiry</h2>
            <button onClick={() => setShowForm(false)} className="text-[10px] border px-3 py-1 rounded font-bold">CLOSE</button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
             <input type="text" placeholder="STUDENT NAME" required className="w-full p-4 border rounded-xl font-bold text-sm" onChange={(e) => setFormData({...formData, studentName: e.target.value})} />
             <input type="tel" placeholder="PARENT PHONE NUMBER" required className="w-full p-4 border rounded-xl font-bold text-sm" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
             <button type="submit" disabled={isSubmitting} className="w-full bg-[#f28d7d] text-white py-4 rounded-xl font-black uppercase shadow-lg transition-all hover:bg-[#e07b6b]">
               {isSubmitting ? "Sending..." : "Submit Inquiry"}
             </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        html { scroll-behavior: smooth; }

        /* LAPTOP STYLE (LOCKED) */
        .hero-banner {
            width: 100vw;
            height: 85vh;
            background-image: url('/flex.png') !important; 
            background-size: cover !important;
            background-position: center !important;
            display: flex;
            align-items: center;
            position: relative;
        }

        /* MOBILE FIX: Center children and move text to top empty space */
        @media (max-width: 768px) {
            .hero-banner {
                height: 70vh; /* Taller hero to show more of the children */
                background-position: center !important; /* BRINGS ALL 3 CHILDREN TO THE MIDDLE */
                align-items: flex-start !important; /* MOVES TEXT TO THE TOP "SKY" AREA */
                padding-top: 40px;
            }
        }

        .hero-banner::before {
            content: "";
            position: absolute;
            inset: 0;
            /* Lighter gradient so children stay visible */
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 40%);
        }

        .welcome-bubble {
            display: inline-block;
            background-color: #56a890;
            color: white;
            padding: 10px 25px;
            border-radius: 60px;
            font-weight: 950;
            box-shadow: 0 12px 24px rgba(86, 168, 144, 0.25);
        }

        @media (min-width: 1024px) { 
            .welcome-bubble { 
                padding: 18px 60px;
                word-spacing: 0.24in !important; 
            } 
        }

        /* CONTINUOUS RED TICKER */
        @keyframes scrollTicker {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        .ticker-wrapper {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            margin: 0 15px;
        }
        .ticker-content {
            display: inline-block;
            animation: scrollTicker 25s linear infinite;
            color: #d00000;
            font-weight: 800;
        }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* 1. TOP INFO BAR */}
      <div className="bg-[#FFD56B] text-[#143611] py-1.5 md:py-2 px-4 flex items-center justify-between text-[8px] md:text-[11px] font-black uppercase shadow-inner border-b border-[#e6c060]">
        <div className="flex items-center gap-1.5 shrink-0 z-10 font-bold">
          <span className="text-[10px] md:text-[14px]">📍</span>
          <span className="hidden xs:inline">laggere , bengaluru</span>
          <span className="xs:hidden">Laggere</span>
        </div>

        <div className="ticker-wrapper">
          <div className="ticker-content font-sans tracking-tight md:tracking-normal uppercase">
            <span className="mx-8">kalpavruksha , Early learning centre admission open for acadamic year 2026-27</span>
            <span className="mx-20 text-gray-400 opacity-30">●</span>
            <span className="mx-8">kalpavruksha , Early learning centre admission open for acadamic year 2026-27</span>
          </div>
        </div>

        <a href="https://wa.me/919902962379" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 shrink-0 z-10 font-bold">
          <span className="text-[10px] md:text-[14px]">📞</span>
          <span className="hidden xs:inline">+91 99029 62379</span>
          <span className="xs:hidden">CHAT</span>
        </a>
      </div>

      {/* 2. HEADER */}
      <header className="sticky top-0 w-full z-[100] bg-white/95 backdrop-blur-md shadow-sm border-b">
        <nav className="flex justify-between items-center px-2 md:px-8 py-0.5">
          <div className="flex items-center gap-1 md:gap-2 cursor-pointer mr-2 md:mr-8" onClick={() => scrollTo('home')}>
            <img src="/logo.png" alt="Logo" className="h-[30px] md:h-[76px] w-auto object-contain" />
            <div className="text-left">
              <span className="text-[10px] md:text-[15px] font-black text-[#56a890] block uppercase leading-none">KALPAVRUKSHA</span>
              <span className="text-[4px] md:text-[8px] text-gray-400 font-bold uppercase block mt-0.5">Early Learning Centre</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-10 overflow-x-auto py-2 no-scrollbar">
            {['Home', 'About', 'Programs', 'Gallery'].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className={`text-[8px] md:text-[12px] font-black uppercase whitespace-nowrap px-1 ${activeSection === item.toLowerCase() ? 'text-[#f28d7d]' : 'text-gray-500'}`}>
                {item}
              </button>
            ))}
            <button onClick={() => setShowForm(true)} className="bg-[#f28d7d] text-white px-2.5 py-1 md:px-7 md:py-2.5 rounded-full font-black text-[8px] md:text-[11px] uppercase shadow-md">Enroll</button>
          </div>
        </nav>
      </header>

      {/* 3. HERO SECTION (CENTERED CHILDREN) */}
      <section id="home" className="hero-banner relative">
        {/* Text stays at the top where it's empty to avoid faces */}
        <div className="px-6 md:ml-8 max-w-[95%] md:max-w-[700px] z-10 text-left">
          <h1 className="text-[20px] md:text-[54px] font-[1000] leading-[1.2] md:leading-[1.05] uppercase mb-2 md:mb-4 min-h-[4em] md:min-h-[3.2em]">
            <Typewriter texts={["WHERE EVERY CHILD\nGROWS WITH\nWONDER."]} />
          </h1>
          <p className="text-[9px] md:text-lg font-bold text-[#444] italic">Premium Montessori & Expert Tutoring.</p>
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section id="about" className="py-12 md:py-24 px-6 text-center">
        <div className="mb-6 md:mb-8">
            <h2 className="welcome-bubble text-xs md:text-5xl uppercase tracking-tighter">Welcome to Kalpavruksha</h2>
        </div>
        <p className="text-[10px] md:text-2xl font-bold text-[#b58d67] uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 md:mb-10">Early learning centre</p>
        <div className="max-w-4xl mx-auto text-[10px] md:text-xl font-bold text-gray-500 leading-relaxed px-4">
          Helping children learn to do it themselves and discover the joy of growing.
        </div>
      </section>

      {/* ... Remaining sections (Programs, Gallery, Tuition, Footer) ... */}
      <section id="programs" className="bg-[#f28d7d] py-12 md:py-24 px-6 text-white text-center">
        <h2 className="text-xl md:text-4xl font-black uppercase mb-8 md:mb-12 tracking-widest">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
          {['Daycare', 'LKG', 'UKG'].map((title) => (
            <div key={title} className="bg-white p-6 md:p-10 rounded-[25px] md:rounded-[40px] shadow-xl flex flex-col items-center">
              <h3 className="text-xl md:text-3xl font-black uppercase text-[#56a890] mb-1">{title}</h3>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase text-center leading-tight">Comprehensive early development</p>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="bg-[#f0fdf4] py-12 md:py-24 px-4">
        <h2 className="text-xl md:text-4xl font-black text-[#143611] text-center mb-8 uppercase tracking-tighter">Our Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 max-w-7xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full aspect-square bg-white rounded-[15px] md:rounded-[30px] overflow-hidden shadow-md border-2 md:border-4 border-white transition-transform active:scale-95">
              <img src="/flex.png" alt="Gallery" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section id="tuition" className="bg-[#143611] py-12 px-6 text-white text-center md:rounded-[60px] md:mx-4 mb-10 md:mb-20 shadow-2xl">
        <h2 className="text-xl md:text-5xl font-black uppercase mb-1">Tuition Centre</h2>
        <p className="text-[#90d2be] font-bold text-[9px] md:text-lg uppercase tracking-widest mb-6 italic">1st to 10th Standard</p>
        <button onClick={() => setShowForm(true)} className="bg-[#f28d7d] text-white px-8 py-3 rounded-full font-black uppercase text-[10px] md:text-xs shadow-xl active:scale-95 transition-transform">Enroll Now</button>
      </section>

      <footer className="bg-[#143611] py-8 md:py-10 text-center text-gray-500 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em]">
        © 2026 Kalpavruksha Montessori School.
      </footer>
    </div>
  );
}

export default App;