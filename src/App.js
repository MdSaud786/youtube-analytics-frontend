// import React, { useEffect, useState } from 'react';
// import './App.css'; // Basic CSS for styling

// // --- NAYI LINES (CHARTING IMPORTS) ---
// import { Bar, Line,pie } from 'react-chartjs-2'; 
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from 'chart.js'; 

// // Chart.js components ko register karein
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );
// // --- NAYI LINES END ---

// // Frontend API URL (Apne VM ka External IP address aur Port daalein!)
// const API_URL = 'http://34.74.243.207:5000'; // Example: 'http://34.74.243.207:5000'

// function App() { 
//   const [channelStats, setChannelStats] = useState(null);
//   const [videoStats, setVideoStats] = useState([]);
//   const [dailyMetrics, setDailyMetrics] = useState([]); // <--- NAYI LINE (State for Daily Metrics)
//   const [startDate, setStartDate] = useState(''); // <--- NAYI LINE (State for Start Date)
//   const [endDate, setEndDate] = useState('');   // <--- NAYI LINE (State for End Date)
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // --- NAYI LINES (STATE FOR SENTIMENT) ---
//   const [selectedVideoId, setSelectedVideoId] = useState(null);
//   const [sentimentData, setSentimentData] = useState(null);
//   const [isSentimentLoading, setIsSentimentLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch Channel Stats
//         const channelResponse = await fetch(`${API_URL}/api/v1/channel_stats`);
//         if (!channelResponse.ok) {
//           throw new Error(`HTTP error! status: ${channelResponse.status}`);
//         }
//         const channelData = await channelResponse.json();
//         setChannelStats(channelData[0] || null); 

//         // Fetch Video Stats
//         const videoResponse = await fetch(`${API_URL}/api/v1/video_stats`);
//         if (!videoResponse.ok) {
//           throw new Error(`HTTP error! status: ${videoResponse.status}`);
//         }
//         const videoData = await videoResponse.json();
//         setVideoStats(videoData);

//         // --- NAYA CODE (FETCH DAILY CHANNEL METRICS) ---
//         // Build API URL with date parameters
//         let dailyMetricsUrl = `${API_URL}/api/v1/daily_channel_metrics`;
//         const params = new URLSearchParams(); // URL parameters banane ke liye
//         if (startDate) {
//           params.append('start_date', startDate); // Agar startDate hai, toh URL mein add karein
//         }
//         if (endDate) {
//           params.append('end_date', endDate); // Agar endDate hai, toh URL mein add karein
//         }
//         if (params.toString()) { // Agar koi parameter hai (jaise start_date ya end_date), toh '?' add karein
//           dailyMetricsUrl += `?${params.toString()}`;
//         }

//         // Fetch Daily Channel Metrics (URL ab parameters ke saath jayega)
//         const dailyMetricsResponse = await fetch(dailyMetricsUrl); 
//         if (!dailyMetricsResponse.ok) { 
//           throw new Error(`HTTP error! status: ${dailyMetricsResponse.status}`); 
//         } 
//         const dailyMetricsData = await dailyMetricsResponse.json(); 
//         setDailyMetrics(dailyMetricsData); 
//         // --- NAYI LINES END ---

//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//         setError(error);
//       } finally {
//           // It's important to put setLoading(false) and setError(null) outside the specific fetch calls
//           // in case one fails, but the overall loading state needs to be updated.
//           // This ensures the loading spinner disappears regardless of which fetch fails.
//           // setError(error) already sets the error state if there's a problem.
//           setLoading(false);
//       }
//     };

//     fetchData();
//   }, [startDate, endDate]); // <--- useEffect ko startDate aur endDate par dependent banaya hai

//   if (loading) return <div className="loading-message">Loading analytics data...</div>;
//   if (error) return <div className="error-data">Error: {error.message}. Please ensure your VM is running and the API server is active.</div>;
//   if (!channelStats) return <div className="no-data-message">No channel data available.</div>;

//   // --- CHART DATA PREPARATION (Top Video Views - Bar Chart) ---
//   const topVideoLabels = videoStats.slice(0, 10).map(video => video.title);
//   const topVideoViews = videoStats.slice(0, 10).map(video => video.view_count);

