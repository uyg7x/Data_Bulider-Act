import { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { usePipelineStore, NODE_DEFINITIONS } from '../../store/pipelineStore';
import CustomNode from './CustomNode';
import { v4 as uuidv4 } from 'uuid';
import { Workflow } from 'lucide-react';

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
    isExecuting,
  } = usePipelineStore();

  // Use React Flow's built-in state management
  const [nodes, setNodes, onNodesChangeRF] = useNodesState(currentNodes);
  const [edges, setEdges, onEdgesChangeRF] = useEdgesState(currentEdges);

  // Track if update is coming from external source to prevent circular updates
  const isExternalUpdate = useRef(false);

  // Sync external state changes to React Flow state
  // Skip sync during execution to prevent ResizeObserver loop
  useEffect(() => {
    if (!isExternalUpdate.current && !isExecuting) {
      setNodes(currentNodes);
    }
  }, [currentNodes, setNodes, isExecuting]);

  useEffect(() => {
    if (!isExternalUpdate.current && !isExecuting) {
      setEdges(currentEdges);
    }
  }, [currentEdges, setEdges, isExecuting]);

  // Handle node changes and sync to Zustand
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChangeRF(changes);
      // Apply changes to get the new state and sync to Zustand
      const updatedNodes = applyNodeChanges(changes, nodes);
      isExternalUpdate.current = true;
      setCurrentNodes(updatedNodes);
      // Reset flag after a tick
      requestAnimationFrame(() => {
        isExternalUpdate.current = false;
      });
    },
    [nodes, onNodesChangeRF, setCurrentNodes]
  );

  // Handle edge changes and sync to Zustand
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChangeRF(changes);
      // Apply changes to get the new state and sync to Zustand
      const updatedEdges = applyEdgeChanges(changes, edges);
      isExternalUpdate.current = true;
      setCurrentEdges(updatedEdges);
      requestAnimationFrame(() => {
        isExternalUpdate.current = false;
      });
    },
    [edges, onEdgesChangeRF, setCurrentEdges]
  );

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
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
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

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, screenToFlowPosition]
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

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
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
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <Workflow size={32} className="text-blue-500" />
              </div>
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
