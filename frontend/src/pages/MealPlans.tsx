import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { MealPlan } from '../types';
import { getMediaUrl } from '../utils';
import DOMPurify from 'dompurify';
import {
    Container,
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Stack,
    Divider,
    Paper,
    alpha,
    useTheme,
    Chip,
    Avatar,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import DateRangeIcon from '@mui/icons-material/DateRange';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../assets/logo.jpg';

const MealPlans: React.FC = () => {
    const theme = useTheme();
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

    const downloadPDF = async (plan: MealPlan) => {
        const element = document.getElementById(`meal-plan-${plan.id}`);
        if (!element) return;

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`MealPlan_${plan.start_date}_to_${plan.end_date}.pdf`);
    };

    const downloadImage = async (plan: MealPlan) => {
        const element = document.getElementById(`meal-plan-${plan.id}`);
        if (!element) return;

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `MealPlan_${plan.start_date}_to_${plan.end_date}.png`;
        link.click();
    };

    if (loading) return (
        <Container sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">Loading your personalized plans...</Typography>
        </Container>
    );

    return (
        <Box sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mr: 2 }}>
                        <MenuBookIcon />
                    </Avatar>
                    <Typography variant="h4" fontWeight={800}>
                        My Meal Plans
                    </Typography>
                </Box>
                <Typography variant="body1" color="textSecondary">
                    View and download your personalized nutrition guides.
                </Typography>
            </Box>

            {mealPlans.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.02), border: `1px dashed ${theme.palette.divider}` }}>
                    <RestaurantIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>No meal plans assigned yet</Typography>
                    <Typography variant="body2" color="textSecondary">Your personalized meal plans will appear here once assigned by your nutritionist.</Typography>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {mealPlans.map((plan, index) => (
                        <Accordion
                            key={plan.id}
                            defaultExpanded={index === 0}
                            sx={{
                                '&:hover': {
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                }
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{ px: 3, py: 1 }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mr: 2 }}>
                                        <CalendarTodayIcon sx={{ fontSize: 20 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {new Date(plan.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} — {new Date(plan.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary" fontWeight={600}>
                                            PLAN #{plan.id}
                                        </Typography>
                                    </Box>
                                    {index === 0 && (
                                        <Chip
                                            label="Active"
                                            color="primary"
                                            size="small"
                                            sx={{ ml: 'auto', mr: 2, height: 24, fontWeight: 700 }}
                                        />
                                    )}
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 4, pt: 0 }}>
                                <Divider sx={{ mb: 3 }} />

                                <Paper
                                    id={`meal-plan-${plan.id}`}
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        bgcolor: '#ffffff',
                                        borderRadius: 4,
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        fontFamily: theme.typography.fontFamily
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                                        <Box>
                                            <Box
                                                component="img"
                                                src={logo}
                                                alt="NourishLab Logo"
                                                sx={{ height: 48, mb: 1 }}
                                            />
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <LocalDiningIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="overline" color="textSecondary" fontWeight={800} sx={{ letterSpacing: '0.1em', display: 'block' }}>
                                                    Nutrition Strategy
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 0.5 }}>
                                                <DateRangeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.primary' }} />
                                                <Typography variant="body2" fontWeight={700}>
                                                    Valid: {plan.start_date} to {plan.end_date}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="textSecondary">
                                                Generated for your specific goals
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            color: 'text.primary',
                                            '& h2': {
                                                fontSize: '1.25rem',
                                                fontWeight: 800,
                                                mt: 4,
                                                mb: 2,
                                                color: 'primary.main',
                                                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                pb: 1,
                                                display: 'inline-block'
                                            },
                                            '& ul': { pl: 2.5, mb: 3 },
                                            '& li': { mb: 1.5, lineHeight: 1.6 },
                                            '& p': { mb: 2, lineHeight: 1.6, color: 'text.secondary' },
                                            '& strong': { color: 'text.primary', fontWeight: 700 },
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(plan.content || ''),
                                        }}
                                    />

                                    {/* Image-based Meal Plan Display */}
                                    {plan.file && (plan.file.toLowerCase().endsWith('.jpg') || plan.file.toLowerCase().endsWith('.jpeg') || plan.file.toLowerCase().endsWith('.png') || plan.file.toLowerCase().endsWith('.gif') || plan.file.toLowerCase().endsWith('.webp')) && (
                                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Meal Plan Image
                                            </Typography>
                                            <Box
                                                component="img"
                                                src={getMediaUrl(plan.file)}
                                                alt="Meal Plan"
                                                sx={{
                                                    maxWidth: '100%',
                                                    maxHeight: 600,
                                                    borderRadius: 2,
                                                    boxShadow: 3,
                                                    mb: 2
                                                }}
                                            />
                                            <Button
                                                component="a"
                                                variant="contained"
                                                color="secondary"
                                                href={getMediaUrl(plan.file)}
                                                download
                                                target="_blank"
                                                startIcon={<ImageIcon />}
                                            >
                                                Download Image Plan
                                            </Button>
                                        </Box>
                                    )}

                                    <Box sx={{ mt: 6, pt: 3, borderTop: `1px dashed ${theme.palette.divider}`, textAlign: 'center' }}>
                                        <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                                            Adjust portions based on your hunger levels and progress. Stay hydrated!
                                        </Typography>
                                    </Box>
                                </Paper>

                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<PictureAsPdfIcon />}
                                            onClick={() => downloadPDF(plan)}
                                            sx={{ boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }}
                                        >
                                            Export PDF
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<ImageIcon />}
                                            onClick={() => downloadImage(plan)}
                                        >
                                            Save as Image
                                        </Button>
                                    </Stack>

                                    <Typography variant="caption" color="textSecondary" fontWeight={600}>
                                        CREATED ON {new Date(plan.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </Typography>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default MealPlans;
