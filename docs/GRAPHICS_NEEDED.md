# Graphics & Visual Assets Needed for Landing Page

**Last Updated:** October 5, 2025
**Purpose:** Document all graphics, images, and visual assets needed to replace placeholders on the landing page

---

## Priority Order

**🔴 High Priority** (MVP launch essentials)
**🟡 Medium Priority** (Enhance user experience)
**🟢 Low Priority** (Nice to have, can add later)

---

## 1. Hero Section

### Hero Illustration
- **Priority:** 🔴 High
- **Location:** `/src/components/landing/Hero.tsx`
- **Current Placeholder:** Gradient background with emoji avatars and voice bars
- **Needed:**
  - Two avatar illustrations (facing each other)
  - Animated voice wave visualization between them
  - Background: Subtle gradient (purple → pink theme)
- **Dimensions:** 900px wide × 400px tall (responsive)
- **Format:** SVG preferred (scalable), or high-res PNG (2x for retina)
- **Style:**
  - Minimalist, flat design
  - Matches GitHub's professional aesthetic
  - Colors: Brand purple (#8b5cf6) and pink (#ec4899)
  - Friendly, approachable feel

**Inspiration:**
- DiceBear avatars (https://dicebear.com) for avatar style
- Voice wave animations similar to iOS Siri interface

---

## 2. How It Works Section

### Flow Diagram Animation
- **Priority:** 🟡 Medium
- **Location:** `/src/components/landing/HowItWorks.tsx`
- **Current Placeholder:** Gray box with placeholder text
- **Needed:**
  - Animated visualization showing 4-step process
  - Avatars moving through: Call → Talk → Rate → Connect
  - Flowing arrows or path between steps
- **Dimensions:** Full-width responsive container
- **Format:** Animated SVG or Lottie JSON
- **Style:**
  - Smooth transitions
  - Illustrate user journey visually
  - Clear, easy to understand at a glance

---

## 3. Features Section (6 Cards)

### 3.1 Smart Filters Screenshot
- **Priority:** 🟡 Medium
- **Mockup Type:** App UI screenshot
- **Shows:** Filter menu interface
  - Country selection dropdown
  - Interest tags (multi-select)
  - Gender filter toggle (with "Premium" badge)
- **Dimensions:** 400px × 300px (card thumbnail)
- **Format:** PNG or JPG (compressed)

### 3.2 Events Map Screenshot
- **Priority:** 🟡 Medium
- **Mockup Type:** Interactive map
- **Shows:**
  - Mapbox-style map with event markers
  - Multiple location pins
  - Event preview cards on hover
- **Dimensions:** 400px × 300px
- **Format:** PNG or JPG

### 3.3 Matcher AI Interview UI
- **Priority:** 🟡 Medium
- **Mockup Type:** Chat/interview interface
- **Shows:**
  - AI avatar asking questions
  - Voice input visualization
  - Progress indicator (e.g., "Question 3 of 10")
- **Dimensions:** 400px × 300px
- **Format:** PNG or JPG

### 3.4 User Profile with Rating Badge
- **Priority:** 🟡 Medium
- **Mockup Type:** Profile card
- **Shows:**
  - Avatar (DiceBear style)
  - Star rating (e.g., 4.8/5.0)
  - Trust badges ("Verified", "Trusted Member")
- **Dimensions:** 400px × 300px
- **Format:** PNG or JPG

### 3.5 Voice-Animated Avatar
- **Priority:** 🟡 Medium
- **Mockup Type:** Avatar animation
- **Shows:**
  - Avatar with mouth/facial movement
  - Voice wave visualization
  - "Speaking" state visual
- **Dimensions:** 400px × 300px
- **Format:** Animated GIF or MP4 (short loop)

### 3.6 Premium Benefits List
- **Priority:** 🟡 Medium
- **Mockup Type:** Pricing/benefits card
- **Shows:**
  - Premium tier features listed
  - Checkmarks for included features
  - "Upgrade" CTA button
- **Dimensions:** 400px × 300px
- **Format:** PNG or JPG

---

## 4. Events Section

### Events Map with Markers
- **Priority:** 🟡 Medium
- **Location:** `/src/components/landing/Events.tsx`
- **Current Placeholder:** Gradient background with emoji pins
- **Needed:**
  - Interactive map showing local events
  - Map markers (different colors for event categories)
  - Event preview cards
- **Dimensions:** Full-width responsive (max 1200px)
- **Format:** PNG screenshot or embedded map component
- **Style:**
  - Clean, modern map style (like Mapbox or Google Maps)
  - Clear markers with category icons

---

## 5. Testimonial Avatars

### User Avatar Placeholders
- **Priority:** 🟢 Low (currently using emoji placeholders)
- **Location:** `/src/components/landing/Testimonials.tsx`
- **Current Placeholder:** Emoji avatars (👩, 👨, 👩‍🦰, 🧑)
- **Needed:**
  - 4 diverse avatar illustrations
  - Gender-diverse, ethnically diverse
- **Dimensions:** 64px × 64px (circular)
- **Format:** SVG or PNG (2x for retina)
- **Style:**
  - DiceBear style or similar
  - Friendly, approachable
  - Matches brand aesthetic

**Alternative:** Keep emoji placeholders until you have real user photos

---

## 6. Icons & Illustrations

### Section Icons (Currently Using Emoji)
- **Priority:** 🟢 Low
- **Current:** Using emoji for consistency (😞, 💬, ⏰, 🛡️, etc.)
- **Alternative Option:**
  - Replace with custom icon set
  - Consistent line-weight and style
  - Brand-colored versions

**Recommended:** Keep emoji for now—they work well and are universally understood

---

## 7. Brand Assets

### Logo Files
- **Priority:** 🔴 High
- **Needed:**
  - Logo SVG (already exists at `/public/logo.svg`)
  - Favicon (if not already created)
  - App icons for future mobile apps
- **Ensure:**
  - Logo works in light and dark themes
  - Clear at small sizes (32px)

### Brand Colors (Already Defined)
- Primary Purple: `#8b5cf6`
- Secondary Pink: `#ec4899`
- Success Green: `#10B981`
- Error Red: `#ef4444`
- Warning Yellow: `#f59e0b`

---

## 8. Animation Assets (Optional Enhancements)

### Micro-interactions
- **Priority:** 🟢 Low
- **Examples:**
  - Button hover animations
  - Card lift effects (already implemented via CSS)
  - Loading spinners
- **Format:** CSS animations (preferred) or Lottie JSON

### Scroll Animations
- **Priority:** 🟢 Low
- **Examples:**
  - Fade-in on scroll
  - Parallax effects
  - Stagger animations for card grids
- **Implementation:** React Intersection Observer + CSS transitions

---

## 9. Social Media Assets (For Footer Links)

### Social Icons
- **Priority:** 🟢 Low
- **Current:** Using emoji (𝕏, 📷, 🎵, 💬)
- **Alternative:**
  - Brand-consistent icon set
  - Monochrome or brand-colored
- **Format:** SVG

---

## Design Tools & Resources

### Recommended Tools for Creating Assets:

1. **Illustrations:**
   - Figma (free tier)
   - Canva Pro
   - Adobe Illustrator

2. **Avatar Generation:**
   - DiceBear (https://dicebear.com) - Free, customizable
   - Notion-style avatars
   - Boring Avatars (https://boringavatars.com)

3. **Screenshots/Mockups:**
   - Figma mockups
   - Cleanshot X (for actual app screenshots later)
   - Device mockup templates (Shotsnapp, Mockuphone)

4. **Animations:**
   - Lottie Files (https://lottiefiles.com)
   - Rive (https://rive.app)
   - CSS animations (no external tools needed)

5. **Icons:**
   - Heroicons (https://heroicons.com) - Free, MIT license
   - Lucide Icons (https://lucide.dev)
   - Font Awesome

---

## Implementation Checklist

### Phase 1: Essential Graphics (Before MVP Launch)
- [ ] Hero illustration (avatars + voice waves)
- [ ] Logo finalized (works in all contexts)
- [ ] Favicon created

### Phase 2: Enhanced Visuals (Post-MVP)
- [ ] Feature screenshots (6 cards)
- [ ] Events map visualization
- [ ] Flow diagram animation
- [ ] Testimonial avatars (replace emoji)

### Phase 3: Polish (Ongoing)
- [ ] Custom icon set (replace emoji)
- [ ] Scroll animations
- [ ] Micro-interactions
- [ ] Social media assets

---

## File Naming Convention

When adding graphics, use this naming pattern:

```
/public/images/landing/
  ├── hero-illustration.svg          # Hero section main visual
  ├── hero-illustration@2x.png       # Retina fallback
  ├── flow-diagram.svg               # How It Works animation
  ├── feature-filters.png            # Feature card screenshots
  ├── feature-events-map.png
  ├── feature-matcher-ai.png
  ├── feature-profile-rating.png
  ├── feature-avatar-animation.gif
  ├── feature-premium-benefits.png
  ├── events-map-full.png            # Events section
  ├── avatar-sarah.svg               # Testimonial avatars
  ├── avatar-marcus.svg
  ├── avatar-emily.svg
  ├── avatar-alex.svg
```

**Optimization:**
- Compress PNGs with TinyPNG or ImageOptim
- Use SVG for logos and icons (scalable, small file size)
- Lazy load images below the fold
- Use Next.js `<Image>` component for automatic optimization

---

## Budget Considerations

**DIY Approach (Free - $50):**
- Figma (free tier) for mockups
- DiceBear for avatars (free)
- Heroicons for icons (free)
- Canva Pro for illustrations ($15/month)

**Professional Approach ($200 - $500):**
- Hire illustrator on Fiverr/Dribbble
- Custom avatar set
- Polished animations
- Full brand asset package

**Recommended for MVP:** DIY with Figma + DiceBear, then upgrade illustrations post-launch based on user feedback.

---

## Next Steps

1. **Now:** Landing page works with placeholders ✅
2. **Before MVP Launch:** Create hero illustration + finalize logo
3. **Post-MVP:** Replace feature screenshots with real app UI
4. **Ongoing:** Collect real user testimonial photos to replace avatars

---

**Last Updated:** October 5, 2025
**Next Review:** After collecting user feedback on landing page design
