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
    }, reverse ? 30 : 70);
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
  const [activeSection, setActiveSection] = useState('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '', parentName: '', phone: '', address: '',
    program: 'Montessori', grade: 'LKG', board: 'State Board'
  });

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
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
        <div className="w-full max-w-xl bg-white rounded-[30px] shadow-2xl overflow-hidden border">
          <div className="bg-[#143611] p-6 text-white flex justify-between items-center">
            <h2 className="text-lg font-black uppercase">Admission Inquiry</h2>
            <button onClick={() => setShowForm(false)} className="text-[10px] border px-3 py-1 rounded font-bold">CLOSE [X]</button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
             <div className="bg-gray-50 p-3 rounded-lg border border-dashed text-center">
                <span className="text-[10px] font-black text-gray-400 uppercase block mb-2">Select Program</span>
                <div className="flex justify-center gap-4">
                   <label className="text-xs font-bold flex items-center gap-1"><input type="radio" name="p" value="Montessori" checked={formData.program==='Montessori'} onChange={()=>setFormData({...formData, program:'Montessori'})}/> Montessori</label>
                   <label className="text-xs font-bold flex items-center gap-1"><input type="radio" name="p" value="Tuition" checked={formData.program==='Tuition'} onChange={()=>setFormData({...formData, program:'Tuition'})}/> Tuition</label>
                </div>
             </div>
             <input type="text" placeholder="STUDENT NAME" required className="w-full p-3 border rounded-xl font-bold text-sm" onChange={(e) => setFormData({...formData, studentName: e.target.value})} />
             <input type="tel" placeholder="PARENT PHONE NUMBER" required className="w-full p-3 border rounded-xl font-bold text-sm" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
             <textarea placeholder="ADDRESS" className="w-full p-3 border rounded-xl font-bold text-sm" rows="2" onChange={(e) => setFormData({...formData, address: e.target.value})} />
             <button type="submit" disabled={isSubmitting} className="w-full bg-[#f28d7d] text-white py-4 rounded-xl font-black uppercase shadow-lg hover:bg-[#e07b6b]">
               {isSubmitting ? "Processing..." : "Submit Inquiry"}
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
            background: linear-gradient(to right, rgba(212, 241, 229, 0.98) 0%, rgba(212, 241, 229, 0.7) 60%, transparent 100%);
        }
        .inch-spacing { word-spacing: 0.1rem; }
        @media (min-width: 768px) { 
          .inch-spacing { word-spacing: 1in; } 
          .hero-banner { background-position: center !important; }
        }
      `}</style>

      {/* 1. TOP BAR */}
      <div className="bg-[#90d2be] text-white py-1.5 px-4 flex flex-col md:flex-row justify-between items-center text-[7px] md:text-[10px] font-black uppercase tracking-tight text-center gap-1">
        <span>Admissions Open 2026-27</span>
        <div className="flex gap-3">
          <span>📍 BENGALURU, KA</span><span>|</span><span>📞 +91 98XXX XXXXX</span>
        </div>
      </div>

      {/* 2. HEADER NAVIGATION */}
      <header className="sticky top-0 w-full z-[100] bg-white/95 backdrop-blur-md shadow-sm border-b">
        <nav className="flex justify-between items-center px-4 md:px-8 py-2 md:py-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <img src="/logo.png" alt="Logo" className="h-[45px] md:h-[76px] w-auto object-contain" />
            <div className="text-left">
              <span className="text-[11px] md:text-[16px] font-black text-[#56a890] block uppercase leading-none">KALPAVRUKSHA</span>
              <span className="text-[6px] md:text-[8px] text-gray-400 font-bold uppercase block mt-0.5">Montessori School</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {['Home', 'About Us', 'Programs', 'Gallery', 'Tuition', 'Contact'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollTo(item.toLowerCase().replace(' ', ''))}
                className={`text-[11px] font-black uppercase transition-colors ${activeSection === item.toLowerCase().replace(' ', '') ? 'text-[#f28d7d]' : 'text-gray-500 hover:text-[#f28d7d]'}`}
              >
                {item}
              </button>
            ))}
            <button onClick={() => setShowForm(true)} className="bg-[#f28d7d] text-white px-5 py-2 rounded-full font-black text-[10px] uppercase shadow-md hover:scale-105 transition-transform">Enroll Now</button>
          </div>
          
          {/* Mobile Enroll Button */}
          <button onClick={() => setShowForm(true)} className="lg:hidden bg-[#f28d7d] text-white px-4 py-1.5 rounded-full font-black text-[9px] uppercase shadow-md">Enroll</button>
        </nav>
      </header>

      {/* 3. HERO SECTION */}
      <section id="home" className="hero-banner">
        <div className="px-6 md:ml-[60px] max-w-[95%] md:max-w-[850px] z-10">
          <h1 className="text-[28px] md:text-6xl font-[1000] leading-[1.2] md:leading-[1.1] uppercase mb-4 min-h-[4em] md:min-h-[3.5em]">
            <Typewriter texts={["WHERE EVERY CHILD\nGROWS WITH\nWONDER."]} />
          </h1>
          <p className="text-xs md:text-xl font-bold text-[#444] italic">Premium Montessori & Expert Tutoring Center.</p>
        </div>
      </section>

      {/* 4. ABOUT SECTION (WELCOME) */}
      <section id="aboutus" className="py-16 md:py-24 px-6 text-center">
        <h2 className="text-2xl md:text-5xl font-black text-[#143611] inch-spacing leading-tight mb-4">
            Welcome to Kalpavruksha
        </h2>
        <p className="text-xs md:text-2xl font-bold text-[#b58d67] uppercase tracking-[0.3em] mb-12">Early learning centre</p>
        <div className="max-w-3xl mx-auto text-sm md:text-base font-medium text-gray-600 leading-relaxed">
          At Kalpavruksha, we believe in nurturing the innate curiosity of every child. Our environment is designed to foster independence, respect, and a lifelong love for learning through the proven Montessori method.
        </div>
      </section>

      {/* 5. OUR PROGRAMS (ORANGE SECTION) */}
      <section id="programs" className="bg-[#f28d7d] py-16 md:py-24 px-6 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase mb-12 tracking-widest">OUR PROGRAMS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Daycare", age: "1.5 - 3 Yrs", desc: "Safe and stimulating environment." },
            { title: "LKG", age: "3 - 4 Yrs", desc: "Foundational social and cognitive skills." },
            { title: "UKG", age: "4 - 5 Yrs", desc: "Preparing for formal schooling transition." }
          ].map((prog) => (
            <div key={prog.title} className="bg-white p-8 rounded-[30px] md:rounded-[40px] shadow-xl text-center flex flex-col items-center">
              <div className="bg-[#d4f1e5] w-12 h-12 rounded-full mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-[#56a890] rounded-sm rotate-45"></div>
              </div>
              <h3 className="text-3xl font-black uppercase text-[#56a890] mb-1">{prog.title}</h3>
              <span className="text-lg font-extrabold text-[#f28d7d] uppercase mb-4 tracking-tighter">{prog.age}</span>
              <p className="text-xs text-gray-500 font-bold">{prog.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. GALLERY SECTION */}
      <section id="gallery" className="bg-[#f0fdf4] py-16 md:py-24 px-6">
        <h2 className="text-3xl md:text-5xl font-black text-[#143611] text-center mb-12 uppercase tracking-tighter">Our Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-white rounded-[25px] overflow-hidden shadow-md border-4 border-white transition-transform hover:scale-105">
              <img src="/web.png" alt="Gallery item" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. TUITION SECTION (GREEN) */}
      <section id="tuition" className="bg-[#143611] py-16 px-6 text-white text-center md:rounded-[60px] md:mx-4 mb-20 shadow-2xl">
        <h2 className="text-3xl md:text-6xl font-black uppercase mb-4">Tuition Centre</h2>
        <p className="text-[#90d2be] font-bold text-sm md:text-xl uppercase tracking-widest mb-10 italic">1st to 10th Standard (State/CBSE/ICSE)</p>
        <button onClick={() => setShowForm(true)} className="bg-[#f28d7d] text-white px-10 py-4 rounded-full font-black uppercase text-xs shadow-xl hover:bg-white hover:text-[#143611] transition-all">Enroll for Tuition</button>
      </section>

      <footer className="bg-[#143611] py-10 text-center text-gray-500 text-[8px] font-black uppercase tracking-[0.3em]">
        © 2026 Kalpavruksha Montessori School. All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;