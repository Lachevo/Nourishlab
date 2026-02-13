import React, { useEffect } from 'react';
import { Container, Typography, Paper, Button, Box, useTheme, alpha } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const PendingApproval: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        // Check if user is approved, if so, redirect to dashboard
        const checkApproval = async () => {
            try {
                const response = await api.get('/profile/');
                if (response.data.profile && response.data.profile.is_approved) {
                    navigate('/');
                }
            } catch (error) {
                console.error('Failed to check approval status', error);
            }
        };
        const interval = setInterval(checkApproval, 5000); // Check every 5 seconds
        checkApproval();

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 2
        }}>
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 4,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <Box sx={{
                        display: 'inline-flex',
                        p: 3,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: 'warning.main',
                        mb: 3,
                        animation: 'pulse 2s infinite ease-in-out',
                        '@keyframes pulse': {
                            '0%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.warning.main, 0.4)}` },
                            '70%': { boxShadow: `0 0 0 20px ${alpha(theme.palette.warning.main, 0)}` },
                            '100%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.warning.main, 0)}` },
                        }
                    }}>
                        <HourglassEmptyIcon sx={{ fontSize: 48 }} />
                    </Box>

                    <Typography variant="h4" gutterBottom fontWeight={800} sx={{ color: 'text.primary' }}>
                        Verification Pending
                    </Typography>

                    <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                        Thanks for joining NourishLab! Your profile is currently under review by our nutrition team.
                        You'll get full access to your personalized dashboard as soon as you're approved.
                    </Typography>

                    <Button
                        variant="outlined"
                        onClick={() => { logout(); navigate('/login'); }}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            borderColor: alpha(theme.palette.text.secondary, 0.2),
                            color: 'text.secondary',
                            '&:hover': {
                                borderColor: 'text.primary',
                                color: 'text.primary',
                                bgcolor: 'transparent'
                            }
                        }}
                    >
                        Sign Out
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default PendingApproval;
