# 01-PRD: Product Requirements Document

**Product:** Mandle  
**Version:** 1.0  
**Date:** January 11, 2025  
**Status:** Ready for Development

---

## Executive Summary

**For Whom:** Solo creators and their assistants who want to maintain consistent, engaging content without manual ideation overhead.

**Core Value:** One-click generation of brand-aligned tweets/threads using free AI, with built-in memory of what works.

**Key Constraint:** 100% free infrastructure - no paid APIs, no subscription costs.

---

## Product Vision

### Problem Statement

Creating consistent, engaging social media content requires:

- Daily ideation (mentally exhausting)
- Brand voice consistency (hard to maintain)
- Performance tracking (time-consuming)
- Collaboration overhead (between creator and assistant)

### Solution

Mandle automates ideation and maintains brand voice through:

- One-click content generation from smart context
- Performance memory that learns what works
- Seamless collaboration between creator and assistant
- Inspiration from successful creators in your niche

### Success Criteria

**MVP Success (30 days):**

- Generate 100+ tweets with consistent brand voice
- 70%+ of generated content used (minimal editing)
- <30 seconds from generate → copy → post
- Zero API costs throughout usage

**Post-MVP Success (90 days):**

- 500+ tweets generated
- Measurable performance improvement (tracked in app)
- Daily active usage (5+ generations/day)
- Assistant collaboration on 30%+ of content

---

## User Personas

### Primary User: The Creator

**Name:** Solo Content Creator  
**Goal:** Maintain daily posting without burnout  
**Pain Points:**

- Writer's block when staring at blank compose box
- Inconsistent voice when rushing content
- No system to track what performs well
- Wasted time ideating same topics repeatedly

**Needs:**

- Fast content generation
- Brand voice consistency
- Performance insights
- Low cognitive overhead

### Secondary User: The Assistant

**Name:** Creative Assistant  
**Goal:** Help creator with content strategy and execution  
**Pain Points:**

- Back-and-forth via messages is slow
- Hard to track draft versions
- Unclear on brand voice boundaries
- Can't see what creator already tried

**Needs:**

- Real-time collaboration
- Clear brand guidelines
- Comment/feedback system
- Version history

---

## Core Features [REQUIRED]

### Feature 1: One-Click Generate 🔴

**Priority:** Critical  
**User Story:** As a creator, I want to click "Generate" and get 3 tweet options without inputting a topic, so I can overcome writer's block instantly.

**Functional Requirements:**

- Single button tap triggers generation
- Returns 3 variations of same concept
- Each variation follows brand voice
- Generation completes in <5 seconds
- Works offline (uses cached context)

**Context Sources (in priority order):**

1. Notes marked "ready to write"
2. Current content pillar (rotates daily)
3. Recent viral topics from connected accounts
4. Random from content pillars if nothing above

**Acceptance Criteria:**

- [ ] Generate button visible on home screen
- [ ] Tapping shows loading animation (Lottie typing)
- [ ] Returns exactly 3 tweets, each 240-280 characters
- [ ] Each variation has different angle/hook
- [ ] All follow brand guardrails (verified programmatically)
- [ ] Offline mode uses last successful context

**Edge Cases:**

- No internet: Use cached pillars, show "offline" indicator
- API failure: Fallback to Groq, then show error if both fail
- Empty context: Generate from random pillar with notice
- Rate limit hit: Queue request, notify user

---

### Feature 2: Content Pillars 🔴

**Priority:** Critical  
**User Story:** As a creator, I want to define 3-5 main topics so the AI knows what to write about.

**Functional Requirements:**

- Setup wizard on first launch
- 3-5 pillars (enforced range)
- Each pillar has: name, description, examples
- Pillars rotate automatically for variety
- Editable anytime in settings

**Data Structure:**

```typescript
interface ContentPillar {
  id: string;
  name: string; // e.g., "AI Tools"
  description: string; // e.g., "Practical AI applications for creators"
  examples: string[]; // 2-3 example topics
  active: boolean;
  lastUsed: Date;
  usageCount: number;
}
```

