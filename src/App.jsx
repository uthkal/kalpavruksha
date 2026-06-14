import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { db, auth } from './firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// --- PERFECTED ANIMATION TYPEWRITER ---
const Typewriter = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (!texts || !texts[index]) return;

    if (subIndex === texts[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 3000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 60 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  if (!texts || !texts[index]) return null;

  return (
    <span className="border-r-4 md:border-r-[6px] border-[#f28d7d] pr-2 whitespace-pre-line leading-tight text-black">
      {texts[index].substring(0, subIndex)}
    </span>
  );
};

const HERO_TEXTS = ["WHERE EVERY CHILD\nGROWS WITH\nWONDER."];

// --- PARENT-FRIENDLY VIVA BOOKS CURRICULUM DATA STORE ---
const PROGRAM_DETAILS = {
  montessori: {
    title: "Montessori Early Learning",
    age: "2.5 to 5 Years",
    themeColor: "bg-[#FFB84D]", 
    cardColor: "bg-[#FFF9E6]", 
    textColor: "text-[#B37400]",
    overview: "Welcome to our hands-on learning world! Following the practical steps of Viva Books, we help young children discover real-world items using their tiny fingers. Instead of just looking at boards, children touch, carry, and sort special wooden blocks and materials to understand shapes, sizes, and daily habits naturally.",
    curriculum: [
      { area: "Daily Practical Living Skills", details: "Children play simple games like pouring water without spilling, buttoning clothes, and cleaning tables. This builds amazing hand control and self-confidence." },
      { area: "Exploring Shapes & Sizes", details: "Using colored wooden blocks, pink towers, and cylinder shapes, children learn to sort items by size and texture, sharpening their visual thinking." },
      { area: "Joyful Count & Bead Games", details: "Math is taught through touch! Children use shiny beads and number rods to see how quantities grow, making basic addition visual and fun." },
      { area: "Sounds & Tracing Journey", details: "Little fingers trace sandpaper letters to feel shapes while learning phonetic sounds, quickly connecting words with matching bright pictures." }
    ]
  },
  lkg: {
    title: "Lower Kindergarten (LKG)",
    age: "3.5 to 4.5 Years",
    themeColor: "bg-[#f28d7d]", 
    cardColor: "bg-[#FFF0F2]", 
    textColor: "text-[#C24D3D]",
    overview: "Step into our joyful LKG room! Modeled after Viva smart preschool activity workbooks, our LKG program gently introduces small children to their very first school desk steps. We balance colorful worksheets with rhymes, tracing lines, and friendly group habits to make early learning exciting.",
    curriculum: [
      { area: "Phonics & First Words", details: "Children master capital and small letters (A-Z) using cheerful sounds, learn to read simple two-letter words, and recite classic action rhymes." },
      { area: "Fun Tracing & Writing Numbers", details: "We practice writing and counting numbers 1 to 50, recognize basic math shapes, and solve interactive puzzles matching objects together." },
      { area: "Knowing the World Around Us", details: "Children discover simple environmental science, including body parts, family trees, domestic vs. wild animals, and basic safety guidelines." },
      { area: "Creative Paper & Craft Play", details: "Little creators enjoy paper tearing, origami paper folding, pattern coloring, and clay molding to turn imagination into real crafts." }
    ]
  },
  ukg: {
    title: "Upper Kindergarten (UKG)",
    age: "4.5 to 5.5 Years",
    themeColor: "bg-[#3A9E85]", 
    cardColor: "bg-[#E6F7F0]", 
    textColor: "text-[#1B6653]",
    overview: "Ready for the big school step! Our UKG roadmap coordinates directly with Viva primary readiness toolkits. We strengthen your child's reading confidence, sentence building, and math skills so they transition into Class 1 with absolute comfort and a smiling face.",
    curriculum: [
      { area: "Sentence Reading & Writing", details: "Children advance to spelling three-letter phonetic words, practicing standard 'this/that' sentences, reading paragraphs, and taking light spelling quizzes." },
      { area: "Easy Addition & Subtraction", details: "Counting moves up from 1 to 100! Children learn forward/backward sequences, skip-counting, and handling single-digit addition and subtraction sums." },
      { area: "Nature & Science Discovery", details: "We explore plant growth lifecycles, seasonal changes, our community helpers, transportation modes, and healthy lifestyle cleanliness blocks." },
      { area: "Bilingual Basics & Script Tracing", details: "Introduction to local script strokes, basic word tracing, and light conversational vocabulary builders for regional Indian languages." }
    ]
  },
  daycare: {
    title: "Premium Daycare Hub",
    age: "1.5 Years onwards",
    themeColor: "bg-[#7A60B3]", 
    cardColor: "bg-[#F3F0FF]", 
    textColor: "text-[#4A3280]",
    overview: "A safe, warm, and happy shelter for your little bundle of joy! Our daycare ecosystem keeps children secure, cleanly fed, and happily active while parents are busy working. We provide structure throughout the afternoon with balanced nap routines and group games.",
    curriculum: [
      { area: "Healthy Snack & Meal Routines", details: "Clean, timely feeding hours following your precise instructions, ensuring your child receives their meals warm and healthy." },
      { area: "Comfy Afternoon Nap Times", details: "A peaceful, climate-controlled sleep room with neat, individual bedding configurations for safe and sound afternoon rest cycles." },
      { area: "Social Play & Puppet Shows", details: "Building huge block towers, listening to story times, watching puppet plays, and playing on secure, soft indoor rubber mats." },
      { area: "After-School Homework Help", details: "Older kids enjoy a quiet reading space with friendly support to assist them in completing their primary school tasks cleanly." }
    ]
  }
};

// --- DYNAMIC PROGRAM DETAIL PAGE COMPONENT ---
function ProgramDetailPage() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const program = PROGRAM_DETAILS[programId?.toLowerCase()];

  if (!program) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-xl font-black uppercase text-red-600">Program Profile Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 bg-[#143611] text-white px-6 py-2 rounded-xl text-xs font-black uppercase">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-gray-50 py-12 px-4 md:px-8 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-xl border overflow-hidden">
        
        <div className={`p-8 md:p-12 text-white relative transition-colors ${program.themeColor}`}>
          <button onClick={() => navigate('/')} className="absolute left-6 top-8 text-xs font-black uppercase border border-white/20 rounded-xl px-3 py-1.5 text-white hover:bg-white hover:text-black transition-all">← Back</button>
          <span className="bg-white text-black font-black text-[9px] uppercase px-3 py-1 rounded-full tracking-wider block w-max mb-3 mt-4">For Ages: {program.age}</span>
          <h1 className="text-3xl md:text-5xl font-[1000] uppercase tracking-tight text-white">{program.title}</h1>
        </div>

        <div className="p-6 md:p-12 space-y-8">
          <div className={`${program.cardColor} p-6 rounded-3xl border border-black/5`}>
            <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-2">About This Class</h2>
            <p className="text-sm md:text-base text-gray-700 font-bold leading-relaxed">{program.overview}</p>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-6">What our little students learn:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {program.curriculum.map((item, idx) => (
                <div key={idx} className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${program.cardColor} border-black/5`}>
                  <div>
                    <span className={`text-xs font-black uppercase tracking-wider block mb-1 ${program.textColor}`}>Activity Part 0{idx + 1}</span>
                    <h3 className="text-base font-black uppercase text-black mb-2">{item.area}</h3>
                    <p className="text-xs md:text-sm text-gray-500 font-bold leading-relaxed">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- DEDICATED FEES STRUCTURE PAGE VIEW ---
function FeesStructurePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[85vh] bg-gray-50 py-12 px-4 md:px-8 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-xl border overflow-hidden">
        
        <div className="bg-[#143611] p-8 md:p-12 text-white relative text-center">
          <button onClick={() => navigate('/')} className="absolute left-6 top-8 text-xs font-black uppercase border border-white/20 rounded-xl px-3 py-1.5 text-white hover:bg-white hover:text-black transition-all">← Home</button>
          <h1 className="text-2xl md:text-4xl font-[1000] uppercase tracking-tight text-white">FEES STRUCTURE</h1>
          <p className="text-[#90d2be] text-[10px] font-black uppercase tracking-widest mt-1">Academic Year Schedules & Pricing Overview</p>
        </div>

        <div className="p-6 md:p-12 space-y-6">
          {[
            { 
              program: "Montessori", 
              timing: "9:00 AM - 12:30 PM", 
              fee: "₹ 25,000", 
              color: "bg-[#FFF9E6] border-amber-200", 
              text: "text-[#B37400]" 
            },
            { 
              program: "LKG", 
              timing: "Monday - Friday: 9:00 AM - 2:00 PM | Saturday: 9:00 AM - 12:30 PM", 
              fee: "₹ 27,000", 
              color: "bg-[#FFF0F2] border-rose-200", 
              text: "text-[#C24D3D]" 
            },
            { 
              program: "UKG", 
              timing: "Monday - Friday: 9:00 AM - 2:00 PM | Saturday: 9:00 AM - 12:30 PM", 
              fee: "₹ 29,000", 
              color: "bg-[#E6F7F0] border-emerald-200", 
              text: "text-[#1B6653]" 
            },
            { 
              program: "Daycare", 
              timing: "8:30 AM - 6:00 PM", 
              fee: "₹ 15,000 (Annual) | ₹ 1,500 (Monthly)", 
              color: "bg-[#F3F0FF] border-purple-200", 
              text: "text-[#4A3280]" 
            }
          ].map((item, idx) => (
            <div key={idx} className={`${item.color} p-6 rounded-[28px] border-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:scale-[1.01]`}>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Preschool Program</span>
                <h3 className="text-xl font-black uppercase text-black">{item.program}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-gray-600">
                  <span className="bg-white/80 px-3 py-1 rounded-full border">⏰ {item.timing}</span>
                  {item.program !== "Daycare" && <span className="bg-white/80 px-3 py-1 rounded-full border">🎒 Includes Books & Uniform</span>}
                </div>
              </div>
              <div className="text-left md:text-right shrink-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">Fee Details</span>
                <p className={`text-xl font-[1000] tracking-tight ${item.text}`}>{item.fee}</p>
              </div>
            </div>
          ))}

          <div className="bg-gray-50 border rounded-3xl p-6 text-center text-xs font-bold text-gray-500 uppercase tracking-wide leading-relaxed">
            * For sibling discounts, semester installment breakups, or Daycare add-on packages matrix pricing, kindly visit the campus center reception counter directly.
          </div>
        </div>

      </div>
    </div>
  );
}

// --- VIDEOPLAYER THEATER VIEW PAGE ---
function VideoViewPage() {
  const { videoSrc } = useParams();
  const navigate = useNavigate();
  const realVideoUrl = videoSrc ? `/${decodeURIComponent(videoSrc)}` : '';

  return (
    <div className="min-h-[85vh] bg-black text-white flex flex-col justify-center items-center p-4 md:p-8">
      <div className="w-full max-w-5xl space-y-4">
        <div className="flex items-center py-2 border-b border-white/10">
          <button onClick={() => navigate(-1)} className="text-xs font-black uppercase tracking-wider bg-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all">← Return</button>
        </div>
        <div className="w-full aspect-video bg-neutral-900 rounded-[30px] overflow-hidden shadow-2xl border border-white/5 relative">
          <video src={realVideoUrl} controls autoPlay className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}

// --- EXPANDED MEDIA PORTFOLIO EXPLORER LINK (`/all-media`) ---
function AllMediaPortfolioPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[85vh] bg-gray-50 py-12 px-6 animate-in fade-in duration-200">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="bg-[#143611] p-8 md:p-12 rounded-[35px] text-white text-center relative shadow-md">
          <button onClick={() => navigate('/')} className="absolute left-6 top-8 text-xs font-black uppercase border border-white/20 rounded-xl px-3 py-1.5 text-white">← Home</button>
          <h1 className="text-2xl md:text-5xl font-[1000] uppercase text-white tracking-tight">OUR GALLERY</h1>
          <p className="text-[#90d2be] text-[10px] font-black uppercase tracking-widest mt-1">Full Live Activity Streams & Snapshot Logs</p>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-6">Activity Streams Room:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { s: "activity.mp4", post: "/thumb1.png" },
              { s: "activity2.mp4", post: "/thumb2.png" },
              { s: "playwithlearn.mp4", post: "/thumb4.png" },
              { s: "envior1.mp4", post: "/kalpaa.png" } 
            ].map((v, i) => (
              <div key={i} onClick={() => navigate(`/video-view/${encodeURIComponent(v.s)}`)} className="bg-neutral-100 rounded-[32px] overflow-hidden shadow-md relative aspect-video border border-gray-200 cursor-pointer hover:scale-[1.01] transition-all group">
                <img src={v.post} alt="Video Poster" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/25 transition-colors">
                  <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <span className="text-2xl text-black ml-1">▶</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-10">
          <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-6">Campus Snapshots & Graphical Activity Maps:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-md border border-gray-200 w-full max-h-[320px] md:max-h-[400px] p-2 flex items-center justify-center">
              <img src="/fee3.jpeg" alt="Activity Reference sheet" className="w-full h-full object-contain block rounded-[24px]" />
            </div>
            <div className="bg-white rounded-[32px] overflow-hidden shadow-md border border-gray-200 w-full max-h-[320px] md:max-h-[400px] p-2 flex items-center justify-center">
              <img src="/envior.png" alt="Campus Environment Sheet" className="w-full h-full object-contain block rounded-[24px]" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-5xl">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="aspect-square bg-white border rounded-[24px] shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-xl opacity-40">📸</span>
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 mt-2">Campus View {idx}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- TUITION ACADEMY PROFILE PAGE ---
function TuitionDetailsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[85vh] bg-gray-50 py-12 px-4 md:px-8 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-xl border overflow-hidden">
        <div className="bg-[#143611] p-8 md:p-12 text-white relative">
          <button onClick={() => navigate('/')} className="absolute left-6 top-8 text-xs font-black uppercase border border-white/20 rounded-xl px-3 py-1.5 text-white hover:bg-white hover:text-black transition-all">← Back</button>
          <span className="bg-[#f28d7d] text-white font-black text-[9px] uppercase px-3 py-1 rounded-full tracking-wider block w-max mb-3 mt-4">1st to 10th Standard</span>
          <h1 className="text-3xl md:text-5xl font-[1000] uppercase tracking-tight text-white">Tuition Academy Hub</h1>
        </div>
        <div className="p-6 md:p-12 space-y-8">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-2">Academic Overview</h2>
            <p className="text-sm md:text-base text-gray-700 font-bold leading-relaxed">
              We provide structured afternoon tutoring blueprints designed to clarify complex textbook tracking from school hours. Our batch coordinators focus on boosting conceptual clarity, daily homework completion tracking, and rigorous test series preparation across all major foundational boards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PUBLIC FACULTY COMPONENT PAGE ---
function FacultyPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[85vh] bg-gray-50 py-12 px-6 animate-in fade-in duration-200">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="bg-[#56a890] p-8 rounded-[35px] text-white text-center relative shadow-sm">
          <button onClick={() => navigate('/')} className="absolute left-6 top-8 text-xs font-black uppercase border border-white/20 rounded-xl px-3 py-1.5 text-white">← Home</button>
          <h1 className="text-2xl md:text-4xl font-black uppercase text-white">Our Faculty Team</h1>
          <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mt-1">Foundational Directors & Educators</p>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-6">Academic Council:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { n: "MANJUNATH K.S", r: "PRINCIPAL", tag: "Administration Head" },
              { n: "MANASA T.M", r: "TEACHER", tag: "General Foundational Subjects" },
              { n: "SHREYA", r: "MONT TEACHER", tag: "Montessori House Custodian" },
              { n: "DHARSHINI", r: "LKG TEACHER", tag: "Lower Kindergarten Coordinator" },
              { n: "KAVITHA", r: "TEACHER", tag: "Activity & Primary Educator" }
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
                <div>
                  <span className="text-[9px] font-black uppercase bg-emerald-50 text-[#56a890] px-3 py-1 rounded-full w-max block mb-3">{f.tag}</span>
                  <h3 className="text-lg font-black text-black uppercase leading-tight">{f.n}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase mt-0.5">{f.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-10">
          <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-6">Campus Operational Care:</h2>
          <div className="max-w-sm">
            <div className="bg-white p-6 rounded-3xl border shadow-sm border-amber-200 bg-amber-50/20">
              <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-800 px-3 py-1 rounded-full w-max block mb-3">Sanitary & Security Oversight</span>
              <h3 className="text-lg font-black text-black uppercase leading-tight">YOGEETHA</h3>
              <p className="text-xs font-bold text-gray-400 uppercase mt-0.5">CUSTODIAN</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- PUBLIC STUDENT ZONE COMPONENT PAGE ---
function StudentZonePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[85vh] bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-[#f28d7d] p-8 rounded-[35px] text-white text-center relative shadow-sm">
          <button onClick={() => navigate('/')} className="absolute left-6 top-8 text-xs font-black uppercase border border-white/20 rounded-xl px-3 py-1.5 text-white">← Home</button>
          <h1 className="text-2xl md:text-4xl font-black uppercase text-white">Student Sections Portal</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { s: "Montessori Environment", sec: "Section A & B", ratio: "1:15" },
            { s: "Lower Kindergarten (LKG)", sec: "Section A, B & C", ratio: "1:20" },
            { s: "Upper Kindergarten (UKG)", sec: "Section A & B", ratio: "1:20" }
          ].map((c, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase bg-rose-50 text-[#f28d7d] px-3 py-1 rounded-full w-max block mb-3">Teacher-Student Ratio: {c.ratio}</span>
                <h3 className="text-lg font-black text-black uppercase leading-tight">{c.s}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase mt-0.5">{c.sec}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- LANDING PAGE COMPONENT VIEW ---
function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <section id="home" className="hero-banner">
        <div className="px-6 md:ml-8 max-w-[95%] md:max-w-[70%] z-10 text-left">
          <h1 className="text-[20px] md:text-[54px] font-[1000] leading-[1.1] uppercase mb-3 text-black">
            <Typewriter texts={["WHERE EVERY CHILD\nGROWS WITH\nWONDER."]} />
          </h1>
          <p className="text-[11px] md:text-lg font-bold text-[#444] italic">A happy start for little ones.</p>
        </div>
      </section>

      <section id="about" className="py-14 md:py-24 px-6 text-center max-w-7xl mx-auto flex flex-col items-center justify-center bg-white transition-all">
        <div className="flex flex-col items-center justify-center leading-none space-y-4">
           <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-0">
              <h2 className="text-[32px] md:text-[85px] font-script text-[#143611] tracking-tight leading-none">Welcome to</h2>
              <img src="/kalpa.png" alt="Logo" className="h-[72px] md:h-[143px] w-auto object-contain block mt-1" />
           </div>
           <p className="text-[11px] md:text-2xl font-bold text-[#b58d67] uppercase tracking-widest block pt-0 mt-0">
             EARLY LEARNING CENTRE
           </p>
        </div>
        <div className="max-w-4xl mx-auto text-[11px] md:text-xl font-bold text-gray-500 leading-relaxed px-4 mt-8 text-center">
          Helping children learn to do it themselves and discover the joy of growing.
        </div>
      </section>

      <section id="programs" className="bg-[#f28d7d] py-16 px-6 text-white text-center">
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-12 tracking-widest text-white">Our Programs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { id: 'montessori', t: 'Montessori', d: <>Hands-on dynamic learning<br/>Self-paced exploration spaces</> },
            { id: 'lkg', t: 'LKG', d: <>Learning phonics and number fun<br/>A new adventure every day</> },
            { id: 'ukg', t: 'UKG', d: <>Reading and logic skills<br/>Ready for the big school</> },
            { id: 'daycare', t: 'Daycare', d: <>Loving home with fun play<br/>Trusted care while you work</> }
          ].map((p, i) => (
            <div key={i} onClick={() => navigate(`/programs/${p.id}`)} className="bg-white p-6 md:p-8 rounded-[30px] shadow-xl flex flex-col items-center transform hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <h3 className="text-xl md:text-2xl font-black uppercase text-[#56a890] mb-3 group-hover:text-[#f28d7d] transition-colors">{p.t}</h3>
              <p className="text-[11px] md:text-[13px] text-gray-500 font-bold uppercase leading-relaxed text-center mb-4">{p.d}</p>
              <span className="text-[10px] font-black uppercase text-[#56a890] bg-gray-50 px-5 py-1.5 rounded-full group-hover:bg-[#56a890] group-hover:text-white transition-all mt-auto tracking-wider">MORE</span>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="py-16 px-6 bg-white text-center max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-2 tracking-widest text-[#143611]">Our Gallery</h2>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-10">Campus Snapshots & Live Activity Clips</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div onClick={() => navigate(`/video-view/${encodeURIComponent('activity.mp4')}`)} className="bg-neutral-100 rounded-[32px] overflow-hidden shadow-lg relative aspect-video border border-gray-200 cursor-pointer hover:scale-[1.01] transition-all group">
            <img src="/thumb1.png" alt="Thumbnail 1" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/25 transition-colors">
              <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <span className="text-2xl text-black ml-1">▶</span>
              </div>
            </div>
          </div>

          <div onClick={() => navigate(`/video-view/${encodeURIComponent('envior1.mp4')}`)} className="bg-neutral-100 rounded-[32px] overflow-hidden shadow-lg relative aspect-video border border-gray-200 cursor-pointer hover:scale-[1.01] transition-all group">
            <img src="/kalpaa.png" alt="Nature Crafts" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/25 transition-colors">
              <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <span className="text-2xl text-black ml-1">▶</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/all-media" className="inline-flex items-center gap-2 font-black uppercase text-xs tracking-widest text-[#143611] hover:text-[#f28d7d] transition-colors bg-gray-50 px-6 py-3 rounded-full shadow-sm border border-gray-100">
            SEE MORE <span className="text-base leading-none">→</span>
          </Link>
        </div>
      </section>

      <section id="tuition" className="bg-[#143611] py-16 px-6 text-white text-center md:rounded-[60px] md:mx-6 mb-10 shadow-2xl">
        <h2 className="text-2xl md:text-5xl font-black uppercase mb-1 tracking-tighter text-white">Tuition Centre</h2>
        <p className="text-[#90d2be] font-bold text-xs md:text-lg uppercase tracking-widest mb-8 italic">1st to 10th Standard</p>
        <Link to="/tuition-details" className="inline-block bg-[#f28d7d] text-white px-10 py-4 rounded-full font-black uppercase text-[11px] md:text-sm shadow-xl active:scale-95 transition-all text-white">Enroll Now</Link>
      </section>
    </>
  );
}

// --- SECURE MANAGEMENT LOGIN PAGE COMPONENT ---
function ManagementLoginPage() {
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    console.log("BUTTON CLICKED! Attempting login for:", loginInput);
    setError('');
    
    if (!loginInput || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginInput, password);
      console.log("Authentication successful.");
      navigate('/dashboard'); 
    } catch (err) {
      console.error("Authentication Error:", err.code);
      setError('Invalid credentials. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-100 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-xl border overflow-hidden">
        <div className="bg-[#143611] p-8 text-white text-center relative">
          <button type="button" onClick={() => navigate('/')} className="absolute left-6 top-8 text-xs font-black uppercase border border-white/20 rounded-xl px-3 py-1.5 text-white">← Home</button>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Management Portal</h1>
        </div>
        
        {!isOtpMode ? (
          <form onSubmit={handleEmailLogin} className="p-8 space-y-5">
            {error && <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-200 text-center uppercase tracking-wider">{error}</div>}
            
            <input type="email" required placeholder="EMAIL ADDRESS" className="w-full p-4 border rounded-2xl font-bold bg-gray-50 text-xs text-black" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} disabled={isLoading} />
            <input type="password" required placeholder="PASSWORD" className="w-full p-4 border rounded-2xl font-bold bg-gray-50 text-xs text-black" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            
            <button type="submit" disabled={isLoading} className={`w-full bg-[#143611] text-white py-4 rounded-2xl font-black uppercase text-xs transition-opacity ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}>
              {isLoading ? 'Authenticating...' : 'Secure Entry Log'}
            </button>
            
            <button type="button" onClick={() => { setIsOtpMode(true); setError(''); }} className="text-[11px] font-black text-[#f28d7d] uppercase tracking-wide block mx-auto mt-2">Login with OTP instead</button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); alert("OTP setup requires RecaptchaVerifier."); }} className="p-8 space-y-5">
             {error && <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-200 text-center uppercase tracking-wider">{error}</div>}
            
            <input type="tel" required placeholder="REGISTERED MOBILE (+91...)" className="w-full p-4 border rounded-2xl font-bold bg-gray-50 text-xs text-black" value={otpPhone} onChange={(e) => setOtpPhone(e.target.value)} />
            
            <div className="flex gap-3">
              <button type="button" onClick={() => { setIsOtpMode(false); setError(''); }} className="w-1/3 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-gray-200 transition-colors">Cancel</button>
              <button type="submit" className="w-2/3 bg-[#56a890] text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-opacity-90 transition-opacity">Transmit OTP</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// --- ENROLLMENT PAGE COMPONENT ---
function EnrollPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    phone: '', 
    program: 'Montessori' 
  });

  return (
    <div className="min-h-[85vh] bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-[40px] shadow-xl border overflow-hidden">
        <div className="bg-[#143611] p-8 text-white text-center relative">
          <button type="button" onClick={() => navigate('/')} className="absolute left-6 top-8 text-xs font-black uppercase border border-white/20 rounded-xl px-3 py-1.5 text-white">← Cancel</button>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">Admission Enquiry</h1>
        </div>
        <div className="p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="FIRST NAME" className="w-full p-4 border rounded-2xl font-bold text-xs text-black bg-gray-50 outline-none" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <input type="text" placeholder="LAST NAME" className="w-full p-4 border rounded-2xl font-bold text-xs text-black bg-gray-50 outline-none" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <input type="tel" placeholder="CONTACT NUMBER" className="w-full p-4 border rounded-2xl font-bold text-xs text-black bg-gray-50 outline-none" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <select className="w-full p-4 border rounded-2xl font-bold text-xs text-black bg-gray-50 outline-none" onChange={(e) => setFormData({...formData, program: e.target.value})}>
            <option value="Montessori">Montessori</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            <option value="Daycare">Daycare</option>
          </select>
          <button type="button" onClick={() => alert('Processing Admission Enquiry for ' + formData.firstName + '...')} className="w-full bg-[#143611] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-wider">Submit Enquiry</button>
        </div>
      </div>
    </div>
  );
}

