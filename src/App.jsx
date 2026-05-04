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

// --- ICON COMPONENTS ---
const EducatorIcon = () => (
  <svg className="w-10 h-10 md:w-12 md:h-12 text-[#56a890]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
);
const PlayIcon = () => (
  <svg className="w-10 h-10 md:w-12 md:h-12 text-[#56a890]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
);

function App() {
  const [showForm, setShowForm] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '', parentName: '', phone: '', address: '',
    program: 'Montessori', grade: 'LKG', board: 'State Board'
  });

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const collectionName = formData.program === 'Montessori' ? "school_inquiries" : "tuition_inquiries";
    try {
      await addDoc(collection(db, collectionName), { ...formData, submittedAt: serverTimestamp() });
      alert("Inquiry Sent!");
      setShowForm(false);
    } catch (err) {
      alert("Error submitting. Please check connection.");
    }
    setIsSubmitting(false);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] py-6 md:py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-[#143611] p-6 md:p-8 text-white flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-black uppercase">Admission Inquiry</h2>
            <button onClick={() => setShowForm(false)} className="text-white font-bold text-xs uppercase border border-white/20 px-3 py-1 rounded">Close</button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-4 md:space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Program Type</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 font-bold text-[#143611] text-sm"><input type="radio" name="program" value="Montessori" checked={formData.program === 'Montessori'} onChange={(e) => setFormData({...formData, program: e.target.value})} /> Montessori</label>
                <label className="flex items-center gap-2 font-bold text-[#143611] text-sm"><input type="radio" name="program" value="Tuition" checked={formData.program === 'Tuition'} onChange={(e) => setFormData({...formData, program: e.target.value})} /> Tuition</label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="p-4 bg-gray-50 border rounded-xl font-bold text-sm outline-none" onChange={(e) => setFormData({...formData, grade: e.target.value})}>
                {formData.program === 'Montessori' ? (<><option>Daycare</option><option>LKG</option><option>UKG</option></>) : ([1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}th Standard</option>))}
              </select>
              {formData.program === 'Tuition' && (<select className="p-4 bg-gray-50 border rounded-xl font-bold text-sm outline-none" onChange={(e) => setFormData({...formData, board: e.target.value})}><option>State Board</option><option>CBSE</option><option>ICSE</option></select>)}
            </div>
            <input type="text" placeholder="STUDENT FULL NAME" required className="w-full p-4 border rounded-xl font-bold text-sm" onChange={(e) => setFormData({...formData, studentName: e.target.value})} />
            <input type="tel" placeholder="PARENT CONTACT NUMBER" required className="w-full p-4 border rounded-xl font-bold text-sm" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <textarea placeholder="RESIDENTIAL ADDRESS" className="w-full p-4 border rounded-xl font-bold text-sm" rows="3" onChange={(e) => setFormData({...formData, address: e.target.value})} />
            <button type="submit" disabled={isSubmitting} className="w-full bg-[#f28d7d] text-white py-4 md:py-5 rounded-xl font-black uppercase shadow-xl hover:bg-[#e07b6b] transition-all">
              {isSubmitting ? "Sending..." : "Send Inquiry"}
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
            height: 80vh;
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
        .inch-spacing { word-spacing: 0.2rem; }
        @media (min-width: 768px) { .inch-spacing { word-spacing: 1in; } }
      `}</style>

      {/* 1. INFO BAR (FIXED FOR MOBILE) */}
      <div className="bg-[#90d2be] text-white py-2 px-4 flex flex-col md:flex-row justify-between items-center text-[8px] md:text-[10px] font-black uppercase tracking-wider text-center gap-1">
        <span>Admissions Open 2026-27</span>
        <div className="flex gap-2 md:gap-4">
          <span>📍 BENGALURU, KA</span><span>📞 +91 98XXX XXXXX</span>
        </div>
      </div>

      {/* 2. NAVIGATION (SCALED LOGO) */}
      <header className="sticky top-0 w-full z-[100] bg-white shadow-sm border-b">
        <nav className="flex justify-between items-center px-4 md:px-8 py-2 md:py-0">
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/logo.png" alt="Logo" className="h-[50px] md:h-[76px] w-auto object-contain" />
            <div className="text-left">
              <span className="text-[12px] md:text-[16px] font-black text-[#56a890] block uppercase leading-none">KALPAVRUKSHA</span>
              <span className="text-[6px] md:text-[8px] text-gray-400 font-bold uppercase tracking-widest block mt-0.5">Montessori School</span>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-[#f28d7d] text-white px-4 md:px-7 py-2 md:py-2.5 rounded-full font-black text-[9px] md:text-[11px] uppercase shadow-lg">Enroll Now</button>
        </nav>
      </header>

      {/* 3. HERO (SMALLER TEXT FOR PHONE) */}
      <section className="hero-banner">
        <div className="px-6 md:ml-[60px] max-w-[900px] z-10 relative">
          <h1 className="text-3xl md:text-6xl font-[1000] leading-[1.2] md:leading-[1.1] uppercase mb-4 md:mb-6 min-h-[3.5em]">
            <Typewriter texts={["WHERE EVERY CHILD\nGROWS WITH\nWONDER."]} />
          </h1>
          <p className="text-base md:text-xl font-bold text-[#444] mb-8 md:mb-10 italic">Premium Montessori & Expert Tutoring Center.</p>
        </div>
      </section>

      {/* 4. WELCOME SECTION (RESPONSIVE GRID) */}
      <section className="py-16 md:py-24 px-6 md:px-10 text-center">
        <h2 className="text-2xl md:text-5xl font-black text-[#143611] tracking-tight mb-2 inch-spacing leading-tight">
            Welcome to Kalpavruksha
        </h2>
        <p className="text-sm md:text-2xl font-bold text-[#b58d67] uppercase tracking-widest mb-12">Early learning centre</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          {[
            { img: "/strick.png", title: "Montessori", text: "Individualized Learning" },
            { Icon: EducatorIcon, title: "Trained Mentors", text: "Warm Environment" },
            { Icon: PlayIcon, title: "Safe Daycare", text: "Stimulating Space" }
          ].map((card) => (
            <div key={card.title} className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl flex flex-col items-center shadow-sm">
              <div className="bg-[#d4f1e5] p-4 md:p-5 rounded-full mb-4 flex items-center justify-center">
                {card.img ? <img src={card.img} alt="sticker" className="w-10 h-10 md:w-12 md:h-12 object-contain" /> : <card.Icon />}
              </div>
              <h3 className="text-base md:text-lg font-extrabold uppercase text-[#56a890] mb-2 leading-tight">{card.title}</h3>
              <p className="text-[10px] md:text-xs text-gray-500 font-semibold">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PROGRAMS (ORANGE BG) */}
      <section className="bg-[#f28d7d] py-16 md:py-24 px-6 md:px-24 text-white text-center">
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-12 tracking-widest">OUR PROGRAMS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {[
            { age: "1.5 - 6 Yrs", title: "Daycare" },
            { age: "3 - 4 Yrs", title: "LKG" },
            { age: "4 - 5 Yrs", title: "UKG" }
          ].map((card) => (
            <div key={card.title} className="bg-white p-8 md:p-10 rounded-[30px] md:rounded-[40px] flex flex-col items-center shadow-xl">
              <h3 className="text-3xl md:text-4xl font-black uppercase text-[#56a890] mb-1">{card.title}</h3>
              <span className="text-lg md:text-xl font-extrabold text-[#f28d7d] uppercase mb-4 tracking-widest">{card.age}</span>
              <p className="text-xs text-gray-600 font-bold">Comprehensive early childhood development.</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TUITION (GREEN BG) */}
      <section className="bg-[#143611] py-16 md:py-24 px-6 text-white text-center md:rounded-[60px] md:mx-4 mb-20 shadow-2xl">
        <h2 className="text-3xl md:text-6xl font-black uppercase mb-4">Tuition Centre</h2>
        <p className="text-[#90d2be] font-bold text-lg md:text-xl uppercase tracking-widest mb-10 italic">1st to 10th Standard</p>
        <button onClick={() => setShowForm(true)} className="bg-[#f28d7d] text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-black uppercase shadow-xl hover:scale-105 transition-all text-sm">Enroll Now</button>
      </section>

      <footer className="bg-[#143611] py-10 text-center text-gray-400 text-[8px] font-black uppercase tracking-widest">
        © 2026 Kalpavruksha Montessori School.
      </footer>
    </div>
  );
}

export default App;