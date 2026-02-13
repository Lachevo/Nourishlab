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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
import type { Profile, MealPlan, WeeklyUpdate } from '../types';

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
    const [profile, setProfile] = useState<Profile | null>(null);
    const [latestMealPlan, setLatestMealPlan] = useState<MealPlan | null>(null);
    const [updates, setUpdates] = useState<WeeklyUpdate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, mealPlansRes, updatesRes] = await Promise.all([
                    api.get('/profile/'),
                    api.get('/meal-plans/?limit=1'), // Assuming backend supports pagination or ordering
                    api.get('/weekly-updates/'),
                ]);

                setProfile(profileRes.data.profile || profileRes.data); // Adjust based on serializer structure
                // Meal plans might be list or paginated result
                const plans = Array.isArray(mealPlansRes.data) ? mealPlansRes.data : mealPlansRes.data.results;
                if (plans && plans.length > 0) {
                    setLatestMealPlan(plans[0]);
                }

                const updatesData = Array.isArray(updatesRes.data) ? updatesRes.data : updatesRes.data.results;
                setUpdates(updatesData || []);

            } catch (error) {
                console.error('Error fetching dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    if (loading) return <Typography>Loading Dashboard...</Typography>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Welcome back!
            </Typography>

            <Grid container spacing={3}>
                {/* Profile Summary */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Current Stats
                            </Typography>
                            <Typography variant="h5" component="div">
                                {profile?.weight ? `${profile.weight} kg` : 'N/A'}
                            </Typography>
                            <Typography color="textSecondary">
                                Current Weight
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Typography variant="body2">
                                Goal: {profile?.goals || 'Not set'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/profile')}>Edit Profile</Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Meal Plan Summary */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Current Meal Plan
                            </Typography>
                            {latestMealPlan ? (
                                <>
                                    <Typography variant="h6">
                                        {latestMealPlan.start_date} - {latestMealPlan.end_date}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Check your plan for today's meals.
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body1">
                                    No active meal plan found.
                                </Typography>
                            )}
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/meal-plans')}>View Plans</Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Quick Action */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <CardContent>
                            <Button variant="contained" color="primary" onClick={() => navigate('/weekly-updates')}>
                                Log Weekly Update
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Weight Chart */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Weight History</Typography>
                        {updates.length > 0 ? (
                            <Box sx={{ height: 300 }}>
                                <Line data={chartData} options={{ maintainAspectRatio: false }} />
                            </Box>
                        ) : (
                            <Typography>No updates logged yet.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
