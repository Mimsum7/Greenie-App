# 🌱 Greenie - Carbon Footprint Tracker & Habit Builder

<div align="center">
  <img src="./assets/images/Greenie%20logo.png" alt="Greenie Logo" width="200" height="200">
  
  **Your personal carbon coach for building sustainable habits**
  
  [![Expo](https://img.shields.io/badge/Expo-52.0.30-blue.svg)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React%20Native-0.79.1-green.svg)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
</div>

## 📖 Overview

Greenie is a comprehensive carbon footprint tracking and habit-building mobile application that gamifies the journey toward sustainable living. Users can track their daily carbon emissions, build eco-friendly habits, and watch their virtual plant grow as they make environmentally conscious choices.

## 🌍 The Problem We Solve

### Climate Action Paralysis
Many people want to reduce their environmental impact but don't know where to start or how to measure their progress. Traditional carbon calculators are complex, one-time tools that don't encourage ongoing behavior change.

### Lack of Motivation
Sustainable living can feel overwhelming without immediate feedback or rewards. People struggle to maintain eco-friendly habits without clear progress tracking and motivation.

### Disconnected Actions
Users often don't understand the real impact of their daily choices on their carbon footprint, making it difficult to prioritize which changes will have the most significant effect.

## ✨ Our Solution

Greenie addresses these challenges by providing:

- **🎯 Personalized Carbon Goals**: Set daily carbon limits based on your lifestyle and sustainability ambitions
- **📊 Real-time Tracking**: Log activities and see immediate carbon impact calculations
- **🌱 Gamified Growth**: Watch your virtual plant evolve as you earn points through sustainable actions
- **🏆 Habit Building**: Choose from curated eco-friendly habits with point rewards and streak tracking
- **🤖 AI Coach**: Get personalized tips and encouragement from Greenie, your carbon coach
- **📈 Progress Visualization**: Track your journey with detailed analytics and achievement milestones

## 🚀 Key Features

### 🏠 Dashboard
- **Plant Growth Visualization**: Your virtual plant evolves through 7 stages based on points earned
- **Daily Carbon Summary**: Real-time tracking against your personal carbon goal
- **Streak Counter**: Maintain momentum with daily habit completion streaks
- **Bonus System**: Earn extra points for completing multiple habits (3+ habits = +5 pts) and maintaining streaks (5+ days = +10 pts)

### 📝 Activity Logging
- **Carbon Calculator**: Log transportation, energy use, and other activities with automatic CO₂ calculations
- **Smart Categories**: Pre-configured activity types with accurate emission factors
- **Quick Entry**: Streamlined interface for fast daily logging

### ✅ Habit Tracker
- **Curated Habits**: Choose from 9 research-backed sustainable habits:
  - 💧 Cold Wash Laundry Day (5 pts)
  - Zero Single-Use Plastics (4 pts)
  - 🔌 Unplug Idle Devices (2 pts)
  - 💧 5-Minute Shower (4 pts)
  - 🔌 Digital Detox Evening (4 pts)
  - 🌾 Meat-Free Day (8 pts)
  - Walk/Bike Commute (7 pts)
  - 🚌 Public Transit/Carpool (8 pts)
  - 🌾 Zero Food Waste Day (5 pts)
- **Flexible Selection**: Activate only the habits that fit your lifestyle
- **Progress Tracking**: Visual calendar showing completion history

### 💬 AI Chat Coach
- **Personalized Tips**: Context-aware advice based on your activity and goals
- **Motivation**: Encouraging messages and celebration of achievements
- **Education**: Learn about the impact of your choices with detailed explanations

### 👤 Profile & Settings
- **Lifestyle Preferences**: Set diet, commute, and carbon goal preferences
- **Notification Controls**: Customize daily tips and achievement alerts
- **Progress Analytics**: View long-term trends and achievements

## 🛠 Technology Stack

- **Framework**: Expo 52.0.30 with Expo Router 4.0.17
- **Frontend**: React Native 0.79.1 with TypeScript
- **Navigation**: Expo Router with tab-based architecture
- **Styling**: React Native StyleSheet (no external CSS frameworks)
- **Icons**: Lucide React Native + React Icons
- **Animations**: React Native Reanimated
- **State Management**: React Context API with useReducer
- **Fonts**: Expo Google Fonts (Inter family)

## 📱 Platform Support

- **Primary**: Web (optimized for browser experience)
- **Secondary**: iOS and Android (via Expo development builds)
- **Note**: Some native features are web-compatible alternatives

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/greenie-carbon-tracker.git
   cd greenie-carbon-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The app will automatically open in your default browser
   - Or navigate to `http://localhost:8081`

### Development Commands

```bash
# Start development server
npm run dev

# Build for web production
npm run build:web

# Run linting
npm run lint
```

## 📁 Project Structure

```
greenie-carbon-tracker/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx            # Dashboard
│   │   ├── log-activity.tsx     # Activity logging
│   │   ├── habits.tsx           # Habit tracker
│   │   ├── chat.tsx             # AI coach chat
│   │   └── profile.tsx          # User profile
│   ├── _layout.tsx              # Root layout
│   ├── splash.tsx               # Splash screen
│   ├── welcome.tsx              # Welcome/onboarding entry
│   └── onboarding.tsx           # User setup flow
├── components/                   # Reusable UI components
│   ├── PlantGraphic.tsx         # Plant visualization
│   ├── ProgressBar.tsx          # Progress indicators
│   ├── HabitCheckbox.tsx        # Habit completion UI
│   ├── ChatBubble.tsx           # Chat message display
│   └── ActivityListItem.tsx     # Activity log entries
├── contexts/                     # State management
│   └── AppContext.tsx           # Global app state
├── utils/                        # Utility functions
│   ├── carbonCalculator.ts      # CO₂ emission calculations
│   └── plantStages.ts           # Plant growth logic
├── types/                        # TypeScript definitions
│   └── index.ts                 # App-wide type definitions
├── assets/                       # Static assets
│   └── images/                  # App images and icons
└── hooks/                        # Custom React hooks
    └── useFrameworkReady.ts     # Framework initialization
```

## 🎮 User Journey

### First Time Users
1. **Welcome Screen**: Introduction to Greenie's mission
2. **Onboarding Flow**: 
   - Set lifestyle preferences (diet, commute, car type)
   - Choose daily carbon goal (5-25 kg CO₂/day)
   - Select initial habits to track
3. **Dashboard**: Start tracking and building habits

### Daily Usage
1. **Check Dashboard**: Review plant progress and daily goals
2. **Complete Habits**: Mark off sustainable actions throughout the day
3. **Log Activities**: Record carbon-generating activities
4. **Chat with Greenie**: Get tips and motivation
5. **Track Progress**: Watch plant grow and streaks build

## 🌱 Plant Growth System

Your virtual plant evolves through 7 distinct stages based on points earned:

- **🌰 Seed** (0 pts): Your sustainability journey begins
- **🌱 Sprout** (35 pts): First signs of growth
- **🌿 Seedling** (85 pts): Growing stronger
- **🌳 Young Plant** (160 pts): Healthy development
- **🌲 Mature Plant** (310 pts): Thriving growth
- **🌸 Flowering Plant** (510 pts): Beautiful blooms
- **🌳 Tree** (1010 pts): Mighty environmental impact

## 🏆 Gamification Features

### Point System
- **Habit Completion**: 2-8 points per habit
- **Daily Combo Bonus**: +5 points for completing 3+ habits
- **Streak Bonus**: +10 points for maintaining 5+ day streaks

### Achievement Tracking
- Consecutive day streaks
- Total points milestones
- Plant stage progression
- Carbon goal achievements

## 🔮 Future Enhancements

- **Social Features**: Share progress with friends and family
- **Community Challenges**: Group sustainability goals
- **Advanced Analytics**: Detailed carbon footprint breakdowns
- **Integration**: Connect with smart home devices and fitness trackers
- **Marketplace**: Redeem points for eco-friendly products
- **Carbon Offsetting**: Direct integration with verified offset programs
---

<div align="center">
  <strong>🌍 Together, we can make a difference, one habit at a time! 🌱</strong>
</div>
