import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpDown, Ruler, Thermometer, Weight, Grid, 
  Database, Gauge, Box, Droplets, Clock, Zap, 
  Activity, Layers, Cpu, ChevronLeft
} from 'lucide-react';

export default function UnitConverter() {
  // --- STATE ---
  // Mode: 'main' (3 tab awal), 'grid' (menu lainnya), 'sub' (lagi buka menu lainnya)
  const [viewMode, setViewMode] = useState('main'); 
  const [category, setCategory] = useState('length'); 
  
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [unit1, setUnit1] = useState('m');
  const [unit2, setUnit2] = useState('cm');

  // --- DATABASE SATUAN (THE ENGINEERING 12) ---
  const categories = {
    // === TAB UTAMA ===
    length: { label: 'Panjang', icon: <Ruler size={18}/>, color: 'bg-emerald-500', units: ['km', 'm', 'cm', 'mm', 'inch', 'ft', 'mile'] },
    weight: { label: 'Berat', icon: <Weight size={18}/>, color: 'bg-blue-500', units: ['kg', 'g', 'mg', 'lbs', 'oz', 'ton'] },
    temp:   { label: 'Suhu', icon: <Thermometer size={18}/>, color: 'bg-orange-500', units: ['C', 'F', 'K', 'R'] },
    
    // === MENU LAINNYA (ENGINEERING PACK) ===
    data:   { label: 'Data', icon: <Database size={24}/>, color: 'bg-indigo-500', units: ['bit', 'Byte', 'KB', 'MB', 'GB', 'TB'] },
    speed:  { label: 'Kecepatan', icon: <Gauge size={24}/>, color: 'bg-red-500', units: ['m/s', 'km/h', 'mph', 'knot', 'mach'] },
    angle:  { label: 'Sudut', icon: <Activity size={24}/>, color: 'bg-violet-500', units: ['deg', 'rad', 'grad'] },
    area:   { label: 'Luas', icon: <Layers size={24}/>, color: 'bg-teal-500', units: ['m2', 'km2', 'ha', 'acre'] },
    volume: { label: 'Volume', icon: <Box size={24}/>, color: 'bg-cyan-500', units: ['m3', 'liter', 'ml', 'gal', 'barrel'] },
    time:   { label: 'Waktu', icon: <Clock size={24}/>, color: 'bg-amber-500', units: ['sec', 'min', 'hour', 'day', 'week', 'year'] },
    press:  { label: 'Tekanan', icon: <Droplets size={24}/>, color: 'bg-sky-600', units: ['Pa', 'bar', 'psi', 'atm'] },
    energy: { label: 'Energi', icon: <Zap size={24}/>, color: 'bg-yellow-500', units: ['J', 'kJ', 'cal', 'kWh', 'BTU'] },
    power:  { label: 'Daya', icon: <Cpu size={24}/>, color: 'bg-pink-500', units: ['W', 'kW', 'HP', 'PK'] },
  };

  // --- LOGIC KONVERSI SAKTI ---
  const convert = (val, from, to, cat) => {
    if (!val) return '';
    const n = parseFloat(val);
    
    // 1. Logic Khusus: Suhu
    if (cat === 'temp') {
      if (from === to) return n;
      let c = n; 
      // Convert all to Celcius first
      if (from === 'F') c = (n - 32) * 5/9;
      if (from === 'K') c = n - 273.15;
      if (from === 'R') c = n * 5/4;
      // Convert Celcius to Target
      if (to === 'C') return c;
      if (to === 'F') return (c * 9/5) + 32;
      if (to === 'K') return c + 273.15;
      if (to === 'R') return c * 4/5;
    }

    // 2. Logic Umum: Base Unit Multiplier
    const rates = {
      // Length (Base: m)
      km:1000, m:1, cm:0.01, mm:0.001, inch:0.0254, ft:0.3048, mile:1609.34,
      // Weight (Base: kg)
      kg:1, g:0.001, mg:1e-6, lbs:0.453592, oz:0.0283495, ton:1000,
      // Data (Base: bit) - Binary version
      bit:1, Byte:8, KB:8192, MB:8388608, GB:8589934592, TB:8796093022208,
      // Speed (Base: m/s)
      'm/s':1, 'km/h':0.277778, mph:0.44704, knot:0.514444, mach:343,
      // Angle (Base: degree)
      deg:1, rad:57.2958, grad:0.9,
      // Area (Base: m2)
      m2:1, km2:1e6, ha:10000, acre:4046.86,
      // Volume (Base: liter)
      liter:1, ml:0.001, m3:1000, gal:3.78541, barrel:158.987,
      // Time (Base: sec)
      sec:1, min:60, hour:3600, day:86400, week:604800, year:31536000,
      // Pressure (Base: Pa)
      Pa:1, bar:100000, psi:6894.76, atm:101325,
      // Energy (Base: Joule)
      J:1, kJ:1000, cal:4.184, kWh:3600000, BTU:1055.06,
      // Power (Base: Watt)
      W:1, kW:1000, HP:745.7, PK:735.5
    };

    if (rates[from] !== undefined && rates[to] !== undefined) {
      const baseValue = n * rates[from];
      return baseValue / rates[to];
    }
    return n;
  };

  // --- EFFECT ---
  useEffect(() => {
    const result = convert(val1, unit1, unit2, category);
    setVal2(result === '' ? '' : parseFloat(result.toPrecision(6)).toString());
  }, [val1, unit1, unit2, category]);

  // --- HANDLERS ---
  const handleTabClick = (key) => {
    if (key === 'others') {
      setViewMode('grid');
    } else {
      setViewMode('main');
      setCategory(key);
      setVal1(''); setVal2('');
      setUnit1(categories[key].units[0]);
      setUnit2(categories[key].units[1]);
    }
  };

  const handleGridClick = (key) => {
    setCategory(key);
    setViewMode('sub'); // Masuk mode konversi khusus
    setVal1(''); setVal2('');
    setUnit1(categories[key].units[0]);
    setUnit2(categories[key].units[1]);
  };

  return (
    <div className="h-full flex flex-col p-2 overflow-hidden">
      
      {/* 1. TABS NAVIGATION */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 mb-4 flex-shrink-0">
        {['length', 'weight', 'temp'].map((key) => (
          <button
            key={key}
            onClick={() => handleTabClick(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'main' && category === key 
                ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {categories[key].icon}
            <span className="hidden sm:inline">{categories[key].label}</span>
          </button>
        ))}
        {/* Tombol LAINNYA */}
        <button
          onClick={() => handleTabClick('others')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'grid' || viewMode === 'sub'
              ? 'bg-slate-800 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Grid size={18}/>
          <span className="hidden sm:inline">Lainnya</span>
        </button>
      </div>

      {/* 2. CONTENT AREA */}
      <AnimatePresence mode="wait">
        
        {/* MODE A: GRID MENU (The 9 Engineering Tools) */}
        {viewMode === 'grid' && (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 overflow-y-auto pb-4"
          >
            <div className="grid grid-cols-3 gap-3 p-1">
              {['data', 'speed', 'angle', 'area', 'volume', 'time', 'press', 'energy', 'power'].map((key, idx) => (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleGridClick(key)}
                  className="aspect-square bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <div className={`${categories[key].color} text-white p-2.5 rounded-full shadow-md`}>
                    {categories[key].icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 text-center px-1 leading-tight">
                    {categories[key].label}
                  </span>
                </motion.button>
              ))}
            </div>
            <p className="text-center text-xs text-slate-300 mt-4">Pilih kategori</p>
          </motion.div>
        )}

        {/* MODE B: CONVERTER UI (Main & Sub) */}
        {(viewMode === 'main' || viewMode === 'sub') && (
          <motion.div 
            key="converter"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col gap-4"
          >
            
            {/* Header Khusus Menu Lainnya (Tombol Back) */}
            {viewMode === 'sub' && (
              <div className="flex items-center gap-2 mb-2 px-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className="p-1.5 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${categories[category].color}`}></span>
                  {categories[category].label}
                </span>
              </div>
            )}

            {/* INPUT DARI */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all shadow-sm">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Dari Satuan
              </label>
              <div className="flex gap-3">
                <input 
                  type="number" 
                  placeholder="0"
                  value={val1}
                  onChange={(e) => setVal1(e.target.value)}
                  className="w-full text-3xl font-bold text-slate-800 outline-none placeholder:text-slate-200"
                />
                <select 
                  value={unit1}
                  onChange={(e) => setUnit1(e.target.value)}
                  className="bg-slate-50 border border-slate-200 font-bold text-slate-600 rounded-xl px-2 outline-none text-sm max-w-[80px]"
                >
                  {categories[category].units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* TOMBOL SWAP */}
            <div className="flex justify-center -my-3 relative z-10">
              <motion.button 
                whileTap={{ rotate: 180 }}
                onClick={() => {
                  setUnit1(unit2); setUnit2(unit1); setVal1(val2);
                }}
                className={`p-3 rounded-full text-white shadow-lg border-4 border-white ${categories[category].color}`}
              >
                <ArrowUpDown size={20} />
              </motion.button>
            </div>

            {/* INPUT MENJADI */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 shadow-inner">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Menjadi Satuan
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  readOnly
                  value={val2}
                  placeholder="0"
                  className="w-full text-3xl font-bold text-slate-600 bg-transparent outline-none placeholder:text-slate-200"
                />
                <select 
                  value={unit2}
                  onChange={(e) => setUnit2(e.target.value)}
                  className="bg-white border border-slate-200 font-bold text-slate-600 rounded-xl px-2 outline-none text-sm max-w-[80px]"
                >
                  {categories[category].units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}