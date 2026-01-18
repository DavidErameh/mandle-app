# 02-TECH_STACK: Technology Stack & Dependencies

**Version:** 1.1  
**Date:** January 12, 2026  
**Status:** Ready for Implementation

---

## Stack Overview

### Core Philosophy

- **100% Free** - No paid services, APIs, or subscriptions
- **Mobile-First** - React Native for iOS/Android
- **Future-Proof** - Easy migration to web (React Native Web)
- **Offline-Capable** - Core features work without internet
- **Performance-Focused** - 60 FPS minimum, optimized bundle

---

## Technology Matrix

| Category        | Primary               | Fallback | Reason                                 |
| --------------- | --------------------- | -------- | -------------------------------------- |
| **Framework**   | React Native 0.83     | -        | Cross-platform, mature ecosystem       |
| **Build Tool**  | Expo SDK 54           | -        | Faster dev, easier deployment          |
| **Language**    | TypeScript 6.0        | -        | Type safety, better DX                 |
| **State**       | Zustand 5.0           | -        | Simple, no boilerplate                 |
| **Database**    | Supabase (PostgreSQL) | SQLite   | Cloud sync + offline                   |
| **AI Provider** | Groq (Llama 3.3 70B)  | -        | Ultra-fast, 14K req/day, main provider |
| **Animations**  | Reanimated 4.2        | -        | 60-120 FPS on UI thread                |
| **Styling**     | NativeWind 4.1        | -        | Tailwind for React Native              |
| **Icons**       | Heroicons             | -        | Matches design aesthetic               |
| **Fonts**       | Expo Google Fonts     | -        | Cooper Old Style Std                   |
| **Gestures**    | Gesture Handler       | -        | Native touch handling                  |
| **Storage**     | Expo SecureStore      | -        | Encrypted key storage                  |

---

## Detailed Stack Breakdown

### 1. Frontend Framework

#### React Native 0.83

```json
{
  "react-native": "0.83.0",
  "react": "19.0.0"
}
```

**Why React Native:**

- ✅ Single codebase → iOS + Android
- ✅ Large library ecosystem
- ✅ Easy web migration (React Native Web)
- ✅ Hot reload for fast development
- ✅ Native performance with New Architecture

**New Architecture Enabled:**

- Fabric renderer (concurrent rendering)
- TurboModules (faster native modules)
- JSI (JavaScript Interface - 10x faster bridge)

#### Expo SDK 54

```json
{
  "expo": "~54.0.0"
}
```

**Why Expo:**

- ✅ OTA updates without app store
- ✅ Faster dev setup (no Xcode/Android Studio initially)
- ✅ Built-in modules (Camera, FileSystem, etc.)
- ✅ Easy deployment to stores
- ✅ Free hosting for updates

**Expo Workflow:** Managed (EAS Build for production)

---

### 2. Programming Language

#### TypeScript 6.0

```json
{
  "typescript": "^6.0.0",
  "@types/react": "~19.0.0",
  "@types/react-native": "~0.83.0"
}
```

