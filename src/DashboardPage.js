// import React, { useEffect, useState } from 'react';
// import './App.css'; // We can reuse the main CSS
// import './Auth.css'; // We can reuse the auth CSS for a logout button

// // Charting Imports
// import { Bar, Line, Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS, CategoryScale, LinearScale, BarElement,
//   PointElement, LineElement, Title, Tooltip, Legend, ArcElement
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale, LinearScale, BarElement, PointElement,
//   LineElement, Title, Tooltip, Legend, ArcElement
// );

// const API_URL = 'http://34.74.243.207:5000'; // Aapka VM ka IP

// function DashboardPage() {
//   const [channelStats, setChannelStats] = useState(null);
//   const [videoStats, setVideoStats] = useState([]);
//   const [dailyMetrics, setDailyMetrics] = useState([]);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [selectedVideoId, setSelectedVideoId] = useState(null);
//   const [sentimentData, setSentimentData] = useState(null);
//   const [isSentimentLoading, setIsSentimentLoading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error("No auth token found. Please login.");
//         }

//         // For now, we are not securing the backend endpoints,
//         // but in a real app, you would send the token in the headers.

//         const channelResponse = await fetch(`${API_URL}/api/v1/channel_stats`);
//         if (!channelResponse.ok) throw new Error(`HTTP error! status: ${channelResponse.status}`);
//         const channelData = await channelResponse.json();
//         setChannelStats(channelData[0] || null);

//         const videoResponse = await fetch(`${API_URL}/api/v1/video_stats`);
//         if (!videoResponse.ok) throw new Error(`HTTP error! status: ${videoResponse.status}`);
//         const videoData = await videoResponse.json();
//         setVideoStats(videoData);

//         let dailyMetricsUrl = `${API_URL}/api/v1/daily_channel_metrics`;
//         const params = new URLSearchParams();
//         if (startDate) params.append('start_date', startDate);
//         if (endDate) params.append('end_date', endDate);
//         if (params.toString()) dailyMetricsUrl += `?${params.toString()}`;

//         const dailyMetricsResponse = await fetch(dailyMetricsUrl);
//         if (!dailyMetricsResponse.ok) throw new Error(`HTTP error! status: ${dailyMetricsResponse.status}`);
//         const dailyMetricsData = await dailyMetricsResponse.json();
//         setDailyMetrics(dailyMetricsData);

//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [startDate, endDate]);

//   const handleVideoClick = async (videoId) => {
//     // ... (handleVideoClick function will be added here later if needed)
//   };

//   if (loading) return <div className="loading-message">Loading dashboard...</div>;
//   if (error) return <div className="error-data">Error: {error.message}.</div>;
//   if (!channelStats) return <div className="no-data-message">No channel data available.</div>;

//   // --- Chart data preparation (sab same rahega) ---
//   const topVideoLabels = videoStats.slice(0, 10).map(video => video.title);
//   const topVideoViews = videoStats.slice(0, 10).map(video => video.view_count);
//   const barChartData = { labels: topVideoLabels, datasets: [{ label: 'Views', data: topVideoViews, backgroundColor: 'rgba(75, 192, 192, 0.6)' }] };
//   const barChartOptions = { responsive: true, plugins: { legend: { position: 'top', labels: { color: 'white' } }, title: { display: true, text: 'Top 10 Video Views', color: 'white' } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } };

//   const dailyLabels = dailyMetrics.map(metric => new Date(metric.record_date).toLocaleDateString());
//   const dailySubscribers = dailyMetrics.map(metric => metric.subscribers);
//   const dailyViews = dailyMetrics.map(metric => metric.total_views);
//   const lineChartData = {
//     labels: dailyLabels,
//     datasets: [
//       { label: 'Subscribers', data: dailySubscribers, borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)' },
//       { label: 'Total Views', data: dailyViews, borderColor: 'rgb(53, 162, 235)', backgroundColor: 'rgba(53, 162, 235, 0.5)' }
//     ],
//   };
//   const lineChartOptions = { responsive: true, plugins: { legend: { position: 'top', labels: { color: 'white' } }, title: { display: true, text: 'Daily Channel Metrics', color: 'white' } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } };


//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>{channelStats.channel_name} Analytics Dashboard</h1>
//       </header>

//       <div className="date-filter-section">
//         <h3>Filter Daily Metrics by Date:</h3>
//         <label>
//           Start Date: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//         </label>
//         <label>
//           End Date: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//         </label>
//       </div>

//       <section className="daily-metrics-section">
//         <h2>Daily Channel Metrics</h2>
//         {dailyMetrics.length > 0 ? (
//           <Line data={lineChartData} options={lineChartOptions} />
//         ) : (
//           <p>No daily metrics data available for the selected range.</p>
//         )}
//       </section>

//       <section className="video-stats-section">
//         <h2>Top 10 Most Viewed Videos</h2>
//         <Bar data={barChartData} options={barChartOptions} />
//         <div className="video-list">
//           {videoStats.slice(0, 10).map(video => (
//             <div key={video.video_id} className="video-item">
//               <h3>{video.title}</h3>
//               <p>Views: {new Intl.NumberFormat().format(video.view_count)}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <footer>
//         <p>© YouTube Analytics Tool</p>
//       </footer>
//     </div>
//   );
// }

