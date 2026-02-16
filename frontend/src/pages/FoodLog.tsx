import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    alpha,
    CircularProgress
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import api from '../services/api';
import type { FoodLog } from '../types';
import { getMediaUrl } from '../utils';

const FoodLogPage: React.FC = () => {
    const theme = useTheme();
    const [logs, setLogs] = useState<FoodLog[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [mealType, setMealType] = useState('Breakfast');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/food-logs/');
            setLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch food logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('date', date);
        formData.append('meal_type', mealType);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        try {
            await api.post('/food-logs/', formData);
            setOpenDialog(false);
            resetForm();
            fetchLogs();
        } catch (error) {
            console.error("Failed to submit log", error);
        }
    };

    const resetForm = () => {
        setContent('');
        setImage(null);
        setMealType('Breakfast');
        setDate(new Date().toISOString().split('T')[0]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    if (loading) return (
        <Container sx={{ mt: 8, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>Loading your journal...</Typography>
        </Container>
    );

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={800}>Food Journal</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddPhotoAlternateIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Log Meal
                </Button>
            </Box>

            <Grid container spacing={3}>
                {logs.map((log) => (
                    <Grid key={log.id} size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {log.image && (
                                <Box
                                    component="img"
                                    src={getMediaUrl(log.image)}
                                    sx={{ height: 200, objectFit: 'cover', width: '100%' }}
                                />
                            )}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary">{log.date}</Typography>
                                    <Typography variant="subtitle2" color="primary" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), px: 1, borderRadius: 1 }}>
                                        {log.meal_type}
                                    </Typography>
                                </Box>
                                <Typography variant="body1">{log.content}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {logs.length === 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography color="text.secondary">Your journal is empty. Log your first meal!</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Log a Meal</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Date"
                                type="date"
                                fullWidth
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                label="Meal Type"
                                fullWidth
                                value={mealType}
                                onChange={(e) => setMealType(e.target.value)}
                            >
                                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="What did you eat?"
                                multiline
                                rows={4}
                                fullWidth
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                startIcon={<AddPhotoAlternateIcon />}
                            >
                                Upload Photo (Optional)
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {image && <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Selected: {image.name}</Typography>}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Save Log</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default FoodLogPage;
