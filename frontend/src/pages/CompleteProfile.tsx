import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Stepper,
    Step,
    StepLabel,
    alpha,
    useTheme,
    InputAdornment,
    Stack,
    Autocomplete,
    Chip,
    FormControl,
    FormLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HeightIcon from '@mui/icons-material/Height';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import CakeIcon from '@mui/icons-material/Cake';
import logo from '../assets/logo.jpg';

const steps = ['Personal Details', 'Goals & Preferences'];

const DIETARY_PREFERENCES = [
    'Vegetarian',
    'Vegan',
    'Keto',
    'Paleo',
    'Low-Carb',
    'Low-Fat',
    'Gluten-Free',
    'Dairy-Free',
    'Halal',
    'Kosher',
    'Pescatarian',
    'Mediterranean',
    'Other'
];

const COMMON_ALLERGIES = [
    'Peanuts',
    'Tree Nuts',
    'Milk/Dairy',
    'Eggs',
    'Soy',
    'Wheat/Gluten',
    'Fish',
    'Shellfish',
    'Sesame',
    'Corn',
    'Other'
];

const CompleteProfile: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1: Personal Details
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    // Step 2: Goals & Preferences
    const [goals, setGoals] = useState('');
    const [selectedDietaryPrefs, setSelectedDietaryPrefs] = useState<string[]>([]);
    const [customDietaryPref, setCustomDietaryPref] = useState('');
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [customAllergy, setCustomAllergy] = useState('');

    const validateStep1 = () => {
        if (!age || !height || !weight) {
            setError('Please fill in all personal details');
            return false;
        }

        const ageNum = parseInt(age);
        const heightNum = parseFloat(height);
        const weightNum = parseFloat(weight);

        if (ageNum < 10 || ageNum > 120) {
            setError('Please enter a valid age (10-120)');
            return false;
        }

        if (heightNum < 50 || heightNum > 300) {
            setError('Please enter a valid height in cm (50-300)');
            return false;
        }

        if (weightNum < 20 || weightNum > 500) {
            setError('Please enter a valid weight in kg (20-500)');
            return false;
        }

        return true;
    };

    const validateStep2 = () => {
        if (!goals.trim()) {
            setError('Please describe your health goals');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError('');

        if (activeStep === 0) {
            if (validateStep1()) {
                setActiveStep(1);
            }
        }
    };

    const handleBack = () => {
        setError('');
        setActiveStep(0);
    };

    const handleSubmit = async () => {
        setError('');

        if (!validateStep2()) {
            return;
        }

        setLoading(true);

        try {
            // Combine selected options with custom inputs
            const dietaryPrefsArray = [...selectedDietaryPrefs];
            if (selectedDietaryPrefs.includes('Other') && customDietaryPref.trim()) {
                dietaryPrefsArray.push(customDietaryPref.trim());
            }
            const dietaryPrefsString = dietaryPrefsArray.filter(p => p !== 'Other').join(', ');

            const allergiesArray = [...selectedAllergies];
            if (selectedAllergies.includes('Other') && customAllergy.trim()) {
                allergiesArray.push(customAllergy.trim());
            }
            const allergiesString = allergiesArray.filter(a => a !== 'Other').join(', ');

            await api.put('/profile/', {
                age: parseInt(age),
                height: parseFloat(height),
                weight: parseFloat(weight),
                goals: goals.trim(),
                dietary_prefs: dietaryPrefsString,
                allergies: allergiesString,
            });

            // Redirect to pending approval or dashboard
            navigate('/pending-approval');
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.detail || 'Failed to save profile. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Tell us about yourself
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
                            This information helps us create personalized nutrition plans for you.
                        </Typography>

                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Age"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="e.g., 25"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CakeIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                fullWidth
                                label="Height"
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="e.g., 170"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <HeightIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Typography variant="body2" color="textSecondary">cm</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                fullWidth
                                label="Current Weight"
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="e.g., 70"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MonitorWeightIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Typography variant="body2" color="textSecondary">kg</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Stack>
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Your health goals & preferences
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
                            Help us understand your dietary needs and health objectives.
                        </Typography>

                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Health Goals"
                                multiline
                                rows={3}
                                value={goals}
                                onChange={(e) => setGoals(e.target.value)}
                                placeholder="e.g., Lose 10kg, Build muscle, Improve energy levels"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />

                            <FormControl fullWidth>
                                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Dietary Preferences (Optional)</FormLabel>
                                <Autocomplete
                                    multiple
                                    options={DIETARY_PREFERENCES}
                                    value={selectedDietaryPrefs}
                                    onChange={(_, newValue) => setSelectedDietaryPrefs(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select your dietary preferences"
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option}
                                                {...getTagProps({ index })}
                                                sx={{ borderRadius: 1.5 }}
                                            />
                                        ))
                                    }
                                />
                                {selectedDietaryPrefs.includes('Other') && (
                                    <TextField
                                        fullWidth
                                        label="Specify Other Dietary Preference"
                                        value={customDietaryPref}
                                        onChange={(e) => setCustomDietaryPref(e.target.value)}
                                        placeholder="e.g., Intermittent Fasting"
                                        sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                )}
                            </FormControl>

                            <FormControl fullWidth>
                                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Allergies & Restrictions (Optional)</FormLabel>
                                <Autocomplete
                                    multiple
                                    options={COMMON_ALLERGIES}
                                    value={selectedAllergies}
                                    onChange={(_, newValue) => setSelectedAllergies(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select your allergies"
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option}
                                                {...getTagProps({ index })}
                                                color="error"
                                                variant="outlined"
                                                sx={{ borderRadius: 1.5 }}
                                            />
                                        ))
                                    }
                                />
                                {selectedAllergies.includes('Other') && (
                                    <TextField
                                        fullWidth
                                        label="Specify Other Allergy"
                                        value={customAllergy}
                                        onChange={(e) => setCustomAllergy(e.target.value)}
                                        placeholder="e.g., Sulfites, Nightshades"
                                        sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                )}
                            </FormControl>
                        </Stack>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
            py: 8
        }}>
            <Container component="main" maxWidth="md" sx={{ mx: 'auto' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 5,
                            width: '100%',
                            borderRadius: 4,
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                            <Box
                                component="img"
                                src={logo}
                                alt="NourishLab Logo"
                                sx={{
                                    height: 60,
                                    width: 'auto',
                                    mb: 2,
                                    filter: theme.palette.mode === 'dark' ? 'invert(1) brightness(2)' : 'none'
                                }}
                            />
                            <Typography component="h1" variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                                Complete Your Profile
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                Just a few more details to get started
                            </Typography>
                        </Box>

                        <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                        {renderStepContent()}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                variant="outlined"
                                sx={{ borderRadius: 2, px: 4 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    startIcon={<CheckCircleIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Complete Profile'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleNext}
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default CompleteProfile;
