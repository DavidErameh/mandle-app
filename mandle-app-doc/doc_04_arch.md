# 04-ARCHITECTURE: System Architecture & Logic

**Version:** 1.0  
**Date:** January 11, 2025  
**Status:** Ready for Implementation

---

## Architecture Overview

### Design Pattern

**Clean Architecture** with **Feature-Based Modules**

```
┌─────────────────────────────────────────────────────────┐
│                   MANDLE SYSTEM                          │
├─────────────────────────────────────────────────────────┤
│  Layer 1: Presentation (UI Components, Screens)         │
│           ↓ Communicates via Custom Hooks               │
│  Layer 2: Domain (Business Logic, Use Cases)            │
│           ↓ Interfaces Only                              │
│  Layer 3: Data (API Calls, Database, Cache)             │
└─────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Separation of Concerns** - Each layer has ONE responsibility
2. **Dependency Inversion** - Inner layers don't know about outer layers
3. **Testability** - Business logic isolated from UI and data sources
4. **Scalability** - Easy to add features without breaking existing code

---

## Folder Structure [REQUIRED]

```
mandle/
├── src/
│   ├── features/              # Feature-based modules
│   │   ├── generate/          # Generation feature
│   │   │   ├── screens/
│   │   │   │   ├── HomeScreen.tsx
│   │   │   │   └── GenerationResultScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── TweetCard.tsx
│   │   │   │   ├── GenerateButton.tsx
│   │   │   │   └── LoadingState.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useGenerate.ts
│   │   │   │   └── useContentPillar.ts
│   │   │   ├── domain/
│   │   │   │   ├── useCases/
│   │   │   │   │   ├── GenerateTweetUseCase.ts
│   │   │   │   │   └── SelectPillarUseCase.ts
│   │   │   │   └── entities/
│   │   │   │       ├── Tweet.ts
│   │   │   │       └── ContentPillar.ts
│   │   │   └── data/
│   │   │       ├── repositories/
│   │   │       │   └── TweetRepository.ts
│   │   │       └── api/
│   │   │           └── generateAPI.ts
│   │   │
│   │   ├── notes/             # Notes feature
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── domain/
│   │   │   └── data/
│   │   │
│   │   ├── inspiration/       # Connected accounts feature
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── domain/
│   │   │   └── data/
│   │   │
│   │   ├── collaboration/     # Comments & versions
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── domain/
│   │   │   └── data/
│   │   │
│   │   └── analytics/         # Performance logging
│   │       ├── screens/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── domain/
│   │       └── data/
│   │
│   ├── core/                  # Shared core functionality
│   │   ├── ai/
│   │   │   ├── orchestrator.ts          # Multi-provider AI logic
│   │   │   ├── providers/
│   │   │   │   ├── gemini.ts
│   │   │   │   └── groq.ts
│   │   │   ├── memory/
│   │   │   │   ├── ContextBuilder.ts
│   │   │   │   └── MemoryRetriever.ts
│   │   │   └── prompts/
│   │   │       ├── SystemPromptBuilder.ts
│   │   │       ├── GenerationPrompt.ts
│   │   │       └── PolishPrompt.ts
│   │   │
│   │   ├── brand/
│   │   │   ├── VoiceEngine.ts           # Brand voice validation
│   │   │   ├── GuardrailValidator.ts    # Content guardrails
│   │   │   └── BrandProfileManager.ts
│   │   │
│   │   ├── database/
│   │   │   ├── supabase.ts              # Supabase client
│   │   │   ├── sqlite.ts                # SQLite client
│   │   │   └── sync.ts                  # Offline sync logic
│   │   │
│   │   └── store/
│   │       ├── appStore.ts              # Global app state
│   │       └── middleware.ts            # Zustand middleware
│   │
│   ├── shared/                # Shared UI & utilities
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useOnline.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useHaptics.ts
│   │   │
│   │   ├── theme/
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   ├── spacing.ts
│   │   │   ├── radius.ts
│   │   │   ├── shadows.ts
│   │   │   └── index.ts
│   │   │
│   │   └── utils/
│   │       ├── formatDate.ts
│   │       ├── validation.ts
│   │       └── analytics.ts
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── TabNavigator.tsx
│   │   └── StackNavigator.tsx
│   │
│   └── types/
│       ├── entities.ts                  # Domain entities
│       ├── api.ts                       # API types
│       └── env.d.ts                     # Environment types
│
├── assets/
│   ├── animations/
│   ├── fonts/
│   └── icons/
│
├── .env                       # Environment variables
├── app.json                   # Expo config
├── babel.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Layer Architecture [REQUIRED]

