# 03-DESIGN: Design System & UI Specifications

**Version:** 1.0  
**Date:** January 11, 2025  
**Status:** Ready for Implementation

---

## Design Philosophy

### Core Principles
1. **Clarity** - Content always takes precedence over chrome
2. **Deference** - UI elements recede, letting content shine
3. **Depth** - Subtle use of translucency and layering
4. **Fluidity** - Every interaction feels natural and responsive
5. **Premium Feel** - High-end aesthetic despite zero budget

### Aesthetic Direction
- **Dark Minimalism** - Very dark gray foundation
- **Frosted Glass** - Translucent elements with blur
- **X Blue Accents** - Strategic use of verified blue
- **Smooth Motion** - 60-120 FPS animations throughout
- **Generous Spacing** - Breathing room, never cramped

---

## Design Tokens [REQUIRED]

### Color System

```typescript
// src/shared/theme/colors.ts
export const colors = {
  // Backgrounds
  background: {
    primary: '#0A0A0A',      // Very dark gray
    secondary: '#141414',     // Slightly lighter
    tertiary: '#1E1E1E',      // Cards, elevated elements
  },
  
  // Frosted Glass
  frosted: {
    default: 'rgba(255, 255, 255, 0.08)',
    hover: 'rgba(255, 255, 255, 0.12)',
    pressed: 'rgba(255, 255, 255, 0.06)',
    border: 'rgba(255, 255, 255, 0.12)',
  },
  
  // Text
  text: {
    primary: '#FFFFFF',                    // Full white
    secondary: 'rgba(255, 255, 255, 0.6)', // 60% opacity
    tertiary: 'rgba(255, 255, 255, 0.4)',  // 40% opacity
    disabled: 'rgba(255, 255, 255, 0.3)',  // 30% opacity
  },
  
  // Accent (X Blue)
  accent: {
    primary: '#1D9BF0',        // X verified blue
    hover: '#1A8CD8',          // Darker on hover
    pressed: '#1780C6',        // Even darker pressed
    light: 'rgba(29, 155, 240, 0.1)', // 10% opacity background
    glow: 'rgba(29, 155, 240, 0.3)',  // Glow effect
  },
  
  // Semantic Colors
  success: {
    primary: '#00D66F',
    background: 'rgba(0, 214, 111, 0.1)',
  },
  error: {
    primary: '#F4212E',
    background: 'rgba(244, 33, 46, 0.1)',
  },
  warning: {
    primary: '#FFD60A',
    background: 'rgba(255, 214, 10, 0.1)',
  },
  
  // Borders & Dividers
  border: {
    default: 'rgba(255, 255, 255, 0.12)',
    light: 'rgba(255, 255, 255, 0.08)',
    heavy: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Overlays
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    medium: 'rgba(0, 0, 0, 0.7)',
    heavy: 'rgba(0, 0, 0, 0.9)',
  },
};
```

### Typography Scale

```typescript
// src/shared/theme/typography.ts
export const typography = {
  // Display (Rare usage, hero sections)
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontFamily: 'CooperOldStyle-Bold',
    letterSpacing: -0.5,
  },
  
  // Headings
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: 'CooperOldStyle-Bold',
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'CooperOldStyle-Bold',
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'CooperOldStyle-Medium',
    letterSpacing: 0,
  },
  
  // Body Text
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'CooperOldStyle-Regular',
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'CooperOldStyle-Medium',
    letterSpacing: 0,
  },
  
  // Small Text
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'CooperOldStyle-Regular',
    letterSpacing: 0.1,
  },
  overline: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'CooperOldStyle-Medium',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Tweet Text (Special case)
  tweet: {
    fontSize: 17,
    lineHeight: 26,
    fontFamily: 'CooperOldStyle-Regular',
    letterSpacing: 0,
  },
};
```

### Spacing System (8pt Grid)

```typescript
// src/shared/theme/spacing.ts
export const spacing = {
  xs: 4,    // 0.5 units
  sm: 8,    // 1 unit
  md: 16,   // 2 units
  lg: 24,   // 3 units
  xl: 32,   // 4 units
  xxl: 48,  // 6 units
  xxxl: 64, // 8 units
};

// Usage: margin, padding, gaps
```

### Border Radius

```typescript
// src/shared/theme/radius.ts
export const radius = {
  sm: 8,    // Buttons, small cards
  md: 12,   // Cards, inputs
  lg: 16,   // Large cards
  xl: 20,   // Modals
  full: 9999, // Pills, avatars
};
```

### Shadows & Elevation

```typescript
// src/shared/theme/shadows.ts
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  glow: {
    shadowColor: '#1D9BF0', // X blue glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 0,
  },
};
```

