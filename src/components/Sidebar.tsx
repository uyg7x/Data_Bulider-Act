import { NODE_DEFINITIONS } from '../store/pipelineStore';
import { usePipelineStore } from '../store/pipelineStore';
import { useAppStore } from '../store/appStore';
import { v4 as uuidv4 } from 'uuid';
import { Database, Wrench, Send, Search } from 'lucide-react';
import { useState } from 'react';

const categoryIcons = {
  data_sources: Database,
  transformations: Wrench,
  outputs: Send,
};

const categoryLabels = {
  data_sources: 'Data Sources',
  transformations: 'Transformations',
  outputs: 'Outputs',
};

export function Sidebar() {
  const { setCurrentNodes, currentNodes } = usePipelineStore();
  const { selectedPipelineId } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = NODE_DEFINITIONS.filter(
    (node) =>
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['data_sources', 'transformations', 'outputs'] as const;

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddNode = (nodeType: string) => {
    const nodeDef = NODE_DEFINITIONS.find((n) => n.type === nodeType);
    if (!nodeDef) return;

    const newNode = {
      id: uuidv4(),
      type: 'pipelineNode',
      position: {
        x: 250 + Math.random() * 200,
        y: 100 + currentNodes.length * 100,
      },
      data: {
        label: nodeDef.label,
        nodeType: nodeType,
        config: {},
        status: 'idle',
      },
    };

    setCurrentNodes([...currentNodes, newNode]);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-200">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">Node Palette</h3>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map((category) => {
          const categoryNodes = filteredNodes.filter((n) => n.category === category);
          if (categoryNodes.length === 0) return null;

          const Icon = categoryIcons[category];

          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {categoryLabels[category]}
                </span>
              </div>
              <div className="space-y-1.5">
                {categoryNodes.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type)}
                    onClick={() => handleAddNode(node.type)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg cursor-grab active:cursor-grabbing transition-all group"
                    title={node.description}
                  >
                    <span className="text-lg">{node.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                        {node.label}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {node.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Drag nodes to canvas or click to add
        </p>
      </div>
    </div>
  );
}
