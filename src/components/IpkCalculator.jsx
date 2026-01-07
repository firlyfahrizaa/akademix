import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { API_BASE, getHeaders } from '../utils'; // Import wajib

export default function IpkCalculator() {
  // --- STATE ---
  const [matkul, setMatkul] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [input, setInput] = useState({ name: '', sks: 2, grade: 'A' });

  // --- 1. LOAD DATA DARI DJANGO ---
  useEffect(() => {
    fetch(`${API_BASE}/ipk/`, { headers: getHeaders() })
      .then(res => res.json())
      .then(data => {
        setMatkul(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Gagal ambil data IPK:", err);
        setIsLoading(false);
      });
  }, []);

  // --- 2. LOGIC HITUNG IPK ---
  const gradePoints = { 
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 
    'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'E': 0 
  };
  
  // Hitung total SKS & Poin secara real-time dari data state 'matkul'
  const totalSKS = matkul.reduce((acc, curr) => acc + parseInt(curr.sks), 0);
  const totalPoints = matkul.reduce((acc, curr) => acc + (curr.sks * gradePoints[curr.grade]), 0);
  const ipk = totalSKS === 0 ? 0 : (totalPoints / totalSKS).toFixed(2);

  // --- 3. TAMBAH MATKUL (POST) ---
  const addMatkul = async () => {
    if (!input.name) return;

    try {
      // Kirim ke Server
      const res = await fetch(`${API_BASE}/ipk/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(input)
      });
      const data = await res.json();

      if (data.status === 'saved') {
        // Update UI
        const newMatkul = { ...input, id: data.id };
        setMatkul([newMatkul, ...matkul]); // Tambah ke paling atas
        
        // Reset Form
        setInput({ name: '', sks: 2, grade: 'A' });
      }
    } catch (e) {
      alert("Gagal simpan matkul. Cek koneksi!");
    }
  };

  // --- 4. HAPUS MATKUL (DELETE) ---
  const deleteMatkul = async (id) => {
    // Hapus di UI dulu (Optimistic Update)
    setMatkul(matkul.filter(m => m.id !== id));
    
    // Hapus di Server
    try {
      await fetch(`${API_BASE}/ipk/`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ id })
      });
    } catch (e) {
      console.error("Gagal hapus di server");
    }
  };

  // --- RENDER UI ---
  return (
    <div className="h-full flex flex-col relative">
      
      {/* HEADER & HASIL IPK */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-slate-600 mb-2">Estimasi IPK</h3>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-200 inline-block w-full">
          <div className="text-6xl font-black tracking-tighter mb-1">
            {isLoading ? <span className="text-2xl animate-pulse">...</span> : ipk}
          </div>
          <div className="flex justify-center gap-4 text-blue-100 text-sm font-medium">
            <span>{totalSKS} Total SKS</span>
            <span>•</span>
            <span>{matkul.length} Matkul</span>
          </div>
        </div>
      </div>

      {/* LIST MATKUL (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-32">
        {isLoading ? (
          <div className="flex justify-center p-4 text-slate-400">
             <Loader2 className="animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode='popLayout'>
            {matkul.length === 0 ? (
              <div className="text-center text-slate-400 mt-4 text-sm">
                Belum ada data mata kuliah.
              </div>
            ) : (
              matkul.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-blue-200 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-slate-700">{item.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {item.sks} SKS • Nilai {item.grade}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-sm">
                      {gradePoints[item.grade]}
                    </span>
                    <button 
                      onClick={() => deleteMatkul(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>

      {/* FORM INPUT FLOATING (DI BAWAH) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur pt-4 pb-2 border-t border-slate-100">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nama Mata Kuliah..."
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:font-normal"
          />
          
          <div className="flex gap-2">
            <select
              value={input.sks}
              onChange={(e) => setInput({ ...input, sks: parseInt(e.target.value) })}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-600 outline-none focus:border-blue-500 cursor-pointer"
            >
              {[1, 2, 3, 4, 6].map(n => (
                <option key={n} value={n}>{n} SKS</option>
              ))}
            </select>

            <select
              value={input.grade}
              onChange={(e) => setInput({ ...input, grade: e.target.value })}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-600 outline-none focus:border-blue-500 cursor-pointer"
            >
              {Object.keys(gradePoints).map(g => (
                <option key={g} value={g}>Nilai {g}</option>
              ))}
            </select>

            <button
              onClick={addMatkul}
              disabled={!input.name}
              className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}