**TypeScript Config:**

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "esnext",
    "module": "commonjs",
    "lib": ["esnext"],
    "jsx": "react-native",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@components/*": ["./shared/components/*"],
      "@features/*": ["./features/*"],
      "@core/*": ["./core/*"]
    }
  }
}
```

**Why TypeScript:**

- ✅ Catch errors before runtime
- ✅ Better IDE autocomplete
- ✅ Self-documenting code
- ✅ Easier refactoring

---

### 3. State Management

#### Zustand 5.0

```bash
npm install zustand
```

**Why Zustand over Redux:**

- ✅ 90% less boilerplate
- ✅ No providers needed
- ✅ Built-in TypeScript support
- ✅ Middleware for persistence
- ✅ <1KB bundle size

**Example Store Structure:**

```typescript
// src/core/store/appStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  isOnline: boolean;
  currentPillar: string;
  generationCount: number;
  setOnline: (status: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnline: true,
      currentPillar: "",
      generationCount: 0,
      setOnline: (status) => set({ isOnline: status }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

---

### 4. Database & Backend

#### Supabase (Primary)

```bash
npm install @supabase/supabase-js
```

**Why Supabase:**

- ✅ PostgreSQL (relational + powerful queries)
- ✅ Real-time subscriptions (collaboration)
- ✅ Row-level security (data isolation)
- ✅ Storage for files (voice examples)
- ✅ Generous free tier

**Free Tier Limits:**

- 500 MB database
- 1 GB file storage
- 2 GB bandwidth/month
- Unlimited API requests
- 2 real-time connections

**Supabase Setup:**

```typescript
// src/core/database/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

#### SQLite (Offline Fallback)

```bash
npx expo install expo-sqlite
```

**Why SQLite:**

- ✅ Works offline
- ✅ Fast local queries
- ✅ Sync to Supabase when online
- ✅ No size limits (device storage)

**Usage Pattern:**

- Write → SQLite first (instant)
- Background → Sync to Supabase
- Read → SQLite if offline, else Supabase

---

### 5. AI APIs

#### Google Gemini 3 Flash (Primary)

```bash
npm install @google/genai
```

**Free Tier Limits:**

- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day
- No credit card required

**Setup:**

```typescript
// src/core/ai/providers/gemini.ts
import { createGoogleGenerativeAI } from "@google/genai";
import { GEMINI_API_KEY } from "@env";

const client = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY });

export async function generateWithGemini(prompt: string) {
  const model = client.getGenerativeModel({
    model: "gemini-3.0-flash", // Updated to Gemini 3 Flash
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    },
  });

  return result.response.text();
}
```

**Why Gemini 3 Flash:**

- ✅ Best free writing quality
- ✅ Fast (3-5 second responses)
- ✅ Long context window (1M+ tokens)
- ✅ Reliable (Google infrastructure)
- ✅ Enhanced agentic coding capabilities

#### Groq (Fallback)

```bash
npm install groq-sdk
```

**Free Tier Limits:**

- 14,400 requests per day
- 600 requests per minute
- Ultra-fast inference (300 tokens/sec)

**Setup:**

```typescript
// src/core/ai/providers/groq.ts
import Groq from "groq-sdk";
import { GROQ_API_KEY } from "@env";

const groq = new Groq({ apiKey: GROQ_API_KEY });

export async function generateWithGroq(prompt: string) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content || "";
}
```

**When to Use Groq:**

- Gemini rate limited (>15 req/min)
- Gemini API error/timeout
- Need ultra-fast response (<2 sec)

#### Multi-Provider Orchestration

```typescript
// src/core/ai/orchestrator.ts
import { generateWithGemini } from "./providers/gemini";
import { generateWithGroq } from "./providers/groq";

export async function generateContent(prompt: string) {
  try {
    // Try Gemini first (better quality)
    return await generateWithGemini(prompt);
  } catch (error) {
    console.log("Gemini failed, falling back to Groq:", error);

    try {
      // Fallback to Groq
      return await generateWithGroq(prompt);
    } catch (fallbackError) {
      console.error("Both AI providers failed:", fallbackError);
      throw new Error("AI generation unavailable");
    }
  }
}
```

---

### 6. Animations

#### React Native Reanimated 4.2

```bash
npx expo install react-native-reanimated
```

**Why Reanimated:**

- ✅ Runs on UI thread (no bridge lag)
- ✅ 60-120 FPS animations
- ✅ Gesture-driven animations
- ✅ Layout animations built-in
- ✅ Web compatibility (React Native Web)

**Config (babel.config.js):**

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"], // Must be last
  };
};
```

**Example Animation:**

```typescript
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';

function AnimatedButton() {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(pressed ? 0.95 : 1) }
    ],
    opacity: withTiming(pressed ? 0.8 : 1),
  }));

  return <Animated.View style={animatedStyle}>...</Animated.View>;
}
```

#### Lottie Animations

```bash
npx expo install lottie-react-native
```

**Why Lottie:**

- ✅ Complex animations without code
- ✅ Small file sizes (vs GIF)
- ✅ Free library: LottieFiles.com
- ✅ Easy color/speed customization

**Example Usage:**

```typescript
import LottieView from 'lottie-react-native';

<LottieView
  source={require('./animations/typing.json')}
  autoPlay
  loop
  style={{ width: 100, height: 100 }}
/>
```

**Required Animations:**

- `typing.json` - AI generation loading
- `checkmark.json` - Success state
- `error.json` - Error state
- `empty.json` - Empty states

---

### 7. Styling

#### NativeWind 4.1

```bash
npm install nativewind
npm install --save-dev tailwindcss
```

**Why NativeWind:**

- ✅ Tailwind CSS for React Native
- ✅ Consistent with web development
- ✅ Fast iteration (utility classes)
- ✅ Dark mode support built-in
- ✅ TypeScript autocomplete

**Tailwind Config:**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        frosted: "rgba(255, 255, 255, 0.08)",
        "frosted-hover": "rgba(255, 255, 255, 0.12)",
        "x-blue": "#1D9BF0",
        "text-primary": "#FFFFFF",
        "text-secondary": "rgba(255, 255, 255, 0.6)",
        border: "rgba(255, 255, 255, 0.12)",
      },
      fontFamily: {
        cooper: ["CooperOldStyle-Regular"],
        "cooper-medium": ["CooperOldStyle-Medium"],
        "cooper-bold": ["CooperOldStyle-Bold"],
      },
      spacing: {
        18: "72px", // 18 * 4 (base unit)
      },
    },
  },
  plugins: [],
};
```

**Example Component:**

```typescript
import { View, Text } from 'react-native';

function TweetCard() {
  return (
    <View className="bg-frosted rounded-xl p-4 border border-border">
      <Text className="text-text-primary font-cooper text-base">
        Your generated tweet appears here
      </Text>
    </View>
  );
}
```

---

### 8. Icons

#### Heroicons (React Native)

```bash
npm install react-native-heroicons react-native-svg
npx expo install react-native-svg
```

**Why Heroicons:**

- ✅ Matches X/Threads aesthetic
- ✅ Outline style (frosted glass compatible)
- ✅ Consistent sizing
- ✅ Tree-shakeable

**Example Usage:**

```typescript
import { PlusIcon, SparklesIcon } from 'react-native-heroicons/outline';

<PlusIcon size={24} color="#1D9BF0" />
<SparklesIcon size={20} color="#FFFFFF" />
```

**Icon Inventory:**

- `SparklesIcon` - Generate button
- `PlusIcon` - Add note
- `ClockIcon` - History
- `ChatBubbleIcon` - Comments
- `ChartBarIcon` - Analytics
- `Cog6ToothIcon` - Settings
- `ArrowPathIcon` - Regenerate

---

### 9. Typography

#### Cooper Old Style Std

```bash
npx expo install expo-font @expo-google-fonts/dev
```

**Font Files Required:**

- `CooperOldStyle-Regular.ttf`
- `CooperOldStyle-Medium.ttf`
- `CooperOldStyle-Bold.ttf`

**Loading Fonts:**

```typescript
// App.tsx
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'CooperOldStyle-Regular': require('./assets/fonts/CooperOldStyle-Regular.ttf'),
    'CooperOldStyle-Medium': require('./assets/fonts/CooperOldStyle-Medium.ttf'),
    'CooperOldStyle-Bold': require('./assets/fonts/CooperOldStyle-Bold.ttf'),
  });

  if (!fontsLoaded) return null;

  SplashScreen.hideAsync();
  return <Navigation />;
}
```

**Typography Scale:**

```typescript
// src/shared/theme/typography.ts
export const typography = {
  heading: {
    fontSize: 32,
    fontFamily: "CooperOldStyle-Bold",
    lineHeight: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: "CooperOldStyle-Medium",
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontFamily: "CooperOldStyle-Regular",
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontFamily: "CooperOldStyle-Regular",
    lineHeight: 20,
  },
};
```

---

### 10. Gesture Handling

#### React Native Gesture Handler

```bash
npx expo install react-native-gesture-handler
```

**Why Gesture Handler:**

- ✅ Native touch handling (no JS bridge)
- ✅ Complex gestures (swipe, pinch, rotate)
- ✅ Works with Reanimated
- ✅ Better performance than PanResponder

**Example: Swipe to Dismiss:**

```typescript
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

function SwipeableTweet() {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > 100) {
        runOnJS(dismissTweet)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        {/* Tweet content */}
      </Animated.View>
    </GestureDetector>
  );
}
```

---

### 11. Secure Storage

#### Expo SecureStore

```bash
npx expo install expo-secure-store
```

**Why SecureStore:**

- ✅ Encrypted storage (iOS Keychain, Android Keystore)
- ✅ Perfect for API keys
- ✅ Auto-syncs across devices (iOS)
- ✅ Biometric protection option

**Usage:**

```typescript
import * as SecureStore from "expo-secure-store";