### Layer 1: Presentation

**Responsibility:** Display UI, handle user interactions, animations

**Rules:**

- ❌ NO business logic
- ❌ NO direct API calls
- ❌ NO direct database queries
- ✅ ONLY calls custom hooks from domain layer

**Example Screen:**

```typescript
// src/features/generate/screens/HomeScreen.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { useGenerate } from '../hooks/useGenerate';
import TweetCard from '../components/TweetCard';
import LoadingState from '../components/LoadingState';

export default function HomeScreen() {
  const { tweets, loading, error, generate } = useGenerate();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <View>
      <TouchableOpacity onPress={generate}>
        <Text>Generate</Text>
      </TouchableOpacity>

      {tweets.map(tweet => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </View>
  );
}
```

### Layer 2: Domain

**Responsibility:** Business logic, use cases, entities

**Rules:**

- ✅ Pure TypeScript (no React)
- ✅ Defines interfaces for data layer
- ❌ NO imports from presentation layer
- ❌ NO knowledge of API details

**Example Use Case:**

```typescript
// src/features/generate/domain/useCases/GenerateTweetUseCase.ts
import { Tweet } from "../entities/Tweet";
import { TweetRepository } from "../../data/repositories/TweetRepository";
import { BrandProfile } from "@/core/brand/entities/BrandProfile";
import { AIOrchestrator } from "@/core/ai/orchestrator";

export class GenerateTweetUseCase {
  constructor(
    private tweetRepo: TweetRepository,
    private aiOrchestrator: AIOrchestrator,
  ) {}

  async execute(brandProfile: BrandProfile): Promise<Tweet[]> {
    // 1. Build context
    const context = await this.buildContext(brandProfile);

    // 2. Generate via AI
    const generatedTexts = await this.aiOrchestrator.generate(context);

    // 3. Validate against guardrails
    const validated = generatedTexts.filter((text) =>
      this.validateGuardrails(text, brandProfile.guardrails),
    );

    // 4. Create tweet entities
    const tweets = validated.map((text) => new Tweet({ content: text }));

    // 5. Save to repository
    await this.tweetRepo.saveDrafts(tweets);

    return tweets;
  }

  private validateGuardrails(text: string, guardrails: any): boolean {
    // Validation logic
    return true;
  }

  private async buildContext(profile: BrandProfile): Promise<string> {
    // Context building logic
    return "";
  }
}
```

**Example Entity:**

```typescript
// src/features/generate/domain/entities/Tweet.ts
export class Tweet {
  id: string;
  content: string;
  platform: "twitter";
  createdAt: Date;
  variant: number;

  constructor(data: Partial<Tweet>) {
    this.id = data.id || generateUUID();
    this.content = data.content || "";
    this.platform = data.platform || "twitter";
    this.createdAt = data.createdAt || new Date();
    this.variant = data.variant || 1;
  }

  get characterCount(): number {
    return this.content.length;
  }

  get withinLimit(): boolean {
    return this.characterCount <= 280;
  }

  get formattedDate(): string {
    return this.createdAt.toLocaleDateString();
  }
}
```

### Layer 3: Data

**Responsibility:** API calls, database queries, caching

**Rules:**

- ✅ Implements repository interfaces from domain
- ✅ Handles network errors
- ✅ Manages cache
- ❌ NO business logic

