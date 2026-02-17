import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    ArrowBack,
    Restaurant,
    TrendingUp,
    LocalDining,
    Science,
    Add,
    Note
} from '@mui/icons-material';
import api from '../services/api';
import type { User, MealPlan, WeeklyUpdate, FoodLog, LabResult } from '../types';
import { getMediaUrl } from '../utils';
import ProgressChart from '../components/nutritionist/ProgressChart';

interface PatientDetailData extends User {
    meal_plans: MealPlan[];
    weekly_updates: WeeklyUpdate[];
    food_logs: FoodLog[];
    lab_results: LabResult[];
}

interface ProgressData {
    weight: Array<{ date: string; value: number }>;
    measurements: {
        waist: Array<{ date: string; value: number }>;
        hips: Array<{ date: string; value: number }>;
        chest: Array<{ date: string; value: number }>;
        arm: Array<{ date: string; value: number }>;
        thigh: Array<{ date: string; value: number }>;
    };
    energy_levels: Array<{ date: string; value: string }>;
    compliance: Array<{ date: string; value: number }>;
}

interface NutritionistNote {
    id: number;
    content: string;
    tags: string;
    created_at: string;
    updated_at: string;
}

const PatientDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<PatientDetailData | null>(null);
    const [progressData, setProgressData] = useState<ProgressData | null>(null);
    const [notes, setNotes] = useState<NutritionistNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [mealPlanDialog, setMealPlanDialog] = useState(false);
    const [noteDialog, setNoteDialog] = useState(false);
    const [newMealPlan, setNewMealPlan] = useState({
        start_date: '',
        end_date: '',
        content: ''
    });
    const [newNote, setNewNote] = useState({
        content: '',
        tags: ''
    });

    useEffect(() => {
        fetchPatientData();
        fetchProgressData();
        fetchNotes();
    }, [id]);

    const fetchPatientData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/nutritionist/patients/${id}/`);
            setPatient(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load patient data');
        } finally {
            setLoading(false);
        }
    };

    const fetchProgressData = async () => {
        try {
            const response = await api.get(`/nutritionist/patients/${id}/progress/`);
            setProgressData(response.data);
        } catch (err) {
            console.error('Failed to fetch progress data:', err);
        }
    };

    const fetchNotes = async () => {
        try {
            const response = await api.get(`/nutritionist/notes/?patient=${id}`);
            setNotes(response.data);
        } catch (err) {
            console.error('Failed to fetch notes:', err);
        }
    };

    const handleCreateMealPlan = async () => {
        try {
            await api.post('/nutritionist/meal-plans/', {
                user_id: id,
                ...newMealPlan
            });
            setMealPlanDialog(false);
            setNewMealPlan({ start_date: '', end_date: '', content: '' });
            fetchPatientData();
        } catch (err: any) {
            alert(err.response?.data?.detail || 'Failed to create meal plan');
        }
    };

    const handleCreateNote = async () => {
        try {
            await api.post('/nutritionist/notes/', {
                patient: id,
                ...newNote
            });
            setNoteDialog(false);
            setNewNote({ content: '', tags: '' });
            fetchNotes();
        } catch (err: any) {
            alert(err.response?.data?.detail || 'Failed to create note');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error || !patient) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">{error || 'Patient not found'}</Alert>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/nutritionist')} sx={{ mt: 2 }}>
                    Back to Dashboard
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box mb={4}>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/nutritionist')} sx={{ mb: 2 }}>
                    Back to Dashboard
                </Button>
                <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontSize: 32,
                            fontWeight: 'bold'
                        }}
                    >
                        {patient.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box flex={1} sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
                        >
                            {patient.username}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {patient.email}
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                            {patient.profile?.is_approved ? (
                                <Chip label="Active Client" color="success" size="small" />
                            ) : (
                                <Chip label="Pending Approval" color="warning" size="small" />
                            )}
                        </Box>
                    </Box>
                    <Box display="flex" gap={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        <Button
                            variant="outlined"
                            startIcon={<Note />}
                            onClick={() => setNoteDialog(true)}
                            fullWidth={true}
                        >
                            Add Note
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setMealPlanDialog(true)}
                            size="large"
                            fullWidth={true}
                        >
                            Create Meal Plan
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Profile Info */}
            {patient.profile && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                            Client Profile
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="body2" color="text.secondary">Age</Typography>
                                <Typography variant="h6">{patient.profile.age || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="body2" color="text.secondary">Height</Typography>
                                <Typography variant="h6">{patient.profile.height ? `${patient.profile.height} cm` : 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="body2" color="text.secondary">Weight</Typography>
                                <Typography variant="h6">{patient.profile.weight ? `${patient.profile.weight} kg` : 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Typography variant="body2" color="text.secondary">BMI</Typography>
                                <Typography variant="h6">
                                    {patient.profile.height && patient.profile.weight
                                        ? ((patient.profile.weight / Math.pow(patient.profile.height / 100, 2)).toFixed(1))
                                        : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2" color="text.secondary">Goals</Typography>
                                <Typography variant="body1">{patient.profile.goals || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2" color="text.secondary">Dietary Preferences</Typography>
                                <Typography variant="body1">{patient.profile.dietary_prefs || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" color="text.secondary">Allergies</Typography>
                                <Typography variant="body1">{patient.profile.allergies || 'None'}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Progress Charts */}
            {progressData && progressData.weight.length > 0 && (
                <Box mb={3}>
                    <Typography variant="h5" fontWeight="bold" mb={2}>
                        Progress Tracking
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <ProgressChart
                                data={progressData.weight}
                                title="Weight Progress"
                                color="#667eea"
                                unit="kg"
                            />
                        </Grid>
                        {progressData.compliance.length > 0 && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <ProgressChart
                                    data={progressData.compliance}
                                    title="Compliance Score"
                                    color="#43e97b"
                                    unit="%"
                                />
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    <Tab icon={<Restaurant />} label="Meal Plans" iconPosition="start" />
                    <Tab icon={<TrendingUp />} label="Progress" iconPosition="start" />
                    <Tab icon={<LocalDining />} label="Food Logs" iconPosition="start" />
                    <Tab icon={<Science />} label="Lab Results" iconPosition="start" />
                    <Tab icon={<Note />} label="Notes" iconPosition="start" />
                </Tabs>
            </Box>

            {/* Tab Panels */}
            {tabValue === 0 && (
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Meal Plans ({patient.meal_plans.length})
                    </Typography>
                    {patient.meal_plans.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" textAlign="center">
                                    No meal plans yet. Create one to get started!
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <Grid container spacing={2}>
                            {patient.meal_plans.map((plan) => (
                                <Grid size={{ xs: 12, md: 6 }} key={plan.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold">
                                                {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                                                {plan.content}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            )}

            {tabValue === 1 && (
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Weekly Progress Updates ({patient.weekly_updates.length})
                    </Typography>
                    {patient.weekly_updates.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" textAlign="center">
                                    No progress updates yet.
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Weight (kg)</TableCell>
                                        <TableCell>Energy Level</TableCell>
                                        <TableCell>Compliance</TableCell>
                                        <TableCell>Photos</TableCell>
                                        <TableCell>Notes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {patient.weekly_updates.map((update) => (
                                        <TableRow key={update.id}>
                                            <TableCell>{new Date(update.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{update.current_weight}</TableCell>
                                            <TableCell>{update.energy_level || 'N/A'}</TableCell>
                                            <TableCell>{update.compliance_score ? `${update.compliance_score}%` : 'N/A'}</TableCell>
                                            <TableCell>
                                                {update.photo_front && (
                                                    <a href={getMediaUrl(update.photo_front)} target="_blank" rel="noopener noreferrer">
                                                        <Avatar
                                                            src={getMediaUrl(update.photo_front)}
                                                            variant="rounded"
                                                            sx={{ width: 40, height: 40, border: '1px solid #eee' }}
                                                        />
                                                    </a>
                                                )}
                                            </TableCell>
                                            <TableCell>{update.notes || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}

            {tabValue === 2 && (
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Food Logs ({patient.food_logs.length})
                    </Typography>
                    {patient.food_logs.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" textAlign="center">
                                    No food logs yet.
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <Grid container spacing={2}>
                            {patient.food_logs.map((log) => (
                                <Grid size={{ xs: 12, md: 6 }} key={log.id}>
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" mb={1}>
                                                <Typography variant="h6">{log.meal_type}</Typography>
                                                <Chip label={new Date(log.date).toLocaleDateString()} size="small" />
                                            </Box>
                                            <Typography variant="body2">{log.content}</Typography>
                                            {log.image && (
                                                <Box mt={2}>
                                                    <img
                                                        src={getMediaUrl(log.image)}
                                                        alt={log.meal_type}
                                                        style={{ width: '100%', borderRadius: 8 }}
                                                    />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            )}

            {tabValue === 3 && (
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Lab Results ({patient.lab_results.length})
                    </Typography>
                    {patient.lab_results.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" textAlign="center">
                                    No lab results uploaded yet.
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <Grid container spacing={2}>
                            {patient.lab_results.map((result) => (
                                <Grid size={{ xs: 12, md: 6 }} key={result.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold">
                                                {result.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                {result.description}
                                            </Typography>
                                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                Uploaded: {new Date(result.uploaded_at).toLocaleDateString()}
                                            </Typography>
                                            <Button
                                                component="a"
                                                variant="outlined"
                                                size="small"
                                                sx={{ mt: 2 }}
                                                href={getMediaUrl(result.file)}
                                                target="_blank"
                                            >
                                                View File
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            )}

            {tabValue === 4 && (
                <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Nutritionist Notes ({notes.length})
                    </Typography>
                    {notes.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" textAlign="center">
                                    No notes yet. Add your first observation!
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <Box>
                            {notes.map((note) => (
                                <Card key={note.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(note.created_at).toLocaleString()}
                                            </Typography>
                                            {note.tags && (
                                                <Box display="flex" gap={0.5}>
                                                    {note.tags.split(',').map((tag, idx) => (
                                                        <Chip key={idx} label={tag.trim()} size="small" />
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {note.content}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            {/* Create Meal Plan Dialog */}
            <Dialog open={mealPlanDialog} onClose={() => setMealPlanDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Meal Plan</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <TextField
                            label="Start Date"
                            type="date"
                            value={newMealPlan.start_date}
                            onChange={(e) => setNewMealPlan({ ...newMealPlan, start_date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            value={newMealPlan.end_date}
                            onChange={(e) => setNewMealPlan({ ...newMealPlan, end_date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            label="Meal Plan Content"
                            multiline
                            rows={8}
                            value={newMealPlan.content}
                            onChange={(e) => setNewMealPlan({ ...newMealPlan, content: e.target.value })}
                            placeholder="Enter detailed meal plan instructions..."
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMealPlanDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateMealPlan} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Note Dialog */}
            <Dialog open={noteDialog} onClose={() => setNoteDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Nutritionist Note</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <TextField
                            label="Note Content"
                            multiline
                            rows={6}
                            value={newNote.content}
                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                            placeholder="Enter your observations, recommendations, or concerns..."
                            fullWidth
                        />
                        <TextField
                            label="Tags (comma-separated)"
                            value={newNote.tags}
                            onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                            placeholder="e.g., progress, concern, goal"
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNoteDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateNote} variant="contained">
                        Save Note
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PatientDetail;
