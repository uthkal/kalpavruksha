import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; 
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// --- FIXED & PROTECTED TYPEWRITER COMPONENT ---
const Typewriter = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (index >= texts.length) {
      setIndex(0);
    }
  }, [texts, index]);

  useEffect(() => {
    if (!texts[index]) return;

    if (subIndex === texts[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2500);
      return () => clearTimeout(timeout);
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

  if (!texts[index]) return null;

  return (
    <span className="border-r-2 md:border-r-4 border-[#f28d7d] pr-1 whitespace-pre-line break-words text-black">
      {texts[index].substring(0, subIndex)}
    </span>
  );
};

const HERO_TEXTS = ["WHERE EVERY CHILD\nGROWS WITH\nWONDER."];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); 
  const [showLogin, setShowLogin] = useState(false);
  const [showFees, setShowFees] = useState(false);
  const [openFacilities, setOpenFacilities] = useState(false);
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [activeSection, setActiveSection] = useState('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [formData, setFormData] = useState({ 
    studentName: '', phone: '', board: 'State', class: '1st Standard', program: 'LKG' 
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      if (currentUser) fetchStudents();
    });
    return () => unsub();
  }, []);

  const fetchStudents = async () => {
    try {
      const q = query(collection(db, "school_inquiries"), orderBy("submittedAt", "desc"));
      const snapshot = await getDocs(q);
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error("Firestore Error"); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      setShowLogin(false);
    } catch (err) { alert("Invalid Credentials"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const colName = showForm === 'montessori' ? "school_inquiries" : "tuition_inquiries";
    try {
      await addDoc(collection(db, colName), { ...formData, inquiryType: showForm, submittedAt: serverTimestamp() });
      alert("Inquiry Sent Successfully!");
      setShowForm(false);
    } catch (err) { alert("Error connecting to database."); }
    setIsSubmitting(false);
  };

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 60, behavior: 'smooth' });
      setActiveSection(id);
      setOpenFacilities(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center font-black text-gray-200 uppercase tracking-widest animate-pulse">Checking Connection...</div>;

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#143611] p-6 text-white flex justify-between items-center">
            <h1 className="font-black uppercase text-xs md:text-base tracking-tighter">Admin Dashboard</h1>
            <button onClick={() => signOut(auth)} className="bg-red-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase">Logout</button>
          </div>
          <div className="p-4 md:p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black uppercase text-gray-400 border-b">
                <tr><th className="pb-4">Name</th><th className="pb-4">Phone</th><th className="pb-4">Class</th></tr>
              </thead>
              <tbody className="text-sm font-bold">
                {students.map(s => (<tr key={s.id} className="border-b hover:bg-gray-50"><td className="py-4 text-xs md:text-sm">{s.studentName}</td><td className="py-4 text-xs md:text-sm">{s.phone}</td><td className="py-4 text-[#56a890] uppercase text-[10px] md:text-sm">{s.program || s.class}</td></tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (showFees) {
    const feeData = [
      { title: "Daycare", timing: "8:00 AM - 6:00 PM", monthly: "₹ 1,500", annual: "₹ 15,000", note: "Limited Slots Available", color: "#56a890" },
      { title: "Montessori", timing: "9:00 AM - 12:30 PM", annual: "₹ 25,000", includes: "Books & Uniform", color: "#f28d7d" },
      { title: "LKG", timing: "M-F 2 PM | Sat 12:30 PM", annual: "₹ 27,000", includes: "Books & Uniform", color: "#b58d67" },
      { title: "UKG", timing: "M-F 2 PM | Sat 12:30 PM", annual: "₹ 29,000", includes: "Books & Uniform", color: "#143611" }
    ];

    return (
      <div className="min-h-screen bg-[#fafafa] py-12 px-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <h2 className="text-2xl md:text-5xl font-black uppercase text-[#143611] tracking-tighter">Fees Structure</h2>
            <button onClick={() => setShowFees(false)} className="bg-black text-white px-8 py-3 rounded-full font-black text-[10px] uppercase shadow-lg">Back Home</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {feeData.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center">
                <h3 className="text-2xl font-black uppercase mb-2" style={{ color: item.color }}>{item.title}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 italic">{item.timing}</p>
                <div className="flex-1 w-full space-y-4">
                   {item.monthly && (
                     <div className="bg-gray-50 p-4 rounded-2xl">
                        <span className="block text-[9px] font-black text-gray-400 uppercase">Monthly</span>
                        <span className="text-lg font-black text-black">{item.monthly}</span>
                     </div>
                   )}
                   <div className="bg-[#143611] p-4 rounded-2xl text-white">
                      <span className="block text-[9px] font-black opacity-60 uppercase">Annual Fee</span>
                      <span className="text-lg font-black">{item.annual}</span>
                   </div>
                   {item.includes && <p className="text-[10px] font-black text-[#56a890] uppercase">{item.includes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 font-sans relative" 
           style={{ backgroundColor: '#143611', backgroundImage: 'radial-gradient(#1e4a1a 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        <button onClick={() => setShowLogin(false)} className="absolute top-8 left-8 bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all active:scale-90 z-10">←</button>
        <div className="w-full max-w-md bg-white rounded-[40px] p-8 md:p-10 shadow-2xl relative z-10">
          <h2 className="text-xl md:text-2xl font-black uppercase text-[#143611] text-center mb-8 tracking-tighter">Management Portal</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="EMAIL" required className="w-full p-4 border rounded-2xl font-bold bg-gray-50 outline-none focus:ring-2 ring-[#56a890]/20" onChange={(e) => setLoginEmail(e.target.value)} />
            <input type="password" placeholder="PASSWORD" required className="w-full p-4 border rounded-2xl font-bold bg-gray-50 outline-none focus:ring-2 ring-[#56a890]/20" onChange={(e) => setLoginPass(e.target.value)} />
            <button className="w-full bg-[#143611] text-white py-4 rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-transform">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        html { scroll-behavior: smooth; }
        .hero-banner { width: 100vw; height: 85vh; background-image: url('/flex.png') !important; background-size: cover !important; background-position: center !important; display: flex; align-items: center; position: relative; }
        @media (max-width: 768px) { .hero-banner { height: 65vh; background-position: 70% center !important; align-items: flex-start !important; padding-top: 50px; } }
        .hero-banner::before { content: ""; position: absolute; inset: 0; background: linear-gradient(to right, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.2) 60%, transparent 100%); }
        .ticker-wrapper { flex: 1; overflow: hidden; white-space: nowrap; margin: 0 15px; }
        .ticker-content { display: inline-block; animation: scrollTicker 25s linear infinite; color: #d00000; font-weight: 800; }
        @keyframes scrollTicker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-script { font-family: 'Great Vibes', cursive; }
      `}</style>

      {/* 1. TOP TICKER */}
      <div className="bg-[#FFD56B] text-[#143611] py-1.5 px-4 flex items-center justify-between text-[8px] md:text-[11px] font-black uppercase border-b border-[#e6c060] sticky top-0 z-[110]">
        <span className="font-bold hidden sm:inline">📍 LAGGERE BENGALURU</span>
        <div className="ticker-wrapper"><div className="ticker-content uppercase text-[#d00000]">kalpavruksha Early learning centre admission open for acadamic year 2026-27 ● kalpavruksha Early learning centre admission open for acadamic year 2026-27</div></div>
        <a href="https://wa.me/919902962379" className="font-bold shrink-0">📞 +91 99029 62379</a>
      </div>

      {/* 2. HEADER */}
      <header className="sticky top-[28px] md:top-[34px] w-full z-[100] bg-white/95 backdrop-blur-md shadow-sm border-b">
        <nav className="flex justify-between items-center px-4 md:px-8 py-1 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <img src="/logo.png" alt="Logo" className="h-[40px] md:h-[72px]" />
            <div className="text-left leading-none uppercase"><span className="text-[10px] md:text-[15px] font-black text-[#56a890] block">KALPAVRUKSHA</span><span className="text-[4px] md:text-[8px] text-gray-400 font-bold block">Early Learning Centre</span></div>
          </div>
          <div className="flex items-center gap-2 md:gap-8 overflow-visible">
            <div className="hidden lg:flex items-center gap-8">
              {['Home', 'About', 'Programs', 'Gallery'].map((item) => (
                <button key={item} onClick={() => scrollTo(item.toLowerCase())} className={`text-[12px] font-black uppercase transition-colors ${activeSection === item.toLowerCase() ? 'text-[#f28d7d]' : 'text-gray-500'}`}>{item}</button>
              ))}
            </div>
            
            {/* DROPDOWN */}
            <div className="relative group">
              <button onClick={() => setOpenFacilities(!openFacilities)} className="text-[9px] md:text-[12px] font-black uppercase text-gray-500 flex items-center gap-0.5">
                Facilities <span className="text-[#f28d7d]">{openFacilities ? '˄' : '˅'}</span>
              </button>
              {openFacilities && (
                <div className="absolute top-full right-0 bg-white border shadow-2xl rounded-2xl py-3 w-40 md:w-48 z-[9999] mt-3 animate-in fade-in slide-in-from-top-1">
                  <button onClick={() => { setShowFees(true); setOpenFacilities(false); }} className="px-5 py-3 text-[9px] md:text-[11px] font-black uppercase text-gray-500 hover:text-[#56a890] w-full text-left">Fees Structure</button>
                  <button onClick={() => { setShowLogin(true); setOpenFacilities(false); }} className="px-5 py-3 text-[9px] md:text-[11px] font-black uppercase text-gray-500 hover:text-[#56a890] w-full text-left">Parents Login</button>
                </div>
              )}
            </div>

            <button onClick={() => setShowForm('montessori')} className="bg-[#f28d7d] text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full font-black text-[9px] md:text-[11px] uppercase shadow-md active:scale-95">Enroll</button>
          </div>
        </nav>
      </header>

      {/* 3. HERO (MOVED 20% LEFT ON MOBILE) */}
      <section id="home" className="hero-banner relative overflow-hidden">
        <div className="px-6 md:ml-8 max-w-[90%] md:max-w-[70%] z-10 text-left transform max-sm:-translate-x-[20%] transition-transform">
          <h1 className="text-[22px] md:text-[54px] font-[1000] leading-tight uppercase mb-4 min-h-[4em] md:min-h-[3.2em]">
            <Typewriter texts={HERO_TEXTS} />
          </h1>
          <p className="text-[11px] md:text-lg font-bold text-[#444] italic">A happy start for little ones.</p>
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section id="about" className="py-12 md:py-24 px-6 text-center max-w-7xl mx-auto">
        <div className="flex flex-col items-center leading-none mt-4 md:mt-8">
           <div className="flex items-center justify-center gap-2 md:gap-8 mb-0">
              <h2 className="text-[28px] md:text-[95px] font-script text-[#143611] tracking-tight">Welcome to</h2>
              <img src="/kalpa.png" alt="Logo" className="h-[47px] md:h-[164px] w-auto object-contain" />
           </div>
           <p className="text-[12px] md:text-2xl font-bold text-[#b58d67] uppercase tracking-widest inline-flex items-center -mt-3.5 md:-mt-8 lg:-mt-10">
             <span className="relative">
               <img src="/leaf.png" alt="" className="absolute -top-4 md:-top-8 -left-2 md:-left-4 w-8 md:w-16 h-auto transform -rotate-[20deg] opacity-95 pointer-events-none" />
               E
             </span>
             ARLY LEARNING CENTRE
           </p>
        </div>
        <div className="max-w-4xl mx-auto text-[11px] md:text-xl font-bold text-gray-500 leading-relaxed px-4 mt-6">Helping children learn to do it themselves and discover the joy of growing.</div>
      </section>

      {/* 5. PROGRAMS SECTION */}
      <section id="programs" className="bg-[#f28d7d] py-16 px-6 text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black uppercase mb-12 tracking-widest">Our Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { t: 'LKG', d: <>Learning phonics and number fun<br/>A new adventure every day</> },
              { t: 'UKG', d: <>Reading and logic skills<br/>Ready for the big school</> },
              { t: 'Daycare', d: <>Loving home with fun play<br/>Trusted care while you work</> }
            ].map((p, i) => (
              <div key={i} className="bg-white p-8 md:p-10 rounded-[30px] shadow-xl flex flex-col items-center">
                <h3 className="text-xl md:text-3xl font-black uppercase text-[#56a890] mb-3">{p.t}</h3>
                <p className="text-[11px] md:text-[15px] text-gray-500 font-bold uppercase leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GALLERY SECTION */}
      <section id="gallery" className="py-16 md:py-24 px-6 text-center bg-white max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-12 text-[#143611] tracking-widest">Our Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-2xl md:rounded-3xl overflow-hidden hover:scale-95 transition-transform cursor-pointer shadow-sm">
              <img src={`/gallery-${i}.jpg`} alt="Moments" className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'; e.target.parentElement.innerHTML=`<div class="flex items-center justify-center h-full text-[9px] font-black text-gray-200 uppercase">Snapshot ${i}</div>`}} />
            </div>
          ))}
        </div>
      </section>

      {/* 7. TUITION SECTION */}
      <section id="tuition" className="bg-[#143611] py-16 px-6 text-white text-center md:rounded-[60px] md:mx-6 mb-10 shadow-2xl">
        <h2 className="text-2xl md:text-5xl font-black uppercase mb-1">Tuition Centre</h2>
        <p className="text-[#90d2be] font-bold text-xs md:text-lg uppercase tracking-widest mb-8 italic">1st to 10th Standard</p>
        <button onClick={() => setShowForm('tuition')} className="bg-[#f28d7d] text-white px-10 py-4 rounded-full font-black uppercase text-[10px] md:text-sm shadow-xl transition-all hover:bg-[#e87c6b] active:scale-95">Enroll Now</button>
      </section>

      <footer className="bg-[#143611] py-8 text-center text-gray-500 text-[8px] font-black uppercase tracking-[0.2em]">© 2026 Kalpavruksha Early Learning Centre.</footer>

      {/* FLOATING WHATSAPP */}
      <a href="https://wa.me/919902962379" target="_blank" className="fixed bottom-5 right-5 flex items-center z-[9999]">
        <div className="bg-white text-black px-4 py-2 rounded-xl font-black text-xs mr-2 shadow-lg border hidden sm:block">Enquire Now</div>
        <div className="bg-[#25D366] w-12 h-12 rounded-full flex items-center justify-center shadow-xl overflow-hidden"><img src="/WhatsApp-Logo.wine.png" alt="WA" className="w-[70%] h-auto" /></div>
      </a>
    </div>
  );
}