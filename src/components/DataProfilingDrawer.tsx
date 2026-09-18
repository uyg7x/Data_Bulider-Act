import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, Type, Calendar, Percent } from 'lucide-react';

interface ColumnInsight {
  name: string;
  type: 'string' | 'number' | 'date';
  nullPercentage: number;
  uniqueValues?: number;
  min?: number;
  max?: number;
}

interface DataProfilingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnInsight[];
  data: any[];
}

export function DataProfilingDrawer({ isOpen, onClose, columns, data }: DataProfilingDrawerProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'string':
        return <Type className="w-4 h-4" />;
      case 'number':
        return <Hash className="w-4 h-4" />;
      case 'date':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'number':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'date':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Data Profiling</h2>
                <p className="text-sm text-gray-600">Column insights and data preview</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Column Insights */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Column Insights
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {columns.map((column, index) => (
                  <motion.div
                    key={column.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-48 bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {column.name}
                      </span>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(column.type)}`}>
                        {getTypeIcon(column.type)}
                        {column.type}
                      </span>
                    </div>

                    {/* Null percentage */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Null values</span>
                        <span>{column.nullPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            column.nullPercentage > 50 ? 'bg-rose-500' :
                            column.nullPercentage > 20 ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${column.nullPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats based on type */}
                    {column.type === 'number' && (
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Min:</span>
                          <span className="font-medium">{column.min}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max:</span>
                          <span className="font-medium">{column.max}</span>
                        </div>
                      </div>
                    )}

                    {column.type === 'string' && column.uniqueValues !== undefined && (
                      <div className="text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Unique:</span>
                          <span className="font-medium">{column.uniqueValues}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Data Table */}
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Data Preview</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.name}
                          className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-200"
                        >
                          <div className="flex items-center gap-2">
                            {getTypeIcon(column.type)}
                            {column.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                        {columns.map((column) => (
                          <td
                            key={column.name}
                            className="px-4 py-3 text-gray-900 border-b border-gray-100"
                          >
                            {row[column.name] === null || row[column.name] === undefined ? (
                              <span className="text-gray-400 italic">null</span>
                            ) : (
                              String(row[column.name])
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
