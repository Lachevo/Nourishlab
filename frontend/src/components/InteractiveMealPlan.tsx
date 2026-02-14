import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Tabs, Tab, useTheme, alpha } from '@mui/material';
import type { MealPlan, Recipe } from '../types';
import RecipeCard from './RecipeCard';

interface InteractiveMealPlanProps {
    plan: MealPlan;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

// Mock recipe for visualization until real data connection
const MOCK_RECIPE: Recipe = {
    id: 1,
    title: 'Avocado Toast with Poached Egg',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    prep_time_minutes: 10,
    calories: 350,
    protein_g: 12,
    carbs_g: 25,
    fat_g: 18,
    ingredients: 'Bread\nAvocado\nEgg',
    instructions: 'Toast bread. Mash avocado. Poach egg. Assemble.',
    tags: 'Vegetarian, Breakfast',
    servings: 1
};

const InteractiveMealPlan: React.FC<InteractiveMealPlanProps> = ({ plan: _plan }) => {
    const theme = useTheme();
    const [selectedDay, setSelectedDay] = useState(0);

    const handleDayChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedDay(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={selectedDay}
                    onChange={handleDayChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="meal plan days"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            minWidth: 100
                        }
                    }}
                >
                    {DAYS.map((day, _index) => (
                        <Tab key={day} label={day} />
                    ))}
                </Tabs>
            </Box>

            <Grid container spacing={3}>
                {MEAL_TYPES.map((mealType) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={mealType}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                height: '100%',
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                borderRadius: 3,
                                bgcolor: alpha(theme.palette.background.paper, 0.5)
                            }}
                        >
                            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
                                {mealType}
                            </Typography>

                            {/* Placeholder functionality - retrieve from plan.structured_plan later */}
                            <RecipeCard recipe={MOCK_RECIPE} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default InteractiveMealPlan;
