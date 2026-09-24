import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Table,
  ChevronDown,
  ChevronRight,
  Terminal,
  ScrollText,
  BarChart3,
  RotateCcw,
} from 'lucide-react';
import { ChartPreview } from './ChartPreview';

const convertToCSV = (data: any[]): string => {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma, newline, or quote
      const str = String(value ?? '');
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
};

const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export function ExecutionLogs() {
  const { executions, chartData, chartType } = usePipelineStore();
  const [expandedExec, setExpandedExec] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'live'>('history');

  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
    running: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Running' },
    success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Success' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Failed' },
  };

  const logLevelColors = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    success: 'text-green-600',
  };

  const handleRetry = (executionId: string) => {
    // Mock retry functionality
    alert(`Retrying execution ${executionId}...`);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border-b border-gray-200 px-8 py-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Execution & Logs</h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor pipeline runs and view results
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Run History
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'live'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Terminal size={14} />
                Live Logs
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'history' ? (
          <div className="space-y-3">
            {executions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-slate-100 rounded-2xl flex items-center justify-center">
                  <ScrollText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No executions yet
                </h3>
                <p className="text-sm text-gray-400">
                  Run a pipeline to see execution history here
                </p>
              </motion.div>
            ) : (
              executions.map((execution, index) => {
                const statusInfo = statusConfig[execution.status];
                const StatusIcon = statusInfo.icon;
                const isExpanded = expandedExec === execution.id;

                return (
                  <motion.div
                    key={execution.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    {/* Execution Header */}
                    <div
                      className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedExec(isExpanded ? null : execution.id)}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                          <StatusIcon size={12} className={execution.status === 'running' ? 'animate-spin' : ''} />
                          {statusInfo.label}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {execution.pipelineName}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {new Date(execution.startedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {execution.duration && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock size={14} />
                            {execution.duration.toFixed(1)}s
                          </span>
                        )}
                        {execution.status === 'success' && execution.outputData && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const csv = convertToCSV(execution.outputData!);
                              const fileName = `${execution.pipelineName.replace(/\s+/g, '_')}_output_${new Date(execution.completedAt).toISOString().split('T')[0]}.csv`;
                              downloadCSV(csv, fileName);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-blue-600"
                            title="Download output as CSV"
                          >
                            <Download size={16} />
                          </button>
                        )}
                        {execution.status === 'failed' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetry(execution.id);
                            }}
                            className="p-1.5 hover:bg-orange-50 rounded-md transition-colors text-gray-400 hover:text-orange-600"
                            title="Retry execution"
                          >
                            <RotateCcw size={16} />
                          </motion.button>
                        )}
                        {isExpanded ? (
                          <ChevronDown size={18} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={18} className="text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100 overflow-hidden"
                        >
                          {/* Logs */}
                          <div className="px-5 py-4">
                            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                              <Terminal size={12} />
                              Execution Logs
                            </h5>
                            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-1.5 max-h-48 overflow-y-auto">
                              {execution.logs.map((log, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-gray-500 text-xs whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                  </span>
                                  <span className={`text-xs ${logLevelColors[log.level]}`}>
                                    [{log.level.toUpperCase()}]
                                  </span>
                                  <span className="text-gray-300 text-xs">
                                    {log.message}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Error Trace for failed executions */}
                          {execution.status === 'failed' && (
                            <div className="px-5 py-4 border-t border-gray-100">
                              <h5 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                <AlertCircle size={12} />
                                Error Trace
                              </h5>
                              <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs space-y-2">
                                <div className="text-red-400">
                                  Error: Pipeline execution failed
                                </div>
                                <div className="text-gray-400">
                                  at PipelineExecutor.execute (pipeline.ts:142)
                                </div>
                                <div className="text-gray-400">
                                  at NodeProcessor.process (node.ts:89)
                                </div>
                                <div className="text-gray-400">
                                  at DataTransformer.transform (transform.ts:56)
                                </div>
                                <div className="text-yellow-400 mt-2">
                                  Caused by: Column "revenue" not found in dataset
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Data Preview */}
                          {execution.outputData && execution.outputData.length > 0 && (
                            <div className="px-5 py-4 border-t border-gray-100">
                              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                <Table size={12} />
                                Output Data Preview
                              </h5>
                              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      {Object.keys(execution.outputData[0]).map((key) => (
                                        <th
                                          key={key}
                                          className="px-3 py-2 text-left font-medium text-gray-600 border-b"
                                        >
                                          {key}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {execution.outputData.map((row: any, i: number) => (
                                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                        {Object.values(row).map((val: any, j: number) => (
                                          <td key={j} className="px-3 py-2 text-gray-700">
                                            {String(val)}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Chart Preview */}
                          {chartData && chartType && execution.status === 'success' && (
                            <div className="px-5 py-4 border-t border-gray-100">
                              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                <BarChart3 size={12} />
                                Generated Chart
                              </h5>
                              <ChartPreview
                                data={chartData}
                                chartType={chartType}
                                title={`${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`}
                              />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        ) : (
          /* Live Logs Tab */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-900 rounded-xl p-6 min-h-[400px]"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-mono">Live Log Stream</span>
            </div>
            <div className="font-mono text-sm space-y-2 text-gray-400">
              <p className="text-gray-500">
                $ Waiting for pipeline execution...
              </p>
              <p className="text-gray-600">
                # Run a pipeline from the Builder to see live logs here
              </p>
              <p className="text-gray-600">
                # Logs will stream in real-time as nodes are processed
              </p>
              <div className="mt-4 p-4 border border-gray-700 rounded-lg">
                <p className="text-gray-500 text-xs mb-2">Example log output:</p>
                <p className="text-blue-400">[INFO] Loading CSV: 1,247 rows detected</p>
                <p className="text-green-400">[SUCCESS] Node 1 completed in 0.3s</p>
                <p className="text-blue-400">[INFO] Processing Node 2: Filter Nulls</p>
                <p className="text-yellow-400">[WARNING] Column 'age' has 23 null values</p>
                <p className="text-green-400">[SUCCESS] Node 2 completed: 1,224 rows remaining</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
