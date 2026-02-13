import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Divider,
    Container,
    Avatar,
    useTheme,
    alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SocialFeed from '../components/SocialFeed';
import { Line } from 'react-chartjs-2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FlagIcon from '@mui/icons-material/Flag';
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
import type { User, MealPlan } from '../types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [latestMealPlan, setLatestMealPlan] = useState<MealPlan | null>(null);
    const [weightHistory, setWeightHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, mealPlansRes, historyRes] = await Promise.all([
                    api.get('/profile/'),
                    api.get('/meal-plans/?limit=1'),
                    api.get('/weight-history/'),
                ]);

                setUser(profileRes.data);

                const plans = Array.isArray(mealPlansRes.data) ? mealPlansRes.data : mealPlansRes.data.results;
                if (plans && plans.length > 0) {
                    setLatestMealPlan(plans[0]);
                }

                setWeightHistory(historyRes.data || []);

            } catch (error) {
                console.error('Error fetching dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const theme = useTheme();

    const chartData = {
        labels: weightHistory.map(u => u.date),
        datasets: [
            {
                label: 'Weight (kg)',
                data: weightHistory.map(u => u.current_weight),
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: theme.palette.primary.main,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: theme.palette.primary.main,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
                yAxisID: 'y',
            },
            // Add BMI Dataset if height is available
            ...(user?.profile?.height ? [{
                label: 'BMI',
                data: weightHistory.map(u => {
                    const heightInMeters = (user?.profile?.height || 0) / 100;
                    return heightInMeters > 0 ? Number((u.current_weight / (heightInMeters * heightInMeters)).toFixed(1)) : null;
                }),
                borderColor: theme.palette.secondary.main,
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
                yAxisID: 'y1',
            }] : []),
        ],
    };

    if (loading) return (
        <Container sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">Transforming your experience...</Typography>
        </Container>
    );

    return (
        <Box sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', mb: 0.5 }}>
                        Dashboard
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Welcome back! Here's your progress overview.
                    </Typography>
                </Box>
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'primary.main',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
            </Box>

            <Grid container spacing={4}>
                {/* Profile Summary */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.12)'
                        }
                    }}>
                        <Box sx={{
                            position: 'absolute',
                            top: -20,
                            right: -20,
                            opacity: 0.05,
                            transform: 'rotate(-15deg)'
                        }}>
                            <TrendingUpIcon sx={{ fontSize: 120 }} />
                        </Box>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', mr: 1.5 }}>
                                    <TrendingUpIcon />
                                </Avatar>
                                <Typography color="textSecondary" variant="subtitle2" fontWeight={700} textTransform="uppercase" letterSpacing="0.05em">
                                    Current Stats
                                </Typography>
                            </Box>

                            <Typography variant="h3" fontWeight={800} color="primary" sx={{ my: 1, letterSpacing: '-0.02em' }}>
                                {user?.profile?.weight ? `${user.profile.weight} kg` : 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" fontWeight={500}>
                                Starting Weight
                            </Typography>

                            <Divider sx={{ my: 2.5, opacity: 0.6 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: alpha(theme.palette.background.default, 0.5), p: 1, borderRadius: 2 }}>
                                <FlagIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" fontWeight={500}>
                                    Goal: <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>{user?.profile?.goals || 'Not set'}</Box>
                                </Typography>
                            </Box>
                        </CardContent>
                        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate('/profile')}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderWidth: '1.5px',
                                    '&:hover': { borderWidth: '1.5px' }
                                }}
                            >
                                Update Profile
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Meal Plan Summary */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{
                            position: 'absolute',
                            top: -20,
                            right: -20,
                            opacity: 0.05,
                            transform: 'rotate(-15deg)'
                        }}>
                            <RestaurantMenuIcon sx={{ fontSize: 120 }} />
                        </Box>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', mr: 1.5 }}>
                                    <RestaurantMenuIcon />
                                </Avatar>
                                <Typography color="textSecondary" variant="subtitle2" fontWeight={600} textTransform="uppercase">
                                    Meal Plan
                                </Typography>
                            </Box>

                            {latestMealPlan ? (
                                <>
                                    <Typography variant="h5" fontWeight={700} sx={{ mt: 1, mb: 0.5 }}>
                                        Active Plan
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                        {latestMealPlan.start_date} — {latestMealPlan.end_date}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), p: 1.5, borderRadius: 2 }}>
                                        Don't forget to check your meals for today!
                                    </Typography>
                                </>
                            ) : (
                                <Box sx={{ py: 3, textAlign: 'center' }}>
                                    <Typography variant="body2" color="textSecondary">
                                        No active meal plan found.
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/meal-plans')}
                            >
                                View My Plans
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Quick Action */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                        border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                        boxShadow: 'none',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            borderStyle: 'solid',
                        }
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', mb: 2, mx: 'auto', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)' }}>
                                <AssessmentIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Track Progress
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                Log your weekly weight and notes to see your progress journey.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                onClick={() => navigate('/weekly-updates')}
                            >
                                New Weekly Update
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Weight Chart */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{
                        p: 3,
                        height: '100%',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                    }}>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" fontWeight={700}>Weight Progress Journey</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), px: 1.5, py: 0.5, borderRadius: 10, fontWeight: 600 }}>
                                {weightHistory.length} ENTRIES
                            </Typography>
                        </Box>

                        {weightHistory.length > 0 ? (
                            <Box sx={{ height: 380 }}>
                                <Line
                                    data={chartData}
                                    options={{
                                        maintainAspectRatio: false,
                                        interaction: {
                                            intersect: false,
                                            mode: 'index',
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: false,
                                                grid: {
                                                    color: alpha(theme.palette.divider, 0.05),
                                                },
                                                ticks: {
                                                    font: {
                                                        weight: 600,
                                                    }
                                                }
                                            },
                                            y1: { // BMI Axis
                                                position: 'right',
                                                beginAtZero: false,
                                                grid: {
                                                    drawOnChartArea: false,
                                                },
                                                ticks: {
                                                    callback: function (value) {
                                                        return 'BMI ' + value;
                                                    }
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    display: false,
                                                },
                                                ticks: {
                                                    font: {
                                                        weight: 600,
                                                    }
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'top',
                                                align: 'end',
                                                labels: {
                                                    usePointStyle: true,
                                                    boxWidth: 8,
                                                }
                                            },
                                            tooltip: {
                                                padding: 12,
                                                backgroundColor: theme.palette.background.paper,
                                                titleColor: theme.palette.text.primary,
                                                bodyColor: theme.palette.text.secondary,
                                                borderColor: theme.palette.divider,
                                                borderWidth: 1,
                                                displayColors: false,
                                                titleFont: { weight: 700, size: 14 },
                                                bodyFont: { size: 13 },
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        ) : (
                            <Box sx={{ height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${theme.palette.divider}`, borderRadius: 3 }}>
                                <Typography color="textSecondary" fontWeight={500}>No weight entries found. Start by logging your first update!</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Social Feed */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <SocialFeed />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
