import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PiesChart() {
    const chartData = useMemo(() => ({
        labels: ['Respuestas Correctas', 'Respuestas Incorrectas'],
        datasets: [
            {
                label: 'Distribución de Respuestas',
                data: [70, 30],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
                hoverBackgroundColor: [
                    'rgba(16, 185, 129, 0.9)',
                    'rgba(239, 68, 68, 0.9)',
                ],
                hoverBorderWidth: 3,
            },
        ],
    }), []);

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        elements: {
            arc: {
                borderWidth: 2,
            }
        },
        cutout: 0,
        radius: '80%',
    }), []);

    return <Pie data={chartData} options={chartOptions} />;
}