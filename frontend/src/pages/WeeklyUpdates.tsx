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
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const WeeklyUpdates: React.FC = () => {
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
                label: 'Weight Progress',
                data: updates.slice().reverse().map(u => u.current_weight),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    if (loading) return <Typography>Loading Updates...</Typography>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                Weekly Updates
            </Typography>

            <Grid container spacing={4}>
                {/* Update Form */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Log New Update</Typography>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Current Weight (kg)"
                                type="number"
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Notes"
                                multiline
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                margin="normal"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={submitting}
                                sx={{ mt: 2 }}
                            >
                                {submitting ? 'Submitting...' : 'Log Update'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* Chart and History */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h6" gutterBottom>Progress Chart</Typography>
                        <Box sx={{ height: 300 }}>
                            <Line data={chartData} options={{ maintainAspectRatio: false }} />
                        </Box>
                    </Paper>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Weight (kg)</TableCell>
                                    <TableCell>Notes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {updates.map((update) => (
                                    <TableRow key={update.id}>
                                        <TableCell>{new Date(update.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{update.current_weight}</TableCell>
                                        <TableCell>{update.notes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    );
};

export default WeeklyUpdates;
