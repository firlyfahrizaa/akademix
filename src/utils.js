// src/utils.js

// 1. Alamat Backend Django (Nanti kalau deploy, ganti ini)
export const API_BASE = 'https://firlyfahriza.pythonanywhere.com/api';

// 2. Fungsi Generate ID Unik (Biar data gak ketuker)
export const getDeviceId = () => {
  let id = localStorage.getItem('akademix_device_id');
  if (!id) {
    // Kalau belum punya ID, bikin baru: user-TIMESTAMP-ACAK
    id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('akademix_device_id', id);
  }
  return id;
};

// 3. Header Standar buat Fetch
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Device-ID': getDeviceId(), // <-- Ini tiket masuk ke Django
});