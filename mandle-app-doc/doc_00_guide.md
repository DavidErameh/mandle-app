# 00-DOC-GUIDE: Documentation Navigation

## Purpose
This guide explains how to use the Mandle documentation suite for building the app with AI coding assistants (Cursor, Windsurf, Cline, etc.).

## Documentation Structure

```
mandle-docs/
├── 00-DOC-GUIDE.md          ← You are here
├── 01-PRD.md                ← Product Requirements Document
├── 02-TECH_STACK.md         ← Technology Stack & Dependencies
├── 03-DESIGN.md             ← Design System & UI Specifications
├── 04-ARCHITECTURE.md       ← System Architecture & Logic
└── 05-DEPLOYMENT.md         ← Deployment & Environment Setup
```

## How to Use These Docs with AI Coding IDEs

### Step 1: Context Loading Order
Load documents in this exact sequence for optimal AI comprehension:

1. **First:** `01-PRD.md` - Understand what we're building
2. **Second:** `04-ARCHITECTURE.md` - Understand system design
3. **Third:** `02-TECH_STACK.md` - Understand technical constraints
4. **Fourth:** `03-DESIGN.md` - Understand UI/UX requirements
5. **Fifth:** `05-DEPLOYMENT.md` - Understand environment setup

### Step 2: Implementation Phases

**Phase 1: Foundation (Week 1)**
- Read: `05-DEPLOYMENT.md` → Set up environment
- Read: `02-TECH_STACK.md` → Install dependencies
- Read: `04-ARCHITECTURE.md` → Create folder structure
- Build: Core architecture skeleton

**Phase 2: Core Features (Week 2)**
- Read: `01-PRD.md` Features 1-5
- Read: `03-DESIGN.md` Components section
- Build: Generation system, brand setup

**Phase 3: Advanced Features (Week 3)**
- Read: `01-PRD.md` Features 6-16
- Build: Inspiration engine, collaboration

**Phase 4: Polish (Week 4)**
- Read: `03-DESIGN.md` Animations
- Implement: All micro-interactions

### Step 3: AI Prompting Best Practices

**When Starting a Feature:**
```
Context: I'm building [Feature Name] from Mandle PRD
Reference: 01-PRD.md section [X], 04-ARCHITECTURE.md section [Y]
Constraints: [Any specific limitations]
Request: Create [specific component/logic]
```

**When Debugging:**
```
Issue: [Describe problem]
Expected: [From PRD or Architecture doc]
Current: [What's happening]
Relevant docs: [Section references]
```

**When Refactoring:**
```
Current implementation: [Describe]
Target architecture: [Reference 04-ARCHITECTURE.md section]
Design system alignment: [Reference 03-DESIGN.md]
Refactor to match documented patterns
```

## Document Symbols & Conventions

### Priority Markers
- 🔴 **Critical** - Must implement exactly as specified
- 🟡 **Important** - Strongly recommended, minor variations acceptable
- 🟢 **Optional** - Nice to have, can defer

### Code Blocks
- `inline code` - Exact values, function names, file paths
- ```javascript - Implementation examples (adapt as needed)
- ```typescript - Type definitions (implement strictly)

### Diagrams
- `→` - Data flow direction
- `↓` - Sequential steps
- `├─` - Folder/file structure
- `│` - Continuation/nesting

### Section Tags
- `[REQUIRED]` - Non-negotiable implementation
- `[REFERENCE]` - Use as example, not verbatim
- `[CONTEXT]` - Background info for understanding
- `[FUTURE]` - Post-MVP consideration

## Common AI Assistant Workflows

### Creating a New Screen
1. Reference: `03-DESIGN.md` → Layout Principles
2. Reference: `04-ARCHITECTURE.md` → Presentation Layer
3. Reference: `02-TECH_STACK.md` → Component Libraries
4. Prompt: "Create [ScreenName] following Mandle's architecture pattern"

### Implementing AI Generation
1. Reference: `04-ARCHITECTURE.md` → AI Agent Architecture
2. Reference: `02-TECH_STACK.md` → AI APIs
3. Reference: `01-PRD.md` → Generation Requirements
4. Prompt: "Implement sequential generation pipeline per architecture doc"

