import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Save, Pencil } from 'lucide-react';

export default function QuickNotes() {
  
  // --- 1. DEFINISI WARNA (Pindahkan ke paling atas biar kebaca duluan) ---
  const colors = [
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
  ];

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  // --- 2. STATE (Dengan "Auto-Repair" Warna) ---
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('akademix_notes');
    let data = saved ? JSON.parse(saved) : [];
    
    // LOGIC PERBAIKAN: Cek setiap catatan, kalau warnanya hilang, kasih warna baru
    return data.map(note => ({
      ...note,
      color: note.color || getRandomColor() // Fallback color
    }));
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState({ title: '', content: '' });
  const [editId, setEditId] = useState(null);

  // --- AUTO SAVE ---
  useEffect(() => {
    localStorage.setItem('akademix_notes', JSON.stringify(notes));
  }, [notes]);

  // --- HANDLER: SAVE (CREATE / UPDATE) ---
  const handleSave = () => {
    if (!input.title.trim() && !input.content.trim()) return;

    if (editId) {
      // MODE EDIT: Update catatan yang sudah ada
      setNotes(notes.map(note => 
        note.id === editId 
          ? { 
              ...note, // Pertahankan data lama (termasuk WARNA)
              title: input.title, 
              content: input.content, 
              date: 'Diedit: ' + new Date().toLocaleDateString('id-ID') 
            } 
          : note
      ));
    } else {
      // MODE BARU: Bikin catatan baru
      const newNote = {
        id: Date.now(),
        title: input.title,
        content: input.content,
        date: new Date().toLocaleDateString('id-ID'),
        color: getRandomColor() // Warna random untuk baru
      };
      setNotes([newNote, ...notes]);
    }
    
    closeModal();
  };

  // --- HANDLER: DELETE ---
  const handleDelete = (e, id) => {
    e.stopPropagation(); 
    if (window.confirm("Yakin mau menghapus catatan ini?")) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  // --- HANDLER: OPEN & CLOSE ---
  const openNew = () => {
    setEditId(null);
    setInput({ title: '', content: '' });
    setIsModalOpen(true);
  };

  const openEdit = (note) => {
    setEditId(note.id);
    setInput({ title: note.title, content: note.content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setInput({ title: '', content: '' });
  };

  return (
    <div className="h-full flex flex-col relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 px-1">
        <p className="text-sm text-slate-400 font-medium">
          {notes.length} Catatan
        </p>
        <button 
          onClick={openNew}
          className="bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-slate-700 active:scale-95 transition-all shadow-md"
        >
          <Plus size={16} /> Buat Baru
        </button>
      </div>

      {/* MODAL FORM */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-12 left-0 right-0 z-20 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 mx-1"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-700">
                {editId ? 'Edit Catatan' : 'Tulis Catatan'}
              </h4>
              <button onClick={closeModal} className="text-slate-300 hover:text-slate-500">
                <X size={18}/>
              </button>
            </div>
            
            <input 
              className="w-full text-lg font-bold text-slate-800 placeholder:text-slate-300 outline-none mb-2 bg-transparent"
              placeholder="Judul (Contoh: Tugas RPL)"
              value={input.title}
              onChange={(e) => setInput({...input, title: e.target.value})}
              autoFocus
            />
            <textarea 
              className="w-full h-24 text-sm text-slate-600 placeholder:text-slate-300 outline-none resize-none bg-transparent"
              placeholder="Isi catatan disini..."
              value={input.content}
              onChange={(e) => setInput({...input, content: e.target.value})}
            />
            
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform flex items-center gap-2"
              >
                <Save size={16} /> Simpan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIST NOTES */}
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
                  onClick={() => openEdit(note)} 
                  className={`p-4 rounded-2xl border ${note.color} relative group transition-all hover:shadow-md cursor-pointer active:scale-[0.98]`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">{note.date}</span>
                    <div className="flex gap-2">
                      <span className="opacity-0 group-hover:opacity-40 transition-opacity">
                        <Pencil size={14} />
                      </span>
                      <button 
                        onClick={(e) => handleDelete(e, note.id)}
                        className="text-slate-800/20 hover:text-red-500 transition-colors z-10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{note.title}</h3>
                  <p className="text-sm opacity-90 whitespace-pre-wrap line-clamp-3">{note.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}