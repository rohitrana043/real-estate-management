// src/theme/index.ts
import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      main: string;
      dark: string;
      light: string;
      contrastText: string;
    };
  }
  interface PaletteOptions {
    neutral: {
      main: string;
      dark: string;
      light: string;
      contrastText: string;
    };
  }
}

export const lightTheme = {
  primary: {
    main: '#2C3E50',
    light: '#34495E',
    dark: '#1A252F',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#E67E22',
    light: '#F39C12',
    dark: '#D35400',
    contrastText: '#FFFFFF',
  },
  neutral: {
    main: '#ECF0F1',
    light: '#F8F9F9',
    dark: '#BDC3C7',
    contrastText: '#2C3E50',
  },
  background: {
    default: '#F8F9F9',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
  },
};

export const darkTheme = {
  primary: {
    main: '#3498DB',
    light: '#5DADE2',
    dark: '#2980B9',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#E67E22',
    light: '#F39C12',
    dark: '#D35400',
    contrastText: '#FFFFFF',
  },
  neutral: {
    main: '#2C3E50',
    light: '#34495E',
    dark: '#1A252F',
    contrastText: '#ECF0F1',
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  text: {
    primary: '#ECF0F1',
    secondary: '#BDC3C7',
  },
};

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light' ? lightTheme : darkTheme),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 24px',
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'transparent',
            '& input': {
              '&:-webkit-autofill': {
                WebkitBoxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 0 0 100px #1A1A1A inset !important'
                    : '0 0 0 100px #FFFFFF inset !important',
                WebkitTextFillColor:
                  theme.palette.mode === 'dark'
                    ? '#ECF0F1 !important'
                    : '#2C3E50 !important',
                caretColor:
                  theme.palette.mode === 'dark' ? '#ECF0F1' : '#2C3E50',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor:
                  theme.palette.mode === 'dark' ? '#3498DB' : '#2C3E50',
              },
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(0, 0, 0, 0.2)',
          },
          '& .MuiInputBase-input': {
            color: theme.palette.mode === 'dark' ? '#ECF0F1' : '#2C3E50',
          },
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: ({ theme }) => ({
          color:
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.7)'
              : 'rgba(0, 0, 0, 0.6)',
          '&.Mui-error': {
            color: '#E74C3C',
          },
        }),
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export const createAppTheme = (mode: 'light' | 'dark'): Theme => {
  return createTheme(getThemeOptions(mode));
};
