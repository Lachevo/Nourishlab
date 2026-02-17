import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Divider,
    alpha,
    useTheme,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import logo from '../assets/logo.jpg';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login/', { username, password });
            await login(response.data.access, response.data.refresh, response.data.user);
            navigate('/');
        } catch (err: any) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/google/', {
                id_token: credentialResponse.credential,
                access_token: credentialResponse.credential,
            });
            await login(response.data.access, response.data.refresh, response.data.user);
            navigate('/');
        } catch (err: any) {
            console.error('Google Auth Error:', err.response?.data || err.message);
            const detail = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Google sign-in failed. Please try again.';
            setError(detail);
        } finally {
            setLoading(false);
        }
    };

    const theme = useTheme();

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
            py: 8
        }}>
            <Container component="main" maxWidth="xs" sx={{ mx: 'auto' }}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 5,
                            width: '100%',
                            borderRadius: 4,
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Box
                                component="img"
                                src={logo}
                                alt="NourishLab Logo"
                                sx={{
                                    height: 80,
                                    width: 'auto',
                                    mb: 2,
                                    filter: theme.palette.mode === 'dark' ? 'invert(1) brightness(2)' : 'none'
                                }}
                            />
                            <Typography component="h1" variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                                Welcome Back
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                Please enter your details to sign in
                            </Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    mt: 4,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                                }}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>

                            <Box sx={{ mt: 3, mb: 3 }}>
                                <Divider sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase' }}>
                                    or continue with
                                </Divider>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        setError('Google Login Failed');
                                    }}
                                    useOneTap
                                />
                            </Box>

                            <Box textAlign="center">
                                <Typography variant="body2" color="textSecondary">
                                    Don't have an account?{' '}
                                    <Link to="/register" style={{ color: theme.palette.primary.main, fontWeight: 700, textDecoration: 'none' }}>
                                        Sign Up
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
