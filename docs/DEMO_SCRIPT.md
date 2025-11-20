# DEMO SCRIPT - CLIENT PRESENTATION
Kafe & Bilyar Booking System

**Date:** November 21, 2025  
**Duration:** 15-20 minutes  
**Platform:** Web Demo (localhost:8081)

---

## DEMO FLOW

### 1. OPENING (2 menit)
"Selamat pagi/siang Bapak/Ibu. Hari ini saya akan demo sistem booking kafe dan bilyar yang sudah kami develop. Sistem ini memiliki 2 role utama: Customer dan Admin."

---

### 2. CUSTOMER FLOW (8 menit)

#### A. Authentication (1 menit)
1. Buka browser → localhost:8081
2. Show Onboarding Screen
   - "Ini adalah landing page dengan 3 fitur utama"
3. Tap "Mulai Sekarang"
4. Login Screen
   - Email: rayhan@gmail.com
   - Password: (any password)
5. Login → Navigate to Home

#### B. Home Screen (1 menit)
1. Show "Selamat Datang, rayhan"
2. Scroll down - lihat:
   - Promo card
   - Available tables
   - Statistics (bookings, tables, customers)

#### C. Booking Flow (3 menit)
1. Tap "Booking" tab
2. Show Booking Screen
   - "Di sini customer bisa pilih tanggal, waktu, durasi, dan meja"
3. Demo booking:
   - Pilih tanggal: Besok
   - Pilih waktu: 14:00
   - Pilih meja: VIP A1
   - Durasi: 2 jam
4. Show 2 options:
   - "Booking Meja Saja" (tanpa menu)
   - "+ Tambah Menu" (dengan pesan makanan/minuman)

#### D. Menu Ordering (2 menit)
1. Tap "+ Tambah Menu"
2. Show MenuScreen
   - Search bar
   - Category chips (Semua, Minuman, Makanan, Dessert)
   - Menu items dengan emoji
3. Demo add to cart:
   - Tap "+" beberapa items
   - Show quantity controls (+/-)
   - Show delete button
4. Show cart summary di bawah
5. Tap "Lanjut ke Ringkasan"

#### E. Booking Summary & Confirm (1 menit)
1. Show BookingHistoryScreen (Summary mode)
   - Detail booking (meja, waktu, durasi)
   - List menu items
   - Total pembayaran (meja + menu)
   - Info box (payment info)
2. Tap "Konfirmasi Pesanan"
3. Confirm dialog → OK
4. Success alert → Navigate to Home
5. Tap "History" tab → Show saved booking

---

### 3. ADMIN FLOW (6 menit)

#### A. Logout Customer (30 detik)
1. Tap "Profile" tab
2. Tap "Logout"
3. Confirm → Back to Onboarding

#### B. Admin Login (2 menit)
1. Tap "Admin / Kasir Login"
2. Show AdminLoginScreen
   - "Sistem admin memiliki 2-factor authentication"
   - "Step 1: Username & Password"
   - "Step 2: Face Recognition untuk absensi"
3. Demo login:
   - Username: admin
   - Password: admin123
4. Login → Success alert
5. Confirm → Navigate to FaceVerification

#### C. Face Verification (1 menit)
1. Show FaceVerificationScreen
   - "Ini adalah mode Web Demo"
   - "Di mobile device, akan menggunakan camera untuk face recognition"
2. Scroll down (atau zoom out)
3. Show verification info box
4. Tap "Simulasi Verifikasi (Web Demo)"
5. Success alert dengan match score
6. Navigate to AdminDashboard

#### D. Admin Dashboard (2.5 menit)
1. Show header:
   - "Halo, Admin Utama! 👋"
   - Role badge: "Admin"
2. Show Absensi card:
   - "Attendance tracking sudah tercatat"
   - Check-in time
   - Status: Aktif
3. Show statistics:
   - 12 Booking Hari Ini
   - 8 Meja Tersedia
4. Show Menu Admin:
   - "Fitur-fitur ini sedang dalam development oleh backend team"
   - List: Manajemen Meja, Booking, Menu, Laporan
5. Demo logout (tap icon di kanan atas)

---

### 4. TECHNICAL HIGHLIGHTS (2 menit)

"Sekarang saya jelaskan teknologi yang digunakan:"

#### Frontend
- React Native with Expo (cross-platform: Web, Android, iOS)
- TypeScript (type-safe development)
- Redux Toolkit (state management)
- Redux Persist (offline capability)
- React Navigation (smooth navigation)

#### Security Features
- JWT authentication
- Password hashing (ready for backend)
- 2-Factor authentication untuk admin
- Face recognition untuk absensi

#### Current Status
✅ Customer flow (100% complete)
✅ Admin authentication (100% complete)
✅ UI/UX polished for web demo
⏳ Backend API integration (next phase)
⏳ Admin management screens (in development)

---

### 5. NEXT STEPS (1 menit)

"Untuk tahap selanjutnya:"

1. Backend API Development
   - REST API dengan Node.js
   - Database PostgreSQL
   - Face recognition integration
   - File upload untuk images

2. Admin Features Completion
   - Table management (CRUD)
   - Booking approval system
   - Menu management (CRUD)
   - Reports & analytics

3. Mobile Deployment
   - Android APK build
   - iOS TestFlight (optional)

4. Production Deployment
   - Web hosting (Vercel/Netlify)
   - Backend hosting (AWS/Railway)
   - Database hosting (Supabase/AWS RDS)

---

### 6. Q&A (2-3 menit)

Bersiap jawab pertanyaan seperti:

Q: "Berapa lama development backend?"
A: "Estimasi 2-3 minggu untuk core features, sudah ada dokumentasi lengkap untuk backend team"

Q: "Apakah bisa dipakai di mobile?"
A: "Ya, ini React Native. Tinggal build APK/IPA. Web demo untuk kemudahan presentasi."

Q: "Bagaimana dengan face recognition?"
A: "Untuk production akan menggunakan AWS Rekognition atau Azure Face API. Saat ini menggunakan simulasi untuk demo."

Q: "Apakah data aman?"
A: "Ya, menggunakan JWT token, password hashing, dan HTTPS untuk production."

---

### 7. CLOSING (1 menit)

"Terima kasih atas waktunya. Apakah ada pertanyaan atau feedback?

Dokumentasi lengkap dan source code sudah siap untuk diserahkan ke backend team untuk tahap development selanjutnya."

---

## BACKUP PLAN

Jika ada technical issues:
- Screenshot/video demo sudah prepared
- Bisa demo dari recorded video
- Dokumentasi bisa ditunjukkan sebagai alternatif

## TIPS PRESENTASI

✅ Speak slowly & clearly
✅ Tunjukkan setiap feature dengan confidence
✅ Highlight security features (2FA, face recognition)
✅ Emphasize completed work (100% frontend)
✅ Be honest tentang what's next (backend)
✅ Show documentation quality

---

Good luck with your presentation! 🚀
