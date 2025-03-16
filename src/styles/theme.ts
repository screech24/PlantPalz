// Define common theme properties
const commonTheme = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    circle: '50%',
  },
  transitions: {
    short: '0.15s ease-in-out',
    medium: '0.25s ease-in-out',
    long: '0.35s ease-in-out',
  },
};

// Light theme
export const lightTheme = {
  ...commonTheme,
  colors: {
    primary: '#4CAF50',
    primaryLight: '#81C784',
    primaryDark: '#388E3C',
    secondary: '#FFC107',
    secondaryLight: '#FFD54F',
    secondaryDark: '#FFA000',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#D32F2F',
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9E9E9E',
      hint: '#9E9E9E',
    },
    border: '#E0E0E0',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
};

// Dark theme
export const darkTheme = {
  ...commonTheme,
  colors: {
    primary: '#66BB6A',
    primaryLight: '#A5D6A7',
    primaryDark: '#43A047',
    secondary: '#FFD54F',
    secondaryLight: '#FFE082',
    secondaryDark: '#FFC107',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#EF5350',
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      disabled: '#757575',
      hint: '#757575',
    },
    border: '#333333',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.24), 0 1px 2px rgba(0,0,0,0.36)',
    md: '0 3px 6px rgba(0,0,0,0.32), 0 3px 6px rgba(0,0,0,0.46)',
    lg: '0 10px 20px rgba(0,0,0,0.38), 0 6px 6px rgba(0,0,0,0.46)',
    xl: '0 14px 28px rgba(0,0,0,0.50), 0 10px 10px rgba(0,0,0,0.44)',
  },
};

// For backward compatibility
export const theme = lightTheme; 