**Example Repository:**

```typescript
// src/features/generate/data/repositories/TweetRepository.ts
import { supabase } from "@/core/database/supabase";
import { Tweet } from "../../domain/entities/Tweet";

export class TweetRepository {
  async saveDrafts(tweets: Tweet[]): Promise<void> {
    const { error } = await supabase.from("drafts").insert(
      tweets.map((tweet) => ({
        id: tweet.id,
        content: tweet.content,
        platform: tweet.platform,
        created_at: tweet.createdAt,
      })),
    );

    if (error) throw new Error("Failed to save drafts");
  }

  async getDrafts(limit: number = 10): Promise<Tweet[]> {
    const { data, error } = await supabase
      .from("drafts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error("Failed to fetch drafts");

    return data.map(
      (row) =>
        new Tweet({
          id: row.id,
          content: row.content,
          platform: row.platform,
          createdAt: new Date(row.created_at),
        }),
    );
  }
}
```

---

## AI Agent Architecture [REQUIRED]

### Sequential Agent Pattern

```
USER CLICKS GENERATE
         ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 1: CONTEXT BUILDER                                │
│  • Fetch active content pillar                          │
│  • Load brand voice profile                             │
│  • Get top 3 similar high-performing tweets             │
│  • Pull from active ideas pool (notes marked "ready")   │
│  • Retrieve connected accounts' viral patterns          │
│  Output: Context object with all necessary data         │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 2: PROMPT ORCHESTRATOR                            │
│  • Build system prompt from brand profile               │
│  • Add guardrails as constraints                        │
│  • Include voice examples (3 best tweets)               │
│  • Add context from Step 1                              │
│  • Add meta-instructions (format, length, etc.)         │
│  Output: Complete prompt string                         │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 3: AI GENERATION ENGINE                           │
│  Provider: Groq (Llama 3.3 70B)                         │
│  • Send prompt to Groq API                              │
│  • Parse response (3 tweet variations)                  │
│  Output: Array of 3 tweet texts                         │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 4: POST-PROCESSOR                                 │
│  • Brand voice validation (similarity score > 0.7)      │
│  • Guardrail enforcement (topics, tone, format)         │
│  • Character count check (240-280)                      │
│  • Format polishing (line breaks, punctuation)          │
│  • Plagiarism check (vs connected accounts)             │
│  Output: 3 validated tweets ready to display            │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 5: PERSISTENCE                                    │
│  • Save to SQLite (offline-first)                       │
│  • Sync to Supabase (background)                        │
│  • Update working memory cache                          │
│  • Log generation event (analytics)                     │
└─────────────────────────────────────────────────────────┘
                  ↓
         DISPLAY TO USER
```

### Implementation

#### 1. Context Builder

```typescript
// src/core/ai/memory/ContextBuilder.ts
import { ContentPillar } from "@/features/generate/domain/entities/ContentPillar";
import { BrandProfile } from "@/core/brand/entities/BrandProfile";
import { Note } from "@/features/notes/domain/entities/Note";
import { PerformanceLog } from "@/features/analytics/domain/entities/PerformanceLog";

export interface GenerationContext {
  pillar: ContentPillar;
  brandProfile: BrandProfile;
  voiceExamples: string[];
  pastSuccesses: PerformanceLog[];
  readyNotes: Note[];
  viralPatterns: string[];
}

export class ContextBuilder {
  constructor(
    private pillarRepo: ContentPillarRepository,
    private brandRepo: BrandProfileRepository,
    private performanceRepo: PerformanceRepository,
    private noteRepo: NoteRepository,
    private accountRepo: ConnectedAccountRepository,
  ) {}

  async build(): Promise<GenerationContext> {
    // Parallel fetch for speed
    const [pillar, brand, performance, notes, patterns] = await Promise.all([
      this.getActivePillar(),
      this.getBrandProfile(),
      this.getTopPerformers(),
      this.getReadyNotes(),
      this.getViralPatterns(),
    ]);

    return {
      pillar,
      brandProfile: brand,
      voiceExamples: brand.voiceExamples.slice(0, 3),
      pastSuccesses: performance.slice(0, 3),
      readyNotes: notes.slice(0, 2),
      viralPatterns: patterns.slice(0, 5),
    };
  }

  private async getActivePillar(): Promise<ContentPillar> {
    // Get pillar that hasn't been used recently
    return await this.pillarRepo.getNextInRotation();
  }

  private async getTopPerformers(): Promise<PerformanceLog[]> {
    // Get tweets with success score > 7
    return await this.performanceRepo.getTopScoring(3);
  }

  private async getReadyNotes(): Promise<Note[]> {
    return await this.noteRepo.getByState("ready", 2);
  }

  private async getViralPatterns(): Promise<string[]> {
    // Get patterns from connected accounts
    const accounts = await this.accountRepo.getAll();
    return accounts.flatMap((acc) => acc.patterns);
  }
}
```

