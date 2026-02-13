import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    Snackbar,
    Stack,
    Box,
    InputAdornment,
} from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import StraightenIcon from '@mui/icons-material/Straighten';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import type { Profile as ProfileType } from '../types';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileType>({
        age: undefined,
        height: undefined,
        weight: undefined,
        goals: '',
        dietary_prefs: '',
        allergies: '',
        is_approved: false,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile/');
            if (response.data.profile) {
                setProfile(response.data.profile);
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        // Basic validation
        if (profile.age && (profile.age < 0 || profile.age > 120)) {
            setSaving(false);
            return setMessage({ type: 'error', text: 'Please enter a valid age' });
        }
        if (profile.height && (profile.height < 0 || profile.height > 300)) {
            setSaving(false);
            return setMessage({ type: 'error', text: 'Please enter a valid height' });
        }
        if (profile.weight && (profile.weight < 0 || profile.weight > 500)) {
            setSaving(false);
            return setMessage({ type: 'error', text: 'Please enter a valid weight' });
        }

        try {
            await api.put('/profile/', profile);
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error) {
            console.error('Failed to update profile', error);
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    My Profile
                </Typography>

                {profile.is_approved ? (
                    <Alert severity="success" sx={{ mb: 3 }}>Account Approved</Alert>
                ) : (
                    <Alert severity="warning" sx={{ mb: 3 }}>Account Pending Approval</Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                sx={{ flex: '1 1 200px' }}
                                label="Age"
                                name="age"
                                type="number"
                                value={profile.age || ''}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CakeIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                sx={{ flex: '1 1 200px' }}
                                label="Height (cm)"
                                name="height"
                                type="number"
                                value={profile.height || ''}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <StraightenIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                sx={{ flex: '1 1 200px' }}
                                label="Weight (kg)"
                                name="weight"
                                type="number"
                                value={profile.weight || ''}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MonitorWeightIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Fitness Goals"
                            name="goals"
                            value={profile.goals || ''}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmojiEventsIcon color="action" sx={{ mt: 1 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Dietary Preferences"
                            name="dietary_prefs"
                            value={profile.dietary_prefs || ''}
                            onChange={handleChange}
                            helperText="Vegetarian, Vegan, Keto, etc."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <RestaurantMenuIcon color="action" sx={{ mt: 1 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Allergies"
                            name="allergies"
                            value={profile.allergies || ''}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MedicalServicesIcon color="action" sx={{ mt: 1 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            <Snackbar
                open={!!message}
                autoHideDuration={6000}
                onClose={() => setMessage(null)}
            >
                <Alert onClose={() => setMessage(null)} severity={message?.type || 'info'}>
                    {message?.text}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Profile;
