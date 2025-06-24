import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryDatum {
  name: string;
  value: number;
  percent: string | number;
  color: string;
}

interface PriceDatum {
  name: string;
  value: number;
}

interface AnalyticsChartsProps {
  categoryData: CategoryDatum[];
  priceData: PriceDatum[];
}

const AnalyticsCharts = ({ categoryData, priceData }: AnalyticsChartsProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 50 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 20, boxShadow: '0px 4px 4px 0px #00000015', border: '1px solid #00000015', padding: '20px 180px 57px 180px' }}>
        <div style={{ marginBottom: 20, fontSize: '24px', fontWeight: 700, color: '#454B60', textAlign: 'left', marginLeft: '-150px', marginTop: '30px' }}>Top Categories Perfomance</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20}}>
          {categoryData.map((cat, idx) => (
            <div key={cat.name} style={{ display: 'flex', alignItems: 'center', background: '#F7F7F7', borderRadius: 20, padding: '14px 24px', gap: 18 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: cat.color, display: 'inline-block', marginRight: 18 }}></span>
              <span style={{ flex: 1, color: '#454B60', fontWeight: 600 }}>{cat.name}</span>
              <span style={{ fontWeight: 700, color: '#222', marginRight: 10 }}>{cat.value} products</span>
              <span style={{ color: '#888', fontSize: 14 }}>{cat.percent}% of total</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#FFFFFF', borderRadius: 20, boxShadow: '0 4px 4px #00000015', padding: '20px 180px 70px 159px', maxWidth: '483px', marginBottom: '128px'}}>
        <div style={{ marginBottom: 20, fontSize: '24px', fontWeight: 700, color: '#454B60', textAlign: 'left', marginLeft: '-129px', marginTop: '30px' }}>Price Distribution</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={priceData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4285F4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsCharts; 