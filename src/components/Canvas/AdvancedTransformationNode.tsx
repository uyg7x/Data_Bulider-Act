import { memo, useState } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Layers, Shield, Brain, Check } from 'lucide-react';

type NodeStatus = 'idle' | 'running' | 'success' | 'error';
type NodeType = 'flatten_json' | 'mask_pii' | 'ai_extract';

interface AdvancedNodeData {
  label: string;
  nodeType: NodeType | string;
  config: Record<string, any>;
  status?: NodeStatus;
  [key: string]: any;
}

type AdvancedNode = Node<AdvancedNodeData>;

const statusColors: Record<NodeStatus, string> = {
  idle: 'border-gray-300 bg-white',
  running: 'border-blue-400 bg-blue-50',
  success: 'border-emerald-400 bg-emerald-50',
  error: 'border-rose-400 bg-rose-50',
};

const nodeIcons: Record<NodeType, any> = {
  flatten_json: Layers,
  mask_pii: Shield,
  ai_extract: Brain,
};

const nodeColors: Record<NodeType, string> = {
  flatten_json: 'from-violet-500 to-violet-600',
  mask_pii: 'from-rose-500 to-rose-600',
  ai_extract: 'from-purple-500 to-pink-500',
};

function AdvancedTransformationNode({ data, selected }: NodeProps<AdvancedNode>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const nodeType = data.nodeType as NodeType;
  const Icon = nodeIcons[nodeType] || Settings;
  const colorClass = nodeColors[nodeType] || 'from-gray-500 to-gray-600';
  const status: NodeStatus = data.status || 'idle';

  // Get checkboxes based on node type
  const getCheckboxes = () => {
    if (nodeType === 'mask_pii') {
      return [
        { key: 'maskEmails', label: 'Emails' },
        { key: 'maskPhones', label: 'Phone Numbers' },
        { key: 'maskCreditCards', label: 'Credit Cards' },
        { key: 'maskSSN', label: 'SSN' },
      ];
    }
    if (nodeType === 'ai_extract') {
      return [
        { key: 'sentiment', label: 'Sentiment Analysis' },
        { key: 'categorize', label: 'Categorize' },
        { key: 'summarize', label: 'Summarize' },
        { key: 'extract_entities', label: 'Extract Entities' },
      ];
    }
    return [];
  };

  const checkboxes = getCheckboxes();

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      className={`relative px-4 py-3 rounded-xl border-2 min-w-[200px] transition-all duration-200 ${
        statusColors[status]
      } ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
      />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900 truncate">
            {data.label}
          </div>
          <div className="text-xs text-gray-500">
            {nodeType === 'mask_pii' && 'Privacy Protection'}
            {nodeType === 'flatten_json' && 'JSON Processing'}
            {nodeType === 'ai_extract' && 'AI-Powered'}
          </div>
        </div>
        {checkboxes.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Settings size={16} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Expanded Settings */}
      <AnimatePresence>
        {isExpanded && checkboxes.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
              {checkboxes.map((checkbox) => {
                const isChecked = Boolean(data.config?.[checkbox.key]);
                return (
                  <label
                    key={checkbox.key}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-white border-gray-300 group-hover:border-blue-400'
                      }`}
                    >
                      {isChecked && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-xs text-gray-700">{checkbox.label}</span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
      />
    </motion.div>
  );
}

export default memo(AdvancedTransformationNode);