### Blur Values

```typescript
// For BackdropFilter or BlurView
export const blur = {
  light: 8,
  medium: 16,
  heavy: 24,
};
```

---

## Component Specifications [REQUIRED]

### 1. Buttons

#### Primary Button (Generate, Post)
```typescript
interface PrimaryButtonProps {
  onPress: () => void;
  children: string;
  loading?: boolean;
  disabled?: boolean;
}

// Visual Specs:
// - Background: colors.accent.primary
// - Text: colors.text.primary
// - Height: 56px
// - Padding: 16px horizontal
// - Border radius: radius.md (12px)
// - Font: typography.bodyMedium
// - Shadow: shadows.glow (on press)
// - Haptic: medium impact

// States:
// - Default: Scale 1.0, opacity 1.0
// - Hover: Scale 1.02, brightness 1.1
// - Pressed: Scale 0.98, opacity 0.9
// - Loading: Show spinner, disable interaction
// - Disabled: Opacity 0.5, no interaction
```

**Animation:**
```typescript
// On press
scale: withSpring(0.98, { damping: 15 })
opacity: withTiming(0.9, { duration: 100 })

// On release
scale: withSpring(1.0, { damping: 15 })
opacity: withTiming(1.0, { duration: 100 })
```

#### Secondary Button (Cancel, Back)
```typescript
// Visual Specs:
// - Background: colors.frosted.default
// - Text: colors.text.primary
// - Height: 56px
// - Border: 1px colors.frosted.border
// - Border radius: radius.md
// - Backdrop blur: 24px
```

#### Icon Button (Settings, History)
```typescript
// Visual Specs:
// - Size: 44x44px (minimum touch target)
// - Background: colors.frosted.default
// - Border radius: radius.sm
// - Icon: 20x20px
// - Active state: colors.accent.light background
```

---

### 2. Cards

#### Tweet Card (Generated Output)
```typescript
interface TweetCardProps {
  content: string;
  variant?: 'default' | 'selected' | 'dimmed';
  onPress?: () => void;
  onLongPress?: () => void;
}

// Visual Specs:
// - Background: colors.frosted.default
// - Border: 1px colors.frosted.border
// - Border radius: radius.lg (16px)
// - Padding: 20px
// - Backdrop blur: 24px
// - Min height: 140px

// Selected State:
// - Border: 2px colors.accent.primary
// - Background: colors.accent.light
// - Glow: shadows.glow

// Dimmed State (other options when one selected):
// - Opacity: 0.5
// - Scale: 0.97
```

**Animation:**
```typescript
// On mount
opacity: withTiming(1, { duration: 300 })
translateY: withSpring(0, { damping: 15 }) // from -20

// On selection
scale: withSpring(1.02, { damping: 12 })
borderWidth: withTiming(2, { duration: 200 })
```

#### Note Card
```typescript
// Visual Specs:
// - Background: colors.background.tertiary
// - Border: None
// - Border radius: radius.md
// - Padding: 16px
// - State badge: Top-right corner
```

---

### 3. Inputs

#### Text Input (Notes, Comments)
```typescript
interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  multiline?: boolean;
  maxLength?: number;
}

// Visual Specs:
// - Background: colors.frosted.default
// - Border: 1px colors.frosted.border
// - Border radius: radius.md
// - Padding: 16px
// - Font: typography.body
// - Placeholder: colors.text.tertiary
// - Min height: 56px (single line)

// Focus State:
// - Border: 2px colors.accent.primary
// - Border glow: shadows.glow
```

---

### 4. Navigation

#### Bottom Tab Bar
```typescript
// Visual Specs:
// - Background: colors.frosted.default
// - Backdrop blur: 32px
// - Height: 80px + safe area
// - Border top: 1px colors.frosted.border
// - Shadow: shadows.lg

// Tab Item:
// - Active: colors.accent.primary
// - Inactive: colors.text.secondary
// - Icon size: 24x24px
// - Label: typography.caption
```

**Tab Icons:**
- Home: SparklesIcon (Generate)
- Notes: DocumentTextIcon
- Inspiration: LightBulbIcon
- Analytics: ChartBarIcon
- Settings: Cog6ToothIcon

#### Header
```typescript
// Visual Specs:
// - Background: colors.background.primary (transparent)
// - Height: 64px + safe area
// - Title: typography.h3, center aligned
// - Back button: Left, 44x44px
// - Action button: Right, 44x44px
```

---

### 5. Modals & Sheets

