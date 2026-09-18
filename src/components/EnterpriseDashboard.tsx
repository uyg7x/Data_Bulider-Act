import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { useAppStore } from '../store/appStore';
import { Plus, FileText, Workflow, HelpCircle, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { MetricsRow } from './dashboard/MetricCard';
import { PipelineHealthChart } from './dashboard/PipelineHealthChart';
import { ActivityHeatmap } from './dashboard/ActivityHeatmap';
import { RecentActivityList } from './dashboard/RecentActivityList';
import type { Pipeline } from '../types';

export function EnterpriseDashboard() {
  const { pipelines, deletePipeline, createPipeline, executions } = usePipelineStore();
  const { setCurrentTab, setSelectedPipelineId } = useAppStore();
  const [showNewModal, setShowNewModal] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  // Calculate metrics
  const totalRecords = 1247893; // Mock data
  const activePipelines = pipelines.filter(p => p.status === 'active').length;
  const successRate = 94; // Mock data
  const computeHours = 127; // Mock data

  // Calculate pipeline health
  const successCount = executions.filter(e => e.status === 'success').length;
  const failureCount = executions.filter(e => e.status === 'failed').length;

  // Recent activities
  const recentActivities = executions.slice(0, 5).map(exec => ({
    id: exec.id,
    pipelineName: exec.pipelineName,
    status: exec.status,
    timestamp: exec.startedAt,
    duration: exec.duration ? `${exec.duration.toFixed(1)}s` : undefined,
  }));

  const handleCreate = () => {
    if (!newPipelineName.trim()) return;
    const id = createPipeline(newPipelineName.trim());
    setSelectedPipelineId(id);
    setCurrentTab('builder');
    setShowNewModal(false);
    setNewPipelineName('');
  };

  const handleOpenPipeline = (id: string) => {
    setSelectedPipelineId(id);
    setCurrentTab('builder');
  };

  const handleDuplicate = (pipeline: Pipeline) => {
    createPipeline(`${pipeline.name} (Copy)`);
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
            <h1 className="text-2xl font-bold text-gray-800">Data Pipelines</h1>
            <p className="text-sm text-gray-500 mt-1">
              Enterprise-grade data transformation platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              <HelpCircle size={18} />
              How to Use
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <Plus size={18} />
              New Pipeline
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-8">
        {/* Metrics Row */}
        <MetricsRow
          totalRecords={totalRecords}
          activePipelines={activePipelines}
          successRate={successRate}
          computeHours={computeHours}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PipelineHealthChart
            successCount={successCount}
            failureCount={failureCount}
          />
          <RecentActivityList activities={recentActivities} />
        </div>

        {/* Activity Heatmap */}
        <div className="mb-8">
          <ActivityHeatmap days={30} />
        </div>

        {/* Pipeline Grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Pipelines</h2>
          {pipelines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16 bg-white rounded-xl border border-gray-200"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <Workflow size={32} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No pipelines yet
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Create your first data pipeline to get started
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                Create Pipeline
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pipelines.map((pipeline, index) => {
                const statusConfig = {
                  draft: { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Draft' },
                  active: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Active' },
                  archived: { icon: XCircle, color: 'text-orange-500', bg: 'bg-orange-100', label: 'Archived' },
                };

                const statusInfo = statusConfig[pipeline.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={pipeline.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    onClick={() => handleOpenPipeline(pipeline.id)}
                    className="relative bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                          {pipeline.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        {new Date(pipeline.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Pipeline Modal */}
      <AnimatePresence>
        {showNewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Create New Pipeline
              </h3>
              <input
                type="text"
                value={newPipelineName}
                onChange={(e) => setNewPipelineName(e.target.value)}
                placeholder="Enter pipeline name..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowNewModal(false);
                    setNewPipelineName('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newPipelineName.trim()}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">How to Use PipelineBuilder</h3>
                <button
                  onClick={() => setShowGuide(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Enterprise Features</h4>
                  <ul className="text-sm text-blue-700 space-y-1.5">
                    <li>• Real-time metrics and analytics dashboard</li>
                    <li>• Advanced transformations: Flatten JSON, Mask PII, AI Extract</li>
                    <li>• Data profiling with column insights</li>
                    <li>• Activity heatmap for pipeline monitoring</li>
                    <li>• Success/failure rate tracking</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
