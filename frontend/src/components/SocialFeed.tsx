import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
    Box,
    Chip,
    alpha,
    useTheme,
} from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import GroupIcon from '@mui/icons-material/Group';
import api from '../services/api';

interface SocialProgress {
    username: string;
    weight_lost: number;
    current_weight: number;
    date: string;
}

const SocialFeed: React.FC = () => {
    const theme = useTheme();
    const [feed, setFeed] = useState<SocialProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSocialProgress = async () => {
            try {
                const response = await api.get('/social-progress/');
                setFeed(response.data);
            } catch (error) {
                console.error('Error fetching social feed', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSocialProgress();
    }, []);

    if (loading) return null;
    if (feed.length === 0) return null;

    return (
        <Card sx={{ height: '100%', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', mr: 1, width: 32, height: 32 }}>
                            <GroupIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="h6" fontWeight={700}>
                            Community
                        </Typography>
                    </Box>
                    <Chip
                        label="Live"
                        color="error"
                        size="small"
                        sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            '& .MuiChip-label': { px: 1 }
                        }}
                    />
                </Box>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Recent achievements from fellow members
                </Typography>

                <List sx={{ width: '100%', p: 0 }}>
                    {feed.map((item, index) => (
                        <React.Fragment key={item.username}>
                            <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                                <ListItemAvatar>
                                    <Avatar sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: 'primary.main',
                                        fontWeight: 700,
                                        fontSize: '0.875rem'
                                    }}>
                                        {item.username[0].toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle2" fontWeight={700}>{item.username}</Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: 'success.main',
                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                px: 1,
                                                py: 0.25,
                                                borderRadius: 1,
                                            }}>
                                                <TrendingDownIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                                <Typography variant="caption" fontWeight={800}>
                                                    {item.weight_lost} kg
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < feed.length - 1 && <Divider component="li" sx={{ opacity: 0.5 }} />}
                        </React.Fragment>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default SocialFeed;