#### Bottom Sheet (Comments, Options)
```typescript
// Visual Specs:
// - Background: colors.background.secondary
// - Border radius: radius.xl (top corners only)
// - Handle: 40x4px rounded pill, colors.text.tertiary
// - Max height: 90% screen
// - Backdrop: colors.overlay.medium

// Gesture:
// - Swipe down to dismiss
// - Bounce at top
// - Snap to half/full height
```

**Animation:**
```typescript
// On open
translateY: withSpring(0, { damping: 20 }) // from full height
opacity: withTiming(1, { duration: 200 })

// Backdrop
opacity: withTiming(0.7, { duration: 300 })
```

#### Alert Modal
```typescript
// Visual Specs:
// - Background: colors.background.tertiary
// - Border radius: radius.lg
// - Padding: 24px
// - Max width: 320px
// - Center screen
// - Shadow: shadows.lg
```

---

### 6. Loading States

#### Skeleton Loader
```typescript
// Visual Specs:
// - Background: colors.frosted.default
// - Shimmer: Linear gradient (transparent → white 10% → transparent)
// - Animation: 1.5s infinite
// - Border radius: Match target component
```

#### Spinner (Button Loading)
```typescript
// Visual Specs:
// - Color: colors.text.primary (in dark button)
// - Size: 20x20px
// - Stroke width: 2px
// - Animation: Continuous rotation
```

#### Lottie Loading (AI Generation)
```typescript
// Visual Specs:
// - Animation: typing.json
// - Size: 100x100px
// - Color: colors.accent.primary
// - Position: Center screen
// - Overlay: colors.overlay.light
```

---

### 7. Lists

#### Virtualized List (Performance Logs, Notes)
```typescript
// Use FlatList, NOT ScrollView
// Visual Specs:
// - Item separator: 1px colors.border.light
// - Empty state: Lottie animation + text
// - Pull to refresh: Custom indicator
// - Item height: Consistent (optimize performance)
```

---

### 8. Badges & Tags

#### State Badge (Note State)
```typescript
// Visual Specs:
// - Background: Semantic color background
// - Text: Semantic color primary
// - Padding: 4px 8px
// - Border radius: radius.sm
// - Font: typography.overline

// States:
// - Draft: colors.text.secondary
// - Ready: colors.accent.primary
// - Generated: colors.success.primary
// - Posted: colors.text.tertiary
```

#### Tag Chip (Performance Tags)
```typescript
// Visual Specs:
// - Background: colors.frosted.default
// - Border: 1px colors.frosted.border
// - Padding: 6px 12px
// - Border radius: radius.full
// - Font: typography.caption
// - Dismissible: X icon on right
```

---

### 9. Empty States

```typescript
// Visual Specs:
// - Lottie animation: empty.json
// - Animation size: 200x200px
// - Title: typography.h3, colors.text.primary
// - Description: typography.body, colors.text.secondary
// - CTA button: Primary button
// - Vertical stack, center aligned
```

**Empty State Messages:**
- No notes: "Capture your ideas" + "Add Note" button
- No drafts: "Generate your first tweet" + "Generate" button
- No performance logs: "Post and track performance"
- No connected accounts: "Connect inspiring creators"

---

### 10. Toasts & Notifications

#### Toast (Success, Error)
```typescript
// Visual Specs:
// - Background: colors.background.tertiary
// - Border: 1px semantic color
// - Border radius: radius.md
// - Padding: 16px
// - Min width: 320px
// - Position: Top center, below safe area
// - Shadow: shadows.md
// - Auto-dismiss: 3 seconds

// Animation:
// - Slide in from top: translateY(-100 → 0)
// - Fade out: opacity(1 → 0) after 2.7s
```

#### Push Notification (Comments)
```typescript
// Visual Specs (iOS style):
// - Background: colors.frosted.default
// - Backdrop blur: 32px
// - Border radius: radius.lg
// - Avatar: 40x40px circle
// - Title: typography.bodyMedium
// - Message: typography.caption
// - Timestamp: typography.overline
```

---

## Apple UX Patterns [REQUIRED]

### 1. Clarity Through Hierarchy

**Visual Weight Distribution:**
```
Primary Action (Generate): colors.accent.primary, 56px height, prominent
Secondary Actions: colors.frosted.default, 44px height, subtle
Tertiary Actions: Icon-only, 44x44px, minimal
```

**Content Priority:**
```
1. Generated tweets (largest, center)
2. Action buttons (medium, accessible)
3. Metadata (smallest, supportive)
```

### 2. Deference to Content

**UI Receding Techniques:**
- Frosted glass (vs solid backgrounds)
- Blur effects (content visible behind)
- Minimal chrome (no unnecessary borders)
- Auto-hide tab bar on scroll
- Translucent navigation bars