**Acceptance Criteria:**

- [ ] Setup wizard appears on first open
- [ ] Can add 3-5 pillars (enforced)
- [ ] Each pillar requires name + description
- [ ] Examples are optional but recommended
- [ ] Pillars appear in settings for editing
- [ ] Can toggle active/inactive
- [ ] Auto-rotation respects `lastUsed` date

---

### Feature 3: Active Ideas Pool 🔴

**Priority:** Critical  
**User Story:** As a creator, I want my saved notes and viral inspirations to feed into generation, so AI has fresh, relevant context.

**Functional Requirements:**

- Combines notes + viral tweets from connected accounts
- Prioritizes notes marked "ready to write"
- Updates viral pool every 6 hours
- Displays pool status (X ideas ready)

**Pool Composition:**

1. User notes marked "ready" (highest priority)
2. Viral tweets from connected accounts (<48 hours old)
3. Trending topics in niche (if available)

**Acceptance Criteria:**

- [ ] Pool size visible on home screen
- [ ] Notes marked "ready" appear first in pool
- [ ] Viral tweets auto-expire after 48 hours
- [ ] Pool updates in background every 6 hours
- [ ] Can manually refresh pool
- [ ] Empty pool gracefully falls back to pillars

---

### Feature 4: [REMOVED]

**Status:** Deprecated/Removed per user request.

---

### Feature 5: Rewrite/Polish 🟡

**Priority:** Important  
**User Story:** As a creator, I want to improve an existing draft, so I can refine ideas without rewriting from scratch.

**Functional Requirements:**

- Input: Existing tweet/thread
- Options: "Make punchier", "Simplify", "Add hook", "More conversational"
- Output: Improved version maintaining core message
- Shows diff/comparison

**Polish Options:**

1. **Punchier** - Shorter sentences, stronger verbs
2. **Simplify** - Remove jargon, clearer language
3. **Add Hook** - Insert curiosity gap at start
4. **Conversational** - More casual, relatable tone
5. **Professional** - More authoritative tone

**Acceptance Criteria:**

- [ ] Long-press tweet → "Polish" option appears
- [ ] Shows 5 polish options
- [ ] Generates single improved version
- [ ] Highlights changes (diff view)
- [ ] Can accept/reject changes
- [ ] Can apply multiple polish types sequentially

---

### Feature 6: System Prompts 🔴

**Priority:** Critical  
**User Story:** As a creator, I want to define how AI should write for me, so content matches my style.

**Functional Requirements:**

- Text area for custom instructions
- Template examples provided
- Character limit: 500-2000 chars
- Applied to every generation
- Editable anytime

**Template Structure:**

```
You are writing tweets for [creator persona].

Writing style:
- [Tone description]
- [Sentence structure preferences]
- [Vocabulary guidelines]

Always:
- [Must-do items]

Never:
- [Avoid items]

Examples of good writing:
[3-5 example tweets]
```

**Acceptance Criteria:**

- [ ] Setup wizard includes prompt creation
- [ ] Template provided as starting point
- [ ] Character count enforced (500-2000)
- [ ] Preview shows how it affects generation
- [ ] Saved to database, encrypted
- [ ] Editable in settings

---

### Feature 7: Brand Guardrails 🔴

**Priority:** Critical  
**User Story:** As a creator, I want automated checks to ensure content stays on-brand, so I never post off-brand content.

**Functional Requirements:**

- Define: Topics, tone, formatting rules
- Automated validation on all generated content
- Flags violations before allowing copy
- Override option (with confirmation)

**Guardrail Categories:**

**1. Content Guardrails**

```typescript
interface ContentGuardrails {
  allowedTopics: string[]; // e.g., ["AI", "productivity"]
  avoidTopics: string[]; // e.g., ["politics", "religion"]
  toneRestrictions: string[]; // e.g., ["no negativity", "no sarcasm"]
  sentimentRequirement: "positive" | "neutral" | "any";
}
```