// export default DashboardPage;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import karein
import './App.css';
import './Auth.css';

// Charting Imports
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = 'http://34.74.243.207:5000';

function DashboardPage() {
    const navigate = useNavigate();
    const [channelStats, setChannelStats] = useState(null);
    const [videoStats, setVideoStats] = useState([]);
    const [dailyMetrics, setDailyMetrics] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // --- NAYA CODE (SECURITY CHECK) ---
        const token = localStorage.getItem('token');
        if (!token) {
            // Agar token nahi hai, toh login page par bhej dein
            navigate('/login');
            return; // Baaki ka code run na karein
        }
        // --- NAYA CODE END ---

        const fetchData = async () => {
            setLoading(true);
            try {
                // In a real app, you'd send the token in headers:
                // headers: { 'Authorization': `Bearer ${token}` }
                
                const channelResponse = await fetch(`${API_URL}/api/v1/channel_stats`);
                if (!channelResponse.ok) throw new Error(`HTTP error! status: ${channelResponse.status}`);
                const channelData = await channelResponse.json();
                setChannelStats(channelData[0] || null);

                const videoResponse = await fetch(`${API_URL}/api/v1/video_stats`);
                if (!videoResponse.ok) throw new Error(`HTTP error! status: ${videoResponse.status}`);
                const videoData = await videoResponse.json();
                setVideoStats(videoData);

                let dailyMetricsUrl = `${API_URL}/api/v1/daily_channel_metrics`;
                const params = new URLSearchParams();
                if (startDate) params.append('start_date', startDate);
                if (endDate) params.append('end_date', endDate);
                if (params.toString()) dailyMetricsUrl += `?${params.toString()}`;
                
                const dailyMetricsResponse = await fetch(dailyMetricsUrl);
                if (!dailyMetricsResponse.ok) throw new Error(`HTTP error! status: ${dailyMetricsResponse.status}`);
                const dailyMetricsData = await dailyMetricsResponse.json();
                setDailyMetrics(dailyMetricsData);

            } catch (error) {
                console.error("Failed to fetch data:", error);
                if (error.message.includes("No auth token found")) {
                    navigate('/login');
                }
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate, navigate]);

    // --- NAYA FUNCTION (LOGOUT KE LIYE) ---
    const handleLogout = () => {
        localStorage.removeItem('token'); // Token ko browser se hatayein
        navigate('/login'); // Login page par bhej dein
    };

    if (loading) return <div className="loading-message">Loading dashboard...</div>;
    if (error) return <div className="error-data">Error: {error.message}.</div>;
    if (!channelStats) return <div className="no-data-message">No channel data available. (Try running the collector script)</div>;

    // --- Chart data preparation (sab same rahega) ---
    const topVideoLabels = videoStats.slice(0, 10).map(video => video.title);
    const topVideoViews = videoStats.slice(0, 10).map(video => video.view_count);
    const barChartData = { labels: topVideoLabels, datasets: [{ label: 'Views', data: topVideoViews, backgroundColor: 'rgba(75, 192, 192, 0.6)' }] };
    const barChartOptions = { responsive: true, plugins: { legend: { position: 'top', labels: { color: 'white' } }, title: { display: true, text: 'Top 10 Video Views', color: 'white' } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } };
    
    const dailyLabels = dailyMetrics.map(metric => new Date(metric.record_date).toLocaleDateString());
    const dailySubscribers = dailyMetrics.map(metric => metric.subscribers);
    const dailyViews = dailyMetrics.map(metric => metric.total_views);
    const lineChartData = {
      labels: dailyLabels,
      datasets: [
        { label: 'Subscribers', data: dailySubscribers, borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)' },
        { label: 'Total Views', data: dailyViews, borderColor: 'rgb(53, 162, 235)', backgroundColor: 'rgba(53, 162, 235, 0.5)' }
      ],
    };
    const lineChartOptions = { responsive: true, plugins: { legend: { position: 'top', labels: { color: 'white' } }, title: { display: true, text: 'Daily Channel Metrics', color: 'white' } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } };

    return (
        <div className="App">
            <header className="App-header">
                <h1>{channelStats.channel_name} Analytics Dashboard</h1>
                {/* --- NAYA BUTTON (LOGOUT) --- */}
                <button onClick={handleLogout} className="auth-button" style={{width: '150px', marginTop: '10px'}}>
                    Logout
                </button>
            </header>
            
            <div className="date-filter-section">
                <h3>Filter Daily Metrics by Date:</h3>
                <label>Start Date: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
                <label>End Date: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
            </div>
            
            <section className="daily-metrics-section">
                <h2>Daily Channel Metrics</h2>
                <Line data={lineChartData} options={lineChartOptions} />
            </section>
            
            <section className="video-stats-section">
                <h2>Top 10 Most Viewed Videos</h2>
                <Bar data={barChartData} options={barChartOptions} />
            </section>

            <footer>
                <p>© YouTube Analytics Tool</p>
            </footer>
        </div>
    );
}

export default DashboardPage;