#### 2. Prompt Orchestrator

```typescript
// src/core/ai/prompts/GenerationPrompt.ts
import { GenerationContext } from "../memory/ContextBuilder";

export class GenerationPromptBuilder {
  build(context: GenerationContext): string {
    return `
${this.buildSystemSection(context.brandProfile)}

${this.buildGuardrailsSection(context.brandProfile.guardrails)}

${this.buildVoiceSection(context.voiceExamples)}

${this.buildContextSection(context)}

${this.buildInstructionsSection()}

Generate 3 tweet variations about: ${this.getTopicFromContext(context)}
    `.trim();
  }

  private buildSystemSection(profile: BrandProfile): string {
    return `
You are a social media writer for a creator with this voice:
${profile.systemPrompt}

Your goal is to write tweets that perfectly match their authentic style.
    `.trim();
  }

  private buildGuardrailsSection(guardrails: any): string {
    return `
GUARDRAILS (NEVER VIOLATE):
- Allowed topics: ${guardrails.allowedTopics.join(", ")}
- Avoid topics: ${guardrails.avoidTopics.join(", ")}
- Tone: ${guardrails.tone}
- Max hashtags: ${guardrails.maxHashtags}
- Character range: ${guardrails.characterRange[0]}-${guardrails.characterRange[1]}
    `.trim();
  }

  private buildVoiceSection(examples: string[]): string {
    return `
VOICE EXAMPLES (Match this style exactly):
${examples.map((ex, i) => `${i + 1}. "${ex}"`).join("\n")}
    `.trim();
  }

  private buildContextSection(context: GenerationContext): string {
    let contextStr = "";

    if (context.pastSuccesses.length > 0) {
      contextStr += `\nYOUR TOP PERFORMING TWEETS (Learn from these):\n`;
      contextStr += context.pastSuccesses
        .map((log) => `- "${log.content}" (Score: ${log.successScore}/10)`)
        .join("\n");
    }

    if (context.readyNotes.length > 0) {
      contextStr += `\n\nIDEAS TO EXPAND:\n`;
      contextStr += context.readyNotes
        .map((note) => `- ${note.content}`)
        .join("\n");
    }

    if (context.viralPatterns.length > 0) {
      contextStr += `\n\nVIRAL PATTERNS IN YOUR NICHE:\n`;
      contextStr += context.viralPatterns.join(", ");
    }

    return contextStr;
  }

  private buildInstructionsSection(): string {
    return `
INSTRUCTIONS:
1. Generate exactly 3 variations
2. Each tweet must be 240-280 characters
3. Different angles/hooks for each
4. Match the voice examples exactly
5. Follow all guardrails strictly
6. Use conversational, engaging tone
7. End with subtle CTA or engagement hook

Format:
TWEET_1: [content]
TWEET_2: [content]
TWEET_3: [content]
    `.trim();
  }

  private getTopicFromContext(context: GenerationContext): string {
    if (context.readyNotes.length > 0) {
      return context.readyNotes[0].content;
    }
    return context.pillar.description;
  }
}
```