//   const barChartData = {
//     labels: topVideoLabels,
//     datasets: [
//       {
//         label: 'Views',
//         data: topVideoViews,
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const barChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           color: 'white' 
//         }
//       },
//       title: {
//         display: true,
//         text: 'Top 10 Video Views',
//         color: 'white' 
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || '';
//             if (label) {
//                 label += ': ';
//             }
//             if (context.parsed.y !== null) {
//                 label += new Intl.NumberFormat('en-US').format(context.parsed.y);
//             }
//             return label;
//           }
//         }
//       }
//     },
//     scales: {
//       x: {
//         ticks: {
//           color: 'white' 
//         },
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)' 
//         }
//       },
//       y: {
//         ticks: {
//           color: 'white' 
//         },
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)' 
//         }
//       }
//     }
//   };
//   // --- CHART DATA PREPARATION END ---

//   // --- NAYA CODE (CHART DATA PREPARATION FOR DAILY METRICS - Line Chart) ---
//   const dailyLabels = dailyMetrics.map(metric => new Date(metric.record_date).toLocaleDateString());
//   const dailySubscribers = dailyMetrics.map(metric => metric.subscribers);
//   const dailyViews = dailyMetrics.map(metric => metric.total_views);

//   const lineChartData = {
//     labels: dailyLabels,
//     datasets: [
//       {
//         label: 'Subscribers',
//         data: dailySubscribers,
//         borderColor: 'rgb(255, 99, 132)',
//         backgroundColor: 'rgba(255, 99, 132, 0.5)',
//         tension: 0.1,
//         pointBackgroundColor: 'rgb(255, 99, 132)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgb(255, 99, 132)'
//       },
//       {
//         label: 'Total Views',
//         data: dailyViews,
//         borderColor: 'rgb(53, 162, 235)',
//         backgroundColor: 'rgba(53, 162, 235, 0.5)',
//         tension: 0.1,
//         pointBackgroundColor: 'rgb(53, 162, 235)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgb(53, 162, 235)'
//       }
//     ],
//   };

//   const lineChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           color: 'white' 
//         }
//       },
//       title: {
//         display: true,
//         text: 'Daily Channel Metrics',
//         color: 'white' 
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || '';
//             if (label) {
//                 label += ': ';
//             }
//             if (context.parsed.y !== null) {
//                 label += new Intl.NumberFormat('en-US').format(context.parsed.y);
//             }
//             return label;
//           }
//         }
//       }
//     },
//     scales: {
//       x: {
//         ticks: {
//           color: 'white' 
//         },
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)' 
//         }
//       },
//       y: {
//         ticks: {
//           color: 'white' 
//         },
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)' 
//         }
//       }
//     }
//   };
//   // --- NAYA CODE END ---

//   return ( 
//     <div className="App">
//       <header className="App-header">
//         <h1>YouTube Channel Analytics for {channelStats.channel_name}</h1>
//         <p>Subscribers: {new Intl.NumberFormat('en-US').format(channelStats.subscribers)}</p>
//         <p>Total Views: {new Intl.NumberFormat('en-US').format(channelStats.total_views)}</p>
//         <p>Total Videos: {channelStats.video_count}</p>
//         <p>Last Updated: {new Date(channelStats.last_updated).toLocaleString()}</p>
//       </header>
      
//       {/* --- NAYA CODE (DATE FILTER SECTION) --- */}
//       <div className="date-filter-section"> 
//         <h3>Filter Daily Metrics by Date:</h3>
//         <label>
//           Start Date:
//           <input 
//             type="date" 
//             value={startDate} 
//             onChange={(e) => setStartDate(e.target.value)} 
//           />
//         </label>
//         <label>
//           End Date:
//           <input 
//             type="date" 
//             value={endDate} 
//             onChange={(e) => setEndDate(e.target.value)} 
//           />
//         </label>
//       </div>
//       {/* --- NAYA CODE END --- */}

//       {/* --- NAYA SECTION (LINE CHART) --- */}
//       <section className="daily-metrics-section"> 
//           <h2>Daily Channel Metrics (Last 30 Days)</h2>
//           {dailyMetrics.length > 0 ? (
//             <Line data={lineChartData} options={lineChartOptions} />
//           ) : (
//             <p>No daily metrics data available.</p>
//           )}
//       </section>
//       {/* --- NAYA SECTION END --- */}

//       <section className="video-stats-section">
//         <h2>Top 10 Most Viewed Videos</h2>
//         {/* Render Chart here */}
//         {videoStats.length > 0 && <Bar data={barChartData} options={barChartOptions} />} 
        
//         {/* Original Video List (ab chart ke neeche) */}
//         {videoStats.length > 0 ? (
//           <div className="video-list">
//             {videoStats.slice(0, 10).map(video => ( 
//               <div key={video.video_id} className="video-item">
//                 <h3>{video.title}</h3>
//                 <p>Views: {new Intl.NumberFormat('en-US').format(video.view_count)}</p>
//                 <p>Likes: {new Intl.NumberFormat('en-US').format(video.like_count)}</p>
//                 <p>Comments: {new Intl.NumberFormat('en-US').format(video.comment_count)}</p>
//                 <p>Published: {new Date(video.published_at).toLocaleDateString()}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No video data available.</p>
//         )}
//       </section>

