import React, { useMemo } from 'react';
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
    Filler,
} from 'chart.js';

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

export default function LinesChart() {
    const chartData = useMemo(() => ({
        labels: ["Funciones", "Variables", "Arrays", "Bucles", "Condicionales", "Objetos", "Async", "Algoritmos"],
        datasets: [
            {
                label: 'Rendimiento (%)',
                data: [85, 70, 60, 90, 80, 55, 45, 65],
                tension: 0.4,
                fill: true,
                borderColor: '#155dfc',
                backgroundColor: 'rgba(21, 93, 252, 0.1)',
                pointRadius: 6,
                pointBorderColor: '#155dfc',
                pointBackgroundColor: '#ffffff',
                pointBorderWidth: 3,
                pointHoverRadius: 8,
            },
            {
                label: 'Promedio Esperado',
                data: [75, 75, 75, 75, 75, 75, 75, 75],
                tension: 0.2,
                fill: false,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                pointRadius: 4,
                pointBorderColor: '#10b981',
                pointBackgroundColor: '#ffffff',
                borderDash: [5, 5],
            },
        ],
    }), []);

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
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
                        return `${context.dataset.label}: ${context.parsed.y}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    },
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 45,
                    font: {
                        size: 11
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        elements: {
            line: {
                borderWidth: 3,
            }
        }
    }), []);

    return <Line data={chartData} options={chartOptions} />;
}