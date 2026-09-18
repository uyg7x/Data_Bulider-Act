import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { useAppStore } from '../store/appStore';
import { Plus, Play, Copy, Trash2, Clock, CheckCircle, XCircle, FileText, Workflow, HelpCircle, Edit3 } from 'lucide-react';
import type { Pipeline } from '../types';

interface PipelineCardProps {
  pipeline: Pipeline;
  index: number;
  onOpen: (id: string) => void;
  onDuplicate: (pipeline: Pipeline) => void;
  onDelete: (id: string) => void;
}

function HealthSparkline({ history }: { history: boolean[] }) {
  return (
    <div className="flex items-center gap-1">
      {history.map((success, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            success ? 'bg-green-500' : 'bg-red-500'
          }`}
          title={success ? 'Success' : 'Failed'}
        />
      ))}
    </div>
  );
}

function PipelineCard({ pipeline, index, onOpen, onDuplicate, onDelete }: PipelineCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    draft: { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Draft' },
    active: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Active' },
    archived: { icon: XCircle, color: 'text-orange-500', bg: 'bg-orange-100', label: 'Archived' },
  };

  const statusInfo = statusConfig[pipeline.status];
  const StatusIcon = statusInfo.icon;

  // Generate mock health history if not present
  const healthHistory = pipeline.healthHistory || [
    Math.random() > 0.2,
    Math.random() > 0.3,
    Math.random() > 0.1,
    Math.random() > 0.4,
    Math.random() > 0.2,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onOpen(pipeline.id)}
      className="relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
    >
      {/* Quick Actions - appear on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-3 right-3 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-md p-1 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onOpen(pipeline.id)}
              className="p-1.5 hover:bg-blue-50 rounded-md transition-colors text-gray-600 hover:text-blue-600"
              title="Run Pipeline"
            >
              <Play size={14} />
            </button>
            <button
              onClick={() => onOpen(pipeline.id)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-600 hover:text-gray-800"
              title="Edit"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => onDuplicate(pipeline)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-600 hover:text-gray-800"
              title="Duplicate"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => onDelete(pipeline.id)}
              className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-gray-600 hover:text-red-600"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Header */}
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

      {/* Health Sparkline */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Recent runs:</span>
          <HealthSparkline history={healthHistory} />
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
          <StatusIcon size={12} />
          {statusInfo.label}
        </span>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          {new Date(pipeline.updatedAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <Play size={12} />
          Last run: {new Date(pipeline.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const { pipelines, deletePipeline, createPipeline } = usePipelineStore();
  const { setCurrentTab, setSelectedPipelineId } = useAppStore();
  const [showNewModal, setShowNewModal] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [showGuide, setShowGuide] = useState(false);

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
              Manage and monitor your data transformation pipelines
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

      {/* Pipeline Grid */}
      <div className="p-8">
        {pipelines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
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
            {pipelines.map((pipeline, index) => (
              <PipelineCard
                key={pipeline.id}
                pipeline={pipeline}
                index={index}
                onOpen={handleOpenPipeline}
                onDuplicate={handleDuplicate}
                onDelete={deletePipeline}
              />
            ))}
          </div>
        )}
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
                {/* Step 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Create a Pipeline</h4>
                    <p className="text-sm text-gray-600">
                      Click "New Pipeline" to start. Give it a descriptive name like "Employee Data Cleanup" or "Sales Report Generator".
                    </p>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Add Nodes from the Palette</h4>
                    <p className="text-sm text-gray-600">
                      In the Builder, find nodes in the left sidebar. <strong>Drag</strong> them onto the canvas or <strong>click</strong> to add. Start with a data source like "Load CSV".
                    </p>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Connect the Nodes</h4>
                    <p className="text-sm text-gray-600">
                      Drag from the <strong>right handle</strong> (output) of one node to the <strong>left handle</strong> (input) of another. This defines the data flow.
                    </p>
                  </div>
                </motion.div>

                {/* Step 4 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Configure Each Node</h4>
                    <p className="text-sm text-gray-600">
                      Click any node to select it. The right panel shows configuration options like column names, operations, chart types, etc.
                    </p>
                  </div>
                </motion.div>

                {/* Step 5 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Run the Pipeline</h4>
                    <p className="text-sm text-gray-600">
                      Click "Run Pipeline" in the top bar. Watch nodes turn blue (processing) then green (success). Check the data preview in the properties panel.
                    </p>
                  </div>
                </motion.div>

                {/* Step 6 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">6</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">View Charts & Logs</h4>
                    <p className="text-sm text-gray-600">
                      For "Generate Chart" nodes, see live chart previews (bar, line, pie, scatter, area). Check the Logs tab for execution history and detailed logs.
                    </p>
                  </div>
                </motion.div>

                {/* Quick Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm">Quick Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">-</span>
                      <span>Always start with a data source node (Load CSV or Load Database)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">-</span>
                      <span>End with an output node (Export CSV, Export JSON, or Generate Chart)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">-</span>
                      <span>Click "Save" to preserve your pipeline layout</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">-</span>
                      <span>Use the zoom controls (+/-) and minimap for navigation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">-</span>
                      <span>Press Delete key to remove selected nodes</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
