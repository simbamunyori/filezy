# CLAUDE.mobile.md — Filezy Mobile App Brief
## iOS & Android — React Native + Expo

---

## 1. OVERVIEW

**App Name:** Filezy
**Platforms:** iOS and Android
**Stack:** React Native + Expo (managed workflow)
**Store listing tagline:** "Free PDF & image tools. No limits. Works offline."

### Why mobile matters for Filezy

The single biggest advantage over web-only competitors:

**Native Share Sheet Integration.**
User receives a PDF via WhatsApp, Gmail, or any app →
taps the Share button → selects Filezy →
file is instantly compressed/merged/converted.
This workflow is impossible on a browser-only tool.

Other mobile advantages:
- App Store + Google Play = two additional discovery channels
  with millions of searches for "PDF tools", "compress image", "remove background"
- Works offline — all processing is on-device, no internet needed
- Photo library access — compress or convert images directly from camera roll
- Files app integration (iOS) and Downloads folder (Android)
- Push notifications for future features (batch jobs, etc.)
- AdMob (mobile ads) generates significantly more revenue per user than AdSense

---

## 2. TECH STACK

### Framework
- **Expo SDK 51+** with managed workflow
- **React Native** — iOS and Android from one codebase
- **TypeScript** throughout

### Shared code from web app
The following from `filezy/lib/` can be imported directly:
- `lib/tools.ts` — tool definitions and metadata
- `lib/text.ts` — all text processing functions (pure JS, no browser APIs)

