import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  // Mock data for demonstration
  const mockStats = {
    school_id: 1,
    period: {
      start_date: '2023-01-01',
      end_date: '2023-12-31'
    },
    active_students_count: 125,
    emotion_distribution: [
      { emotion_name: 'радость', percentage: 25.5 },
      { emotion_name: 'грусть', percentage: 18.2 },
      { emotion_name: 'гнев', percentage: 12.3 },
      { emotion_name: 'страх', percentage: 8.7 },
      { emotion_name: 'спокойствие', percentage: 15.4 },
      { emotion_name: 'удивление', percentage: 7.2 },
      { emotion_name: 'вина', percentage: 6.8 },
      { emotion_name: 'стыд', percentage: 5.9 }
    ],
    average_intensity: 5.8,
    popular_tags: [
      { tag_name: 'учёба', count: 89, percentage: 32.1 },
      { tag_name: 'друзья', count: 67, percentage: 24.5 },
      { tag_name: 'семья', count: 52, percentage: 18.9 },
      { tag_name: 'здоровье', count: 38, percentage: 13.8 },
      { tag_name: 'хобби', count: 25, percentage: 9.1 },
      { tag_name: 'будущее', count: 18, percentage: 6.6 },
      { tag_name: 'одиночество', count: 14, percentage: 5.1 }
    ]
  };

  useEffect(() => {
    // In a real app, we would fetch statistics from the API
    // For now, we'll use mock data
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, [schoolId, dateRange]);

  const handleFetchStats = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // In a real app, we would call the API here
    // For now, we'll just reload the mock data
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  };

  // Chart data configurations
  const emotionDistributionData = {
    labels: stats?.emotion_distribution.map(item => item.emotion_name) || [],
    datasets: [
      {
        label: 'Emotion Distribution (%)',
        data: stats?.emotion_distribution.map(item => item.percentage) || [],
        backgroundColor: [
          'rgba(255, 215, 0, 0.7)',    // радость - gold
          'rgba(70, 130, 180, 0.7)',   // грусть - steel blue
          'rgba(220, 20, 60, 0.7)',    // гнев - crimson
          'rgba(147, 112, 219, 0.7)',  // страх - medium purple
          'rgba(50, 205, 50, 0.7)',    // спокойствие - lime green
          'rgba(255, 165, 0, 0.7)',    // удивление - orange
          'rgba(128, 128, 128, 0.7)',  // вина - gray
          'rgba(75, 0, 130, 0.7)'      // стыд - indigo
        ],
        borderColor: [
          'rgba(255, 215, 0, 1)',
          'rgba(70, 130, 180, 1)',
          'rgba(220, 20, 60, 1)',
          'rgba(147, 112, 219, 1)',
          'rgba(50, 205, 50, 1)',
          'rgba(255, 165, 0, 1)',
          'rgba(128, 128, 128, 1)',
          'rgba(75, 0, 130, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const popularTagsData = {
    labels: stats?.popular_tags.map(item => item.tag_name) || [],
    datasets: [
      {
        label: 'Tag Frequency',
        data: stats?.popular_tags.map(item => item.count) || [],
        backgroundColor: 'rgba(67, 97, 238, 0.7)',
        borderColor: 'rgba(67, 97, 238, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Mock trend data for the line chart
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Average Mood Intensity',
        data: [5.2, 5.8, 6.1, 5.5, 5.9, 6.3, 6.0, 5.7, 5.4, 5.8, 6.2, 5.9],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Title',
      },
    },
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <p className="error-message">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="statistics-header">
        <h1>School Statistics</h1>
        <form onSubmit={handleFetchStats} className="stats-filter-form">
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="schoolId" className="form-label">School ID</label>
              <input
                type="number"
                id="schoolId"
                name="schoolId"
                className="form-input"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group half-width">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-input"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              />
            </div>
            
            <div className="form-group half-width">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-input"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary">Fetch Statistics</button>
        </form>
      </div>

      {stats && (
        <div className="statistics-content">
          <div className="stats-summary card">
            <h2>Summary</h2>
            <div className="summary-grid">
              <div className="summary-item">
                <h3>{stats.active_students_count}</h3>
                <p>Active Students</p>
              </div>
              <div className="summary-item">
                <h3>{stats.average_intensity.toFixed(1)}</h3>
                <p>Avg. Intensity</p>
              </div>
              <div className="summary-item">
                <h3>{stats.period.start_date} to {stats.period.end_date}</h3>
                <p>Reporting Period</p>
              </div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-card card">
              <h3>Emotion Distribution</h3>
              <Pie data={emotionDistributionData} options={chartOptions} />
            </div>

            <div className="chart-card card">
              <h3>Popular Tags</h3>
              <Bar data={popularTagsData} options={chartOptions} />
            </div>

            <div className="chart-card card">
              <h3>Mood Trend Over Time</h3>
              <Line data={trendData} options={chartOptions} />
            </div>
          </div>

          <div className="stats-actions">
            <button className="btn btn-outline">Export to PDF</button>
            <button className="btn btn-outline">Export to Excel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;