import React from 'react';
import { Card, CardContent, Typography, Box, Button, Grid } from '@mui/material';
import { Add, Person, Restaurant, Science, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
    const navigate = useNavigate();

    const actions = [
        {
            icon: <Person />,
            label: 'View All Patients',
            color: '#667eea',
            action: () => navigate('/nutritionist')
        },
        {
            icon: <Add />,
            label: 'Create Meal Plan',
            color: '#43e97b',
            action: () => {
                // This will be handled by selecting a patient first
                alert('Please select a patient to create a meal plan');
            }
        },
        {
            icon: <TrendingUp />,
            label: 'View Progress',
            color: '#f093fb',
            action: () => navigate('/nutritionist')
        },
        {
            icon: <Science />,
            label: 'Lab Results',
            color: '#4facfe',
            action: () => navigate('/nutritionist')
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