**2. Format Guardrails**

```typescript
interface FormatGuardrails {
  maxHashtags: number; // e.g., 2
  maxEmojis: number; // e.g., 1
  requireCTA: boolean; // e.g., true
  maxLineBreaks: number; // e.g., 3
  characterRange: [number, number]; // e.g., [240, 280]
}
```

**3. Platform-Specific**

```typescript
// Platform specific guardrails simplified to Twitter only
interface PlatformGuardrails {
  twitter: {
    threadLength: [number, number]; // e.g., [5, 7]
    preferredPostTime: string[]; // e.g., ["9-11am", "7-9pm"]
  };
}
```

**Acceptance Criteria:**

- [ ] Setup wizard includes guardrail configuration
- [ ] All generated content auto-validated
- [ ] Violations highlighted in red
- [ ] Can override with confirmation modal
- [ ] Override logs to analytics
- [ ] Guardrails editable in settings

---

### Feature 8: Voice Examples 🟡

**Priority:** Important  
**User Story:** As a creator, I want to provide my best tweets as examples, so AI matches my actual voice.

**Functional Requirements:**

- Upload 10-20 of your best tweets
- AI analyzes for patterns
- Uses as stylistic reference
- Can add/remove anytime

**Analysis Outputs:**

- Sentence length distribution
- Common hooks/structures
- Vocabulary patterns
- Emoji/punctuation usage
- Tone classification

**Acceptance Criteria:**

- [ ] "Add Voice Example" button in settings
- [ ] Paste tweet or import from Twitter
- [ ] Shows analysis summary after adding
- [ ] Minimum 10 examples required
- [ ] Maximum 20 examples enforced
- [ ] Can delete/replace examples
- [ ] Analysis updates on add/remove

---

### Feature 9: Connected Accounts 🟡

**Priority:** Important  
**User Story:** As a creator, I want to monitor 2-4 successful creators, so I can draw inspiration from proven formats.

**Functional Requirements:**

- Add 2-4 Twitter/Threads accounts
- Auto-fetch their top tweets weekly
- Display viral patterns found
- Never copy verbatim (plagiarism check)

**Data Collected Per Account:**

```typescript
interface ConnectedAccount {
  handle: string;
  platform: "twitter";
  addedDate: Date;
  topTweets: Array<{
    content: string;
    impressions: number;
    engagement: number;
    date: Date;
    patterns: string[]; // e.g., ["question-hook", "list-format"]
  }>;
  viralPatterns: string[];
}
```

**Acceptance Criteria:**

- [ ] Can add 2-4 accounts (enforced range)
- [ ] Auto-fetches top 10 tweets per account weekly
- [ ] Displays patterns found (e.g., "Uses questions 70% of time")
- [ ] Plagiarism check before allowing copy
- [ ] Can view account's top tweets in-app
- [ ] Can remove account anytime

---

### Feature 10: Share from Twitter 🟡

**Priority:** Important  
**User Story:** As a creator, I want to share a tweet to Mandle for analysis and recreation, so I can adapt viral formats to my voice.

**Functional Requirements:**

- Share tweet URL to Mandle
- Auto-analyzes: hook, structure, emotion
- Generates 3 variations in your voice
- Saves to inspiration library

**Analysis Components:**

1. **Hook Type** - Question, statement, stat, story
2. **Structure** - List, narrative, tutorial, hot-take
3. **Emotion** - Curiosity, urgency, aspiration, relatability
4. **CTA Type** - Follow, retweet, reply, click

**Acceptance Criteria:**

- [ ] Appears in iOS/Android share sheet
- [ ] Accepts Twitter URLs
- [ ] Extracts tweet content automatically
- [ ] Shows analysis within 3 seconds
- [ ] Generates 3 variations in your voice
- [ ] Saves original + variations to library
- [ ] Can access via "Inspiration" tab

