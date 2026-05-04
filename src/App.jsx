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
    }, reverse ? 30 : 80);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="border-r-4 border-[#f28d7d] pr-1 whitespace-pre-line text-black">
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

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const collectionName = formData.program === 'Montessori' ? "school_inquiries" : "tuition_inquiries";
    try {
      await addDoc(collection(db, collectionName), { ...formData, submittedAt: serverTimestamp() });
      alert("Inquiry Sent Successfully!");
      setShowForm(false);
    } catch (err) {
      alert("Submission failed. Check your internet connection.");
    }
    setIsSubmitting(false);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] py-6 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-[30px] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-[#143611] p-6 text-white flex justify-between items-center">
            <h2 className="text-xl font-black uppercase">Admission Inquiry</h2>
            <button onClick={() => setShowForm(false)} className="text-white font-bold text-xs uppercase border border-white/20 px-3 py-1 rounded">Close</button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Select Program</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 font-bold text-[#143611] text-sm"><input type="radio" name="program" value="Montessori" checked={formData.program === 'Montessori'} onChange={(e) => setFormData({...formData, program: e.target.value})} /> Montessori</label>
                <label className="flex items-center gap-2 font-bold text-[#143611] text-sm"><input type="radio" name="program" value="Tuition" checked={formData.program === 'Tuition'} onChange={(e) => setFormData({...formData, program: e.target.value})} /> Tuition</label>
              </div>
            </div>
            <input type="text" placeholder="STUDENT NAME" required className="w-full p-4 border rounded-xl font-bold text-sm" onChange={(e) => setFormData({...formData, studentName: e.target.value})} />
            <input type="tel" placeholder="PARENT PHONE" required className="w-full p-4 border rounded-xl font-bold text-sm" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <button type="submit" disabled={isSubmitting} className="w-full bg-[#f28d7d] text-white py-4 rounded-xl font-black uppercase shadow-xl hover:bg-[#e07b6b] transition-all">
              {isSubmitting ? "Sending..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        html { scroll-behavior: smooth; }
        .hero-banner {
            width: 100vw;
            height: 75vh;
            background-image: url('/web.png') !important;
            background-size: cover !important;
            background-position: center !important;
            display: flex;
            align-items: center;
            position: relative;
        }
        .hero-banner::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(to right, rgba(212, 241, 229, 0.98) 0%, rgba(212, 241, 229, 0.6) 60%, transparent 100%);
        }
        .inch-spacing { word-spacing: 0.1rem; }
        @media (min-width: 768px) { .inch-spacing { word-spacing: 1in; } }
      `}</style>

      {/* INFO BAR */}
      <div className="bg-[#90d2be] text-white py-2 px-4 flex flex-col md:flex-row justify-between items-center text-[8px] md:text-[10px] font-black uppercase tracking-wider text-center gap-1">
        <span>Admissions Open 2026-27</span>
        <div className="flex gap-2 md:gap-4">
          <span>📍 BENGALURU, KA</span><span>📞 +91 98XXX XXXXX</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <header className="sticky top-0 w-full z-[100] bg-white shadow-sm border-b">
        <nav className="flex justify-between items-center px-4 md:px-12 py-2">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-[45px] md:h-[76px] w-auto" />
            <div className="text-left hidden sm:block">
              <span className="text-[12px] md:text-[16px] font-black text-[#56a890] uppercase leading-none">KALPAVRUKSHA</span>
              <span className="text-[6px] md:text-[8px] text-gray-400 font-bold uppercase block">Montessori School</span>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden lg:flex gap-6 text-[10px] font-black uppercase text-gray-500">
              <button onClick={() => scrollTo('home')} className="hover:text-[#56a890]">Home</button>
              <button onClick={() => scrollTo('about')} className="hover:text-[#56a890]">About</button>
              <button onClick={() => scrollTo('gallery')} className="hover:text-[#56a890]">Gallery</button>
              <button onClick={() => scrollTo('tuition')} className="hover:text-[#56a890]">Tuition</button>
            </div>
            <button onClick={() => setShowForm(true)} className="bg-[#f28d7d] text-white px-5 py-2 rounded-full font-black text-[9px] md:text-[11px] uppercase">Enroll</button>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="hero-banner">
        <div className="px-6 md:ml-[80px] max-w-[900px] z-10 relative">
          <h1 className="text-3xl md:text-6xl font-[1000] leading-[1.2] uppercase mb-4 min-h-[3.5em]">
            <Typewriter texts={["WHERE EVERY CHILD\nGROWS WITH\nWONDER."]} />
          </h1>
          <p className="text-sm md:text-xl font-bold text-[#444] italic">Premium Montessori & Expert Tutoring Center.</p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-16 md:py-24 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-[#143611] uppercase mb-6">About Our School</h2>
            <p className="text-gray-600 font-medium leading-relaxed mb-6">
              At Kalpavruksha, we believe in the natural curiosity of children. Our Montessori environment is designed to foster independence, respect, and a lifelong love for learning.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl font-black text-[#56a890] text-center">SAFETY FIRST</div>
              <div className="p-4 bg-gray-50 rounded-xl font-black text-[#56a890] text-center">EXPERT STAFF</div>
            </div>
          </div>
          <div className="rounded-[40px] overflow-hidden shadow-2xl h-[300px] md:h-[400px]">
            <img src="/web.png" className="w-full h-full object-cover" alt="About" />
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-16 bg-[#f0fdf4] px-6">
        <h2 className="text-3xl font-black text-center uppercase mb-12 text-[#143611]">Our Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {[1,2,3,4].map(n => (
            <div key={n} className="aspect-square bg-gray-200 rounded-2xl overflow-hidden hover:scale-105 transition-transform">
               <img src="/web.png" className="w-full h-full object-cover" alt="gallery item" />
            </div>
          ))}
        </div>
      </section>

      {/* TUITION SECTION */}
      <section id="tuition" className="bg-[#143611] py-16 md:py-24 px-6 text-white text-center md:rounded-[60px] md:mx-6 mb-20 shadow-2xl">
        <h2 className="text-3xl md:text-6xl font-black uppercase mb-4">Tuition Centre</h2>
        <p className="text-[#90d2be] font-bold text-lg md:text-xl uppercase tracking-widest mb-10 italic">1st to 10th Standard (All Boards)</p>
        <button onClick={() => setShowForm(true)} className="bg-[#f28d7d] text-white px-8 py-4 rounded-full font-black uppercase shadow-xl hover:scale-105 transition-all">Get Details</button>
      </section>

      <footer className="bg-[#143611] py-10 text-center text-gray-400 text-[8px] font-black uppercase tracking-widest">
        © 2026 Kalpavruksha Montessori School | Bengaluru
      </footer>
    </div>
  );
}

export default App;