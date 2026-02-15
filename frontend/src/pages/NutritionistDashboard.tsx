import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Avatar,
    Chip,
    Button,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert
} from '@mui/material';
import { Search, Person, CheckCircle, Pending, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { User } from '../types';
import RecentActivity from '../components/nutritionist/RecentActivity';
import QuickActions from '../components/nutritionist/QuickActions';

interface DashboardStats {
    total_patients: number;
    approved_patients: number;
    pending_patients: number;
    active_meal_plans: number;
}

const NutritionistDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<User[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [patientsRes, statsRes] = await Promise.all([
                api.get('/nutritionist/patients/'),
                api.get('/nutritionist/stats/')
            ]);
            setPatients(patientsRes.data);
            setStats(statsRes.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterStatus === 'all') return matchesSearch;
        if (filterStatus === 'approved') return matchesSearch && patient.profile?.is_approved;
        if (filterStatus === 'pending') return matchesSearch && !patient.profile?.is_approved;
        return matchesSearch;
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box mb={4}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Client Management Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Monitor your clients' progress and manage their nutrition plans
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Stats Cards */}
            {stats && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            position: 'relative',
                            overflow: 'visible'
                        }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="h3" color="white" fontWeight="bold">
                                            {stats.total_patients}
                                        </Typography>
                                        <Typography variant="body2" color="rgba(255,255,255,0.9)" sx={{ mt: 1 }}>
                                            Total Clients
                                        </Typography>
                                    </Box>
                                    <Person sx={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="h3" color="white" fontWeight="bold">
                                            {stats.approved_patients}
                                        </Typography>
                                        <Typography variant="body2" color="rgba(255,255,255,0.9)" sx={{ mt: 1 }}>
                                            Active Clients
                                        </Typography>
                                    </Box>
                                    <CheckCircle sx={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="h3" color="white" fontWeight="bold">
                                            {stats.pending_patients}
                                        </Typography>
                                        <Typography variant="body2" color="rgba(255,255,255,0.9)" sx={{ mt: 1 }}>
                                            Pending Approval
                                        </Typography>
                                    </Box>
                                    <Pending sx={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="h3" color="white" fontWeight="bold">
                                            {stats.active_meal_plans}
                                        </Typography>
                                        <Typography variant="body2" color="rgba(255,255,255,0.9)" sx={{ mt: 1 }}>
                                            Active Meal Plans
                                        </Typography>
                                    </Box>
                                    <TrendingUp sx={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Activity and Quick Actions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <RecentActivity />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <QuickActions />
                </Grid>
            </Grid>

            {/* Search and Filter */}
            <Box mb={3}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                        <TextField
                            fullWidth
                            placeholder="Search clients by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    backgroundColor: 'background.paper'
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box display="flex" gap={1}>
                            <Chip
                                label="All"
                                onClick={() => setFilterStatus('all')}
                                color={filterStatus === 'all' ? 'primary' : 'default'}
                                sx={{ cursor: 'pointer' }}
                            />
                            <Chip
                                label="Active"
                                onClick={() => setFilterStatus('approved')}
                                color={filterStatus === 'approved' ? 'success' : 'default'}
                                sx={{ cursor: 'pointer' }}
                            />
                            <Chip
                                label="Pending"
                                onClick={() => setFilterStatus('pending')}
                                color={filterStatus === 'pending' ? 'warning' : 'default'}
                                sx={{ cursor: 'pointer' }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Client List */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Your Clients ({filteredPatients.length})
            </Typography>

            {filteredPatients.length === 0 ? (
                <Card>
                    <CardContent>
                        <Box textAlign="center" py={4}>
                            <Person sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No clients found
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={2}>
                    {filteredPatients.map((patient) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={patient.id}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
                                    }
                                }}
                                onClick={() => navigate(`/nutritionist/patients/${patient.id}`)}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                mr: 2,
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                fontSize: 24,
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {patient.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box flex={1}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {patient.username}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {patient.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                                        {patient.profile?.is_approved ? (
                                            <Chip
                                                icon={<CheckCircle />}
                                                label="Active"
                                                color="success"
                                                size="small"
                                            />
                                        ) : (
                                            <Chip
                                                icon={<Pending />}
                                                label="Pending"
                                                color="warning"
                                                size="small"
                                            />
                                        )}
                                        {patient.profile?.goals && (
                                            <Chip
                                                label={patient.profile.goals.substring(0, 20) + '...'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 1 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/nutritionist/patients/${patient.id}`);
                                        }}
                                    >
                                        View Details
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

export default NutritionistDashboard;
