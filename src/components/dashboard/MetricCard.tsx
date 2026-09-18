import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

export function MetricCard({ title, value, suffix = '', icon, color, delay = 0 }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900">
          {displayValue.toLocaleString()}
          {suffix}
        </p>
      </div>
    </motion.div>
  );
}

interface MetricsRowProps {
  totalRecords: number;
  activePipelines: number;
  successRate: number;
  computeHours: number;
}

export function MetricsRow({ totalRecords, activePipelines, successRate, computeHours }: MetricsRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard
        title="Total Records Processed"
        value={totalRecords}
        icon={<TrendingUp className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-blue-500 to-blue-600"
        delay={0}
      />
      <MetricCard
        title="Active Pipelines"
        value={activePipelines}
        icon={<Clock className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-purple-500 to-purple-600"
        delay={0.1}
      />
      <MetricCard
        title="Success Rate"
        value={successRate}
        suffix="%"
        icon={<CheckCircle className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        delay={0.2}
      />
      <MetricCard
        title="Compute Hours"
        value={computeHours}
        suffix="h"
        icon={<AlertCircle className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-orange-500 to-orange-600"
        delay={0.3}
      />
    </div>
  );
}
