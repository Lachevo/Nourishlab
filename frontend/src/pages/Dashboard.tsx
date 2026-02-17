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
    Container,
    Avatar,
    useTheme,
    alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SocialFeed from '../components/SocialFeed';
import { Line } from 'react-chartjs-2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlagIcon from '@mui/icons-material/Flag';
import ChatIcon from '@mui/icons-material/Chat';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ScienceIcon from '@mui/icons-material/Science';

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
import type { User, MealPlan, FoodLog, Message } from '../types';

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
    const { user } = useAuth();
    const navigate = useNavigate();
    const [_latestMealPlan, setLatestMealPlan] = useState<MealPlan | null>(null);
    const [weightHistory, setWeightHistory] = useState<any[]>([]);
    const [recentLogs, setRecentLogs] = useState<FoodLog[]>([]);
    const [recentMessages, setRecentMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mealPlansRes, historyRes, logsRes, msgsRes] = await Promise.all([
                    api.get('/meal-plans/?limit=1'),
                    api.get('/weight-history/'),
                    api.get('/food-logs/?limit=3'),
                    api.get('/messages/?limit=3')
                ]);

                const plans = Array.isArray(mealPlansRes.data) ? mealPlansRes.data : mealPlansRes.data.results;
                if (plans && plans.length > 0) {
                    setLatestMealPlan(plans[0]);
                }

                setWeightHistory(historyRes.data || []);
                setRecentLogs(logsRes.data || []);
                setRecentMessages(msgsRes.data || []);

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
                        Welcome back, {user?.username}! Here's what's happening.
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {/* Stats & Progress */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mr: 1.5 }}>
                                            <TrendingUpIcon />
                                        </Avatar>
                                        <Typography color="textSecondary" variant="subtitle2" fontWeight={700}>CURRENT STATUS</Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight={800} color="primary">
                                        {user?.profile?.weight || '--'} <Typography component="span" variant="h6">kg</Typography>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">Current Weight</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', mr: 1.5 }}>
                                            <FlagIcon />
                                        </Avatar>
                                        <Typography color="textSecondary" variant="subtitle2" fontWeight={700}>ACTIVE GOAL</Typography>
                                    </Box>
                                    <Typography variant="h6" fontWeight={700} noWrap>
                                        {user?.profile?.goals || 'Set your goals'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">Personal Target</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                    <Typography variant="h6" fontWeight={700}>Weight Journey</Typography>
                                    <Button size="small" onClick={() => navigate('/weekly-updates')}>Log Progress</Button>
                                </Box>
                                <Box sx={{ height: 260 }}>
                                    <Line data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right Sidebar - Social & Community */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <SocialFeed />
                </Grid>

                {/* Feature Widgets Row */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', mr: 1.5 }}>
                                    <ChatIcon />
                                </Avatar>
                                <Typography variant="h6" fontWeight={700}>Messages</Typography>
                            </Box>
                            {recentMessages.length > 0 ? (
                                <Box sx={{ mb: 2 }}>
                                    {recentMessages.map(m => (
                                        <Box key={m.id} sx={{ mb: 1.5 }}>
                                            <Typography variant="body2" noWrap fontWeight={600}>{m.sender}: {m.content}</Typography>
                                            <Typography variant="caption" color="textSecondary">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>No recent messages.</Typography>
                            )}
                        </CardContent>
                        <CardActions>
                            <Button fullWidth onClick={() => navigate('/messages')}>Chat with Nutritionist</Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', mr: 1.5 }}>
                                    <FastfoodIcon />
                                </Avatar>
                                <Typography variant="h6" fontWeight={700}>Food Journal</Typography>
                            </Box>
                            {recentLogs.length > 0 ? (
                                <Box>
                                    {recentLogs.map(l => (
                                        <Box key={l.id} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">{l.meal_type}</Typography>
                                            <Typography variant="caption" color="textSecondary">{l.date}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Log your meals today!</Typography>
                            )}
                        </CardContent>
                        <CardActions>
                            <Button fullWidth variant="outlined" onClick={() => navigate('/food-log')}>View Journal</Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main', mr: 1.5 }}>
                                    <ScienceIcon />
                                </Avatar>
                                <Typography variant="h6" fontWeight={700}>Lab Results</Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Keep track of your blood work and documents.</Typography>
                        </CardContent>
                        <CardActions>
                            <Button fullWidth onClick={() => navigate('/lab-results')}>Manage Documents</Button>
                        </CardActions>
                    </Card>
                </Grid>

            </Grid>
        </Box>
    );
};

export default Dashboard;
