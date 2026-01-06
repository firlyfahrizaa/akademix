import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

export default function FocusTimer() {
  // --- STATE ---
  const [mode, setMode] = useState('focus'); // 'focus' atau 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Detik default (25 menit)
  const [isActive, setIsActive] = useState(false);

  // --- LOGIC TIMER ---
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Kalau waktu habis, otomatis stop & reset
      setIsActive(false);
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play().catch(e => console.log("Audio play failed")); // Play sound (optional)
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // --- HANDLERS ---
  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  // Format detik ke MM:SS (Contoh: 1500 -> 25:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress Bar Circular (Hitungan Persen)
  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor (Glow Effect) */}
      <motion.div 
        animate={{ scale: isActive ? [1, 1.2, 1] : 1, opacity: isActive ? 0.4 : 0.2 }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={`absolute w-80 h-80 rounded-full blur-3xl -z-10 ${mode === 'focus' ? 'bg-orange-300' : 'bg-blue-300'}`}
      />

      {/* 1. SWITCH MODE BUTTONS */}
      <div className="bg-slate-100 p-1 rounded-xl flex mb-10 w-full max-w-xs">
        <button 
          onClick={() => switchMode('focus')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'focus' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}
        >
          <Zap size={16} /> Fokus
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'break' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
        >
          <Coffee size={16} /> Istirahat
        </button>
      </div>

      {/* 2. TIMER DISPLAY */}
      <div className="relative mb-12">
        {/* Lingkaran Luar (SVG) */}
        <svg className="w-64 h-64 transform -rotate-90">
          <circle
            cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - (timeLeft / totalTime))} // Logic Progress Bar
            strokeLinecap="round"
            className={`transition-all duration-1000 ${mode === 'focus' ? 'text-orange-500' : 'text-blue-500'}`}
          />
        </svg>

        {/* Angka di Tengah */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.h1 
            key={timeLeft}
            initial={{ y: 5, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-6xl font-black tracking-tighter ${mode === 'focus' ? 'text-slate-800' : 'text-slate-800'}`}
          >
            {formatTime(timeLeft)}
          </motion.h1>
          <p className="text-slate-400 font-medium tracking-widest uppercase text-xs mt-2">
            {isActive ? 'Sedang Berjalan' : 'Paused'}
          </p>
        </div>
      </div>

      {/* 3. CONTROL BUTTONS */}
      <div className="flex gap-4">
        <button 
          onClick={toggleTimer}
          className={`p-6 rounded-2xl text-white shadow-lg active:scale-95 transition-all ${mode === 'focus' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
        </button>
        
        <button 
          onClick={resetTimer}
          className="p-6 rounded-2xl bg-white text-slate-400 border border-slate-100 shadow-sm hover:text-slate-600 active:scale-95 transition-all"
        >
          <RotateCcw size={32} />
        </button>
      </div>

    </div>
  );
}