import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function EnrollPage() {
  const navigate = useNavigate();
  const [enrollmentType, setEnrollmentType] = useState('montessori');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ studentName: '', phone: '', parentName: '', age: '', program: 'LKG', class: '1st Standard', board: 'State Board' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const targetCollection = enrollmentType === 'montessori' ? "school_inquiries" : "tuition_inquiries";
    try {
      await addDoc(collection(db, targetCollection), { ...formData, submittedAt: serverTimestamp() });
      alert("Registration Form Submitted Successfully!");
      navigate('/'); // Routes browser url redirect back to core home index path
    } catch (err) { alert("Database error occurred."); }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[85vh] bg-gray-50 py-12 px-4 animate-in fade-in duration-200">
      <div className="max-w-3xl mx-auto bg-white rounded-[40px] shadow-xl border overflow-hidden">
        <div className="bg-[#143611] p-8 text-white text-center relative">
          <button type="button" onClick={() => navigate('/')} className="absolute left-6 top-8 text-xs font-black uppercase border border-white/30 rounded-xl px-3 py-1.5 text-white">← Back</button>
          <h1 className="text-2xl md:text-3xl font-black uppercase text-white">Admission Registry</h1>
        </div>

        <div className="grid grid-cols-2 border-b">
          <button type="button" onClick={() => setEnrollmentType('montessori')} className={`py-4 font-black uppercase text-xs ${enrollmentType === 'montessori' ? 'text-[#56a890] border-b-4 border-[#56a890]' : 'text-gray-400'}`}>Montessori</button>
          <button type="button" onClick={() => setEnrollmentType('tuition')} className={`py-4 font-black uppercase text-xs ${enrollmentType === 'tuition' ? 'text-[#f28d7d]/10 text-[#f28d7d] border-b-4 border-[#f28d7d]' : 'text-gray-400'}`}>Tuition Academy</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="STUDENT FULL NAME" required className="w-full p-4 border rounded-2xl font-bold bg-gray-50 text-xs text-black" onChange={(e) => setFormData({...formData, studentName: e.target.value})} />
            <input type="tel" placeholder="PARENT PHONE NUMBER" required className="w-full p-4 border rounded-2xl font-bold bg-gray-50 text-xs text-black" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-2xl font-black uppercase text-xs text-white bg-[#143611]">{isSubmitting ? "Sending..." : "Complete Registry"}</button>
        </form>
      </div>
    </div>
  );
}