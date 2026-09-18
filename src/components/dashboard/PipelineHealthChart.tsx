import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PipelineHealthChartProps {
  successCount: number;
  failureCount: number;
}

export function PipelineHealthChart({ successCount, failureCount }: PipelineHealthChartProps) {
  const data = [
    { name: 'Success', value: successCount, color: '#10b981' },
    { name: 'Failed', value: failureCount, color: '#ef4444' },
  ];

  const total = successCount + failureCount;
  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pipeline Health</h3>
          <p className="text-sm text-gray-600">Success rate this week</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{successRate}%</p>
          <p className="text-xs text-gray-600">{total} total runs</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-sm text-gray-600">Success ({successCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <span className="text-sm text-gray-600">Failed ({failureCount})</span>
        </div>
      </div>
    </motion.div>
  );
}