### 3. Depth Through Layering

**Z-Axis Hierarchy:**
```
Layer 5: Modals & alerts (elevation 16)
Layer 4: Floating action button (elevation 8)
Layer 3: Cards (elevation 4)
Layer 2: Navigation bars (elevation 2)
Layer 1: Background (elevation 0)
```

**Visual Depth Cues:**
- Shadows (subtle, directional)
- Translucency (layered transparency)
- Blur (gaussian, progressive)
- Scale (larger = closer)

### 4. Fluid Animations

**Timing Functions:**
```typescript
export const easings = {
  // Standard iOS curves
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  
  // Spring (preferred for gestures)
  spring: {
    damping: 15,
    mass: 0.7,
    stiffness: 120,
  },
};
```

**Duration Guidelines:**
- Micro-interactions: 100-200ms
- Transitions: 300-400ms
- Page changes: 400-500ms
- Never exceed 600ms

### 5. Haptic Feedback

```typescript
import * as Haptics from 'expo-haptics';

// Button press
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Success action
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Error
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// Selection change
Haptics.selectionAsync();
```

**Usage Guidelines:**
- Always on primary actions
- On selection changes
- On successful completions
- On errors (different pattern)
- Never on scroll or passive interactions

---

## Animation Library [REQUIRED]

### Entrance Animations

#### Fade In Up (Cards, Modals)
```typescript
import Animated, { 
  useAnimatedStyle,
  withSpring,
  withTiming 
} from 'react-native-reanimated';

const FadeInUp = ({ children, delay = 0 }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1, { duration: 300, delay }),
    transform: [
      { translateY: withSpring(0, { damping: 15 }, delay) }
    ],
  }));

  return (
    <Animated.View 
      style={[{ opacity: 0, transform: [{ translateY: -20 }] }, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
};
```

#### Scale In (Buttons, Icons)
```typescript
const ScaleIn = ({ children, delay = 0 }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1, { duration: 200, delay }),
    transform: [
      { scale: withSpring(1, { damping: 12 }, delay) }
    ],
  }));

  return (
    <Animated.View 
      style={[{ opacity: 0, transform: [{ scale: 0.9 }] }, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
};
```

### Interactive Animations

#### Press Scale
```typescript
import { Gesture } from 'react-native-gesture-handler';

const pressGesture = Gesture.Tap()
  .onBegin(() => {
    scale.value = withSpring(0.95, { damping: 15 });
  })
  .onFinalize(() => {
    scale.value = withSpring(1.0, { damping: 15 });
  });
```

#### Swipe to Dismiss
```typescript
const panGesture = Gesture.Pan()
  .onChange((event) => {
    translateX.value = event.translationX;
    opacity.value = Math.max(0, 1 - Math.abs(event.translationX) / 200);
  })
  .onEnd((event) => {
    if (Math.abs(event.translationX) > 100) {
      translateX.value = withSpring(event.translationX > 0 ? 400 : -400);
      runOnJS(onDismiss)();
    } else {
      translateX.value = withSpring(0);
      opacity.value = withTiming(1);
    }
  });
```

### Layout Animations

#### Accordion Expand
```typescript
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const AnimatedHeight = ({ expanded, children }) => {
  const heightStyle = useAnimatedStyle(() => ({
    height: withTiming(expanded ? 'auto' : 0, { duration: 300 }),
    opacity: withTiming(expanded ? 1 : 0, { duration: 200 }),
  }));

  return (
    <Animated.View style={heightStyle}>
      {children}
    </Animated.View>
  );
};
```

---

## Lottie Animation Specs [REQUIRED]

### Required Animations

1. **typing.json** - AI Generation Loading
   - Duration: 2s loop
   - Colors: colors.accent.primary
   - Size: 100x100px
   - Source: LottieFiles "Typing Indicator"

2. **checkmark.json** - Success State
   - Duration: 1s one-shot
   - Colors: colors.success.primary
   - Size: 80x80px
   - Source: LottieFiles "Success Checkmark"

3. **error.json** - Error State
   - Duration: 1s one-shot
   - Colors: colors.error.primary
   - Size: 80x80px
   - Source: LottieFiles "Error X"

4. **empty.json** - Empty States
   - Duration: 3s loop
   - Colors: colors.text.tertiary
   - Size: 200x200px
   - Source: LottieFiles "Empty Box"

5. **sparkle.json** - Generate Button Hover
   - Duration: 1.5s loop
   - Colors: colors.accent.primary
   - Size: 24x24px (icon size)
   - Source: LottieFiles "Sparkle Animation"

---

## Responsive Design

