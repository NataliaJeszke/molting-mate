# 🕷️ Molting Mate

A comprehensive mobile application for tarantula enthusiasts to manage their spider collection, track feeding schedules, monitor molting history, and receive timely care reminders.

<div align="center">

[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020.svg?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB.svg?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](#license)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Background Tasks](#-background-tasks)
- [Internationalization](#-internationalization)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Known Limitations](#-known-limitations)
- [License](#-license)

---

## ✨ Features

### 🗂️ Collection Management
- **Comprehensive Spider Profiles** - Track name, species, age, gender, photos, and origin documents
- **Species Database** - Pre-seeded with common tarantula species, add custom species
- **Favorites** - Mark favorite spiders for quick access
- **Search & Filter** - Filter by species, gender, age, and feeding/molting dates
- **Sort Options** - Sort by last feeding, last molt, or next feeding date

### 🍽️ Feeding Management
- **Feeding Schedules** - Set custom feeding frequencies (multiple times/week, weekly, bi-weekly, monthly, rarely)
- **Feeding History** - Complete feeding log for each spider
- **Smart Status Tracking** - Visual indicators for hungry spiders and those needing feeding today
- **Upcoming Feeds** - Preview spiders that need feeding in the next 1-3 days

### 🦗 Molting Management
- **Molting History** - Track each molt with date and instar (L) progression
- **Age Tracking** - Automatically increments instar count with each molt
- **Molt Timeline** - View complete molting history per spider

### 🔔 Smart Notifications
- **Background Task System** - Checks feeding status approximately every hour
- **Daily Reminders** - Notifications at 12:00 PM for spiders needing feeding
- **Badge Counter** - App icon badge shows number of spiders to feed
- **Localized Messages** - Notifications in user's preferred language

### 🎨 User Experience
- **Dark/Light Themes** - Automatic theme switching with custom color schemes
- **Multi-language Support** - Full Polish and English translations
- **Smooth Animations** - React Native Reanimated for fluid UI transitions
- **Optimized Lists** - FlashList for high-performance scrolling

### 📱 Cross-Platform
- **iOS Support** - Full native iOS experience
- **Android Support** - Optimized for Android devices
- **Responsive Design** - Adapts to different screen sizes

---

## 📸 Screenshots

---

## 🛠️ Tech Stack

### Core Framework
- **[Expo SDK 54](https://expo.dev)** - Development platform
- **[React Native 0.81.5](https://reactnative.dev/)** - Mobile framework
- **[TypeScript 5.3](https://www.typescriptlang.org/)** - Type safety
- **[Expo Router 6.0](https://docs.expo.dev/router/introduction/)** - File-based navigation

### State Management & Data
- **[Zustand 5.0](https://github.com/pmndrs/zustand)** - Normalized state management
- **[Expo SQLite 16.0](https://docs.expo.dev/versions/latest/sdk/sqlite/)** - Local database
- **[@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/)** - Persistent storage

### UI & Animations
- **[React Native Reanimated 4.1](https://docs.swmansion.com/react-native-reanimated/)** - Animations
- **[React Native Gesture Handler 2.28](https://docs.swmansion.com/react-native-gesture-handler/)** - Touch gestures
- **[@shopify/flash-list 2.0](https://shopify.github.io/flash-list/)** - Optimized lists
- **[Expo Blur 15.0](https://docs.expo.dev/versions/latest/sdk/blur-view/)** - Blur effects
- **[Lottie React Native 7.3](https://github.com/lottie-react-native/lottie-react-native)** - Vector animations

### Notifications & Background Tasks
- **[Expo Notifications 0.32](https://docs.expo.dev/versions/latest/sdk/notifications/)** - Push notifications
- **[Expo Background Task 1.0](https://docs.expo.dev/versions/latest/sdk/background-task/)** - Background processing
- **[Expo Task Manager 14.0](https://docs.expo.dev/versions/latest/sdk/task-manager/)** - Task scheduling

### Media & Documents
- **[Expo Image Picker 17.0](https://docs.expo.dev/versions/latest/sdk/imagepicker/)** - Photo selection
- **[Expo Document Picker 14.0](https://docs.expo.dev/versions/latest/sdk/document-picker/)** - Document uploads
- **[React Native PDF 6.7](https://github.com/wonday/react-native-pdf)** - PDF viewing
- **[React Native WebView 13.15](https://github.com/react-native-webview/react-native-webview)** - Web content

### Internationalization & Utilities
- **[i18n-js 4.5](https://github.com/fnando/i18n-js)** - Translations (PL/EN)
- **[date-fns 4.1](https://date-fns.org/)** - Date manipulation
- **[Expo Localization 17.0](https://docs.expo.dev/versions/latest/sdk/localization/)** - Locale detection

### Development Tools
- **[ESLint 8.57](https://eslint.org/)** - Code linting
- **[Prettier 3.5](https://prettier.io/)** - Code formatting
- **[Jest 29.7](https://jestjs.io/)** - Testing framework

---

## 🏗️ Architecture

### Normalized State Management

```typescript
// Zustand Store Structure
{
  byId: { [spiderId: string]: SpiderDetailType },  // O(1) lookups
  allIds: string[],                                 // Ordered list
  version: number                                   // Reactivity trigger
}
```

**Benefits:**
- O(1) spider lookups by ID
- Single source of truth
- Optimistic updates
- Minimal re-renders

### Database Schema

```sql
-- Spiders Table
CREATE TABLE spiders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  spiderSpecies INTEGER,
  individualType TEXT,
  lastFed TEXT,
  feedingFrequency TEXT,
  lastMolt TEXT,
  imageUri TEXT,
  isFavourite INTEGER,
  status TEXT,
  nextFeedingDate TEXT,
  FOREIGN KEY (spiderSpecies) REFERENCES species(id)
);

-- Species Table
CREATE TABLE species (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

-- Feeding History
CREATE TABLE feedingHistory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  spiderId TEXT NOT NULL,
  date TEXT NOT NULL,
  FOREIGN KEY (spiderId) REFERENCES spiders(id) ON DELETE CASCADE
);

-- Molting History
CREATE TABLE moltingHistory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  spiderId TEXT NOT NULL,
  date TEXT NOT NULL,
  FOREIGN KEY (spiderId) REFERENCES spiders(id) ON DELETE CASCADE
);

-- Documents
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  spiderId TEXT NOT NULL,
  documentUri TEXT NOT NULL,
  FOREIGN KEY (spiderId) REFERENCES spiders(id) ON DELETE CASCADE
);
```

### File-Based Routing

```
app/
├── (tabs)/
│   ├── index.tsx          # Home/Collection
│   ├── feeding.tsx        # Feeding tracker
│   ├── molting.tsx        # Molting tracker
│   └── profile.tsx        # Settings
├── spider/[id].tsx        # Spider detail
├── spiderForm.tsx         # Add/Edit spider
└── _layout.tsx            # Root layout
```

---

## 📦 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Expo CLI** (installed automatically)
- **iOS Development:**
  - macOS with Xcode 15+
  - iOS Simulator or physical device
- **Android Development:**
  - Android Studio
  - Android Emulator or physical device

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/molting-mate.git
cd molting-mate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npx expo start
```

### 4. Run on Device/Emulator

**iOS Simulator:**
```bash
npx expo run:ios
```

**Android Emulator:**
```bash
npx expo run:android
```

**Physical Device (Expo Go):**
- Scan QR code with Expo Go app
- Note: Background tasks require development build

---

## 📁 Project Structure

```
molting-mate/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── index.tsx            # Collection screen
│   │   ├── feeding.tsx          # Feeding tracker
│   │   ├── molting.tsx          # Molting tracker
│   │   └── profile.tsx          # Settings
│   ├── spider/[id].tsx          # Spider detail (dynamic)
│   ├── spiderForm.tsx           # Add/Edit spider
│   └── _layout.tsx              # Root layout & providers
│
├── components/
│   ├── commons/                 # Reusable components
│   │   ├── Filters/             # Filter modal
│   │   ├── ModalUpdate/         # Feeding/Molting update
│   │   ├── SpiderListItem/      # List item component
│   │   └── ...
│   └── ui/                      # Base UI components
│       ├── ThemedText.tsx
│       ├── ThemedDatePicker.tsx
│       └── ...
│
├── core/                        # Feature components
│   ├── CollectionListComponent/
│   ├── FeedingListComponent/
│   ├── MoltingListComponent/
│   ├── SpiderDetail/
│   └── SpiderForm/
│
├── store/                       # Zustand stores
│   ├── spidersStore.ts         # Main spider state
│   ├── filtersStore.ts         # Filter state
│   ├── spiderSpeciesStore.ts   # Species state
│   └── userStore.ts            # User preferences
│
├── db/                          # Database layer
│   └── database.ts             # SQLite operations
│
├── services/                    # Business logic
│   └── backgroundNotifications.ts # Background task handler
│
├── hooks/                       # Custom React hooks
│   ├── useFeedingNotifications.ts
│   ├── useSpiderFilter.ts
│   ├── useDebounce.ts
│   └── ...
│
├── language/                    # Internationalization
│   ├── locales/
│   │   ├── en.json
│   │   └── pl.json
│   └── i18n.ts
│
├── constants/                   # App constants & enums
│   ├── Colors.ts
│   ├── FeedingFrequency.enums.ts
│   └── ...
│
└── assets/                      # Static resources
    ├── images/
    └── fonts/
```

---

## 🗄️ Database Schema

The app uses SQLite for local data persistence with the following key tables:

- **spiders** - Main spider records
- **species** - Spider species catalog
- **feedingHistory** - Feeding log entries
- **moltingHistory** - Molt records
- **documents** - Origin document attachments

All operations use foreign keys with CASCADE DELETE for data integrity.

---

## ⏰ Background Tasks

### How It Works

1. **Registration** - When notifications are enabled, background task registers with system
2. **Execution** - System wakes app approximately every 60 minutes
3. **Database Check** - Task queries SQLite for spiders needing feeding
4. **Notification Scheduling** - If before 12:00, schedules notification for noon; otherwise shows immediately
5. **Badge Update** - Updates app icon badge with feeding count

### Task Flow

```
User Enables Notifications
         ↓
registerBackgroundTaskAsync()
         ↓
System schedules task (min. interval: 60 min)
         ↓
TaskManager.defineTask() executes in background
         ↓
├─ Query spiders from SQLite
├─ Calculate feeding status
├─ Update badge count
└─ Schedule/show notification
         ↓
User receives notification at 12:00 PM
```

### Limitations

- **iOS Simulator**: Background tasks unavailable (requires physical device)
- **Minimum Interval**: 60 minutes on iOS, 15 minutes on Android
- **System Discretion**: Exact timing controlled by OS for battery optimization
- **Expo Go**: Not supported (requires development build)

---

## 🌍 Internationalization

Supports **Polish (pl)** and **English (en)** with complete translations for:

- UI labels and buttons
- Notification messages
- Form validation errors
- Species names (optionally)

**Change Language:**
Profile → Settings → Language

**Translation Files:**
- `language/locales/pl.json`
- `language/locales/en.json`

---

## 💻 Development

### Run Linter

```bash
npm run lint
```

### Fix Linting Issues

```bash
npm run lint:fix
```

### Run Tests

```bash
npm test
```

### Clear Cache

```bash
npx expo start --clear
```

### Prebuild Native Projects

```bash
npx expo prebuild --clean
```

---

## 📱 Building for Production

### iOS

```bash
# Local build
npx expo run:ios --configuration Release

# EAS Build (recommended)
eas build --platform ios
```

### Android

```bash
# Local build
npx expo run:android --variant release

# EAS Build (recommended)
eas build --platform android
```

### Configure EAS Build

1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure: `eas build:configure`
4. Build: `eas build --platform all`

---

## ⚠️ Known Limitations

### Background Tasks
- **iOS Simulator**: Background tasks API unavailable - test on physical device
- **Expo Go**: Background tasks require development build with `expo-dev-client`
- **Timing**: System determines exact execution time (not guaranteed at 9:00 AM)

### React Native Reanimated
- Version mismatch in Expo Go - use development build for full animation support

### Database
- SQLite is local only - no cloud sync implemented
- No automatic backup system

---

## 📄 License

**Copyright © 2025. All Rights Reserved.**

This software and associated documentation files (the "Software") are proprietary and confidential.

**RESTRICTIONS:**

- ❌ **Commercial Use**: Prohibited
- ❌ **Non-Commercial Use**: Prohibited without written permission
- ❌ **Copying**: Prohibited
- ❌ **Distribution**: Prohibited
- ❌ **Modification**: Prohibited
- ❌ **Sublicensing**: Prohibited

**This Software is provided for viewing purposes only.** No license is granted for use, reproduction, or distribution in any form.

For licensing inquiries, please contact the author.

---

<div align="center">

**Made with ❤️ for Tarantula Enthusiasts**

</div>