// --- GLOBAL NAVIGATION MENU ---
function GlobalHeaderNavigation() {
  const [openFacilities, setOpenFacilities] = useState(false);
  const navigate = useNavigate();

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) window.scrollTo({ top: element.offsetTop - 120, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-[28px] md:top-[34px] w-full z-[100] bg-white/95 backdrop-blur-md shadow-sm border-b">
      <nav className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-[40px] md:h-[60px]" />
          <div className="text-left uppercase leading-none">
            <span className="text-[12px] md:text-[16px] font-black text-[#56a890] block">KALPAVRUKSHA</span>
            <span className="text-[8px] font-black text-[#f28d7d] block tracking-widest mt-0.5">EARLY LEARNING CENTRE</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8 font-black uppercase text-[10px] md:text-[12px]">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-500 hover:text-black tracking-wider">HOME</Link>
          <Link to="/" onClick={() => handleScroll('about')} className="text-gray-500 hover:text-black tracking-wider">ABOUT</Link>
          <Link to="/" onClick={() => handleScroll('programs')} className="text-gray-500 hover:text-black tracking-wider">PROGRAMS</Link>
          <Link to="/" onClick={() => handleScroll('gallery')} className="text-gray-500 hover:text-black tracking-wider">GALLERY</Link>
          
          <div 
            className="relative py-2 cursor-pointer text-gray-500 hover:text-black"
            onMouseEnter={() => setOpenFacilities(true)}
            onMouseLeave={() => setOpenFacilities(false)}
          >
            <button className="font-black uppercase tracking-wider flex items-center gap-0.5 pointer-events-none">
              FACILITIES <span className="text-[#f28d7d] text-[8px]">{openFacilities ? '▲' : '▼'}</span>
            </button>
            
            {openFacilities && (
              <div className="absolute top-full right-0 bg-white border shadow-xl py-2 flex flex-col w-52 rounded-2xl z-[9999] text-black normal-case overflow-hidden">
                <button onClick={() => { navigate('/fees'); setOpenFacilities(false); }} className="px-5 py-3 text-[10px] font-black uppercase text-gray-500 hover:bg-gray-50 text-left border-b border-gray-100 block w-full">Fees Structure</button>
                <Link to="/faculty" className="px-5 py-3 text-[10px] font-black uppercase text-gray-500 hover:bg-gray-50 text-left border-b border-gray-100 block">Faculty Team</Link>
                <Link to="/student-zone" className="px-5 py-3 text-[10px] font-black uppercase text-gray-500 hover:bg-gray-50 text-left border-b border-gray-100 block">Student Zone</Link>
                <Link to="/management-login" className="px-5 py-3 text-[10px] font-black uppercase text-red-500 bg-red-50/20 hover:bg-red-50 text-left block">Management Login</Link>
              </div>
            )}
          </div>

          <Link to="/enroll" className="bg-[#f28d7d] text-white px-5 py-2 rounded-full font-black uppercase tracking-wider shadow-sm transition-transform active:scale-95">ENROLL</Link>
        </div>
      </nav>
    </header>
  );
}

