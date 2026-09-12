import { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/metrics');
      
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
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
        <h1 className="dashboard-title">System Metrics Dashboard</h1>
        <p className="dashboard-subtitle">Phase 2: React REST API & Containerized Integration</p>
      </header>

      <div className="controls-bar">
        <span className="dashboard-subtitle">Status: Real-Time Sync</span>
        <button 
          onClick={fetchMetrics} 
          disabled={loading} 
          className="btn-fetch"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          System Error: {error}
        </div>
      )}

      {loading && !metrics.length ? (
        <div className="state-card">
          <p>Loading telemetry data...</p>
        </div>
      ) : metrics.length > 0 ? (
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <div key={metric.id} className="metric-card">
              <div className="metric-name">{metric.name}</div>
              <div className="metric-value">{metric.value}</div>
              <span className="metric-status">{metric.status}</span>
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <div className="state-card">
            <p>No metrics available to display.</p>
          </div>
        )
      )}
    </main>
  );
}