// Save API key
await SecureStore.setItemAsync("gemini_key", GEMINI_API_KEY);

// Retrieve API key
const key = await SecureStore.getItemAsync("gemini_key");

// Delete API key
await SecureStore.deleteItemAsync("gemini_key");
```

**What to Store:**

- API keys (Gemini, Groq, Twitter)
- Supabase credentials
- User preferences
- Performance data (optional)

---

### 12. Environment Variables

#### Expo Environment Config

```bash
npm install react-native-dotenv
```

**.env File:**

```env
# AI APIs
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# Twitter API (optional)
TWITTER_BEARER_TOKEN=your_twitter_token_here

# App Config
APP_ENV=development
```

**Babel Config:**

```javascript
// babel.config.js
module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        safe: false,
        allowUndefined: true,
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
```

**TypeScript Types:**

```typescript
// src/types/env.d.ts
declare module "@env" {
  export const GEMINI_API_KEY: string;
  export const GROQ_API_KEY: string;
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
  export const TWITTER_BEARER_TOKEN: string;
  export const APP_ENV: "development" | "production";
}
```

---

## Complete Dependency List

### Core Dependencies

```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "react": "19.0.0",
    "react-native": "0.83.0",
    "typescript": "^6.0.0",

    "@supabase/supabase-js": "^2.90.0",
    "@google/genai": "^1.35.0",
    "groq-sdk": "^0.34.0",

    "zustand": "^5.0.0",
    "@react-native-async-storage/async-storage": "1.23.0",
    "expo-sqlite": "~15.0.0",
    "expo-secure-store": "~14.0.0",

    "react-native-reanimated": "~4.2.0",
    "react-native-gesture-handler": "~2.20.0",
    "lottie-react-native": "7.3.4",

    "nativewind": "^4.1.0",
    "react-native-heroicons": "^4.0.0",
    "react-native-svg": "15.0.0",

    "expo-font": "~13.0.0",
    "@expo/vector-icons": "^14.0.0",

    "react-native-dotenv": "^3.4.11",

    "@react-navigation/native": "^7.1.0",
    "@react-navigation/bottom-tabs": "^7.1.0",
    "@react-navigation/stack": "^7.1.0",
    "react-native-screens": "~4.0.0",
    "react-native-safe-area-context": "4.12.0"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@types/react": "~19.0.0",
    "@types/react-native": "~0.83.0",
    "babel-preset-expo": "~12.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## Installation Script