#### 3. AI Orchestrator

```typescript
// src/core/ai/orchestrator.ts
import { generateWithGemini } from "./providers/gemini";
import { generateWithGroq } from "./providers/groq";

export class AIOrchestrator {
  async generate(prompt: string): Promise<string[]> {
    try {
      // Try Gemini first (better quality)
      const response = await generateWithGemini(prompt);
      return this.parseTweets(response);
    } catch (geminiError) {
      console.log("Gemini failed, trying Groq:", geminiError);

      try {
        // Fallback to Groq
        const response = await generateWithGroq(prompt);
        return this.parseTweets(response);
      } catch (groqError) {
        console.error("Both providers failed:", groqError);
        throw new Error("AI generation unavailable. Check your connection.");
      }
    }
  }

  private parseTweets(response: string): string[] {
    // Parse format: TWEET_1: [content]\nTWEET_2: [content]...
    const matches = response.matchAll(/TWEET_\d+:\s*(.+?)(?=TWEET_\d+:|$)/gs);
    const tweets = Array.from(matches).map((match) => match[1].trim());

    if (tweets.length !== 3) {
      throw new Error("Invalid AI response format");
    }

    return tweets;
  }
}
```

#### 4. Post-Processor

```typescript
// src/core/ai/PostProcessor.ts
import { BrandProfile } from "@/core/brand/entities/BrandProfile";
import { GuardrailValidator } from "@/core/brand/GuardrailValidator";

export class PostProcessor {
  constructor(private guardrailValidator: GuardrailValidator) {}

  async process(
    tweets: string[],
    brandProfile: BrandProfile,
  ): Promise<string[]> {
    const processed = [];

    for (const tweet of tweets) {
      // 1. Trim and clean
      let cleaned = tweet.trim().replace(/\s+/g, " ");

      // 2. Validate guardrails
      const violations = this.guardrailValidator.validate(
        cleaned,
        brandProfile.guardrails,
      );

      if (violations.length > 0) {
        console.warn("Tweet violated guardrails:", violations);
        continue; // Skip this tweet
      }

      // 3. Character count check
      if (cleaned.length < 240 || cleaned.length > 280) {
        cleaned = this.adjustLength(cleaned);
      }

      // 4. Format polishing
      cleaned = this.polish(cleaned);

      processed.push(cleaned);
    }

    // If we filtered out tweets, throw to regenerate
    if (processed.length < 3) {
      throw new Error("Insufficient valid tweets. Regenerating...");
    }

    return processed.slice(0, 3);
  }

  private adjustLength(tweet: string): string {
    if (tweet.length > 280) {
      // Trim to last complete sentence under 280
      const sentences = tweet.match(/[^.!?]+[.!?]+/g) || [];
      let result = "";
      for (const sentence of sentences) {
        if ((result + sentence).length <= 280) {
          result += sentence;
        } else {
          break;
        }
      }
      return result || tweet.slice(0, 277) + "...";
    }
    return tweet;
  }

  private polish(tweet: string): string {
    // Fix common issues
    return tweet
      .replace(/\s+([.,!?])/g, "$1") // Remove space before punctuation
      .replace(/([.,!?])([A-Z])/g, "$1 $2") // Add space after punctuation
      .replace(/\n{3,}/g, "\n\n") // Max 2 line breaks
      .trim();
  }
}
```

---

## Database Schema [REQUIRED]

### Supabase PostgreSQL Tables

