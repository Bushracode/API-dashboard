import React, { useState, useEffect } from 'react';
import './styles.css';

const MOCK_METRICS = [
  { id: 1, name: 'Active Subscriptions', value: '1,284', status: 'Operational', trend: '+12% this week' },
  { id: 2, name: 'API Latency (p99)', value: '42ms', status: 'Optimal', trend: 'Fast' },
  { id: 3, name: 'Database CPU Load', value: '18.5%', status: 'Normal', trend: 'Stable' },
  { id: 4, name: 'System Throughput', value: '124.8 GB/s', status: 'Optimal', trend: 'High Speed' },
  { id: 5, name: 'Serverless Functions', value: '99.98%', status: 'Healthy', trend: 'Vercel Edge' },
  { id: 6, name: 'Error Rate', value: '0.001%', status: 'Minimal', trend: 'Near Zero' }
];

export default function App() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isServerlessMode, setIsServerlessMode] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Attempt FastAPI backend fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch('http://localhost:8000/api/v1/metrics', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`FastAPI server returned status ${response.status}`);
      }

      const data = await response.json();
      setMetrics(data);
      setIsServerlessMode(false);
    } catch (err) {
      // 2. Dual Mode Fallback: Automatically use Vercel Serverless Mock Mode
      console.warn('FastAPI backend offline, falling back to Vercel Serverless mode:', err.message);
      setIsServerlessMode(true);
      setError('Live FastAPI backend unreachable. Switched to Vercel Serverless mode.');
      
      // Simulate network latency for mock metrics
      setTimeout(() => {
        setMetrics(MOCK_METRICS.map(m => {
          if (m.name.includes('Latency')) {
            return { ...m, value: `${Math.floor(35 + Math.random() * 20)}ms` };
          }
          return m;
        }));
      }, 400);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-badge-row">
          <span className={`status-pill ${isServerlessMode ? 'pill-serverless' : 'pill-live'}`}>
            <span className="status-dot"></span>
            <span>{isServerlessMode ? 'Simulated Edge Mode' : 'Live System Connected'}</span>
          </span>
        </div>
        <h1 className="dashboard-title">System Metrics Dashboard</h1>
        <p className="dashboard-subtitle">Real-time Performance & Cloud Telemetry</p>
      </header>

      <div className="controls-bar">
        <div className="stats-indicator">
          <span>Active Nodes: <strong>4</strong></span>
          <span className="separator-dot"></span>
          <span>Region: <strong>Global CDN</strong></span>
        </div>
        <button 
          onClick={fetchMetrics} 
          disabled={loading} 
          className="btn-fetch"
        >
          {loading ? 'Refreshing...' : 'Refresh Metrics'}
        </button>
      </div>

      {error && isServerlessMode && (
        <div className="info-banner">
          <span className="info-icon">✦</span>
          <span>{error}</span>
        </div>
      )}

      {loading && !metrics.length ? (
        <div className="state-card">
          <div className="loading-spinner"></div>
          <p>Loading telemetry stream...</p>
        </div>
      ) : (
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <div key={metric.id} className="metric-card">
              <div className="metric-header">
                <span className="metric-name">{metric.name}</span>
                <span className="metric-status">{metric.status}</span>
              </div>
              <div className="metric-value">{metric.value}</div>
              {metric.trend && (
                <div className="metric-trend">
                  <span className="trend-sparkle">✦</span>
                  <span>{metric.trend}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}