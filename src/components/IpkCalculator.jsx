import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save } from 'lucide-react';

export default function IpkCalculator() {
  // --- STATE DENGAN ANTI-CRASH ---
  const [matkul, setMatkul] = useState(() => {
    try {
      // Coba baca data
      const saved = localStorage.getItem('akademix_ipk');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      // Kalau error, jangan crash! Pakai array kosong aja.
      console.error("Gagal baca storage:", e);
      return [];
    }
  });

  const [input, setInput] = useState({ name: '', sks: 2, grade: 'A' });

  // --- LOGIC HITUNG IPK ---
  const gradePoints = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'E': 0 };
  
  const totalSKS = matkul.reduce((acc, curr) => acc + parseInt(curr.sks), 0);
  const totalPoints = matkul.reduce((acc, curr) => acc + (curr.sks * gradePoints[curr.grade]), 0);
  const ipk = totalSKS === 0 ? 0 : (totalPoints / totalSKS).toFixed(2);

  // --- EFFECT: AUTO SAVE (DENGAN ANTI-CRASH) ---
  useEffect(() => {
    try {
      localStorage.setItem('akademix_ipk', JSON.stringify(matkul));
    } catch (e) {
      console.error("Gagal simpan data:", e);
    }
  }, [matkul]);

  // --- HANDLER ---
  const addMatkul = (e) => {
    e.preventDefault();
    if (!input.name) return;
    setMatkul([...matkul, { ...input, id: Date.now() }]);
    setInput({ name: '', sks: 2, grade: 'A' }); // Reset form
  };

  const deleteMatkul = (id) => {
    setMatkul(matkul.filter(item => item.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      
      {/* 1. SCORE CARD (Bagian Atas) */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-6 text-white shadow-lg mb-6 flex justify-between items-center relative overflow-hidden">
        {/* Hiasan Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <div>
          <p className="text-blue-100 text-sm font-medium mb-1">Total SKS: {totalSKS}</p>
          <h2 className="text-5xl font-bold tracking-tighter">{ipk}</h2>
        </div>
        <div className="text-right z-10">
          <p className="text-xs text-blue-100 uppercase tracking-widest">Prediksi IPK</p>
          <p className="text-sm font-medium text-white/80">{matkul.length} Mata Kuliah</p>
        </div>
      </div>

      {/* 2. FORM INPUT (Versi Responsif Total) */}
      <form onSubmit={addMatkul} className="flex flex-col md:flex-row gap-3 mb-6">
        <input 
          type="text" 
          placeholder="Nama Matkul..." 
          className="w-full md:flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
          value={input.name}
          onChange={(e) => setInput({...input, name: e.target.value})}
        />
        
        <div className="flex gap-2">
          <select 
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none shadow-sm"
            value={input.sks}
            onChange={(e) => setInput({...input, sks: parseInt(e.target.value)})}
          >
            {[1,2,3,4,6].map(num => <option key={num} value={num}>{num} SKS</option>)}
          </select>
          
          <select 
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none shadow-sm font-bold text-slate-700"
            value={input.grade}
            onChange={(e) => setInput({...input, grade: e.target.value})}
          >
            {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          
          <button 
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center min-w-[50px]"
          >
            <Plus size={20} />
          </button>
        </div>
      </form>

      {/* 3. LIST MATA KULIAH (Scrollable) */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-20">
        <AnimatePresence>
          {matkul.length === 0 ? (
            <div className="text-center text-slate-400 mt-10 text-sm">Belum ada data mata kuliah.</div>
          ) : (
            matkul.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group"
              >
                <div>
                  <h4 className="font-bold text-slate-700">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.sks} SKS • Nilai {item.grade}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-sm">
                    {gradePoints[item.grade]}
                  </span>
                  <button 
                    onClick={() => deleteMatkul(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}