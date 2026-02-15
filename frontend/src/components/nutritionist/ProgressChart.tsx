import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
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
    Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface ProgressDataPoint {
    date: string;
    value: number;
}

interface ProgressChartProps {
    data: ProgressDataPoint[];
    title: string;
    color?: string;
    unit?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
    data,
    title,
    color = '#667eea',
    unit = ''
}) => {
    const chartData = {
        labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: title,
                data: data.map(d => d.value),
                borderColor: color,
                backgroundColor: `${color}20`,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold' as const
                },
                bodyFont: {
                    size: 13
                },
                callbacks: {
                    label: function (context: any) {
                        return `${context.parsed.y}${unit}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    font: {
                        size: 11
                    },
                    callback: function (value: any) {
                        return value + unit;
                    }
                }
            }
        }
    };

    if (data.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        {title}
                    </Typography>
                    <Typography color="text.secondary" textAlign="center" py={4}>
                        No data available
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    {title}
                </Typography>
                <Box sx={{ height: 250 }}>
                    <Line data={chartData} options={options} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProgressChart;
