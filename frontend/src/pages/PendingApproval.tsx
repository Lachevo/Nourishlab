import React, { useEffect } from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PendingApproval: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

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
        checkApproval();
    }, [navigate]);

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Registration Successful!
                </Typography>
                <Typography variant="body1" paragraph>
                    Your account is currently pending approval from an administrator.
                </Typography>
                <Typography variant="body1" paragraph>
                    Please wait for approval to access the full features of NourishLab.
                </Typography>
                <Button variant="outlined" onClick={() => { logout(); navigate('/login'); }}>
                    Logout
                </Button>
            </Paper>
        </Container>
    );
};

export default PendingApproval;
