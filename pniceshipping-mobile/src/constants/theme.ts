// 🎨 Premium Design System - Apple Inspired
// Crafted for Pnice Shipping Mobile
import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Primary Brand Colors - Professional Blue Palette
  primary: {
    950: '#000B1F', // Near black
    900: '#0A2342', // Deep navy
    800: '#0C2D52', // Dark blue
    700: '#0E3762', // Navy blue
    600: '#104172', // Royal blue
    500: '#007AFF', // iOS Blue (primary)
    400: '#3D8FFF', // Light blue
    300: '#66A3FF', // Sky blue
    200: '#99C2FF', // Pale blue
    100: '#CCE0FF', // Very light blue
    50: '#EBF5FF',  // Almost white blue
  },

  // Accent Colors - Vibrant & Semantic
  accent: {
    blue: '#007AFF',      // iOS Blue - Primary CTA
    purple: '#BF5AF2',    // iOS Purple - Premium
    pink: '#FF375F',      // iOS Pink - Alerts
    orange: '#FF9F0A',    // iOS Orange - Warnings
    yellow: '#FFD60A',    // iOS Yellow - Pending
    green: '#32D74B',     // iOS Green - Success
    teal: '#64D2FF',      // iOS Teal - Info
    indigo: '#5E5CE6',    // iOS Indigo - Secondary
    cyan: '#5AC8FA',      // Bright cyan
    mint: '#00C7BE',      // Fresh mint
    red: '#FF453A',       // Bright red
  },

  // Neutral Colors - Refined Dark Mode
  gray: {
    950: '#000000',       // Pure black
    900: '#0A0A0C',       // Near black
    850: '#161618',       // Very dark gray
    800: '#1C1C1E',       // Dark gray (iOS)
    750: '#232326',       // Darker medium
    700: '#2C2C2E',       // Medium dark (iOS)
    600: '#3A3A3C',       // Medium gray (iOS)
    500: '#48484A',       // Mid gray
    400: '#636366',       // Light medium
    300: '#8E8E93',       // Light gray (iOS)
    200: '#AEAEB2',       // Very light gray
    100: '#C7C7CC',       // Almost white gray
    50: '#E5E5EA',        // Off white
  },

  // Status Colors - Semantic & Accessible
  status: {
    pending: '#FFD60A',     // Yellow - Waiting
    received: '#64D2FF',    // Teal - Received
    transit: '#BF5AF2',     // Purple - In transit
    available: '#32D74B',   // Green - Available
    delivered: '#30D158',   // Bright green - Delivered
    error: '#FF453A',       // Red - Error
    warning: '#FF9F0A',     // Orange - Warning
    info: '#5E5CE6',        // Indigo - Info
    success: '#32D74B',     // Green - Success
  },

  // Background & Surface - Layered Depth
  background: {
    primary: '#000000',              // Pure black base
    secondary: '#0A0A0C',            // Subtle elevation
    tertiary: '#161618',             // Higher elevation
    elevated: '#1C1C1E',             // Card background
    elevatedHover: '#232326',        // Hover state
    card: 'rgba(28, 28, 30, 0.88)',  // Glassmorphism
    cardSubtle: 'rgba(28, 28, 30, 0.6)', // Subtle glass
    blur: 'rgba(18, 18, 20, 0.7)',   // Blur overlay
  },

  // Text Colors - Hierarchical Contrast
  text: {
    primary: '#FFFFFF',                  // Pure white - Headlines
    secondary: 'rgba(255, 255, 255, 0.85)', // High contrast - Body
    tertiary: 'rgba(255, 255, 255, 0.6)',   // Medium contrast - Labels
    quaternary: 'rgba(255, 255, 255, 0.4)', // Low contrast - Hints
    disabled: 'rgba(255, 255, 255, 0.25)',  // Very low - Disabled
    placeholder: 'rgba(255, 255, 255, 0.3)', // Placeholders
  },

  // Borders - Subtle Separation
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',    // Almost invisible
    light: 'rgba(255, 255, 255, 0.1)',      // Light separator
    medium: 'rgba(255, 255, 255, 0.15)',    // Medium separator
    strong: 'rgba(255, 255, 255, 0.2)',     // Strong border
    focus: 'rgba(0, 122, 255, 0.5)',        // Focus ring
  },

  // Overlay - Modals & Sheets
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    strong: 'rgba(0, 0, 0, 0.7)',
    blur: 'rgba(0, 0, 0, 0.4)',
  },
};

// Typography - SF Pro / Roboto System Fonts
export const FONTS = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  heavy: Platform.select({
    ios: 'System',
    android: 'Roboto-Black',
    default: 'System',
  }),
};

