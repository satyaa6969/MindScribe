import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
} from 'chart.js';
import NewEntryForm from './NewEntryForm'; // <-- IMPORT THE NEW FORM

// Register all the chart components we need
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

// This component expects the 'token' to be passed as a prop
const Dashboard = ({ token }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 1. fetchStats is now in the main component scope
    const fetchStats = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';;

            const response = await axios.get(`${API_URL}/api/dashboard-stats/`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            setStats(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch stats. Please log in again.');
            setLoading(false);
        }
    };

    // 2. useEffect now just calls fetchStats on load
    useEffect(() => {
        fetchStats();
    }, [token]);

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!stats) {
        return <div>No stats available.</div>;
    }

    // --- Prepare Data for Charts ---

    // Data for the Mood Pie Chart
    const pieChartData = {
        labels: stats.mood_counts.map(item => item.mood),
        datasets: [
            {
                label: 'Mood Count',
                data: stats.mood_counts.map(item => item.count),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Positive (Greenish)
                    'rgba(255, 99, 132, 0.6)', // Negative (Reddish)
                    'rgba(201, 203, 207, 0.6)', // Neutral (Grey)
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(201, 203, 207, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Data for the Sentiment Trend Line Chart
    const lineChartData = {
        labels: stats.sentiment_trend.map(item => new Date(item.day).toLocaleDateString()),
        datasets: [
            {
                label: 'Average Sentiment Score',
                data: stats.sentiment_trend.map(item => item.average_score),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    // Chart options
    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
    };

    return (
        <div className="dashboard-grid">
            {/* Row 1 */}
            <div className="card">
                <h3>Total Entries</h3>
                <p className="stat-number">{stats.total_entries}</p>
            </div>

            <div className="card large-card"> {/* Spans 2 cols */}
                <h3>Mood Distribution</h3>
                <div style={{ height: '300px' }}> {/* Container for chart size */}
                    <Pie data={pieChartData} options={chartOptions} />
                </div>
            </div>

            {/* Row 2 */}
            <div className="card full-width-card"> {/* Spans full 3 cols */}
                <h3>Sentiment Trend</h3>
                <div style={{ height: '300px' }}> {/* Container for chart size */}
                    <Line data={lineChartData} options={chartOptions} />
                </div>
            </div>

            {/* Row 3 - NEW FORM */}
            <div className="card full-width-card">
                <NewEntryForm token={token} onEntryAdded={fetchStats} />
            </div>

            {/* Row 4 - Recent Entries */}
            <div className="card full-width-card">
                <h3>Recent Entries</h3>
                <ul className="entry-list">
                    {stats.recent_entries.map(entry => (
                        <li key={entry.id}>
                            <strong>{new Date(entry.created_at).toLocaleDateString()}</strong>
                            <p>{entry.content}</p>
                            <span>Mood: {entry.mood} (Score: {entry.sentiment_score.toFixed(3)})</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;