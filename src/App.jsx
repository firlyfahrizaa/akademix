import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IpkCalculator from './components/IpkCalculator';
import FocusTimer from './components/FocusTimer';
import UnitConverter from './components/UnitConverter';
import QuickNotes from './components/QuickNotes';
import { 
  Calculator, 
  Clock, 
  Ruler, 
  BookOpen, 
  X
} from 'lucide-react';

// --- DATA MENU TOOLS ---
const tools = [
  {
    id: 'ipk',
    title: 'IPK Calculator',
    desc: 'Target SKS & Nilai',
    icon: <Calculator size={28} />,
    color: 'bg-blue-50 text-blue-600',
    delay: 0.1
  },
  {
    id: 'focus',
    title: 'Focus Timer',
    desc: 'Teknik Pomodoro',
    icon: <Clock size={28} />,
    color: 'bg-orange-50 text-orange-600',
    delay: 0.2
  },
  {
    id: 'unit',
    title: 'Unit Converter',
    desc: 'Konversi Satuan',
    icon: <Ruler size={28} />,
    color: 'bg-emerald-50 text-emerald-600',
    delay: 0.3
  },
  {
    id: 'notes',
    title: 'Quick Notes',
    desc: 'Catatan Kilat',
    icon: <BookOpen size={28} />,
    color: 'bg-purple-50 text-purple-600',
    delay: 0.4
  },
];

function App() {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 selection:bg-blue-100">
      
      {/* HEADER */}
      <header className="px-6 pt-12 pb-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">Dashboard</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Akademix<span className="text-blue-600">.</span>
          </h1>
        </motion.div>
      </header>

      {/* GRID MENU AREA */}
      <main className="px-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              onClick={() => setActiveMenu(tool.id)}
              
              // Animasi Interaksi
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.96 }}
              
              // Animasi Masuk
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: tool.delay, duration: 0.4, type: "spring" }}
              
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              {/* Dekorasi Background Bulat */}
              <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 transition-transform group-hover:scale-125 ${tool.color.split(' ')[0].replace('bg-', 'bg-')}`} style={{backgroundColor: 'currentColor'}} />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className={`p-3.5 rounded-2xl w-fit mb-4 ${tool.color}`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800 leading-tight">{tool.title}</h3>
                  <p className="text-sm text-slate-400 font-medium">{tool.desc}</p>
                </div>
                
                {/* Titik tiga sudah dihapus disini sesuai request */}
              </div>
            </motion.div>
          ))}

        </div>

        {/* FOOTER (UPDATED BY FIRLY FAHRIZA) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center pb-8"
        >
          <p className="text-slate-400 text-xs font-medium">
            Designed & Built by{' '}
            <a 
              href="https://instagram.com/firlyfahriza"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline cursor-pointer transition-colors hover:text-blue-500"
            >
              Firly Fahriza
            </a>
          </p>
        </motion.div>
      </main>

      {/* MODAL POPUP (Tempat Fitur Nanti) */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center sm:p-4"
            onClick={() => setActiveMenu(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md h-[85vh] md:h-auto md:min-h-[500px] rounded-t-[2.5rem] md:rounded-[2rem] p-8 flex flex-col shadow-2xl"
            >
              {/* Header Modal */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {tools.find(t => t.id === activeMenu)?.title}
                  </h2>
                  <p className="text-slate-400 text-sm">Tools</p>
                </div>
                <button 
                  onClick={() => setActiveMenu(null)}
                  className="bg-slate-100 p-2.5 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Area Konten Tools */}
              <div className="flex-1 h-full overflow-hidden relative">
                
                {activeMenu === 'ipk' && <IpkCalculator />}
                {activeMenu === 'focus' && <FocusTimer />}
                {activeMenu === 'unit' && <UnitConverter />}
                {activeMenu === 'notes' && <QuickNotes />}

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;