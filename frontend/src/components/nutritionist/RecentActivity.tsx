import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    Restaurant,
    TrendingUp,
    Science,
    AccessTime
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Activity {
    type: 'food_log' | 'weekly_update' | 'lab_result';
    patient: string;
    patient_id: number;
    content: string;
    timestamp: string;
    date: string;
}

const RecentActivity: React.FC = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await api.get('/nutritionist/recent-activity/');
            setActivities(response.data);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'food_log':
                return <Restaurant />;
            case 'weekly_update':
                return <TrendingUp />;
            case 'lab_result':
                return <Science />;
            default:
                return <AccessTime />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'food_log':
                return '#4facfe';
            case 'weekly_update':
                return '#43e97b';
            case 'lab_result':
                return '#f093fb';
            default:
                return '#667eea';
        }
    };

    const getActivityLabel = (type: string) => {
        switch (type) {
            case 'food_log':
                return 'Food Log';
            case 'weekly_update':
                return 'Progress Update';
            case 'lab_result':
                return 'Lab Result';
            default:
                return 'Activity';
        }
    };

    const formatTimeAgo = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Recent Activity
                </Typography>
                {activities.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={3}>
                        No recent activity
                    </Typography>
                ) : (
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {activities.map((activity, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    cursor: 'pointer',
                                    borderRadius: 2,
                                    mb: 1,
                                    '&:hover': {
                                        bgcolor: 'action.hover'
                                    }
                                }}
                                onClick={() => navigate(`/nutritionist/patients/${activity.patient_id}`)}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
                                        {getActivityIcon(activity.type)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="body1" fontWeight={600}>
                                                {activity.patient}
                                            </Typography>
                                            <Chip
                                                label={getActivityLabel(activity.type)}
                                                size="small"
                                                sx={{
                                                    bgcolor: getActivityColor(activity.type),
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {activity.content}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatTimeAgo(activity.timestamp)}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentActivity;
