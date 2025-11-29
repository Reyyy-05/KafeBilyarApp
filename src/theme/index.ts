// src/theme/index.ts
// Dark Orange Design System - Kafe & Bilyar App
// Inspired by "Sites for Designers" aesthetic

export const Colors = {
  // Dark Background Colors
  bg: {
    primary: '#0F0F0F',      // Deepest black background
    secondary: '#1A1A1A',    // Card/Surface background
    tertiary: '#2D2D2D',     // Elevated elements
    elevated: '#353535',     // Hover/Active states
  },
  
  // Orange Accent Colors (Primary Brand)
  orange: {
    primary: '#FF6B35',      // Main orange
    light: '#FF8C61',        // Lighter orange
    dark: '#E85A28',         // Darker orange
    glow: 'rgba(255, 107, 53, 0.2)', // Glow effect
    subtle: 'rgba(255, 107, 53, 0.1)', // Subtle background
  },
  
  // Text Colors (for dark theme)
  text: {
    primary: '#FFFFFF',      // Main text (white)
    secondary: '#B0B0B0',    // Secondary text (light gray)
    tertiary: '#6B6B6B',     // Disabled/placeholder (dark gray)
    inverse: '#000000',      // Text on orange background
  },
  
  // Status/Semantic Colors
  status: {
    success: '#4CAF50',      // Green (available, confirmed)
    error: '#F44336',        // Red (error, occupied)
    warning: '#FFC107',      // Yellow (pending)
    info: '#2196F3',         // Blue (info)
  },
  
  // Neutral Grays (for borders, dividers)
  gray: {
    100: '#F5F5F5',
    200: '#E0E0E0',
    300: '#BDBDBD',
    400: '#9E9E9E',
    500: '#757575',
    600: '#616161',
    700: '#424242',
    800: '#2D2D2D',
    900: '#1A1A1A',
  },
  
  // Special Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const Typography = {
  // Font Sizes
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display1: 28,
    display2: 32,
    display3: 40,
    display4: 48,
  },
  
  // Font Weights
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  xxxxl: 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadows = {
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
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  // Special orange glow shadow
  orange: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const Layout = {
  // Container widths
  containerMaxWidth: 1200,
  
  // Header/Footer heights
  headerHeight: 60,
  tabBarHeight: 60,
  
  // Common paddings
  screenPadding: Spacing.md,
  cardPadding: Spacing.md,
  buttonPadding: Spacing.md,
  sectionSpacing: Spacing.lg,
};

// Pre-defined Component Styles
export const Components = {
  // Button Styles
  button: {
    primary: {
      backgroundColor: Colors.orange.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: BorderRadius.md,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: Colors.orange.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: BorderRadius.md,
    },
    dark: {
      backgroundColor: Colors.bg.tertiary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: BorderRadius.md,
    },
    text: {
      backgroundColor: 'transparent',
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
  },
  
  // Card Styles
  card: {
    default: {
      backgroundColor: Colors.bg.secondary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: Colors.bg.tertiary,
    },
    elevated: {
      backgroundColor: Colors.bg.secondary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      ...Shadows.md,
    },
    selected: {
      backgroundColor: Colors.bg.tertiary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      borderWidth: 2,
      borderColor: Colors.orange.primary,
    },
  },
  
  // Input Styles
  input: {
    default: {
      backgroundColor: Colors.bg.secondary,
      borderWidth: 1,
      borderColor: Colors.bg.tertiary,
      borderRadius: BorderRadius.md,
      paddingVertical: 12,
      paddingHorizontal: 16,
      color: Colors.text.primary,
    },
    focused: {
      borderColor: Colors.orange.primary,
      borderWidth: 2,
    },
    error: {
      borderColor: Colors.status.error,
      borderWidth: 2,
    },
  },
  
  // Header Styles
  header: {
    default: {
      backgroundColor: Colors.bg.secondary,
      height: Layout.headerHeight,
      paddingHorizontal: Spacing.md,
    },
  },
  
  // Badge Styles
  badge: {
    success: {
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: BorderRadius.md,
    },
    error: {
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: BorderRadius.md,
    },
    warning: {
      backgroundColor: 'rgba(255, 193, 7, 0.2)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: BorderRadius.md,
    },
    info: {
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: BorderRadius.md,
    },
  },
};

// Export all as Theme object
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  layout: Layout,
  components: Components,
};

// Export default Theme
export default Theme;

// Helper function untuk apply glow effect
export const createGlowStyle = (color: string, opacity: number = 0.3) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: opacity,
  shadowRadius: 20,
  elevation: 8,
});

// Helper function untuk combine styles
export const combineStyles = (...styles: any[]) => {
  return Object.assign({}, ...styles);
};
