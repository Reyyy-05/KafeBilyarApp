# 🎱 Kafe & Bilyar Booking System

Sistem booking meja kafe dan bilyar dengan fitur face recognition untuk absensi admin.

![React Native](https://img.shields.io/badge/React%20Native-0.74-61dafb?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK%2051-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?logo=typescript)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.0-764abc?logo=redux)

---

## 📱 Screenshots

### Customer App
- Onboarding & Login
- Home Screen (Tables, Promo, Stats)
- Booking Flow (Date, Time, Table, Duration)
- Menu Ordering dengan Cart
- Booking Summary & Confirmation
- Booking History

### Admin App
- Admin Login (2FA: Password + Face Recognition)
- Face Verification (Attendance Tracking)
- Admin Dashboard (Stats, Quick Actions)
- Coming Soon: Table/Booking/Menu Management

---

## ✨ Features

### Customer Features
✅ Register & Login  
✅ Browse available tables  
✅ Book table dengan pilihan tanggal, waktu, durasi  
✅ Order menu (food & drinks)  
✅ Cart system (add, increase, decrease, remove)  
✅ Booking summary & confirmation  
✅ Booking history  
✅ Profile management  
✅ Logout  

### Admin Features
✅ 2-Factor Authentication (Password + Face Recognition)  
✅ Attendance tracking dengan face verification  
✅ Dashboard dengan statistics  
✅ Logout  
⏳ Table management (CRUD)  
⏳ Booking management (approve/reject)  
⏳ Menu management (CRUD)  
⏳ Reports & Analytics  

---

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo SDK 51** - Development & build tools
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **Redux Persist** - Offline data persistence
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design UI components
- **Expo Camera** - Face recognition (mobile)

### Backend (Coming Soon)
- **Node.js + Express/NestJS** - REST API
- **PostgreSQL** - Database
- **JWT** - Authentication
- **AWS Rekognition / Azure Face API** - Face recognition
- **Cloudinary / AWS S3** - Image storage

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ & npm
- Expo CLI
- (Optional) Android Studio / Xcode for mobile builds

### Installation

Clone repository
git clone https://github.com/yourusername/KafeBilyarApp.git
cd KafeBilyarApp

Install dependencies
npm install

Start development server
npx expo start

Options:
- Press 'w' for web
- Press 'a' for Android (requires Android Studio)
- Press 'i' for iOS (requires Xcode on macOS)

### Web Development
Start web server
npx expo start --web

Open browser at http://localhost:19006
---

## 📂 Project Structure

KafeBilyarApp/
├── src/
│ ├── screens/
│ │ ├── auth/ # Login, Register, Onboarding
│ │ ├── customer/ # Customer screens
│ │ └── admin/ # Admin screens
│ ├── navigation/
│ │ ├── tabs/ # Tab navigators
│ │ └── types.ts # Navigation types
│ ├── store/
│ │ ├── slices/ # Redux slices
│ │ └── index.ts # Store configuration
│ └── services/ # API services (coming soon)
├── docs/
│ ├── BACKEND_HANDOFF.md # Backend documentation
│ └── DEMO_SCRIPT.md # Presentation guide
├── App.tsx # Root component
├── app.json # Expo configuration
└── package.json # Dependencies
---

## 🎯 Demo Credentials

### Customer
- Email: `rayhan@gmail.com`
- Password: (any password - mock auth)

### Admin
- Username: `admin` / Password: `admin123`
- Username: `kasir1` / Password: `kasir123`
- Username: `superadmin` / Password: `super123`

---
Build for web
npx expo export:web

Deploy to Vercel
vercel deploy

Or deploy to Netlify
netlify deploy --dir web-build
### Android
Build APK
eas build --platform android

Or local build
npx expo run:android
### iOS
Build IPA (requires Apple Developer account)
eas build --platform ios

Or local build
npx expo run:ios
---

## 🛣️ Roadmap

### Phase 1: Foundation ✅
- [x] React Native + TypeScript setup
- [x] Redux Toolkit + Persist
- [x] Navigation (Stack + Tab)
- [x] Expo Web support

### Phase 2: Customer Features ✅
- [x] Authentication (Login/Register/Logout)
- [x] Home screen
- [x] Booking flow
- [x] Menu ordering dengan cart
- [x] Booking history
- [x] Profile management

### Phase 3: Admin Features (In Progress)
- [x] Admin 2FA authentication
- [x] Face verification
- [x] Admin dashboard
- [ ] Table management (CRUD)
- [ ] Booking management
- [ ] Menu management
- [ ] Reports & analytics

### Phase 4: Backend Integration
- [ ] REST API development
- [ ] Database setup
- [ ] Real authentication
- [ ] Face recognition API
- [ ] File upload

### Phase 5: Production
- [ ] Performance optimization
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Push notifications
- [ ] App store deployment

---

## 🤝 Contributing

This is a university project. For backend development:

1. Read `docs/BACKEND_HANDOFF.md`
2. Setup PostgreSQL database
3. Create REST API endpoints
4. Test with frontend

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Developer

**Frontend Developer:** [Your Name]  
**University:** [Your University]  
**Project:** Final Year Project / Thesis  
**Year:** 2025  

---

## 📞 Contact

- Email: [your-email]
- GitHub: [your-github]
- LinkedIn: [your-linkedin]

---

## 🙏 Acknowledgments

- Expo Team untuk amazing framework
- React Native Paper untuk UI components
- Redux Team untuk state management
- Semua open-source contributors

---

**Built with ❤️ using React Native & Expo**

## 📚 Documentation

### For Backend Developers
Lihat `docs/BACKEND_HANDOFF.md` untuk:
- API Endpoints specification
- Database schema
- Authentication flow
- Redux state structure
- Migration guide

### For Presentation
Lihat `docs/DEMO_SCRIPT.md` untuk demo flow

---

## 🔐 Security Features

- **JWT Authentication** - Token-based auth untuk customer & admin
- **Password Hashing** - bcrypt (ready for backend integration)
- **2-Factor Authentication** - Admin harus verify wajah setelah login
- **Face Recognition** - Attendance tracking dengan face matching
- **Redux Persist Encryption** - Secure local storage

---

## 📱 Deployment

### Web

