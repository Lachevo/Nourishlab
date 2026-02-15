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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    InputAdornment
} from '@mui/material';
import { Search, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface WeeklyUpdate {
    id: number;
    user: {
        id: number;
        username: string;
        email: string;
    };
    date: string;
    current_weight: number;
    waist_cm: number | null;
    hips_cm: number | null;
    chest_cm: number | null;
    arm_cm: number | null;
    thigh_cm: number | null;
    energy_level: string | null;
    compliance_score: number | null;
    notes: string;
}

const ClientWeeklyUpdates: React.FC = () => {
    const navigate = useNavigate();
    const [updates, setUpdates] = useState<WeeklyUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        try {
            setLoading(true);
            // Get all patients and their updates
            const response = await api.get('/nutritionist/patients/');
            const patients = response.data;

            // Fetch updates for each patient
            const allUpdates: WeeklyUpdate[] = [];
            for (const patient of patients) {
                const detailResponse = await api.get(`/nutritionist/patients/${patient.id}/`);
                const patientUpdates = detailResponse.data.weekly_updates.map((update: any) => ({
                    ...update,
                    user: {
                        id: patient.id,
                        username: patient.username,
                        email: patient.email
                    }
                }));
                allUpdates.push(...patientUpdates);
            }

            // Sort by date descending
            allUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setUpdates(allUpdates);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load updates');
        } finally {
            setLoading(false);
        }
    };

    const filteredUpdates = updates.filter(update =>
        update.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        update.user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
                    Client Weekly Updates
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Monitor all client progress updates in one place
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
                    placeholder="Search by client name or email..."
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
                    <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <CardContent>
                            <Typography variant="h4" color="white" fontWeight="bold">
                                {filteredUpdates.length}
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.9)">
                                Total Updates
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                        <CardContent>
                            <Typography variant="h4" color="white" fontWeight="bold">
                                {new Set(filteredUpdates.map(u => u.user.id)).size}
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.9)">
                                Active Clients
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Updates Table */}
            {filteredUpdates.length === 0 ? (
                <Card>
                    <CardContent>
                        <Box textAlign="center" py={4}>
                            <TrendingUp sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No weekly updates found
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Client</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Weight (kg)</TableCell>
                                <TableCell>Energy Level</TableCell>
                                <TableCell>Compliance</TableCell>
                                <TableCell>Notes</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUpdates.map((update) => (
                                <TableRow
                                    key={update.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/nutritionist/patients/${update.user.id}`)}
                                >
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                                                {update.user.username.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Typography variant="body2" fontWeight={600}>
                                                {update.user.username}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{new Date(update.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{update.current_weight}</TableCell>
                                    <TableCell>
                                        {update.energy_level ? (
                                            <Chip label={update.energy_level} size="small" color="primary" />
                                        ) : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {update.compliance_score ? `${update.compliance_score}%` : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                            {update.notes || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label="View Client"
                                            size="small"
                                            color="primary"
                                            onClick={() => navigate(`/nutritionist/patients/${update.user.id}`)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default ClientWeeklyUpdates;