PDF and image processing needs React Native specific libraries
(browser APIs like Canvas and WASM don't work in React Native).

### Key Libraries

| Purpose | Library |
|---|---|
| PDF merge, split, compress | `react-native-pdf-lib` or `@react-native-documents/picker` + custom |
| PDF rendering/viewer | `react-native-pdf` |
| Image manipulation | `expo-image-manipulator` |
| Background removal | Call a lightweight API or run ONNX model via `onnxruntime-react-native` |
| File picker | `expo-document-picker` |
| Photo library | `expo-image-picker` |
| Share sheet (receive files) | `expo-share-intent` |
| File saving/sharing | `expo-sharing` + `expo-file-system` |
| Navigation | `expo-router` (file-based, mirrors Next.js structure) |
| Ads | `react-native-google-mobile-ads` (AdMob) |
| Analytics | `@react-native-firebase/analytics` or Plausible mobile SDK |

### Monorepo structure
The web and mobile apps share a monorepo:
```
filezy/
├── apps/
│   ├── web/          ← Next.js web app (existing)
│   └── mobile/       ← React Native Expo app (this brief)
├── packages/
│   └── core/         ← Shared TypeScript logic (text tools, tool definitions)
├── CLAUDE.md
└── CLAUDE.mobile.md
```

Use **Turborepo** to manage the monorepo. Claude Code should set this up.

---

## 3. DESIGN SYSTEM (Mobile)

### Principle
The mobile app must feel like a native app, not a website wrapper.
Same brand identity as web (Filezy, electric blue, clean whites) but
adapted for touch: larger tap targets, bottom navigation, gesture support.

### Color Palette
Identical to web:
```
bg:       #FAFAFA
surface:  #FFFFFF
border:   #E5E7EB
text:     #111827
muted:    #6B7280
accent:   #2563EB
success:  #16A34A
error:    #DC2626
```

### Typography
- **System font** on mobile — SF Pro on iOS, Roboto on Android
  (do not load web fonts — performance and native feel)
- Same size scale: 12 / 14 / 16 / 20 / 24 / 32

### Navigation
**Bottom Tab Bar** — 4 tabs:
```
[PDF]  [Image]  [Text]  [All Tools]
```
Each tab icon is a custom SVG, 24px, electric blue when active, grey when inactive.

No hamburger menu. No drawer. Tab bar is always visible.

### Core Components (mobile-specific)

**FilePickerCard** — replaces web DropZone
- Large tappable card: full width, 160px tall
- Two buttons side by side:
  - "From Files" (document icon) → expo-document-picker
  - "From Photos" (photo icon) → expo-image-picker
- On file selected: filename + size shown, thumbnail if image
- Haptic feedback on tap: `expo-haptics`

**ProcessButton** — same concept as web
- Full width, 52px tall (larger for touch)
- Loading state with ActivityIndicator + "Processing..."
- Haptic feedback on press and on completion

**ResultSheet** — bottom sheet modal after processing
- File size comparison
- Large "Save to Files" button (primary)
- "Share" button (opens native share sheet)
- AdMob banner ad below the buttons (clearly separated)
- Dismiss by swipe down

**ToolListItem** — for the All Tools tab
- 64px tall list row
- Tool icon left, name + description center, chevron right
- Grouped by category with sticky section headers

---

## 4. APP STRUCTURE (expo-router)

```
mobile/app/
├── (tabs)/
│   ├── _layout.tsx         ← Bottom tab navigator
│   ├── pdf/
│   │   ├── index.tsx       ← PDF tools grid
│   │   ├── merge.tsx       ← Merge PDF screen
│   │   ├── compress.tsx    ← Compress PDF screen
│   │   ├── split.tsx
│   │   ├── pdf-to-jpg.tsx
│   │   ├── rotate.tsx
│   │   ├── unlock.tsx
│   │   ├── protect.tsx
│   │   └── watermark.tsx
│   ├── image/
│   │   ├── index.tsx       ← Image tools grid
│   │   ├── compress.tsx
│   │   ├── resize.tsx
│   │   ├── convert.tsx
│   │   ├── crop.tsx
│   │   └── remove-bg.tsx
│   ├── text/
│   │   ├── index.tsx       ← Text tools grid
│   │   ├── word-count.tsx
│   │   ├── case-converter.tsx
│   │   ├── diff-checker.tsx
│   │   └── base64.tsx
│   └── all/
│       └── index.tsx       ← Full tool list
├── _layout.tsx             ← Root layout, fonts, providers
└── +not-found.tsx
```

---

## 5. SHARE INTENT (the killer feature)

This is what makes the mobile app uniquely powerful.

When a user receives a PDF or image in any app (WhatsApp, Gmail, Files, Safari)
and taps Share → Filezy, the app opens on the relevant tool screen
with the file pre-loaded and ready to process.

### Implementation

```typescript
// In app/_layout.tsx
import { useShareIntent } from 'expo-share-intent'

export default function RootLayout() {
  const { shareIntent, resetShareIntent } = useShareIntent()

  useEffect(() => {
    if (!shareIntent) return

    if (shareIntent.files?.[0]?.mimeType === 'application/pdf') {
      // Route to PDF compress with file pre-loaded
      router.push({
        pathname: '/(tabs)/pdf/compress',
        params: { sharedFile: shareIntent.files[0].path }
      })
    }

    if (shareIntent.files?.[0]?.mimeType?.startsWith('image/')) {
      // Route to image compress with file pre-loaded
      router.push({
        pathname: '/(tabs)/image/compress',
        params: { sharedFile: shareIntent.files[0].path }
      })
    }

    resetShareIntent()
  }, [shareIntent])
}
```

### iOS Info.plist additions needed:
```xml
<key>CFBundleDocumentTypes</key>
<array>
  <dict>
    <key>CFBundleTypeName</key>
    <string>PDF Document</string>
    <key>LSItemContentTypes</key>
    <array>
      <string>com.adobe.pdf</string>
    </array>
  </dict>
</array>
```

### Android AndroidManifest additions:
Handled automatically by `expo-share-intent` plugin.

---

## 6. TOOL IMPLEMENTATIONS (mobile-specific)

### Compress PDF
```typescript
// expo-file-system + custom PDF compression
// For v1: use a lightweight API call to a free tier service
// (PDF compression is hard to do purely on-device in React Native)
// Recommended: pdf.co free tier (250 API calls/day free)
// Show clear loading state: "Compressing on your device..."
// Future: implement fully on-device with react-native-pdf-lib
```

### Compress Image
```typescript
import * as ImageManipulator from 'expo-image-manipulator'

const compress = async (uri: string, quality: number) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [],
    { compress: quality / 100, format: ImageManipulator.SaveFormat.JPEG }
  )
  return result.uri
}
// quality: 0–100, default 70
// Show before/after file size comparison
```

### Resize Image
```typescript
import * as ImageManipulator from 'expo-image-manipulator'

const resize = async (uri: string, width: number, height: number) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width, height } }],
    { compress: 1, format: ImageManipulator.SaveFormat.PNG }
  )
  return result.uri
}
```

### Remove Background
```typescript
// Option A (v1): Use remove.bg API free tier (50 images/month free)
// Option B (v2): Run ONNX model on-device with onnxruntime-react-native
// Model: RMBG-1.4 (~175MB) — too large for v1, use API instead

const removeBackground = async (imageUri: string): Promise<string> => {
  const formData = new FormData()
  formData.append('image_file', { uri: imageUri, type: 'image/jpeg', name: 'image.jpg' })

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': process.env.EXPO_PUBLIC_REMOVE_BG_KEY },
    body: formData,
  })
  // returns PNG with transparent background
  const blob = await response.blob()
  // save to local file system and return uri
}
```

### Word Count
```typescript
// Pure JS — same logic as web, imported from packages/core
// Use a TextInput with multiline={true}
// Live stats update on every keystroke using onChangeText
```

### Save Output
```typescript
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'

const saveFile = async (uri: string, filename: string) => {
  // Save to Downloads/Files
  const dest = FileSystem.documentDirectory + filename
  await FileSystem.copyAsync({ from: uri, to: dest })

  // Open native share sheet
  await Sharing.shareAsync(dest)
}
```

---

## 7. MONETISATION (Mobile)

### AdMob Setup
- Register at **admob.google.com** — free
- Create one Banner Ad unit and one Interstitial Ad unit
- Banner: shown on ResultSheet only (below download button)
- Interstitial: shown after every 5th completed operation
  (not on every operation — this would frustrate users)
- Never show an ad mid-process

```typescript
import { BannerAd, BannerAdSize, InterstitialAd } from 'react-native-google-mobile-ads'

// Banner on result screen
<BannerAd
  unitId={Platform.OS === 'ios' ? IOS_BANNER_ID : ANDROID_BANNER_ID}
  size={BannerAdSize.BANNER}
  requestOptions={{ requestNonPersonalizedAdsOnly: true }}
/>
```

### Revenue expectation
Mobile AdMob eCPM is typically $2–$8 per 1,000 impressions
vs web AdSense at $1–$3 per 1,000 impressions.
Mobile generates 2–3x more ad revenue per user than web.

---

## 8. APP STORE REQUIREMENTS

### iOS — Apple Developer Account
- Cost: **$99/year** (apple developer program)
- Register at: **developer.apple.com**
- Required before submitting to App Store
- Build with: `eas build --platform ios` (Expo Application Services)

### Android — Google Play Console
- Cost: **$25 one-time**
- Register at: **play.google.com/console**
- Build with: `eas build --platform android`

### App Store Listing Copy

**App Name:** Filezy — PDF & Image Tools

**Subtitle (iOS):** Free. Unlimited. No Watermarks.

**Description:**
```
Filezy gives you every tool you need to work with PDF and image files —
completely free, with no limits and no watermarks.

PDF TOOLS
• Merge multiple PDFs into one
• Compress PDF — reduce file size up to 90%
• Split PDF into separate pages
• Convert PDF to Word or JPG
• Rotate, unlock, protect, and watermark PDFs

IMAGE TOOLS
• Compress images without quality loss
• Resize to any dimension
• Convert between JPG, PNG, WebP, AVIF
• Crop with precision
• Remove background with AI

TEXT TOOLS
• Word and character counter
• Case converter
• Diff checker
• Base64 encoder

WHY FILEZY?
✓ No account required — ever
✓ No task limits — process as many files as you want
✓ No watermarks on output
✓ Share files directly from WhatsApp, Gmail, or any app
✓ Works with your Files app and photo library
✓ Most processing happens on your device — your files stay private
```

**Keywords (iOS):** pdf tools, compress pdf, merge pdf, remove background,
image compressor, pdf to word, free pdf, image resize, word count

**Category:** Productivity
**Age Rating:** 4+ (no objectionable content)

---

## 9. BUILD ORDER (Mobile)

**Phase M1 — Setup (Session 1)**
1. Set up Turborepo monorepo structure
2. Move existing web app to `apps/web/`
3. Create `packages/core/` with shared logic
4. Init Expo app in `apps/mobile/`
5. Set up expo-router navigation with bottom tabs
6. Build shared design tokens and base components
7. Build FilePickerCard, ProcessButton, ResultSheet

**Phase M2 — Image Tools (Session 2)**
All image tools work cleanly with expo-image-manipulator
so start here — faster wins, fewer dependencies:
1. Compress Image
2. Resize Image
3. Convert Image format
4. Crop Image

**Phase M3 — Text Tools (Session 3)**
Pure JS — import from packages/core, just build the UI:
1. Word Count
2. Case Converter
3. Diff Checker
4. Base64

**Phase M4 — PDF Tools (Session 4)**
1. Compress PDF (API-based for v1)
2. Merge PDF
3. Split PDF
4. PDF to JPG
5. Rotate PDF

**Phase M5 — Native Features & Launch (Session 5)**
1. Share intent (receive files from other apps)
2. Remove Background
3. AdMob integration
4. App Store listing assets (screenshots, icon)
5. EAS Build setup
6. TestFlight (iOS beta) + Play Store internal testing

---

## 10. APP ICON & SPLASH SCREEN

**Icon:** Blue square (#2563EB), white "f" lettermark in Geist Bold
Size: 1024×1024px PNG (Expo generates all required sizes)

**Splash screen:** White background, Filezy logo centered,
electric blue accent bar at bottom
Duration: instant (no artificial delay)

Generate icon and splash with:
```bash
npx expo-asset-resizer --source icon.png
```

---

## 11. QUALITY GATES (Mobile)

Before shipping each phase:

- [ ] Works on iPhone SE (small screen) — 375px wide
- [ ] Works on Android with small screen (360px wide)
- [ ] File picker opens correctly on both platforms
- [ ] Processed file saves correctly to Files/Downloads
- [ ] Share sheet opens with correct file attached
- [ ] Share intent receives file correctly from WhatsApp and Gmail
- [ ] AdMob banner renders without layout shift
- [ ] App does not crash when processing files > 10MB
- [ ] Cold start time < 2 seconds
- [ ] No unnecessary permissions requested
  (only: camera roll if image tool, file access, network for background removal)

---

## 12. LAUNCH SEQUENCE

1. Build web app first — get first users and validate the concept
2. When web hits 10K monthly visits — build mobile app
3. Launch on Android first (faster review process — 1–3 days)
4. Launch on iOS second (review takes 1–7 days)
5. Cross-promote: banner on web → "Also available on iOS & Android"
6. App Store Optimisation (ASO): update keywords monthly based on search data

---

## 13. COST SUMMARY (Mobile)

| Item | Cost |
|---|---|
| Apple Developer Account | $99/year |
| Google Play Console | $25 one-time |
| Expo EAS Build (free tier) | $0 (15 builds/month free) |
| remove.bg API (background removal) | $0 (50 free/month) |
| AdMob | $0 (revenue share model) |
| **Total to launch mobile** | **~$124** |

---

*Last updated: May 2026*
*Stack: React Native · Expo · expo-router · expo-image-manipulator · expo-share-intent*
