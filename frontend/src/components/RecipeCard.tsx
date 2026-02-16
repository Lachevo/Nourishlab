import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, alpha, useTheme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import type { Recipe } from '../types';
import { getMediaUrl } from '../utils';

interface RecipeCardProps {
    recipe: Recipe;
    onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
    const theme = useTheme();

    return (
        <Card
            onClick={onClick}
            sx={{
                maxWidth: 345,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': onClick ? {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
                } : {}
            }}
        >
            {recipe.image && (
                <CardMedia
                    component="img"
                    height="180"
                    image={getMediaUrl(recipe.image)}
                    alt={recipe.title}
                />
            )}
            <CardContent>
                <Typography gutterBottom variant="h6" component="div" fontWeight={700}>
                    {recipe.title}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 1.5, color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {recipe.prep_time_minutes}m
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                        <LocalFireDepartmentIcon sx={{ fontSize: 16, mr: 0.5, color: theme.palette.error.main }} />
                        {recipe.calories} kcal
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {recipe.tags?.split(',').map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag.trim()}
                            size="small"
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.main',
                                fontWeight: 500,
                                fontSize: '0.75rem'
                            }}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default RecipeCard;
