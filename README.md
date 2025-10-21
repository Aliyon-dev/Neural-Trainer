# Neural Trainer 🏋️‍♂️

A modern fitness tracking application built with React, TypeScript, and Firebase. Track your workouts, monitor your mood, and gain insights into your fitness journey with a beautiful, responsive interface.

## ✨ Features

### 🔐 Authentication
- **Firebase Authentication** with email/password
- **Protected Routes** - Secure dashboard access
- **Toast Notifications** - Real-time feedback for auth actions
- **Persistent Sessions** - Stay logged in across browser sessions

### 🎨 User Interface
- **Modern Design** - Clean, fitness-focused aesthetic
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion powered interactions
- **Custom Typography** - Pacifico for headings, Manrope for body text
- **Dark Theme** - Easy on the eyes during workouts

### 🏗️ Architecture
- **Monorepo Structure** - Organized with PNPM workspaces
- **TypeScript** - Full type safety across the application
- **Component Library** - Reusable UI components with shadcn/ui
- **State Management** - React Context for authentication
- **Route Protection** - Secure navigation with React Router

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend & Services
- **Firebase** - Authentication and future backend services
- **tRPC** - Type-safe API layer (prepared for future use)

### Development
- **PNPM** - Fast, disk space efficient package manager
- **Turborepo** - Monorepo build system
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
Neural-Trainer/
├── apps/
│   └── web/                    # Frontend React application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   │   ├── ui/         # shadcn/ui components
│       │   │   ├── AuthLayout.tsx
│       │   │   ├── AuthHeader.tsx
│       │   │   ├── AuthForm.tsx
│       │   │   ├── ProtectedRoute.tsx
│       │   │   └── ...
│       │   ├── contexts/       # React Context providers
│       │   │   └── AuthContext.tsx
│       │   ├── lib/            # Utilities and configurations
│       │   │   ├── firebase.ts
│       │   │   └── utils.ts
│       │   ├── routes/          # Page components
│       │   │   ├── App.tsx      # Landing page
│       │   │   ├── Login.tsx    # Authentication
│       │   │   ├── Signup.tsx   # User registration
│       │   │   └── Dashboard.tsx # Main app interface
│       │   └── main.tsx         # App entry point
│       ├── package.json
│       └── ...
├── packages/
│   └── shared/                 # Shared schemas and types
│       ├── src/
│       │   ├── schemas.ts       # Zod validation schemas
│       │   └── index.ts
│       └── package.json
├── functions/                  # Firebase Functions (future)
│   ├── src/
│   │   ├── trpc/               # tRPC router definitions
│   │   └── index.ts
│   └── package.json
├── .gitignore
├── package.json               # Root package.json
├── pnpm-workspace.yaml         # PNPM workspace config
├── turbo.json                  # Turborepo configuration
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- **Node.js** 18+ 
- **PNPM** (recommended) or npm/yarn
- **Firebase Project** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neural-trainer.git
   cd neural-trainer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env` file in `apps/web/`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com)
2. **Enable Authentication** with Email/Password provider
3. **Get your config** from Project Settings > General > Your apps
4. **Add the config** to your `.env` file

## 🎯 Usage

### Authentication Flow
1. **Landing Page** - Beautiful hero section with call-to-action
2. **Sign Up** - Create account with email/password
3. **Login** - Access existing account
4. **Dashboard** - Protected area with user information
5. **Logout** - Secure sign out with confirmation

### Key Features
- **Responsive Design** - Works on all screen sizes
- **Loading States** - Smooth user experience during auth
- **Error Handling** - Clear feedback for all scenarios
- **Route Protection** - Automatic redirects based on auth state

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev                    # Start all apps in development mode
pnpm dev --filter=web       # Start only the web app

# Building
pnpm build                  # Build all apps
pnpm build --filter=web     # Build only the web app

# Linting
pnpm lint                   # Lint all packages
pnpm lint --filter=web      # Lint only the web app

# Type checking
pnpm typecheck              # Type check all packages
```

### Code Quality
- **ESLint** - Configured for React, TypeScript, and accessibility
- **Prettier** - Consistent code formatting
- **TypeScript** - Strict type checking enabled
- **Component Structure** - Organized, reusable components

## 🔮 Future Features

### Planned Development
- **Workout Tracking** - Log exercises, sets, and reps
- **Mood Monitoring** - Track mental wellness and energy levels
- **Progress Analytics** - Visualize fitness journey with charts
- **Social Features** - Connect with friends and share achievements
- **Mobile App** - React Native version for iOS/Android

### Technical Roadmap
- **Backend API** - tRPC implementation with Firebase Functions
- **Database** - Firestore for user data storage
- **Real-time Updates** - Live synchronization across devices
- **Offline Support** - PWA capabilities for mobile users
- **Testing** - Comprehensive test suite with Jest and Cypress

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`pnpm lint && pnpm typecheck`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful, accessible component library
- **Firebase** - Robust authentication and backend services
- **Framer Motion** - Smooth, performant animations
- **Tailwind CSS** - Utility-first CSS framework
- **React Team** - Amazing frontend framework

## 📞 Support

- **Issues** - [GitHub Issues](https://github.com/yourusername/neural-trainer/issues)
- **Discussions** - [GitHub Discussions](https://github.com/yourusername/neural-trainer/discussions)
- **Email** - support@neuraltrainer.com

---

**Built with ❤️ for fitness enthusiasts everywhere**

*Start your transformation today with Neural Trainer!* 🚀