```sql
-- Content Pillars
CREATE TABLE content_pillars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  examples TEXT[],
  active BOOLEAN DEFAULT true,
  last_used TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pillars_active ON content_pillars(active);
CREATE INDEX idx_pillars_last_used ON content_pillars(last_used);

-- Notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  tags TEXT[],
  state TEXT DEFAULT 'draft' CHECK (state IN ('draft', 'ready', 'generated', 'posted', 'archived')),
  pillar_id UUID REFERENCES content_pillars(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notes_state ON notes(state);
CREATE INDEX idx_notes_pillar ON notes(pillar_id);

-- Drafts
CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('twitter')),
  note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  variant INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drafts_created ON drafts(created_at DESC);
CREATE INDEX idx_drafts_note ON drafts(note_id);

-- Versions (for collaboration)
CREATE TABLE versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID REFERENCES drafts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT NOT NULL, -- 'creator' | 'assistant'
  change_type TEXT CHECK (change_type IN ('generated', 'edited', 'polished')),
  parent_version UUID REFERENCES versions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_versions_draft ON versions(draft_id, created_at DESC);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID REFERENCES drafts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_draft ON comments(draft_id);
CREATE INDEX idx_comments_resolved ON comments(resolved);

-- Performance Logs
CREATE TABLE performance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID REFERENCES drafts(id) ON DELETE SET NULL,
  content TEXT NOT NULL, -- Denormalized for easier querying
  platform TEXT,
  impressions INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  retweets INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  follows INTEGER DEFAULT 0,
  clicks INTEGER,
  success_score REAL, -- 1-10 calculated score
  tags TEXT[],
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_performance_score ON performance_logs(success_score DESC);
CREATE INDEX idx_performance_posted ON performance_logs(posted_at DESC);

-- Connected Accounts
CREATE TABLE connected_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  handle TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'threads')),
  added_date TIMESTAMPTZ DEFAULT NOW(),
  last_fetched TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_accounts_handle_platform ON connected_accounts(handle, platform);

-- Viral Tweets (from connected accounts)
CREATE TABLE viral_tweets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES connected_accounts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  url TEXT,
  impressions INTEGER,
  engagement REAL, -- engagement rate %
  patterns TEXT[], -- ['question-hook', 'list-format', etc.]
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours')
);

CREATE INDEX idx_viral_account ON viral_tweets(account_id);
CREATE INDEX idx_viral_expires ON viral_tweets(expires_at);

-- Brand Profile (single row, updated not inserted)
CREATE TABLE brand_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  system_prompt TEXT NOT NULL,
  guardrails JSONB NOT NULL,
  voice_examples TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (array_length(voice_examples, 1) BETWEEN 10 AND 20)
);

-- Ensure only one brand profile exists
CREATE UNIQUE INDEX idx_brand_profile_singleton ON brand_profile ((id IS NOT NULL));

-- Generation Events (analytics)
CREATE TABLE generation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pillar_id UUID REFERENCES content_pillars(id),
  provider TEXT, -- 'gemini' | 'groq'
  success BOOLEAN,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_created ON generation_events(created_at DESC);
```

### SQLite Schema (Offline Cache)

```sql
-- Simplified schema for offline storage
CREATE TABLE IF NOT EXISTS drafts_cache (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  platform TEXT,
  created_at INTEGER,
  synced BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notes_cache (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  state TEXT,
  created_at INTEGER,
  synced BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS brand_cache (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at INTEGER
);
```

---

## Data Flow Examples [REQUIRED]

### Example 1: One-Click Generate

```
1. USER TAPS GENERATE BUTTON
   ├─> HomeScreen.tsx catches tap
   ├─> Calls useGenerate() hook
   └─> Hook triggers GenerateTweetUseCase

2. GENERATE TWEET USE CASE
   ├─> ContextBuilder.build()
   │   ├─> Fetches active pillar (DB query)
   │   ├─> Fetches brand profile (cached)
   │   ├─> Fetches top 3 performers (DB query)
   │   └─> Returns GenerationContext
   │
   ├─> GenerationPromptBuilder.build(context)
   │   └─> Returns complete prompt string
   │
   ├─> AIOrchestrator.generate(prompt)
   │   ├─> Try generateWithGemini()
   │   │   ├─> HTTP POST to Gemini API
   │   │   ├─> If success: Return 3 tweets
   │   │   └─> If fail: Throw error
   │   └─> Catch: Try generateWithGroq()
   │       ├─> HTTP POST to Groq API
   │       └─> Return 3 tweets
   │
   ├─> PostProcessor.process(tweets, brandProfile)
   │   ├─> Validate each tweet
   │   ├─> Check guardrails
   │   └─> Return 3 validated tweets
   │
   └─> TweetRepository.saveDrafts(tweets)
       ├─> Insert to SQLite (instant)
       ├─> Background: Sync to Supabase
       └─> Return success

3. UI UPDATES
   ├─> useGenerate() hook updates state
   ├─> HomeScreen re-renders
   ├─> Displays 3 TweetCard components
   └─> Each card animates in (FadeInUp)
```

