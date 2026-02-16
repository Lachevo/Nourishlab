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
    CircularProgress,
    Alert,
    TextField,
    InputAdornment
} from '@mui/material';
import { Search, LocalDining } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getMediaUrl } from '../utils';

interface FoodLog {
    id: number;
    user: {
        id: number;
        username: string;
        email: string;
    };
    date: string;
    meal_type: string;
    content: string;
    image: string | null;
    created_at: string;
}

const ClientFoodJournals: React.FC = () => {
    const navigate = useNavigate();
    const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchFoodLogs();
    }, []);

    const fetchFoodLogs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/nutritionist/patients/');
            const patients = response.data;

            const allLogs: FoodLog[] = [];
            for (const patient of patients) {
                const detailResponse = await api.get(`/nutritionist/patients/${patient.id}/`);
                const patientLogs = detailResponse.data.food_logs.map((log: any) => ({
                    ...log,
                    user: {
                        id: patient.id,
                        username: patient.username,
                        email: patient.email
                    }
                }));
                allLogs.push(...patientLogs);
            }

            allLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setFoodLogs(allLogs);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load food logs');
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = foodLogs.filter(log =>
        log.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.meal_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box mb={4}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Client Food Journals
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Monitor what your clients are eating
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Search */}
            <Box mb={3}>
                <TextField
                    fullWidth
                    placeholder="Search by client name, email, or meal type..."
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
            </Box>

            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                        <CardContent>
                            <Typography variant="h4" color="white" fontWeight="bold">
                                {filteredLogs.length}
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.9)">
                                Total Food Logs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <CardContent>
                            <Typography variant="h4" color="white" fontWeight="bold">
                                {new Set(filteredLogs.map(l => l.user.id)).size}
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.9)">
                                Active Clients
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Food Logs Grid */}
            {filteredLogs.length === 0 ? (
                <Card>
                    <CardContent>
                        <Box textAlign="center" py={4}>
                            <LocalDining sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No food logs found
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {filteredLogs.map((log) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={log.id}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
                                    }
                                }}
                                onClick={() => navigate(`/nutritionist/patients/${log.user.id}`)}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                                            {log.user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box flex={1}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {log.user.username}
                                            </Typography>
                                        </Box>
                                        <Chip label={new Date(log.date).toLocaleDateString()} size="small" />
                                    </Box>

                                    <Typography variant="h6" fontWeight="bold" mb={1}>
                                        {log.meal_type}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        {log.content}
                                    </Typography>

                                    {log.image && (
                                        <Box
                                            component="img"
                                            src={getMediaUrl(log.image)}
                                            alt={log.meal_type}
                                            sx={{
                                                width: '100%',
                                                height: 200,
                                                objectFit: 'cover',
                                                borderRadius: 2
                                            }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default ClientFoodJournals;
