# EventFDR - Event Finding & Registration Platform

A modern event discovery and registration platform built with **Next.js 15**, **TypeScript**, and **React 19**.

![EventFDR](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)

## ✨ Features

- 🔍 **Event Discovery** - Browse and search events with filters
- 🎫 **Event Registration** - Book tickets with multiple payment options
- 👤 **User Authentication** - Login, register, and manage profile
- 📝 **Event Creation** - Multi-step form to create new events
- 🎨 **Modern UI** - Dark theme with glassmorphism and animations
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast Performance** - Next.js App Router with Turbopack

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/zeeshan-0705/EventFDR.git
cd EventFDR

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Account

- **Email:** `demo@eventfdr.com`
- **Password:** `demo123`

## 📁 Project Structure

```
EventFDR/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── events/             # Events listing page
│   │   ├── event/[eventId]/    # Event detail (dynamic route)
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── my-tickets/         # User's tickets
│   │   └── create-event/       # Event creation wizard
│   ├── components/             # Reusable UI components
│   ├── contexts/               # React Context providers
│   ├── data/                   # Mock data
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
├── public/                     # Static assets
└── package.json
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** CSS Modules
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **State Management:** React Context API

## 📜 Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Design Features

- Dark theme with subtle gradients
- Glassmorphism effects
- Smooth animations and transitions
- Responsive grid layouts
- Modern typography (Inter & Outfit fonts)

## 📄 License

MIT License - feel free to use this project for learning and personal projects.

## 👨‍💻 Author

Built with ❤️ by Zeeshan
