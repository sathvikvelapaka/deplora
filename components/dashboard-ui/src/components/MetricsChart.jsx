import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '10:00', requests: 400 },
  { time: '10:05', requests: 650 },
  { time: '10:10', requests: 800 },
  { time: '10:15', requests: 750 },
  { time: '10:20', requests: 1200 },
  { time: '10:25', requests: 1100 },
  { time: '10:30', requests: 1400 },
  { time: '10:35', requests: 1350 },
  { time: '10:40', requests: 1800 },
  { time: '10:45', requests: 1950 },
  { time: '10:50', requests: 2200 },
  { time: '10:55', requests: 2400 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel" style={{ padding: '0.75rem', border: '1px solid var(--primary-glow)' }}>
        <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)' }}>{label}</p>
        <p style={{ margin: 0, color: 'var(--primary)' }}>
          {payload[0].value} <span style={{ color: 'var(--text-muted)' }}>req/s</span>
        </p>
      </div>
    );
  }
  return null;
};

const MetricsChart = () => {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Global API Traffic</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Inference requests per second across all clusters</p>
        </div>
        <div className="badge badge-success" style={{ animation: 'pulse-glow 2s infinite' }}>Live Data</div>
      </div>
      
      <div style={{ flex: 1, width: '100%', minHeight: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-highlight)', strokeWidth: 1, strokeDasharray: '5 5' }} />
            <Area 
              type="monotone" 
              dataKey="requests" 
              stroke="var(--primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRequests)" 
              activeDot={{ r: 6, fill: 'var(--primary)', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;
