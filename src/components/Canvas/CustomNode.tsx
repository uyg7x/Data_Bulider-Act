import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NODE_DEFINITIONS } from '../../store/pipelineStore';

type NodeStatus = 'idle' | 'running' | 'success' | 'error';

const statusColors: Record<string, string> = {
  idle: 'border-gray-300 bg-white',
  running: 'border-blue-400 bg-blue-50 animate-pulse',
  success: 'border-green-400 bg-green-50',
  error: 'border-red-400 bg-red-50',
};

const statusIcons: Record<string, string> = {
  idle: '',
  running: '⏳',
  success: '✅',
  error: '❌',
};

function CustomNode({ data, selected }: NodeProps) {
  const nodeDef = NODE_DEFINITIONS.find((n: any) => n.type === data.nodeType);
  const status: NodeStatus = data.status || 'idle';
  const icon = nodeDef?.icon || '📦';

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 shadow-md min-w-[180px] transition-all duration-200 ${
        statusColors[status] || statusColors.idle
      } ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
      />
      
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-800">
            {data.label}
          </div>
          {data.config && Object.keys(data.config).length > 0 && (
            <div className="text-xs text-gray-500 mt-0.5 truncate">
              {Object.entries(data.config)
                .filter(([, v]) => v)
                .slice(0, 2)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')}
            </div>
          )}
        </div>
        {status !== 'idle' && (
          <span className="text-sm">{statusIcons[status] || ''}</span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(CustomNode);
