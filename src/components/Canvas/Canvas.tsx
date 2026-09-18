import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { usePipelineStore, NODE_DEFINITIONS } from '../../store/pipelineStore';
import CustomNode from './CustomNode';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
  pipelineNode: CustomNode,
};

function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const {
    currentNodes,
    currentEdges,
    setCurrentNodes,
    setCurrentEdges,
    setSelectedNodeId,
    selectedNodeId,
  } = usePipelineStore();

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      const newEdge: Edge = {
        id: uuidv4(),
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
      };
      setCurrentEdges(addEdge(newEdge, currentEdges));
    },
    [currentEdges, setCurrentEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const nodeDef = NODE_DEFINITIONS.find((n) => n.type === type);
      if (!nodeDef) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: uuidv4(),
        type: 'pipelineNode',
        position,
        data: {
          label: nodeDef.label,
          nodeType: type,
          config: {},
          status: 'idle',
        },
      };

      setCurrentNodes([...currentNodes, newNode]);
    },
    [currentNodes, setCurrentNodes, screenToFlowPosition]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const onNodesChange = useCallback(
    (changes: any[]) => {
      // Handle position changes and removals
      let updatedNodes = [...currentNodes];
      
      for (const change of changes) {
        if (change.type === 'position' && change.position) {
          updatedNodes = updatedNodes.map((n) =>
            n.id === change.id ? { ...n, position: change.position } : n
          );
        } else if (change.type === 'remove') {
          updatedNodes = updatedNodes.filter((n) => n.id !== change.id);
        }
      }
      
      setCurrentNodes(updatedNodes);
    },
    [currentNodes, setCurrentNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any[]) => {
      let updatedEdges = [...currentEdges];
      
      for (const change of changes) {
        if (change.type === 'remove') {
          updatedEdges = updatedEdges.filter((e) => e.id !== change.id);
        }
      }
      
      setCurrentEdges(updatedEdges);
    },
    [currentEdges, setCurrentEdges]
  );

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={currentNodes}
        edges={currentEdges}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls className="!bg-white !border-gray-200 !shadow-md" />
        <MiniMap
          className="!bg-white !border-gray-200"
          nodeColor={(node) => {
            switch (node.data?.status) {
              case 'success': return '#22c55e';
              case 'error': return '#ef4444';
              case 'running': return '#3b82f6';
              default: return '#94a3b8';
            }
          }}
        />
        {currentNodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Build Your Pipeline
              </h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Drag nodes from the left panel onto the canvas and connect them to create your data pipeline
              </p>
            </div>
          </div>
        )}
      </ReactFlow>
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
