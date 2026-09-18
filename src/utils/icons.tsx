import {
  FileUp,
  Database,
  Eraser,
  Type,
  Calculator,
  Filter,
  ArrowUpDown,
  BarChart3,
  PieChart,
  LineChart,
  ScatterChart,
  Download,
  FileJson,
  Box,
  type LucideProps,
} from 'lucide-react';
import type { FC } from 'react';

// Map of icon names to Lucide components
const iconMap: Record<string, FC<LucideProps>> = {
  FileUp,
  Database,
  Eraser,
  Type,
  Calculator,
  Filter,
  ArrowUpDown,
  BarChart3,
  PieChart,
  LineChart,
  ScatterChart,
  Download,
  FileJson,
  Box,
};

interface NodeIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function NodeIcon({ name, size = 18, className = '' }: NodeIconProps) {
  const Icon = iconMap[name] || Box;
  return <Icon size={size} className={className} />;
}

// Get icon component by name
export function getIconComponent(name: string): FC<LucideProps> {
  return iconMap[name] || Box;
}