// Font Sizes - iOS Human Interface Guidelines Scale
export const FONT_SIZES = {
  xs: 11,       // Caption 2
  sm: 13,       // Caption 1
  base: 15,     // Footnote
  md: 17,       // Body (iOS default)
  lg: 20,       // Title 3
  xl: 24,       // Title 2
  '2xl': 28,    // Title 1
  '3xl': 34,    // Large Title
  '4xl': 42,    // Huge Title
  '5xl': 52,    // Hero
  '6xl': 64,    // Display
};

// Font Weights - Numeric values for precise control
export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
} as const;

// Line Heights - Optimized for readability
export const LINE_HEIGHTS = {
  tight: 1.2,
  snug: 1.4,
  normal: 1.5,
  relaxed: 1.6,
  loose: 1.8,
};

// Letter Spacing - Subtle tracking adjustments
export const LETTER_SPACING = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.2,
};

// Spacing - 8px Grid System (Apple Standard)
export const SPACING = {
  xs: 4,        // 0.25rem - Micro spacing
  sm: 8,        // 0.5rem - Tight spacing
  md: 12,       // 0.75rem - Compact spacing
  base: 16,     // 1rem - Base unit
  lg: 20,       // 1.25rem - Comfortable spacing
  xl: 24,       // 1.5rem - Generous spacing
  '2xl': 32,    // 2rem - Section spacing
  '3xl': 40,    // 2.5rem - Large section
  '4xl': 48,    // 3rem - XL section
  '5xl': 64,    // 4rem - Hero spacing
  '6xl': 80,    // 5rem - Mega spacing
  '7xl': 96,    // 6rem - Ultra spacing
};

// Border Radius - Smooth, modern curves
export const BORDER_RADIUS = {
  none: 0,
  xs: 4,        // Subtle rounding
  sm: 8,        // Small elements
  md: 12,       // Cards, buttons
  base: 16,     // Standard cards
  lg: 20,       // Large cards
  xl: 24,       // XL cards
  '2xl': 28,    // Hero elements
  '3xl': 32,    // Full screen sheets
  '4xl': 40,    // Extra large
  full: 9999,   // Pills, avatars
};

// Shadows - Subtle depth & elevation
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.32,
    shadowRadius: 32,
    elevation: 16,
  },
  // Colored shadows for CTAs
  blue: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  purple: {
    shadowColor: '#BF5AF2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Icon Sizes - Consistent scaling
export const ICON_SIZES = {
  xs: 14,       // Tiny icons
  sm: 18,       // Small icons
  md: 22,       // Medium icons
  base: 24,     // Default size
  lg: 28,       // Large icons
  xl: 32,       // XL icons
  '2xl': 40,    // Hero icons
  '3xl': 48,    // Featured icons
  '4xl': 56,    // Display icons
  '5xl': 64,    // Massive icons
};

// Animations - Fluid motion design
export const ANIMATIONS = {
  // Duration (ms) - Based on Material Design guidelines
  duration: {
    instant: 100,    // Micro-interactions
    fast: 200,       // Quick transitions
    normal: 300,     // Standard transitions
    slow: 400,       // Deliberate transitions
    slower: 500,     // Attention-grabbing
    slowest: 700,    // Hero animations
  },

  // Easing curves - Natural motion
  easing: {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],

    // Custom Apple-like curves
    standard: [0.4, 0.0, 0.2, 1],      // Material standard
    decelerate: [0.0, 0.0, 0.2, 1],    // Slowing down
    accelerate: [0.4, 0.0, 1, 1],      // Speeding up
    sharp: [0.4, 0.0, 0.6, 1],         // Quick & sharp
    bounce: [0.68, -0.55, 0.265, 1.55], // Playful bounce
  },

  // Spring configurations - For Reanimated
  spring: {
    // Smooth & natural
    smooth: {
      damping: 20,
      mass: 1,
      stiffness: 120,
    },
    // Snappy & responsive
    snappy: {
      damping: 15,
      mass: 0.8,
      stiffness: 180,
    },
    // Bouncy & playful
    bouncy: {
      damping: 10,
      mass: 1.2,
      stiffness: 150,
    },
    // Gentle & soft
    gentle: {
      damping: 25,
      mass: 1,
      stiffness: 100,
    },
    // Default (recommended)
    default: {
      damping: 15,
      mass: 1,
      stiffness: 150,
    },
  },

  // Timing config for withTiming
  timing: {
    fast: {
      duration: 200,
      easing: [0.4, 0.0, 0.2, 1],
    },
    normal: {
      duration: 300,
      easing: [0.4, 0.0, 0.2, 1],
    },
    slow: {
      duration: 500,
      easing: [0.4, 0.0, 0.2, 1],
    },
  },
};

