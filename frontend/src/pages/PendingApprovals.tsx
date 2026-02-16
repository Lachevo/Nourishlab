import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Avatar,
    Button,
    CircularProgress,
    Alert,
    Paper,
    Divider,
} from '@mui/material';
import { CheckCircle, ContactMail, CalendarToday } from '@mui/icons-material';
import api from '../services/api';
import type { User } from '../types';

const PendingApprovals: React.FC = () => {
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/nutritionist/pending-patients/');
            setPendingUsers(res.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load pending users');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: number) => {
        try {
            await api.post(`/nutritionist/approve-patient/${userId}/`);
            setSuccess('User approved successfully!');
            // Remove from list
            setPendingUsers(pendingUsers.filter(u => u.id !== userId));
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to approve user');
            setTimeout(() => setError(''), 3000);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={4}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Pending Approvals
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Review and approve new client registrations
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            {pendingUsers.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                    <CheckCircle sx={{ fontSize: 60, color: 'success.light', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        All clear! No pending approvals.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {pendingUsers.map((user) => (
                        <Grid size={{ xs: 12, md: 6 }} key={user.id}>
                            <Card sx={{
                                borderRadius: 4,
                                border: '1px solid rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%'
                            }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar sx={{
                                            bgcolor: 'primary.main',
                                            width: 56,
                                            height: 56,
                                            mr: 2,
                                            fontWeight: 'bold'
                                        }}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">{user.username}</Typography>
                                            <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
                                                <ContactMail sx={{ fontSize: 16, mr: 0.5 }} /> {user.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box mb={2}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>PROFILE DETAILS</Typography>
                                        <Grid container spacing={1}>
                                            <Grid size={{ xs: 6 }}>
                                                <Typography variant="body2"><strong>Age:</strong> {user.profile?.age || 'N/A'}</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 6 }}>
                                                <Typography variant="body2"><strong>Weight:</strong> {user.profile?.weight || 'N/A'} kg</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Typography variant="body2"><strong>Goals:</strong> {user.profile?.goals || 'No goals specified'}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Box display="flex" alignItems="center" color="text.secondary" mb={2}>
                                        <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                                        <Typography variant="caption">Joined: {new Date().toLocaleDateString()}</Typography>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color="success"
                                        startIcon={<CheckCircle />}
                                        onClick={() => handleApprove(user.id)}
                                        sx={{ borderRadius: 2, py: 1 }}
                                    >
                                        Approve Access
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default PendingApprovals;
