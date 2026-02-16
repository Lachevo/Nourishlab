import React from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { Add, Science, TrendingUp, CheckCircle, Fastfood, Chat } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
    const navigate = useNavigate();

    const actions = [
        {
            icon: <CheckCircle />,
            label: 'Pending Approvals',
            color: '#f5576c',
            action: () => navigate('/nutritionist/approvals')
        },
        {
            icon: <Add />,
            label: 'Create Meal Plan',
            color: '#43e97b',
            action: () => navigate('/nutritionist/create-meal-plan')
        },
        {
            icon: <TrendingUp />,
            label: 'Client Updates',
            color: '#f093fb',
            action: () => navigate('/nutritionist/weekly-updates')
        },
        {
            icon: <Fastfood />,
            label: 'Food Journals',
            color: '#fa709a',
            action: () => navigate('/nutritionist/food-journals')
        },
        {
            icon: <Science />,
            label: 'Lab Results',
            color: '#4facfe',
            action: () => navigate('/nutritionist/lab-results')
        },
        {
            icon: <Chat />,
            label: 'Messages',
            color: '#667eea',
            action: () => navigate('/messages')
        }
    ];

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    {actions.map((action, index) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={index}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={action.icon}
                                onClick={action.action}
                                sx={{
                                    py: 1.5,
                                    borderColor: action.color,
                                    color: action.color,
                                    '&:hover': {
                                        borderColor: action.color,
                                        bgcolor: `${action.color}10`
                                    }
                                }}
                            >
                                {action.label}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default QuickActions;