```bash
# Create project
npx create-expo-app mandle --template blank-typescript

cd mandle

# Install all dependencies
npm install @supabase/supabase-js @google/genai groq-sdk zustand @react-native-async-storage/async-storage nativewind react-native-heroicons react-native-svg react-native-dotenv @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack

# Install Expo packages
npx expo install expo-sqlite expo-secure-store expo-font react-native-reanimated react-native-gesture-handler lottie-react-native react-native-screens react-native-safe-area-context react-native-svg

# Install dev dependencies
npm install --save-dev tailwindcss @types/react @types/react-native

# Initialize Tailwind
npx tailwindcss init

# Setup complete
echo "✅ Dependencies installed"
```

---

## API Key Setup Guide

### 1. Google Gemini API

1. Go to: https://ai.google.dev/
2. Click "Get API Key"
3. Create new project or use existing
4. Copy API key
5. Add to `.env`: `GEMINI_API_KEY=your_key_here`
6. Test: Run generation, should work immediately

### 2. Groq API

1. Go to: https://console.groq.com/
2. Sign up (free, no credit card)
3. Navigate to API Keys
4. Create new key
5. Add to `.env`: `GROQ_API_KEY=your_key_here`

### 3. Supabase

1. Go to: https://supabase.com/
2. Create new project (free tier)
3. Wait ~2 minutes for setup
4. Go to Settings → API
5. Copy:
   - Project URL → `SUPABASE_URL`
   - Anon Public Key → `SUPABASE_ANON_KEY`
6. Add both to `.env`

### 4. Twitter API (Optional)

1. Go to: https://developer.twitter.com/
2. Apply for Essential Access (free)
3. Create app
4. Generate Bearer Token
5. Add to `.env`: `TWITTER_BEARER_TOKEN=your_token`
6. Limits: 500,000 tweets/month read

---

## Performance Optimization

### Bundle Size

- ✅ Use Hermes engine (enabled by default)
- ✅ Enable minification in production
- ✅ Tree-shake unused code
- ✅ Lazy load heavy screens

### Memory Management

- ✅ Virtualized lists (FlatList, not ScrollView)
- ✅ Image optimization (WebP format)
- ✅ Clear intervals/timeouts on unmount
- ✅ Memoize expensive computations

### Network

- ✅ Cache AI responses (SQLite)
- ✅ Request batching where possible
- ✅ Background sync for non-critical data
- ✅ Optimistic UI updates