// --- SECURE ROUTE BOUNCER ---
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe; // Cleanup listener on unmount
  }, []);

  if (loading) {
    return <div className="min-h-[85vh] flex items-center justify-center font-black uppercase tracking-widest text-xs">Verifying Security Clearance...</div>;
  }

  if (!user) {
    return <Navigate to="/management-login" replace />;
  }

  return children;
}

// --- SECURE DASHBOARD VIEW ---
function ManagementDashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[85vh] bg-gray-50 p-10 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-black uppercase tracking-widest text-[#143611] mb-6">Secure Dashboard</h1>
      <p className="text-sm font-bold text-gray-500 mb-8 uppercase">Welcome to the inner sanctum.</p>
      <button 
        onClick={() => {
          signOut(auth).then(() => navigate('/'));
        }} 
        className="bg-red-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-wider shadow-lg hover:bg-red-700 transition-colors"
      >
        Sign Out Securely
      </button>
    </div>
  );
}


// --- MASTER COMPONENT ROUTER CONTAINER ---
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white overflow-x-hidden text-black font-sans">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          html { scroll-behavior: smooth; }
          .hero-banner { width: 100vw; height: 85vh; background-image: url('/flex.png') !important; background-size: cover !important; background-position: center !important; display: flex; align-items: flex-start; position: relative; padding-top: 15vh; }
          @media (max-width: 768px) { .hero-banner { height: 75vh; padding-top: 10vh; background-position: 65% center !important; } }
          .hero-banner::before { content: ""; position: absolute; inset: 0; background: linear-gradient(to right, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.1) 70%, transparent 100%); }
          .ticker-content { display: inline-block; animation: scrollTicker 11s linear infinite; color: #d00000; font-weight: 800; white-space: nowrap; }
          @keyframes scrollTicker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
          .font-script { font-family: 'Great Vibes', cursive; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>

        {/* RUNNING TICKER */}
        <div className="bg-[#FFD56B] text-[#143611] py-1.5 px-3 flex items-center justify-between text-[8px] md:text-[11px] font-black uppercase border-b border-[#e6c060] sticky top-0 z-[120]">
          <a href="https://maps.app.goo.gl/23xDnaNV6Y1GGG6J7" target="_blank" rel="noreferrer" className="font-black shrink-0 text-black">📍 LAGGERE</a>
          <div className="flex-1 overflow-hidden mx-4 text-center">
            <div className="ticker-content uppercase text-red-600">admission open for academic year 2026-27 ● kalpavruksha early learning centre ● </div>
          </div>
          <a href="https://wa.me/919902962379" target="_blank" rel="noreferrer" className="font-bold text-black shrink-0 hover:opacity-80 transition-opacity">📞 +91 99029 62379</a>
        </div>

        <GlobalHeaderNavigation />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/programs/:programId" element={<ProgramDetailPage />} />
          <Route path="/enroll" element={<EnrollPage />} />
          <Route path="/management-login" element={<ManagementLoginPage />} />
          <Route path="/faculty" element={<FacultyPage />} />
          <Route path="/student-zone" element={<StudentZonePage />} />
          <Route path="/tuition-details" element={<TuitionDetailsPage />} />
          <Route path="/video-view/:videoSrc" element={<VideoViewPage />} />
          <Route path="/all-media" element={<AllMediaPortfolioPage />} />
          <Route path="/fees" element={<FeesStructurePage />} />
          
          {/* Private Secure Route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <ManagementDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>

        <footer className="bg-[#143611] py-8 text-center text-gray-500 text-[9px] font-black uppercase tracking-widest">© 2026 Kalpavruksha Early Learning Centre.</footer>
      </div>
    </Router>
  );
}