### Example 2: Share Tweet from Twitter

```
1. USER SHARES TWEET URL TO MANDLE
   ├─> iOS/Android Share Sheet
   └─> App opens to ShareHandler

2. SHARE HANDLER
   ├─> Extracts URL from share intent
   ├─> Calls AnalyzeTweetUseCase(url)
   │   ├─> TweetFetcher.fetch(url)
   │   │   ├─> Call Twitter API (or web scrape)
   │   │   └─> Return tweet content + metrics
   │   │
   │   ├─> PatternExtractor.analyze(content)
   │   │   ├─> Identify hook type
   │   │   ├─> Identify structure
   │   │   └─> Identify emotion
   │   │
   │   └─> Return Analysis object
   │
   └─> Navigate to AnalysisScreen

3. ANALYSIS SCREEN
   ├─> Displays original tweet
   ├─> Shows extracted patterns
   ├─> "Recreate in My Voice" button
   │   ├─> Calls GenerateTweetUseCase
   │   ├─> Passes analysis as context
   │   └─> Generates 3 variations
   │
   └─> InspirationRepository.save(originalTweet, analysis)
       └─> Saves to inspiration library
```

### Example 3: Real-Time Collaboration

```
1. CREATOR GENERATES TWEET
   ├─> TweetRepository.saveDrafts()
   └─> Supabase insert triggers real-time event

2. SUPABASE REAL-TIME
   ├─> Broadcasts INSERT event
   └─> All connected clients receive

3. ASSISTANT'S DEVICE
   ├─> useRealtimeSubscription() hook catches event
   ├─> Fetches new draft details
   └─> Shows notification: "New draft from Creator"

4. ASSISTANT OPENS DRAFT
   ├─> NavigationService.navigate('DraftDetail', { id })
   └─> DraftDetailScreen renders

5. ASSISTANT ADDS COMMENT
   ├─> Calls AddCommentUseCase(draftId, content)
   ├─> CommentRepository.create()
   └─> Supabase insert triggers event

6. CREATOR'S DEVICE
   ├─> Receives real-time comment event
   ├─> Shows push notification
   └─> Comment appears in UI instantly
```

---

## State Management [REQUIRED]

### Zustand Store Structure

```typescript
// src/core/store/appStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  // Online status
  isOnline: boolean;
  setOnline: (status: boolean) => void;

  // Current generation context
  currentPillar: string | null;
  setCurrentPillar: (pillarId: string) => void;

  // Generation history (cache)
  recentTweets: Tweet[];
  addTweet: (tweet: Tweet) => void;
  clearRecentTweets: () => void;

  // User preferences
  preferences: {
    hapticFeedback: boolean;
    autoSave: boolean;
    syncInterval: number;
  };
  updatePreferences: (prefs: Partial<AppState["preferences"]>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isOnline: true,
      currentPillar: null,
      recentTweets: [],
      preferences: {
        hapticFeedback: true,
        autoSave: true,
        syncInterval: 300000, // 5 minutes
      },

      // Actions
      setOnline: (status) => set({ isOnline: status }),

      setCurrentPillar: (pillarId) => set({ currentPillar: pillarId }),

      addTweet: (tweet) =>
        set((state) => ({
          recentTweets: [tweet, ...state.recentTweets].slice(0, 10),
        })),

      clearRecentTweets: () => set({ recentTweets: [] }),

      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

---

## Error Handling [REQUIRED]

### Error Hierarchy

```typescript
// src/shared/utils/errors.ts

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, "NETWORK_ERROR", 503);
  }
}