---

## Testing Stack (Optional for MVP)

```json
{
  "devDependencies": {
    "jest": "^29.2.1",
    "@testing-library/react-native": "^12.4.0",
    "@testing-library/jest-native": "^5.4.3"
  }
}
```

**Testing Priority (Post-MVP):**

1. AI generation logic
2. Brand guardrail validation
3. Performance logger calculations
4. Supabase sync logic

---

## Compatibility Matrix

| Platform | Minimum Version | Recommended  |
| -------- | --------------- | ------------ |
| iOS      | 15.0            | 17.0+        |
| Android  | 11 (API 30)     | 14 (API 34)+ |
| Node.js  | 20.0            | 22.0+        |
| npm      | 10.0            | 11.0+        |
| Expo Go  | 54.0            | Latest       |

---

## External Services Configuration

### Supabase Tables (Create These)

```sql
-- Run in Supabase SQL Editor

-- Content Pillars
CREATE TABLE content_pillars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  examples TEXT[],
  active BOOLEAN DEFAULT true,
  last_used TIMESTAMP,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  tags TEXT[],
  state TEXT DEFAULT 'draft', -- draft | ready | generated | posted | archived
  pillar_id UUID REFERENCES content_pillars(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Drafts
CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  platform TEXT, -- twitter | threads
  note_id UUID REFERENCES notes(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Versions
CREATE TABLE versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID REFERENCES drafts(id),
  content TEXT NOT NULL,
  author TEXT, -- creator | assistant
  change_type TEXT, -- generated | edited | polished
  parent_version UUID REFERENCES versions(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID REFERENCES drafts(id),
  content TEXT NOT NULL,
  author TEXT,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Performance Logs
CREATE TABLE performance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID REFERENCES drafts(id),
  platform TEXT,
  impressions INTEGER,
  likes INTEGER,
  retweets INTEGER,
  replies INTEGER,
  follows INTEGER,
  success_score REAL,
  tags TEXT[],
  posted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Connected Accounts
CREATE TABLE connected_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  handle TEXT NOT NULL,
  platform TEXT NOT NULL,
  added_date TIMESTAMP DEFAULT NOW(),
  last_fetched TIMESTAMP
);

-- Viral Tweets
CREATE TABLE viral_tweets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES connected_accounts(id),
  content TEXT NOT NULL,
  url TEXT,
  impressions INTEGER,
  engagement REAL,
  patterns TEXT[],
  fetched_at TIMESTAMP DEFAULT NOW()
);

-- Brand Profile
CREATE TABLE brand_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  system_prompt TEXT,
  guardrails JSONB,
  voice_examples TEXT[],
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Supabase Storage Buckets

```javascript
// Create these buckets in Supabase Dashboard
// Storage → New Bucket

buckets = [
  "voice-examples", // Store example tweets as text files
  "lottie-animations", // Custom animations
  "user-exports", // Future: Export data feature
];
```

---

## Cost Breakdown (Free Tier Limits)

| Service         | Free Tier             | Usage Estimate         | Cost         |
| --------------- | --------------------- | ---------------------- | ------------ |
| **Gemini API**  | 15 req/min            | ~50 req/day            | $0           |
| **Groq API**    | 14.4K req/day         | ~10 req/day (fallback) | $0           |
| **Supabase**    | 500MB DB, 1GB storage | ~100MB used            | $0           |
| **Expo**        | Unlimited dev         | 1 project              | $0           |
| **Twitter API** | 500K tweets/month     | ~1K/month              | $0           |
| **Total**       | -                     | -                      | **$0/month** |

**Breaking Free Tier:**

- Only if >15 generations per minute (unlikely)
- Or >500MB database (after ~50K tweets)
- Or >500K Twitter API calls (unlikely)

---

## CI/CD Setup (Future)

```yaml
# .github/workflows/deploy.yml (Optional)
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx expo export:web
      - run: eas build --platform all
```

---

## Next Steps

1. ✅ Read `03-DESIGN.md` for UI specifications
2. ✅ Read `04-ARCHITECTURE.md` for system design
3. ✅ Read `05-DEPLOYMENT.md` for environment setup
4. ✅ Run installation script above
5. ✅ Create Supabase tables
6. ✅ Get API keys and add to `.env`
7. ✅ Start building!

---

**Last Updated:** January 12, 2026  
**Version:** 1.1  
**Status:** Ready for Implementation
