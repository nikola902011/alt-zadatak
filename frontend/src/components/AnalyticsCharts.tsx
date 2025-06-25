import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './AnalyticsCharts.css';

interface CategoryData {
  name: string;
  value: number;
  percent: string;
  color: string;
}

interface PriceData {
  name: string;
  value: number;
}

interface AnalyticsChartsProps {
  categoryData: CategoryData[];
  priceData: PriceData[];
}

const AnalyticsCharts = ({ categoryData, priceData }: AnalyticsChartsProps) => {
  return (
    <div className="analyticsCharts">
      <div className="categoryPerformanceCard">
        <div className="categoryPerformanceTitle">Top Categories Perfomance</div>
        <div className="categoryList">
          {categoryData.map((cat) => (
            <div key={cat.name} className="categoryItem">
              <span>
                <span className="categoryColorIndicator" style={{ background: cat.color }}></span>
                <span className="categoryName">{cat.name}</span>
              </span>
              <span>              
                <div className="categoryCount">{cat.value} products</div>
                <div className="categoryPercentage">{cat.percent}% of total</div>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="priceDistributionCard">
        <div className='chartHolder'>Price Distribution</div>
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