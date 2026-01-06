import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Save } from 'lucide-react';

export default function QuickNotes() {
  // --- STATE DENGAN ANTI-CRASH ---
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('akademix_notes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Gagal baca notes:", e);
      return [];
    }
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [input, setInput] = useState({ title: '', content: '' });

  // --- AUTO SAVE (DENGAN ANTI-CRASH) ---
  useEffect(() => {
    try {
      localStorage.setItem('akademix_notes', JSON.stringify(notes));
    } catch (e) {
      console.error("Gagal simpan notes:", e);
    }
  }, [notes]);

  // --- COLORS (Pastel) ---
  const colors = [
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
  ];

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  // --- HANDLER ---
  const addNote = () => {
    if (!input.title.trim() && !input.content.trim()) return;
    
    const newNote = {
      id: Date.now(),
      title: input.title,
      content: input.content,
      date: new Date().toLocaleDateString('id-ID'),
      color: getRandomColor()
    };

    setNotes([newNote, ...notes]);
    setInput({ title: '', content: '' });
    setIsAdding(false);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="h-full flex flex-col relative">
      
      {/* 1. HEADER & ADD BUTTON */}
      <div className="flex justify-between items-center mb-4 px-1">
        <p className="text-sm text-slate-400 font-medium">
          {notes.length} Catatan tersimpan
        </p>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-slate-700 active:scale-95 transition-all shadow-md"
        >
          <Plus size={16} /> Buat Baru
        </button>
      </div>

      {/* 2. FORM INPUT (Overlay Modal Kecil) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-12 left-0 right-0 z-20 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 mx-1"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-700">Tulis Catatan</h4>
              <button onClick={() => setIsAdding(false)} className="text-slate-300 hover:text-slate-500"><X size={18}/></button>
            </div>
            <input 
              className="w-full text-lg font-bold text-slate-800 placeholder:text-slate-300 outline-none mb-2"
              placeholder="Judul (Contoh: Tugas RPL)"
              value={input.title}
              onChange={(e) => setInput({...input, title: e.target.value})}
              autoFocus
            />
            <textarea 
              className="w-full h-20 text-sm text-slate-600 placeholder:text-slate-300 outline-none resize-none"
              placeholder="Isi catatan disini..."
              value={input.content}
              onChange={(e) => setInput({...input, content: e.target.value})}
            />
            <div className="flex justify-end mt-2">
              <button 
                onClick={addNote}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform flex items-center gap-2"
              >
                <Save size={16} /> Simpan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. LIST NOTES (Masonry Grid) */}
      <div className="flex-1 overflow-y-auto pb-20 pr-1">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50">
            <Save size={48} className="mb-4" />
            <p className="text-sm">Belum ada catatan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className={`p-4 rounded-2xl border ${note.color} relative group transition-shadow hover:shadow-sm`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">{note.date}</span>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="text-slate-800/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{note.title}</h3>
                  <p className="text-sm opacity-90 whitespace-pre-wrap">{note.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}