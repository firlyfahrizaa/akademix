import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Save, Pencil, Loader2 } from 'lucide-react';
import { API_BASE, getHeaders } from '../utils';

export default function QuickNotes() {
  // --- STATE ---
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State UI
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null); // <-- ID note yang lagi diedit (null kalau baru)
  
  // State Form
  const [input, setInput] = useState({ title: '', content: '' });
  
  // --- LOAD DATA ---
  useEffect(() => {
    fetch(`${API_BASE}/notes/`, { headers: getHeaders() })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          ...item,
          date: new Date(item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
          })
        }));
        setNotes(formatted);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setIsLoading(false);
      });
  }, []);

  // --- LOGIC TOMBOL EDIT (PENSIL) ---
  const startEdit = (note) => {
    setInput({ title: note.title, content: note.content }); // Isi form dengan data lama
    setEditingId(note.id); // Set ID yang mau diedit
    setIsAdding(true); // Buka modal form
  };

  // --- LOGIC SIMPAN (BISA SAVE BARU / UPDATE LAMA) ---
  const saveNote = async () => {
    if (!input.title || !input.content) return;

    const payload = {
      title: input.title,
      content: input.content,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
    };

    try {
      let url = `${API_BASE}/notes/`;
      let method = 'POST';

      // Kalau lagi mode Edit:
      if (editingId) {
        method = 'PUT'; // Pake method PUT
        payload.id = editingId; // Jangan lupa bawa ID-nya
      }

      const res = await fetch(url, {
        method: method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();

      if (data.status === 'saved' || data.status === 'updated') {
        if (editingId) {
          // UPDATE DI TAMPILAN (Edit Mode)
          setNotes(notes.map(n => n.id === editingId ? { ...n, ...payload } : n));
        } else {
          // UPDATE DI TAMPILAN (New Mode)
          const newNote = { id: data.id, ...payload, date: 'Baru saja' };
          setNotes([newNote, ...notes]);
        }
        
        // Reset Form & Tutup Modal
        setIsAdding(false);
        setEditingId(null);
        setInput({ title: '', content: '' });
      }
    } catch (error) {
      alert("Gagal simpan/update. Cek koneksi backend!");
    }
  };

  // --- HAPUS DATA ---
  const deleteNote = async (id) => {
    setNotes(notes.filter(n => n.id !== id));
    try {
      await fetch(`${API_BASE}/notes/`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ id })
      });
    } catch (error) { console.error("Gagal hapus"); }
  };

  // --- RENDER UI ---
  return (
    <div className="h-full flex flex-col relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-700">Catatan Saya</h3>
          <p className="text-sm text-slate-400">{notes.length} catatan tersimpan</p>
        </div>
        
        <button 
          onClick={() => {
            setEditingId(null); // Pastikan mode-nya "New"
            setInput({ title: '', content: '' });
            setIsAdding(true);
          }} 
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-lg active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* LIST NOTES */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20 space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-40 text-slate-400 gap-2">
            <Loader2 className="animate-spin" /> Memuat...
          </div>
        ) : (
          <AnimatePresence mode='popLayout'>
            {notes.length === 0 ? (
              <div className="text-center text-slate-400 mt-10">Belum ada catatan.</div>
            ) : (
              notes.map((note) => (
                <motion.div
                  key={note.id}
                  layout // <-- Biar animasinya smooth pas geser
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-5 rounded-2xl border ${note.color} relative group hover:shadow-md transition-all`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">
                      {note.date}
                    </span>
                    
                    {/* ACTION BUTTONS */}
                    <div className="flex gap-1">
                      {/* TOMBOL EDIT */}
                      <button 
                        onClick={() => startEdit(note)} // <-- Panggil fungsi edit
                        className="text-black/20 hover:text-blue-600 transition-colors p-1"
                      >
                        <Pencil size={16} />
                      </button>
                      
                      {/* TOMBOL HAPUS */}
                      <button 
                        onClick={() => deleteNote(note.id)}
                        className="text-black/20 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{note.title}</h4>
                  <p className="text-sm opacity-90 whitespace-pre-line leading-relaxed">
                    {note.content}
                  </p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>

      {/* MODAL FORM */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col justify-end md:justify-center"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white border border-slate-200 shadow-2xl rounded-t-3xl md:rounded-2xl p-6 h-[80%] md:h-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-800">
                  {editingId ? 'Edit Catatan' : 'Tulis Catatan'} {/* Ubah Judul */}
                </h3>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Judul Catatan..."
                  value={input.title}
                  onChange={(e) => setInput({ ...input, title: e.target.value })}
                  className="w-full text-lg font-bold text-slate-800 outline-none border-b border-slate-100 pb-2 focus:border-blue-500"
                  autoFocus
                />
                <textarea
                  placeholder="Isi catatanmu di sini..."
                  value={input.content}
                  onChange={(e) => setInput({ ...input, content: e.target.value })}
                  className="w-full h-40 text-slate-600 outline-none resize-none leading-relaxed"
                ></textarea>
                
                <button 
                  onClick={saveNote}
                  disabled={!input.title || !input.content}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex justify-center gap-2 items-center"
                >
                  <Save size={20} />
                  {editingId ? 'Update Catatan' : 'Simpan Catatan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}