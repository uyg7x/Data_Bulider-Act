import { useState } from 'react';
import { usePipelineStore } from '../store/pipelineStore';
import { useAppStore } from '../store/appStore';
import { Plus, MoreVertical, Play, Copy, Trash2, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

export function Dashboard() {
  const { pipelines, deletePipeline, createPipeline } = usePipelineStore();
  const { setCurrentTab, setSelectedPipelineId } = useAppStore();
  const [showNewModal, setShowNewModal] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

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

  const handleDuplicate = (pipeline: any) => {
    const newId = createPipeline(`${pipeline.name} (Copy)`);
    setMenuOpen(null);
  };

  const statusConfig = {
    draft: { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Draft' },
    active: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Active' },
    archived: { icon: XCircle, color: 'text-orange-500', bg: 'bg-orange-100', label: 'Archived' },
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Pipelines</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor your data transformation pipelines
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            <Plus size={18} />
            New Pipeline
          </button>
        </div>
      </div>

      {/* Pipeline Grid */}
      <div className="p-8">
        {pipelines.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No pipelines yet
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Create your first data pipeline to get started
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
              Create Pipeline
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pipelines.map((pipeline) => {
              const statusInfo = statusConfig[pipeline.status];
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={pipeline.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
                  onClick={() => handleOpenPipeline(pipeline.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <FileText size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {pipeline.name}
                        </h3>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === pipeline.id ? null : pipeline.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical size={16} className="text-gray-400" />
                      </button>
                      {menuOpen === pipeline.id && (
                        <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(pipeline);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Copy size={14} />
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePipeline(pipeline.id);
                              setMenuOpen(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
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
                      <Clock size={12} />
                      {new Date(pipeline.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Play size={12} />
                      Last run: {new Date(pipeline.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Pipeline Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
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
          </div>
        </div>
      )}
    </div>
  );
}