---

### Feature 11: Notes System 🔴

**Priority:** Critical  
**User Story:** As a creator, I want to save raw ideas for later, so I don't lose inspiration.

**Functional Requirements:**

- Quick-add note (text input)
- Tag notes (e.g., "ready", "idea", "thread")
- Search notes
- Mark "ready to write" (feeds into generation)
- Attach to content pillar

**Note States:**

1. **Draft** - Just an idea
2. **Ready** - Feeds into active ideas pool
3. **Generated** - Already created content from this
4. **Posted** - Content posted to social
5. **Archived** - No longer relevant

**Acceptance Criteria:**

- [ ] "+" button opens note creation
- [ ] Can add note in <5 seconds
- [ ] Tag system with custom tags
- [ ] Search by keyword or tag
- [ ] "Mark Ready" button feeds into pool
- [ ] Shows note state badge
- [ ] Can convert note → thread directly

---

### Feature 12: Version History 🟡

**Priority:** Important  
**User Story:** As a creator and assistant, we want to see all iterations of a tweet, so we can track evolution and revert if needed.

**Functional Requirements:**

- Auto-saves every edit
- Shows timeline of changes
- Can compare versions
- Can revert to previous
- Preserves who made change (creator vs assistant)

**Version Metadata:**

```typescript
interface Version {
  id: string;
  content: string;
  author: "creator" | "assistant";
  timestamp: Date;
  changeType: "generated" | "edited" | "polished";
  parentVersion?: string;
}
```

**Acceptance Criteria:**

- [ ] "History" button on each draft
- [ ] Shows timeline view of versions
- [ ] Can tap version to preview
- [ ] Diff view shows changes
- [ ] Can revert with confirmation
- [ ] Shows author name/role
- [ ] Preserves all versions indefinitely

---

### Feature 13: Comments/Feedback 🟡

**Priority:** Important  
**User Story:** As a creator and assistant, we want to leave notes on drafts, so we can collaborate asynchronously.

**Functional Requirements:**

- Add comment to any draft
- Mentions (@creator, @assistant)
- Mark comment resolved
- Real-time sync (via Supabase)
- Push notification for new comments

**Comment Features:**

- Text comments
- Reply threads
- @ mentions
- Resolve/unresolve
- Edit/delete own comments

**Acceptance Criteria:**

- [ ] "Comment" button on drafts
- [ ] Text input with @ autocomplete
- [ ] Comments appear in real-time
- [ ] Push notification when mentioned
- [ ] Can resolve comment
- [ ] Resolved comments collapsed
- [ ] Can filter by unresolved only

---

### Feature 14: Performance Logger 🔴

**Priority:** Critical  
**User Story:** As a creator, I want to log how each tweet performed, so AI can learn what works.

**Functional Requirements:**

- Manual entry: impressions, likes, retweets
- Auto-calculates engagement rate
- Tag with topics/formats
- Feeds into AI context for future generation

**Performance Metrics:**

```typescript
interface PerformanceLog {
  tweetId: string;
  content: string;
  platform: "twitter";
  postedDate: Date;
  metrics: {
    impressions: number;
    likes: number;
    retweets: number;
    replies: number;
    follows: number;
    clicks?: number;
  };
  tags: string[];
  successScore: number; // 1-10, auto-calculated
}
```

**Success Score Formula:**

```
successScore = (
  (impressions / 1000) * 0.3 +
  (engagementRate * 10) * 0.4 +
  (newFollowers) * 0.3
)
capped at 10
```

**Acceptance Criteria:**

- [ ] "Log Performance" button on posted tweets
- [ ] Manual input fields for all metrics
- [ ] Auto-calculates engagement rate
- [ ] Auto-calculates success score
- [ ] Shows performance history graph
- [ ] Can filter by score >7 (high performers)
- [ ] High performers feed into AI context

---

### Feature 15: Context Recall 🔴