//       <footer>
//         <p>&copy; YouTube Analytics Tool</p>
//       </footer>
//     </div>
//   );
// }

// export default App;


// import React, { useEffect, useState } from 'react';
// import './App.css'; 

// // --- CHARTING IMPORTS ---
// import { Bar, Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS, CategoryScale, LinearScale, BarElement,
//   PointElement, LineElement, Title, Tooltip, Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale, LinearScale, BarElement, PointElement,
//   LineElement, Title, Tooltip, Legend
// );
// // --- IMPORTS END ---

// const API_URL = 'http://34.74.243.207:5000';

// function App() {
//   const [channelStats, setChannelStats] = useState(null);
//   const [videoStats, setVideoStats] = useState([]);
//   const [dailyMetrics, setDailyMetrics] = useState([]);
//   // --- NAYI LINES (State for Date Filtering) ---
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   // --- NAYI LINES END ---
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true); // Show loading spinner on each fetch
//       try {
//         // Fetch Channel Stats (only needs to be fetched once, but we keep it here for simplicity)
//         const channelResponse = await fetch(`${API_URL}/api/v1/channel_stats`);
//         if (!channelResponse.ok) throw new Error(`HTTP error! status: ${channelResponse.status}`);
//         const channelData = await channelResponse.json();
//         setChannelStats(channelData[0] || null);

//         // Fetch Video Stats
//         const videoResponse = await fetch(`${API_URL}/api/v1/video_stats`);
//         if (!videoResponse.ok) throw new Error(`HTTP error! status: ${videoResponse.status}`);
//         const videoData = await videoResponse.json();
//         setVideoStats(videoData);

//         // --- UPDATE: Build API URL with date parameters ---
//         let dailyMetricsUrl = `${API_URL}/api/v1/daily_channel_metrics`;
//         const params = new URLSearchParams();
//         if (startDate) {
//           params.append('start_date', startDate);
//         }
//         if (endDate) {
//           params.append('end_date', endDate);
//         }
//         if (params.toString()) {
//           dailyMetricsUrl += `?${params.toString()}`;
//         }
//         // --- UPDATE END ---

//         // Fetch Daily Channel Metrics
//         const dailyMetricsResponse = await fetch(dailyMetricsUrl); // Use the new URL
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
//   }, [startDate, endDate]); // <-- UPDATE: Re-run effect when dates change

//   if (loading) return <div className="loading-message">Loading analytics data...</div>;
//   if (error) return <div className="error-data">Error: {error.message}. Please ensure your VM is running and the API server is active.</div>;
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
//         <h1>YouTube Channel Analytics for {channelStats.channel_name}</h1>
//         <p>Subscribers: {new Intl.NumberFormat().format(channelStats.subscribers)}</p>
//         <p>Total Views: {new Intl.NumberFormat().format(channelStats.total_views)}</p>
//         <p>Total Videos: {channelStats.video_count}</p>
//         <p>Last Updated: {new Date(channelStats.last_updated).toLocaleString()}</p>
//       </header>

//       {/* --- NAYA SECTION (DATE FILTER) --- */}
//       <div className="date-filter-section">
//         <h3>Filter Daily Metrics by Date:</h3>
//         <label>
//           Start Date:
//           <input 
//             type="date" 
//             value={startDate} 
//             onChange={(e) => setStartDate(e.target.value)} 
//           />
//         </label>
//         <label>
//           End Date:
//           <input 
//             type="date" 
//             value={endDate} 
//             onChange={(e) => setEndDate(e.target.value)} 
//           />
//         </label>
//       </div>
//       {/* --- NAYA SECTION END --- */}
      
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
//         {videoStats.length > 0 && <Bar data={barChartData} options={barChartOptions} />}
        
//         <div className="video-list">
//           {videoStats.slice(0, 10).map(video => (
//             <div key={video.video_id} className="video-item">
//               <h3>{video.title}</h3>
//               <p>Views: {new Intl.NumberFormat().format(video.view_count)}</p>
//               <p>Likes: {new Intl.NumberFormat().format(video.like_count)}</p>
//               <p>Comments: {new Intl.NumberFormat().format(video.comment_count)}</p>
//               <p>Published: {new Date(video.published_at).toLocaleDateString()}</p>
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

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import DashboardPage from './DashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Default route redirects to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;