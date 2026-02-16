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
    InputAdornment,
    Button
} from '@mui/material';
import { Search, Science, Download } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getMediaUrl } from '../utils';

interface LabResult {
    id: number;
    user: {
        id: number;
        username: string;
        email: string;
    };
    title: string;
    description: string;
    file: string;
    uploaded_at: string;
}

const ClientLabResults: React.FC = () => {
    const navigate = useNavigate();
    const [labResults, setLabResults] = useState<LabResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchLabResults();
    }, []);

    const fetchLabResults = async () => {
        try {
            setLoading(true);
            const response = await api.get('/nutritionist/patients/');
            const patients = response.data;

            const allResults: LabResult[] = [];
            for (const patient of patients) {
                const detailResponse = await api.get(`/nutritionist/patients/${patient.id}/`);
                const patientResults = detailResponse.data.lab_results.map((result: any) => ({
                    ...result,
                    user: {
                        id: patient.id,
                        username: patient.username,
                        email: patient.email
                    }
                }));
                allResults.push(...patientResults);
            }

            allResults.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
            setLabResults(allResults);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load lab results');
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = labResults.filter(result =>
        result.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.title.toLowerCase().includes(searchQuery.toLowerCase())
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
                    Client Lab Results
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Review and track client laboratory test results
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
                    placeholder="Search by client name, email, or test title..."
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
                    <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <CardContent>
                            <Typography variant="h4" color="white" fontWeight="bold">
                                {filteredResults.length}
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.9)">
                                Total Lab Results
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <CardContent>
                            <Typography variant="h4" color="white" fontWeight="bold">
                                {new Set(filteredResults.map(r => r.user.id)).size}
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.9)">
                                Clients with Results
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Lab Results Grid */}
            {filteredResults.length === 0 ? (
                <Card>
                    <CardContent>
                        <Box textAlign="center" py={4}>
                            <Science sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No lab results found
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {filteredResults.map((result) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={result.id}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
                                    }
                                }}
                                onClick={() => navigate(`/nutritionist/patients/${result.user.id}`)}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                                            {result.user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box flex={1}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {result.user.username}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={new Date(result.uploaded_at).toLocaleDateString()}
                                            size="small"
                                        />
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <Science color="primary" />
                                        <Typography variant="h6" fontWeight="bold">
                                            {result.title}
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        {result.description || 'No description provided'}
                                    </Typography>

                                    <Box display="flex" gap={1}>
                                        <Button
                                            component="a"
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Download />}
                                            href={getMediaUrl(result.file)}
                                            target="_blank"
                                            onClick={(e) => e.stopPropagation()}
                                            fullWidth
                                        >
                                            Download
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/nutritionist/patients/${result.user.id}`);
                                            }}
                                            fullWidth
                                        >
                                            View Client
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default ClientLabResults;