**Priority:** Critical  
**User Story:** As a creator, I want AI to reference my past successes when generating, so new content matches what works.

**Functional Requirements:**

- Before generation, query performance database
- Find top 3 similar high-performing tweets
- Include in AI context
- Show user what inspired current generation

**Similarity Matching:**

- Topic overlap (via tags)
- Semantic similarity (via embeddings)
- Format similarity (thread vs standalone)

**Context Window:**

```
SYSTEM PROMPT
+ BRAND GUARDRAILS
+ VOICE EXAMPLES (3 samples)
+ PAST SUCCESSES (top 3 similar)
+ CONTENT PILLAR (current)
+ ACTIVE IDEAS (if any)
= GENERATION REQUEST
```

**Acceptance Criteria:**

- [ ] Before generation, searches performance DB
- [ ] Finds top 3 similar tweets with score >7
- [ ] Includes in AI prompt
- [ ] Shows "Inspired by your [topic] tweet from [date]"
- [ ] Falls back to voice examples if no similar found
- [ ] Similarity threshold >0.7 (configurable)

---

### Feature 16: Pattern Extraction 🟡

**Priority:** Important  
**User Story:** As a creator, I want to see what patterns emerge from successful content, so I can double down on what works.

**Functional Requirements:**

- Weekly analysis of performance data
- Identifies patterns in high performers (score >7)
- Displays insights dashboard
- Auto-applies insights to future generation

**Pattern Categories:**

1. **Structural** - Thread length, tweet length, formatting
2. **Content** - Topics, tone, hooks
3. **Timing** - Best days/times to post
4. **Engagement** - What drives replies vs retweets

**Example Insights:**

- "Your question threads average 8.2/10 score"
- "Posts about AI tools outperform productivity by 40%"
- "Tweets 250-270 chars perform best (vs 220-240)"
- "Tuesday 9am posts get 2x impressions"

**Acceptance Criteria:**

- [ ] "Insights" tab in app
- [ ] Runs analysis weekly (Sunday midnight)
- [ ] Shows top 5 patterns discovered
- [ ] Each pattern shows supporting data
- [ ] Can dismiss irrelevant patterns
- [ ] Patterns feed into generation context
- [ ] Insights exportable as text

---

## User Flows [REQUIRED]

### Flow 1: First-Time Setup

```
1. Download app → Open
2. Welcome screen → "Get Started"
3. Setup Wizard:
   a. Define 3-5 Content Pillars
   b. Write System Prompt (template provided)
   c. Set Brand Guardrails
   d. Add 10 Voice Examples
   e. Connect 2-4 Accounts (optional)
4. Home screen → Ready to generate
```

**Time to Complete:** <10 minutes

---

### Flow 2: Daily Generation (Primary Flow)

```
1. Open app
2. Tap "Generate" button (center, prominent)
3. See loading animation (2-5 sec)
4. View 3 tweet options
5. Swipe through options
6. Tap favorite → Long-press → "Copy"
7. Minimize app → Open Twitter → Paste → Post
8. Return to Mandle → "Log Performance" (later)
```

**Time to Complete:** <30 seconds

---

### Flow 3: Thread Creation (Removed)

[Removed]

---

### Flow 4: Inspiration from Viral Tweet

```
1. See viral tweet on Twitter
2. Tap Share → "Mandle"
3. Mandle analyzes tweet (3 sec)
4. Shows: Hook type, structure, emotion
5. Generates 3 variations in your voice
6. Pick favorite → Copy → Post
7. Original saved to "Inspiration" library
```

**Time to Complete:** <45 seconds

---

### Flow 5: Collaboration with Assistant

```
Creator:
1. Generates 3 tweet options
2. Favorites one → Leaves comment: "Thoughts?"

Assistant (real-time):
3. Sees notification
4. Opens draft
5. Leaves comment: "Love it! Maybe punchier hook?"
6. Suggests edit

Creator:
7. Sees comment (push notification)
8. Taps "Polish" → "Make Punchier"
9. Reviews polished version
10. Approves → Copies → Posts
```

