import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- RESPONSIVE TYPEWRITER ---
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
    }, reverse ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="border-r-4 border-[#f28d7d] pr-1 break-words text-black">
      {texts[index].substring(0, subIndex)}
    </span>
  );
};

function App() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '', parentName: '', phone: '', address: '',
    program: 'Montessori', grade: 'LKG', board: 'State Board'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const col = formData.program === 'Montessori' ? "school_inquiries" : "tuition_inquiries";
    try {
      await addDoc(collection(db, col), { ...formData, submittedAt: serverTimestamp() });
      alert("Success! We will contact you soon.");
      setShowForm(false);
    } catch (err) { alert("Error connecting to Firebase."); }
    setIsSubmitting(false);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] py-6 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-[30px] shadow-2xl overflow-hidden border">
          <div className="bg-[#143611] p-6 text-white flex justify-between items-center">
            <h2 className="text-lg font-black uppercase">Admission</h2>
            <button onClick={() => setShowForm(false)} className="text-[10px] border px-2 py-1 rounded">CLOSE</button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
             <input type="text" placeholder="STUDENT NAME" required className="w-full p-3 border rounded-xl font-bold text-sm" onChange={(e) => setFormData({...formData, studentName: e.target.value})} />
             <input type="tel" placeholder="PHONE" required className="w-full p-3 border rounded-xl font-bold text-sm" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
             <button type="submit" disabled={isSubmitting} className="w-full bg-[#f28d7d] text-white py-4 rounded-xl font-black uppercase shadow-lg">
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
        .hero-banner {
            width: 100vw;
            height: 75vh;
            background-image: url('/web.png') !important;
            background-size: cover !important;
            background-position: 70% center !important;
            display: flex;
            align-items: center;
        }
        .hero-banner::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(to right, rgba(212, 241, 229, 0.98) 0%, rgba(212, 241, 229, 0.8) 50%, transparent 100%);
        }
        .inch-spacing { word-spacing: 0.1rem; }
        @media (min-width: 768px) { .inch-spacing { word-spacing: 1in; } }
      `}</style>

      {/* 1. TOP BAR - FIXED FOR PHONE OVERLAP */}
      <div className="bg-[#90d2be] text-white py-1.5 px-4 flex flex-col md:flex-row justify-between items-center text-[7px] md:text-[10px] font-black uppercase tracking-tight text-center gap-0.5">
        <span className="opacity-90">Admissions Open 2026-27</span>
        <div className="flex gap-2">
          <span>📍 BENGALURU, KA</span>
          <span className="hidden md:inline">|</span>
          <span>📞 +91 98XXX XXXXX</span>
        </div>
      </div>

      {/* 2. HEADER - SCALED FOR SMALL SCREENS */}
      <header className="sticky top-0 w-full z-[100] bg-white/90 backdrop-blur-md shadow-sm border-b">
        <nav className="flex justify-between items-center px-4 md:px-8 py-2 md:py-0">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-[45px] md:h-[76px] w-auto object-contain" />
            <div className="text-left">
              <span className="text-[11px] md:text-[16px] font-black text-[#56a890] block uppercase leading-none">KALPAVRUKSHA</span>
              <span className="text-[6px] md:text-[8px] text-gray-400 font-bold uppercase block mt-0.5">Montessori School</span>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-[#f28d7d] text-white px-4 md:px-7 py-1.5 md:py-2.5 rounded-full font-black text-[9px] md:text-[11px] uppercase shadow-md">Enroll</button>
        </nav>
      </header>

      {/* 3. HERO - FIXED FONT SIZES */}
      <section className="hero-banner relative">
        <div className="px-6 md:ml-[60px] max-w-[90%] md:max-w-[800px] z-10">
          <h1 className="text-[26px] md:text-6xl font-[1000] leading-[1.2] md:leading-[1.1] uppercase mb-4 min-h-[4em] md:min-h-[3.5em]">
            <Typewriter texts={["WHERE EVERY CHILD\nGROWS WITH\nWONDER."]} />
          </h1>
          <p className="text-sm md:text-xl font-bold text-[#444] italic">Premium Montessori & Expert Tutoring Center.</p>
        </div>
      </section>

      {/* 4. WELCOME TITLE - RESPONSIVE SPACING */}
      <section className="py-12 md:py-24 px-6 text-center">
        <h2 className="text-2xl md:text-5xl font-black text-[#143611] inch-spacing leading-tight mb-4">
            Welcome to Kalpavruksha
        </h2>
        <p className="text-xs md:text-2xl font-bold text-[#b58d67] uppercase tracking-widest">Early learning centre</p>
      </section>

      {/* 5. GALLERY - FIXED GRID STACKING */}
      <section className="bg-[#f0fdf4] py-16 px-6 md:px-10">
        <h2 className="text-3xl md:text-5xl font-black text-[#143611] text-center mb-12 uppercase tracking-tighter">Our Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-white rounded-[30px] overflow-hidden shadow-md border-4 border-white transform hover:rotate-2 transition-transform">
              <img src="/web.png" alt="Gallery" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* 6. TUITION SECTION */}
      <section className="bg-[#143611] py-16 px-6 text-white text-center md:rounded-[60px] md:mx-4 mb-20">
        <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">Tuition Centre</h2>
        <p className="text-[#90d2be] font-bold text-sm md:text-xl uppercase mb-8">1st to 10th Standard</p>
        <button onClick={() => setShowForm(true)} className="bg-[#f28d7d] text-white px-10 py-4 rounded-full font-black uppercase text-xs shadow-xl">Start Learning</button>
      </section>

      <footer className="bg-[#143611] py-8 text-center text-gray-500 text-[7px] font-black uppercase">
        © 2026 Kalpavruksha Montessori School.
      </footer>
    </div>
  );
}

export default App;