// Screen & Device - Responsive breakpoints
export const SCREEN = {
  width,
  height,
  // Device size categories
  isSmall: width < 375,      // iPhone SE, small Android
  isMedium: width >= 375 && width < 414,  // iPhone 12/13, regular Android
  isLarge: width >= 414,     // iPhone Pro Max, large Android
  // Responsive helpers
  isCompact: width < 390,
  isRegular: width >= 390 && width < 430,
  isExpanded: width >= 430,
};

// Layout Constants - Safe areas & dimensions
export const LAYOUT = {
  // Headers
  headerHeight: 96,
  headerHeightCompact: 80,
  headerHeightExpanded: 112,

  // Tab bar
  tabBarHeight: 82,
  tabBarHeightCompact: 70,

  // Safe area insets
  bottomInset: Platform.OS === 'ios' ? 34 : 0,
  topInset: Platform.OS === 'ios' ? 44 : 0,

  // Content spacing
  screenPadding: SPACING.lg,
  screenPaddingHorizontal: SPACING.xl,

  // Card dimensions
  cardMinHeight: 120,
  cardMaxWidth: 600,

  // Input dimensions
  inputHeight: 52,
  inputHeightSmall: 44,
  inputHeightLarge: 60,

  // Button dimensions
  buttonHeight: 52,
  buttonHeightSmall: 44,
  buttonHeightLarge: 60,
};

// Haptic Patterns - Enhanced feedback
export const HAPTICS = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;

// Z-Index Layers - Proper stacking order
export const Z_INDEX = {
  background: 0,
  content: 1,
  card: 10,
  cardHover: 20,
  dropdown: 50,
  sticky: 100,
  overlay: 500,
  drawer: 600,
  modal: 700,
  popover: 800,
  toast: 900,
  tooltip: 1000,
};

// Opacity Scales - Consistent transparency
export const OPACITY = {
  invisible: 0,
  subtle: 0.05,
  veryLight: 0.1,
  light: 0.2,
  medium: 0.4,
  strong: 0.6,
  veryStrong: 0.8,
  almostVisible: 0.95,
  visible: 1,
};

// Status color mapping with gradients
export const getStatusColor = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'En attente⏳': COLORS.status.pending,
    'Recu📦': COLORS.status.received,
    'En Transit✈️': COLORS.status.transit,
    'Disponible🟢': COLORS.status.available,
    'Livré✅': COLORS.status.delivered,
  };
  return statusMap[status] || COLORS.status.info;
};

// Get status gradient colors
export const getStatusGradient = (status: string): [string, string] => {
  const gradientMap: { [key: string]: [string, string] } = {
    'En attente⏳': [COLORS.status.pending, COLORS.accent.orange],
    'Recu📦': [COLORS.status.received, COLORS.accent.cyan],
    'En Transit✈️': [COLORS.status.transit, COLORS.accent.indigo],
    'Disponible🟢': [COLORS.status.available, COLORS.accent.mint],
    'Livré✅': [COLORS.status.delivered, COLORS.accent.green],
  };
  return gradientMap[status] || [COLORS.accent.blue, COLORS.accent.indigo];
};

// Helper: Create glassmorphism style
export const createGlassmorphism = (intensity: 'subtle' | 'medium' | 'strong' = 'medium') => {
  const intensityMap = {
    subtle: {
      backgroundColor: COLORS.background.cardSubtle,
      borderWidth: 0.5,
      borderColor: COLORS.border.subtle,
    },
    medium: {
      backgroundColor: COLORS.background.card,
      borderWidth: 1,
      borderColor: COLORS.border.light,
    },
    strong: {
      backgroundColor: COLORS.background.elevated,
      borderWidth: 1,
      borderColor: COLORS.border.medium,
    },
  };
  return intensityMap[intensity];
};

// Helper: Generate consistent button styles
export const createButtonStyle = (variant: 'primary' | 'secondary' | 'ghost' | 'danger') => {
  const baseStyle = {
    height: LAYOUT.buttonHeight,
    borderRadius: BORDER_RADIUS.base,
    paddingHorizontal: SPACING.xl,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        ...SHADOWS.blue,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: COLORS.background.elevated,
        borderWidth: 1,
        borderColor: COLORS.border.medium,
      };
    case 'danger':
      return {
        ...baseStyle,
        ...SHADOWS.md,
      };
    case 'ghost':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
      };
    default:
      return baseStyle;
  }
};

// Export all as default
export default {
  COLORS,
  FONTS,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  LETTER_SPACING,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ICON_SIZES,
  ANIMATIONS,
  SCREEN,
  LAYOUT,
  HAPTICS,
  Z_INDEX,
  OPACITY,
  getStatusColor,
  getStatusGradient,
  createGlassmorphism,
  createButtonStyle,
};