**Time to Complete:** 5-10 minutes (async)

---

## Non-Functional Requirements [REQUIRED]

### Performance

- 🔴 App launch: <2 seconds (cold start)
- 🔴 Generation time: <5 seconds (AI call)
- 🔴 UI animations: 60 FPS minimum
- 🟡 Database queries: <200ms
- 🟡 Real-time sync: <1 second latency

### Reliability

- 🔴 Offline mode: Core features work without internet
- 🔴 API fallback: Groq if Gemini fails
- 🟡 Auto-save drafts every 30 seconds
- 🟡 Background sync when reconnected

### Scalability

- 🟡 Handle 10,000+ saved drafts
- 🟡 1,000+ performance logs
- 🟡 100+ notes
- 🟢 5+ years of data without degradation

### Security

- 🔴 API keys stored in encrypted .env
- 🔴 User data encrypted at rest (Supabase)
- 🟡 Optional biometric lock
- 🟢 No analytics/tracking

### Accessibility

- 🟡 VoiceOver support (iOS)
- 🟡 TalkBack support (Android)
- 🟡 Dynamic text sizing
- 🟢 High contrast mode

---

## Out of Scope (Post-MVP)

### Not Building Now:

- ❌ Multi-user authentication
- ❌ Auto-posting to platforms
- ❌ Paid features/subscriptions
- ❌ Web dashboard (mobile-only MVP)
- ❌ Analytics beyond performance logging
- ❌ Image generation
- ❌ Video script generation
- ❌ Engagement automation
- ❌ DM automation

### Future Considerations:

- 🟢 Web version (desktop companion)
- 🟢 Calendar view of posts
- 🟢 A/B testing framework
- 🟢 Export to Notion/Google Docs
- 🟢 AI-suggested posting times
- 🟢 Trend detection

---

## Success Metrics

### MVP Launch (Week 4)

- [ ] App available on iOS/Android
- [ ] All 16 core features functional
- [ ] <3 crashes per 100 sessions
- [ ] <5 second generation time
- [ ] 60 FPS UI performance

### 30-Day Post-Launch

- [ ] 100+ tweets generated
- [ ] 70%+ content usage rate
- [ ] 5+ generations per day (avg)
- [ ] <30 second generate-to-post flow
- [ ] $0 infrastructure costs

### 90-Day Maturity

- [ ] 500+ tweets generated
- [ ] Performance improvement visible in logged data
- [ ] Daily active usage
- [ ] Assistant using collaboration features
- [ ] 3+ connected accounts providing inspiration

---

## Technical Constraints [REQUIRED]

### Budget

- 🔴 **$0/month** - Only free tier services
- 🔴 Gemini 2.5 Flash: 15 req/min (free)
- 🔴 Groq: 14,400 req/day (free)
- 🔴 Supabase: 500MB DB, 1GB storage (free)

### APIs

- 🔴 No OpenAI (paid only)
- 🔴 No Claude API (paid only)
- 🟡 Twitter API: Read-only, essential access (free)
- 🟡 Threads: Web scraping (no official API)

### Platform

- 🔴 React Native + Expo
- 🔴 iOS 14+ and Android 10+
- 🟡 No web version initially
- 🟢 Future: React Native Web

---

## Dependencies [REFERENCE]

This PRD depends on:

- `02-TECH_STACK.md` for implementation details
- `03-DESIGN.md` for UI specifications
- `04-ARCHITECTURE.md` for system design
- `05-DEPLOYMENT.md` for environment setup

---

## Approval & Sign-Off

**Product Owner:** Creator (You)  
**Development Team:** AI Coding Assistant + You  
**Status:** ✅ Approved for Development  
**Start Date:** January 11, 2025  
**Target MVP:** February 8, 2025 (4 weeks)

---

**Last Updated:** January 11, 2025  
**Version:** 1.0  
**Changes:** Initial release
