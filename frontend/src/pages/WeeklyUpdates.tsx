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
    Slider,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const WeeklyUpdates: React.FC = () => {
    const theme = useTheme();
    const [updates, setUpdates] = useState<WeeklyUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [currentWeight, setCurrentWeight] = useState<number | ''>('');
    const [waistCm, setWaistCm] = useState<number | ''>('');
    const [hipsCm, setHipsCm] = useState<number | ''>('');
    const [chestCm, setChestCm] = useState<number | ''>('');
    const [energyLevel, setEnergyLevel] = useState<number>(7);
    const [complianceScore, setComplianceScore] = useState<number>(80);
    const [notes, setNotes] = useState('');
    const [photoFront, setPhotoFront] = useState<File | null>(null);

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

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhotoFront(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('current_weight', String(currentWeight));
        if (waistCm) formData.append('waist_cm', String(waistCm));
        if (hipsCm) formData.append('hips_cm', String(hipsCm));
        if (chestCm) formData.append('chest_cm', String(chestCm));
        formData.append('energy_level', String(energyLevel));
        formData.append('compliance_score', String(complianceScore));
        formData.append('notes', notes);
        if (photoFront) formData.append('photo_front', photoFront);

        try {
            const response = await api.post('/weekly-updates/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUpdates([response.data, ...updates]);
            setSuccess('Update logged successfully!');
            resetForm();
        } catch (err: any) {
            console.error('Failed to submit update', err);
            setError(err.response?.data?.error || 'Failed to submit update');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setCurrentWeight('');
        setWaistCm('');
        setHipsCm('');
        setChestCm('');
        setEnergyLevel(7);
        setComplianceScore(80);
        setNotes('');
        setPhotoFront(null);
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
            },
        ],
    };

    const canSubmit = (() => {
        if (updates.length === 0) return true;
        const latestUpdate = updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        const lastDate = new Date(latestUpdate.date);
        const nextDate = new Date(lastDate);
        nextDate.setDate(lastDate.getDate() + 7);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        nextDate.setHours(0, 0, 0, 0);
        return today >= nextDate;
    })();

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
                    Track your journey with measurements, energy levels, and photos.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mr: 1.5 }}>
                                <AddCircleOutlineIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight={700}>Log Update</Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

                        {!canSubmit && (
                            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                                You can log your next update in 7 days.
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Current Weight (kg)"
                                        type="number"
                                        value={currentWeight}
                                        onChange={(e) => setCurrentWeight(Number(e.target.value))}
                                        required
                                        disabled={!canSubmit}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Waist (cm)"
                                        type="number"
                                        value={waistCm}
                                        onChange={(e) => setWaistCm(Number(e.target.value))}
                                        disabled={!canSubmit}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Hips (cm)"
                                        type="number"
                                        value={hipsCm}
                                        onChange={(e) => setHipsCm(Number(e.target.value))}
                                        disabled={!canSubmit}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Chest (cm)"
                                        type="number"
                                        value={chestCm}
                                        onChange={(e) => setChestCm(Number(e.target.value))}
                                        disabled={!canSubmit}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography gutterBottom variant="subtitle2">Energy Level (1-10)</Typography>
                                    <Slider
                                        value={energyLevel}
                                        onChange={(_, v) => setEnergyLevel(v as number)}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={1}
                                        max={10}
                                        disabled={!canSubmit}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography gutterBottom variant="subtitle2">Compliance Score (%)</Typography>
                                    <Slider
                                        value={complianceScore}
                                        onChange={(_, v) => setComplianceScore(v as number)}
                                        valueLabelDisplay="auto"
                                        step={5}
                                        min={0}
                                        max={100}
                                        disabled={!canSubmit}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Notes"
                                        multiline
                                        rows={3}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        disabled={!canSubmit}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        startIcon={<PhotoCameraIcon />}
                                        disabled={!canSubmit}
                                    >
                                        Progress Photo
                                        <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                                    </Button>
                                    {photoFront && <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Selected: {photoFront.name}</Typography>}
                                </Grid>
                            </Grid>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={submitting || !canSubmit}
                                size="large"
                                sx={{ mt: 3, py: 1.5 }}
                            >
                                {submitting ? 'Saving...' : 'Log Weekly Progress'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper sx={{ p: 4, mb: 4, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', mr: 1.5 }}>
                                <ShowChartIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight={700}>Weight Progress</Typography>
                        </Box>
                        <Box sx={{ height: 300 }}>
                            <Line data={chartData} options={{ maintainAspectRatio: false }} />
                        </Box>
                    </Paper>

                    <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Weight</TableCell>
                                    <TableCell>Measurements</TableCell>
                                    <TableCell>Compliance</TableCell>
                                    <TableCell>Photos</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {updates.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell>{u.date}</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{u.current_weight} kg</TableCell>
                                        <TableCell>
                                            {u.waist_cm && `W: ${u.waist_cm} `}
                                            {u.hips_cm && `H: ${u.hips_cm} `}
                                            {u.chest_cm && `C: ${u.chest_cm}`}
                                        </TableCell>
                                        <TableCell>{u.compliance_score || 0}%</TableCell>
                                        <TableCell>
                                            {u.photo_front && (
                                                <a href={u.photo_front} target="_blank" rel="noopener noreferrer">
                                                    <Avatar
                                                        src={u.photo_front}
                                                        variant="rounded"
                                                        sx={{ width: 40, height: 40, border: '1px solid #eee' }}
                                                    />
                                                </a>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default WeeklyUpdates;