export class AIGenerationError extends AppError {
  constructor(
    message: string,
    public provider: string,
  ) {
    super(message, "AI_GENERATION_ERROR", 500);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, "DATABASE_ERROR", 500);
  }
}
```

### Error Handling Pattern

```typescript
// In use cases
try {
  const result = await someOperation();
  return result;
} catch (error) {
  if (error instanceof NetworkError) {
    // Retry logic
    return await retry(someOperation, 3);
  } else if (error instanceof AIGenerationError) {
    // Fallback to groq
    return await fallbackGeneration();
  } else {
    // Log and throw
    console.error("Unexpected error:", error);
    throw new AppError("Operation failed", "UNKNOWN_ERROR");
  }
}

// In presentation layer (hooks)
const [error, setError] = useState<string | null>(null);

try {
  await generateTweet();
} catch (err) {
  if (err instanceof AppError) {
    setError(err.message);
    showToast(err.message, "error");
  } else {
    setError("Something went wrong");
    showToast("Something went wrong", "error");
  }
}
```

---

## Performance Optimization [REQUIRED]

### 1. Memoization

```typescript
import { useMemo, useCallback } from "react";

// Expensive computation
const sortedTweets = useMemo(() => {
  return tweets.sort((a, b) => b.createdAt - a.createdAt);
}, [tweets]);

// Prevent function recreation
const handleGenerate = useCallback(async () => {
  await generate();
}, [generate]);
```

### 2. Virtualized Lists

```typescript
import { FlatList } from 'react-native';

<FlatList
  data={tweets}
  renderItem={({ item }) => <TweetCard tweet={item} />}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

### 3. Background Sync

```typescript
// Sync to Supabase in background
const syncQueue = new SyncQueue();

// Write to SQLite immediately
await sqlite.insert("drafts", draft);

// Queue sync (non-blocking)
syncQueue.add(async () => {
  await supabase.from("drafts").insert(draft);
});
```

---

## Testing Strategy

### Unit Tests (Domain Layer)

```typescript
// GenerateTweetUseCase.test.ts
describe("GenerateTweetUseCase", () => {
  it("should generate 3 tweets", async () => {
    const useCase = new GenerateTweetUseCase(mockRepo, mockAI);
    const tweets = await useCase.execute(mockProfile);
    expect(tweets).toHaveLength(3);
  });

  it("should validate against guardrails", async () => {
    // Test guardrail validation
  });
});
```

### Integration Tests (Data Layer)

```typescript
// TweetRepository.test.ts
describe("TweetRepository", () => {
  it("should save drafts to Supabase", async () => {
    const repo = new TweetRepository();
    await repo.saveDrafts(mockTweets);
    const saved = await repo.getDrafts();
    expect(saved).toEqual(mockTweets);
  });
});
```

---

## Security Considerations [REQUIRED]

### API Key Storage

```typescript
// Use Expo SecureStore
import * as SecureStore from "expo-secure-store";

// Save
await SecureStore.setItemAsync("gemini_key", apiKey);

// Retrieve
const key = await SecureStore.getItemAsync("gemini_key");
```

### Row-Level Security (Supabase)

```sql
-- Enable RLS
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own drafts
CREATE POLICY user_drafts ON drafts
  FOR ALL
  USING (auth.uid() = user_id);
```

---

## Next Steps

1. ✅ Read `05-DEPLOYMENT.md` for environment setup
2. ✅ Create folder structure as documented
3. ✅ Set up Supabase database with schema
4. ✅ Implement core domain entities first
5. ✅ Build use cases layer by layer
6. ✅ Connect to UI via custom hooks
7. ✅ Test each layer independently

---

**Last Updated:** January 11, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation
