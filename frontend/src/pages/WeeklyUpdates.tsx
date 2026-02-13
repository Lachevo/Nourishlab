import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { WeeklyUpdate } from '../types';
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Alert,
    alpha,
    useTheme,
    Avatar,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import HistoryIcon from '@mui/icons-material/History';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const WeeklyUpdates: React.FC = () => {
    const theme = useTheme();
    const [updates, setUpdates] = useState<WeeklyUpdate[]>([]);
    const [currentWeight, setCurrentWeight] = useState<number | ''>('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        try {
            const response = await api.get('/weekly-updates/');
            const data = Array.isArray(response.data) ? response.data : response.data.results;
            setUpdates(data || []);
        } catch (error) {
            console.error('Failed to fetch updates', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/weekly-updates/', {
                current_weight: Number(currentWeight),
                notes,
            });
            setUpdates([response.data, ...updates]);
            setSuccess('Update logged successfully!');
            setCurrentWeight('');
            setNotes('');
        } catch (err: any) {
            console.error('Failed to submit update', err);
            setError('Failed to submit update');
        } finally {
            setSubmitting(false);
        }
    };

    const chartData = {
        labels: updates.slice().reverse().map(u => u.date),
        datasets: [
            {
                label: 'Weight (kg)',
                data: updates.slice().reverse().map(u => u.current_weight),
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    if (loading) return (
        <Container sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">Loading your progress history...</Typography>
        </Container>
    );

    return (
        <Box sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                    Weekly Updates
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Track your journey and stay committed to your goals.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Update Form */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 4, border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mr: 1.5 }}>
                                <AddCircleOutlineIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight={700}>Log Update</Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

                        {updates.length > 0 && (() => {
                            const latestUpdate = updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                            const lastDate = new Date(latestUpdate.date);
                            const nextDate = new Date(lastDate);
                            nextDate.setDate(lastDate.getDate() + 7);
                            const today = new Date();

                            // Reset time components for accurate date comparison
                            today.setHours(0, 0, 0, 0);
                            nextDate.setHours(0, 0, 0, 0);

                            if (today < nextDate) {
                                return (
                                    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                                        You can log your next update on <strong>{nextDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong>.
                                    </Alert>
                                );
                            }
                            return null;
                        })()}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Current Weight (kg)"
                                type="number"
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                                required
                                margin="normal"
                                disabled={(() => {
                                    if (updates.length > 0) {
                                        const latestUpdate = updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                                        const lastDate = new Date(latestUpdate.date);
                                        const nextDate = new Date(lastDate);
                                        nextDate.setDate(lastDate.getDate() + 7);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        nextDate.setHours(0, 0, 0, 0);
                                        return today < nextDate;
                                    }
                                    return false;
                                })()}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                fullWidth
                                label="Notes / Thoughts"
                                multiline
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                margin="normal"
                                placeholder="How are you feeling this week?"
                                disabled={(() => {
                                    if (updates.length > 0) {
                                        const latestUpdate = updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                                        const lastDate = new Date(latestUpdate.date);
                                        const nextDate = new Date(lastDate);
                                        nextDate.setDate(lastDate.getDate() + 7);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        nextDate.setHours(0, 0, 0, 0);
                                        return today < nextDate;
                                    }
                                    return false;
                                })()}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={submitting || (() => {
                                    if (updates.length > 0) {
                                        const latestUpdate = updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                                        const lastDate = new Date(latestUpdate.date);
                                        const nextDate = new Date(lastDate);
                                        nextDate.setDate(lastDate.getDate() + 7);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        nextDate.setHours(0, 0, 0, 0);
                                        return today < nextDate;
                                    }
                                    return false;
                                })()}
                                size="large"
                                sx={{ mt: 3, py: 1.5 }}
                            >
                                {submitting ? 'Saving...' : 'Log Weekly Progress'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* Chart and History */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 4, mb: 4, border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', mr: 1.5 }}>
                                <ShowChartIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight={700}>Progress Chart</Typography>
                        </Box>
                        <Box sx={{ height: 320 }}>
                            <Line
                                data={chartData}
                                options={{
                                    maintainAspectRatio: false,
                                    interaction: { intersect: false, mode: 'index' },
                                    scales: {
                                        y: { grid: { color: alpha(theme.palette.divider, 0.05) } },
                                        x: { grid: { display: false } }
                                    },
                                    plugins: { legend: { display: false } }
                                }}
                            />
                        </Box>
                    </Paper>

                    <TableContainer component={Paper} sx={{ border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: 4, overflow: 'hidden' }}>
                        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', mr: 1.5, width: 32, height: 32 }}>
                                <HistoryIcon sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight={700}>Update History</Typography>
                        </Box>
                        <Table>
                            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Weight (kg)</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {updates.map((update) => (
                                    <TableRow key={update.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ fontWeight: 600 }}>{new Date(update.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={800} color="primary.main">
                                                {update.current_weight} kg
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{update.notes || '—'}</TableCell>
                                    </TableRow>
                                ))}
                                {updates.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body2" color="textSecondary">No history available yet.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default WeeklyUpdates;
