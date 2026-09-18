import { usePipelineStore, NODE_DEFINITIONS } from '../store/pipelineStore';
import { Settings, Trash2, Info, Table } from 'lucide-react';
import { NodeIcon } from '../utils/icons';
import { ChartPreview } from './ChartPreview';
import { CsvUploader } from './CsvUploader';

export function PropertiesPanel() {
  const { currentNodes, selectedNodeId, setSelectedNodeId, updateNodeConfig, setCurrentNodes, currentEdges, setCurrentEdges, chartData, chartType } = usePipelineStore();

  const selectedNode = currentNodes.find((n) => n.id === selectedNodeId);
  const nodeDef = selectedNode
    ? NODE_DEFINITIONS.find((n) => n.type === selectedNode.data.nodeType)
    : null;

  const handleDeleteNode = () => {
    if (!selectedNodeId) return;
    setCurrentNodes(currentNodes.filter((n) => n.id !== selectedNodeId));
    setCurrentEdges(currentEdges.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  };

  const handleConfigChange = (fieldName: string, value: any) => {
    if (!selectedNodeId) return;
    updateNodeConfig(selectedNodeId, { [fieldName]: value });
  };

  if (!selectedNode) {
    return (
      <div className="w-72 bg-white border-l border-gray-200 flex flex-col items-center justify-center p-6">
        <Settings size={40} className="text-gray-300 mb-3" />
        <p className="text-sm text-gray-500 text-center">
          Select a node to view and edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-md ${nodeDef?.color || 'bg-gray-400'} flex items-center justify-center flex-shrink-0`}>
              <NodeIcon name={nodeDef?.iconName || 'Box'} size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-800">
                {selectedNode.data.label}
              </h3>
              <p className="text-xs text-gray-500">{nodeDef?.description}</p>
            </div>
          </div>
          <button
            onClick={handleDeleteNode}
            className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-gray-400 hover:text-red-500"
            title="Delete node"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Settings size={14} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Configuration
          </span>
        </div>

        {nodeDef?.configFields.map((field) => (
          <div key={field.name}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {field.label}
            </label>
            {field.type === 'text' && (
              <input
                type="text"
                value={selectedNode.data.config?.[field.name] || ''}
                onChange={(e) => handleConfigChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
            {field.type === 'number' && (
              <input
                type="number"
                value={selectedNode.data.config?.[field.name] || ''}
                onChange={(e) => handleConfigChange(field.name, Number(e.target.value))}
                placeholder={field.placeholder}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
            {field.type === 'select' && (
              <select
                value={selectedNode.data.config?.[field.name] || field.defaultValue || ''}
                onChange={(e) => handleConfigChange(field.name, e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select...</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
            {field.type === 'toggle' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedNode.data.config?.[field.name] ?? field.defaultValue ?? false}
                    onChange={(e) => handleConfigChange(field.name, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="text-sm text-gray-600">
                  {selectedNode.data.config?.[field.name] ?? field.defaultValue ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            )}
          </div>
        ))}

        {/* Node Status */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Status
            </span>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            selectedNode.data.status === 'success' ? 'bg-green-100 text-green-700' :
            selectedNode.data.status === 'error' ? 'bg-red-100 text-red-700' :
            selectedNode.data.status === 'running' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              selectedNode.data.status === 'success' ? 'bg-green-500' :
              selectedNode.data.status === 'error' ? 'bg-red-500' :
              selectedNode.data.status === 'running' ? 'bg-blue-500 animate-pulse' :
              'bg-gray-400'
            }`}></span>
            {selectedNode.data.status || 'idle'}
          </div>
        </div>

        {/* CSV Uploader for load_csv nodes */}
        {selectedNode.data.nodeType === 'load_csv' && (
          <CsvUploader nodeId={selectedNode.id} />
        )}

        {/* Chart Preview for generate_chart nodes */}
        {selectedNode.data.nodeType === 'generate_chart' && chartData && chartType && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Info size={14} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Chart Preview
              </span>
            </div>
            <ChartPreview
              data={chartData}
              chartType={chartType}
              title={selectedNode.data.config?.title || 'Generated Chart'}
            />
          </div>
        )}

        {/* Data Preview */}
        {selectedNode.data.outputPreview && selectedNode.data.outputPreview.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Table size={14} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Data Preview
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    {Object.keys(selectedNode.data.outputPreview[0]).map((key) => (
                      <th key={key} className="px-2 py-1 text-left font-medium text-gray-600 border-b">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedNode.data.outputPreview.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50">
                      {Object.values(row).map((val: any, j: number) => (
                        <td key={j} className="px-2 py-1 text-gray-700">
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
      </div>
    </div>
  );
}