### Breakpoints
```typescript
export const breakpoints = {
  small: 375,   // iPhone SE
  medium: 390,  // iPhone 14 Pro
  large: 428,   // iPhone 14 Pro Max
  tablet: 768,  // iPad Mini
};
```

### Safe Areas
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Always respect safe area insets
const insets = useSafeAreaInsets();

<View style={{ paddingTop: insets.top }}>
  {/* Content */}
</View>
```

### Dynamic Type (Accessibility)
```typescript
import { Text, Platform } from 'react-native';

// Support dynamic type scaling
<Text 
  style={typography.body}
  maxFontSizeMultiplier={1.3} // Max 130% scale
>
  Content
</Text>
```

---

## Dark Mode Only

**Design Decision:** Mandle is dark mode only. No light mode.

**Rationale:**
- Premium aesthetic
- Reduces eye strain (long writing sessions)
- Consistent with X's aesthetic
- Simpler implementation

---

## Accessibility Requirements [REQUIRED]

### Color Contrast
- Text on background: Minimum 4.5:1 (WCAG AA)
- Large text (18pt+): Minimum 3:1
- Interactive elements: Minimum 3:1

### Touch Targets
- Minimum: 44x44pt (Apple HIG)
- Preferred: 48x48pt (Material Design)
- Spacing: 8pt minimum between targets

### Screen Reader Support
```typescript
// All interactive elements
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Generate tweets"
  accessibilityHint="Creates 3 new tweet options"
  accessibilityRole="button"
>
  <Text>Generate</Text>
</TouchableOpacity>
```

### Semantic Labels
```typescript
// Headers
<Text accessibilityRole="header">Tweet Options</Text>

// Images
<Image 
  accessibilityLabel="User avatar"
  accessibilityIgnoresInvertColors={true}
/>
```

---

## Design File Organization

```
assets/
├── animations/
│   ├── typing.json
│   ├── checkmark.json
│   ├── error.json
│   ├── empty.json
│   └── sparkle.json
├── fonts/
│   ├── CooperOldStyle-Regular.ttf
│   ├── CooperOldStyle-Medium.ttf
│   └── CooperOldStyle-Bold.ttf
└── icons/
    └── (Heroicons imported as components)

src/shared/theme/
├── colors.ts
├── typography.ts
├── spacing.ts
├── radius.ts
├── shadows.ts
└── index.ts (exports all)
```

---

## Component Library Checklist

### Core Components (Build First)
- [ ] Button (Primary, Secondary, Icon)
- [ ] Card (Tweet, Note)
- [ ] Input (Text, Multiline)
- [ ] Loading (Spinner, Skeleton, Lottie)
- [ ] Empty State
- [ ] Toast

### Navigation Components
- [ ] Bottom Tab Bar
- [ ] Header
- [ ] Back Button

### Advanced Components
- [ ] Bottom Sheet
- [ ] Alert Modal
- [ ] Badge
- [ ] Tag Chip
- [ ] Version Timeline
- [ ] Comment Thread

---

## Design System Usage Example

```typescript
// src/screens/HomeScreen/index.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '@/shared/theme';
import { SparklesIcon } from 'react-native-heroicons/outline';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function HomeScreen() {
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colors.background.primary,
      padding: spacing.md 
    }}>
      <Text style={[typography.h1, { color: colors.text.primary }]}>
        Generate
      </Text>
      
      <TouchableOpacity
        style={{
          backgroundColor: colors.accent.primary,
          height: 56,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: spacing.lg,
        }}
      >
        <SparklesIcon size={20} color={colors.text.primary} />
        <Text style={[typography.bodyMedium, { color: colors.text.primary }]}>
          Generate Tweets
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Quality Checklist

Before shipping any screen:
- [ ] Respects safe area insets
- [ ] 60 FPS animations (use Perf Monitor)
- [ ] Haptic feedback on interactions
- [ ] Loading states for async actions
- [ ] Error states with recovery
- [ ] Empty states with clear CTAs
- [ ] VoiceOver labels (iOS) / TalkBack (Android)
- [ ] Touch targets ≥44pt
- [ ] Color contrast ≥4.5:1
- [ ] Works offline (shows appropriate UI)

---

## Next Steps

1. ✅ Read `04-ARCHITECTURE.md` for implementation patterns
2. ✅ Read `05-DEPLOYMENT.md` for setup
3. ✅ Download required fonts to `assets/fonts/`
4. ✅ Download Lottie animations to `assets/animations/`
5. ✅ Set up theme files in `src/shared/theme/`
6. ✅ Build component library from this spec
7. ✅ Test on multiple device sizes

---

**Last Updated:** January 11, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation
