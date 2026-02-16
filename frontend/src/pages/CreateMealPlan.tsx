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
    TextField,
    CircularProgress,
    Alert,
    Autocomplete,
    Divider,
    Chip,
    IconButton
} from '@mui/material';
import { Restaurant, CheckCircle, Pending, Close, CloudUpload, Delete, PictureAsPdf, Image as ImageIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { User } from '../types';

const CreateMealPlan: React.FC = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<User[]>([]);
    const [selectedPatients, setSelectedPatients] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [creating, setCreating] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [mealPlan, setMealPlan] = useState({
        start_date: '',
        end_date: '',
        content: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await api.get('/nutritionist/patients/');
            setPatients(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMealPlan = async () => {
        if (selectedPatients.length === 0) {
            setError('Please select at least one client');
            return;
        }

        if (!mealPlan.start_date || !mealPlan.end_date) {
            setError('Please fill in start and end dates');
            return;
        }

        if (!mealPlan.content && !selectedFile) {
            setError('Please provide either meal plan text content or upload a file (PDF/Image)');
            return;
        }

        try {
            setError('');
            setCreating(true);

            // Create meal plans for all selected patients
            const promises = selectedPatients.map(patient => {
                const formData = new FormData();
                formData.append('user_id', patient.id.toString());
                formData.append('start_date', mealPlan.start_date);
                formData.append('end_date', mealPlan.end_date);
                if (mealPlan.content) {
                    formData.append('content', mealPlan.content);
                }
                if (selectedFile) {
                    formData.append('file', selectedFile);
                }

                return api.post('/nutritionist/meal-plans/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            });

            await Promise.all(promises);

            setSuccess(`Successfully created meal plan for ${selectedPatients.length} client(s)!`);
            setMealPlan({ start_date: '', end_date: '', content: '' });
            setSelectedPatients([]);
            setSelectedFile(null);
            setFilePreview(null);

            setTimeout(() => {
                navigate('/nutritionist');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create meal plan');
        } finally {
            setCreating(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError('Please upload a PDF or image file (JPEG, PNG, GIF)');
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }

            setSelectedFile(file);
            setError('');

            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
    };

    const removePatient = (patientId: number) => {
        setSelectedPatients(selectedPatients.filter(p => p.id !== patientId));
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
                    Create Meal Plan
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Design a personalized nutrition plan for one or more clients
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Client Selection */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ position: 'sticky', top: 20 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={2}>
                                Select Clients
                            </Typography>

                            <Autocomplete
                                multiple
                                options={patients}
                                value={selectedPatients}
                                onChange={(_, newValue) => setSelectedPatients(newValue)}
                                getOptionLabel={(option) => option.username}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search clients"
                                        placeholder="Type to search..."
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props} key={option.id}>
                                        <Avatar sx={{ mr: 2, width: 32, height: 32, fontSize: 14 }}>
                                            {option.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box flex={1}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {option.username}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {option.email}
                                            </Typography>
                                        </Box>
                                        {option.profile?.is_approved ? (
                                            <CheckCircle color="success" sx={{ fontSize: 16 }} />
                                        ) : (
                                            <Pending color="warning" sx={{ fontSize: 16 }} />
                                        )}
                                    </Box>
                                )}
                            />

                            {selectedPatients.length > 0 && (
                                <Box mt={3}>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="subtitle2" color="text.secondary" mb={1}>
                                        Selected Clients ({selectedPatients.length})
                                    </Typography>
                                    <Box display="flex" flexDirection="column" gap={1}>
                                        {selectedPatients.map((patient) => (
                                            <Card key={patient.id} variant="outlined">
                                                <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                                                            {patient.username.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Box flex={1}>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {patient.username}
                                                            </Typography>
                                                        </Box>
                                                        <Chip
                                                            icon={<Close />}
                                                            label="Remove"
                                                            size="small"
                                                            onClick={() => removePatient(patient.id)}
                                                            sx={{ cursor: 'pointer' }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Meal Plan Form */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={3}>
                                <Restaurant color="primary" sx={{ fontSize: 32 }} />
                                <Typography variant="h6" fontWeight="bold">
                                    Meal Plan Details
                                </Typography>
                            </Box>

                            <Box display="flex" flexDirection="column" gap={3}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Start Date"
                                            type="date"
                                            value={mealPlan.start_date}
                                            onChange={(e) => setMealPlan({ ...mealPlan, start_date: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="End Date"
                                            type="date"
                                            value={mealPlan.end_date}
                                            onChange={(e) => setMealPlan({ ...mealPlan, end_date: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                </Grid>

                                {/* File Upload Section */}
                                <Box>
                                    <Typography variant="subtitle2" mb={1} fontWeight={600}>
                                        Upload Meal Plan (PDF or Image)
                                    </Typography>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUpload />}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    >
                                        Choose File
                                        <input
                                            type="file"
                                            hidden
                                            accept=".pdf,image/*"
                                            onChange={handleFileChange}
                                        />
                                    </Button>

                                    {selectedFile && (
                                        <Card variant="outlined" sx={{ p: 2 }}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                {selectedFile.type === 'application/pdf' ? (
                                                    <PictureAsPdf color="error" sx={{ fontSize: 40 }} />
                                                ) : (
                                                    <ImageIcon color="primary" sx={{ fontSize: 40 }} />
                                                )}
                                                <Box flex={1}>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {selectedFile.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </Typography>
                                                </Box>
                                                <IconButton onClick={handleRemoveFile} color="error">
                                                    <Delete />
                                                </IconButton>
                                            </Box>

                                            {filePreview && (
                                                <Box mt={2}>
                                                    <img
                                                        src={filePreview}
                                                        alt="Preview"
                                                        style={{
                                                            width: '100%',
                                                            maxHeight: 300,
                                                            objectFit: 'contain',
                                                            borderRadius: 8
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Card>
                                    )}
                                </Box>

                                <Divider>
                                    <Chip label="OR" size="small" />
                                </Divider>

                                <TextField
                                    label="Meal Plan Content (Text)"
                                    multiline
                                    rows={12}
                                    value={mealPlan.content}
                                    onChange={(e) => setMealPlan({ ...mealPlan, content: e.target.value })}
                                    placeholder="Enter detailed meal plan instructions...

Example:
Monday:
- Breakfast: Oatmeal with berries and nuts
- Lunch: Grilled chicken salad
- Dinner: Baked salmon with vegetables

Tuesday:
..."
                                    fullWidth
                                />

                                <Box display="flex" gap={2} justifyContent="flex-end">
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/nutritionist')}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleCreateMealPlan}
                                        disabled={selectedPatients.length === 0 || creating}
                                    >
                                        {creating ? 'Creating...' : `Create for ${selectedPatients.length} Client${selectedPatients.length !== 1 ? 's' : ''}`}
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CreateMealPlan;
