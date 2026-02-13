import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2BA275', // Logo Emerald Green
            light: '#5cd6a5',
            dark: '#1e7a56',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#132E26', // Logo Dark Green
            light: '#3a564c',
            dark: '#000000',
        },
        background: {
            default: '#f8fcfb', // Very light mint/slate
            paper: '#ffffff',
        },
        success: {
            main: '#2BA275', // Matching primary for consistency
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
        h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
        h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
        h4: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#132E26', // Use secondary for headings
        },
        h5: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            color: '#132E26',
        },
        h6: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            color: '#132E26',
        },
        subtitle1: {
            fontWeight: 500,
        },
        button: {
            fontFamily: '"Outfit", sans-serif',
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 20px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #2BA275 0%, #1e7a56 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #238f65 0%, #176345 100%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    },
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
        MuiAccordion: {
            styleOverrides: {
                root: {
                    borderRadius: '12px !important',
                    '&:before': {
                        display: 'none',
                    },
                    marginBottom: 12,
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                },
            },
        },
    },
});

export default theme;
