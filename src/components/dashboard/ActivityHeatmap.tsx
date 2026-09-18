import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ActivityHeatmapProps {
  days?: number;
}

export function ActivityHeatmap({ days = 30 }: ActivityHeatmapProps) {
  // Generate mock activity data
  const activityData = useMemo(() => {
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      // Random activity level (0-4)
      const activity = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        activity,
        dayOfWeek: date.getDay(),
      });
    }
    return data;
  }, [days]);

  const getColor = (activity: number) => {
    switch (activity) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-emerald-200';
      case 2: return 'bg-emerald-300';
      case 3: return 'bg-emerald-400';
      case 4: return 'bg-emerald-500';
      default: return 'bg-gray-100';
    }
  };

  const totalActivity = activityData.reduce((sum, day) => sum + day.activity, 0);
  const activeDays = activityData.filter(day => day.activity > 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activity Heatmap</h3>
          <p className="text-sm text-gray-600">Pipeline activity over last {days} days</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{activeDays}</p>
          <p className="text-xs text-gray-600">active days</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-1 flex-wrap">
          {activityData.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              className={`w-4 h-4 rounded-sm ${getColor(day.activity)} cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all`}
              title={`${day.date}: ${day.activity} pipelines`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-200"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-300"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
          </div>
          <span>More</span>
        </div>
        <span className="text-gray-500">{totalActivity} total pipelines</span>
      </div>
    </motion.div>
  );
}