### Building a Component
1. Reference: `03-DESIGN.md` → Design Tokens
2. Reference: `03-DESIGN.md` → Component Specifications
3. Prompt: "Create [Component] using NativeWind with Mandle design system"

### Setting Up Database
1. Reference: `04-ARCHITECTURE.md` → Database Schema
2. Reference: `02-TECH_STACK.md` → Supabase Setup
3. Reference: `05-DEPLOYMENT.md` → Environment Variables
4. Prompt: "Create Supabase schema from architecture doc"

## Critical Context for AI Assistants

### What Makes This App Unique
- **Zero-budget constraint**: Only free APIs (Gemini, Groq)
- **Personal use**: No multi-user auth initially
- **Apple-style UX**: Premium feel despite being free
- **Collaboration-ready**: Built for user + assistant workflow
- **Offline-first**: Works without internet for drafts

### Non-Negotiables
1. **No paid API calls** - Always use free tiers
2. **Clean architecture** - Strict layer separation
3. **Sequential AI pattern** - No parallel agent calls
4. **Apple UX principles** - Clarity, deference, depth
5. **Performance** - 60 FPS minimum, Reanimated for all animations

### Common Pitfalls to Avoid
❌ Don't use Redux (use Zustand)
❌ Don't call AI APIs from components (use domain layer)
❌ Don't hard-code colors (use design tokens)
❌ Don't use React Native's Animated API (use Reanimated)
❌ Don't skip error handling on API calls
❌ Don't store sensitive keys in code (use .env)

## Document Cross-References

### When You Need To Know:
- **"What features to build?"** → `01-PRD.md`
- **"How to structure code?"** → `04-ARCHITECTURE.md`
- **"What libraries to use?"** → `02-TECH_STACK.md`
- **"What should it look like?"** → `03-DESIGN.md`
- **"How to deploy?"** → `05-DEPLOYMENT.md`
- **"What colors/fonts?"** → `03-DESIGN.md` → Design Tokens
- **"How does AI work?"** → `04-ARCHITECTURE.md` → AI Agent Architecture
- **"Database structure?"** → `04-ARCHITECTURE.md` → Data Models
- **"API endpoints?"** → `02-TECH_STACK.md` → API Configuration

## Version Control Notes

### File Naming Convention
- All docs use UPPERCASE with underscores: `01_PRD.md`
- Version in header: `Version 1.0 - [Date]`
- Update log at bottom of each doc

### When Docs Conflict
Priority order (highest to lowest):
1. `01-PRD.md` - Business requirements win
2. `04-ARCHITECTURE.md` - System design constraints
3. `03-DESIGN.md` - UX requirements
4. `02-TECH_STACK.md` - Technical limitations
5. `05-DEPLOYMENT.md` - Environment specifics

## Quick Start Checklist

- [ ] Read this guide completely
- [ ] Load `01-PRD.md` into AI context
- [ ] Load `04-ARCHITECTURE.md` into AI context
- [ ] Set up environment per `05-DEPLOYMENT.md`
- [ ] Create project structure from `04-ARCHITECTURE.md`
- [ ] Install dependencies from `02-TECH_STACK.md`
- [ ] Set up design tokens from `03-DESIGN.md`
- [ ] Build Feature 1 from `01-PRD.md`
- [ ] Test against design specs in `03-DESIGN.md`
- [ ] Repeat for next feature

## Getting Help

### If Implementation Unclear:
1. Check relevant doc section
2. Look for `[REFERENCE]` code examples
3. Cross-reference with architecture patterns
4. Ask AI: "According to [doc name], how should I implement [X]?"

### If Requirements Conflict:
1. Follow priority order above
2. Document the conflict
3. Choose path that serves core user flow
4. Note deviation for future review

## Success Metrics

Your implementation is correct when:
✅ Follows folder structure from `04-ARCHITECTURE.md`
✅ Uses exact design tokens from `03-DESIGN.md`
✅ Implements features from `01-PRD.md` in order
✅ Uses only technologies from `02-TECH_STACK.md`
✅ Deploys per `05-DEPLOYMENT.md` instructions
✅ Passes all `[REQUIRED]` specifications
✅ Maintains 60 FPS performance
✅ Works offline for core features

---

**Next Step:** Read `01-PRD.md` to understand what we're building.

**Last Updated:** January 11, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation
