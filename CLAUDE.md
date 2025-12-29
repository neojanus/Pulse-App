# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pulse-App is an Expo/React Native mobile application using Expo SDK 54, React 19, and React Native 0.81. The app targets iOS, Android, and web platforms with file-based routing via Expo Router.

## Essential Commands

### Development
```bash
npx expo start                  # Start dev server
npx expo start --clear          # Clear cache and start dev server
npx expo install <package>      # Install packages with compatible versions
npx expo install --fix          # Auto-fix invalid package versions
```

### Quality & Building
```bash
npx expo lint                   # Run ESLint
npx expo doctor                 # Check project health and dependencies
```

### EAS Workflows (CI/CD)
```bash
npm run draft                   # Publish preview update
npm run development-builds      # Create development builds
npm run deploy                  # Deploy to production
```

### Production Builds
```bash
npx eas-cli@latest build --platform ios -s       # Build and submit to App Store
npx eas-cli@latest build --platform android -s   # Build and submit to Google Play
```

## Architecture

### Routing (Expo Router - File-based)
- `app/` - All routes live here; file names map to URLs
- `app/_layout.tsx` - Root layout with ThemeProvider and Stack navigator
- `app/(tabs)/` - Tab group with bottom navigation
- `app/modal.tsx` - Modal presentation example

### Path Aliases
Use `@/` prefix for imports (configured in tsconfig.json):
```typescript
import { useColorScheme } from '@/hooks/use-color-scheme';
```

### Theme System
- `constants/theme.ts` - Colors and Fonts definitions for light/dark modes
- `hooks/use-color-scheme.ts` - Hook for accessing current color scheme
- `hooks/use-theme-color.ts` - Hook for theme-aware color values

### Key Experiments Enabled
- `typedRoutes: true` - Type-safe routing
- `reactCompiler: true` - React Compiler optimization
- `newArchEnabled: true` - React Native New Architecture

## Documentation Resources

Always consult Expo documentation when implementing features:
- **General Expo**: https://docs.expo.dev/llms-full.txt
- **EAS/Deployment**: https://docs.expo.dev/llms-eas.txt
- **SDK/APIs**: https://docs.expo.dev/llms-sdk.txt
- **Workflows Schema**: https://exp.host/--/api/v2/workflows/schema

## Build Profiles (eas.json)

- `development` - Dev client builds for internal distribution
- `development-simulator` - iOS simulator builds
- `preview` - Internal distribution preview builds (main channel)
- `production` - Production builds with auto-increment (production channel)

## Troubleshooting

If Expo Go shows errors or the project doesn't run correctly, create a development build. Expo Go is a sandbox with limited native modules. After installing new packages or config plugins, development builds are often required.

## UI/UX Reference

The `UI_UX/stitch_full_briefing_readout/` directory contains design reference screens (HTML/PNG) for the briefing feature.
