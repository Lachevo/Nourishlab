import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { MealPlan } from '../types';
import DOMPurify from 'dompurify';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MealPlans: React.FC = () => {
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMealPlans();
    }, []);

    const fetchMealPlans = async () => {
        try {
            const response = await api.get('/meal-plans/');
            setMealPlans(Array.isArray(response.data) ? response.data : response.data.results);
        } catch (error) {
            console.error('Failed to fetch meal plans', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Typography>Loading Meal Plans...</Typography>;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                My Meal Plans
            </Typography>

            {mealPlans.length === 0 ? (
                <Typography>No meal plans assigned yet.</Typography>
            ) : (
                mealPlans.map((plan) => (
                    <Accordion key={plan.id} defaultExpanded={mealPlans.indexOf(plan) === 0}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">
                                Plan: {plan.start_date} to {plan.end_date}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box
                                sx={{
                                    '& h2': { fontSize: '1.5rem', mb: 1 },
                                    '& ul': { pl: 2, mb: 2 },
                                    '& p': { mb: 1 },
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(plan.content),
                                }}
                            />
                            <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 2 }}>
                                Created: {new Date(plan.created_at).toLocaleDateString()}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Container>
    );
};

export default MealPlans;
