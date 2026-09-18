import { useCallback, useRef, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  type NodeTypes,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { usePipelineStore, NODE_DEFINITIONS } from '../../store/pipelineStore';
import CustomNode from './CustomNode';
import AdvancedTransformationNode from './AdvancedTransformationNode';
import { ErrorBoundary } from '../ErrorBoundary';
import { v4 as uuidv4 } from 'uuid';
import { Workflow, Upload } from 'lucide-react';
import Papa from 'papaparse';

function FlowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const {
    currentNodes,
    currentEdges,
    setCurrentNodes,
    setCurrentEdges,
    setSelectedNodeId,
    isExecuting,
    setCsvData,
  } = usePipelineStore();
  
  const [isDragging, setIsDragging] = useState(false);

  const nodeTypes = useMemo<NodeTypes>(() => ({
    pipelineNode: CustomNode as any,
    advancedNode: AdvancedTransformationNode as any,
  }), []);
  
  // Handle CSV file drag-and-drop on canvas
  const handleCanvasDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      
      const files = event.dataTransfer.files;
      if (files.length === 0) return;
      
      const file = files[0];
      if (!file.name.endsWith('.csv')) {
        alert('Please drop a CSV file');
        return;
      }
      
      // Parse the CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length > 0 || results.data.length === 0) {
            alert('Error parsing CSV file');
            return;
          }
          
          const data = results.data as any[];
          const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });
          
          // Create a Load CSV node
          const newNode: Node = {
            id: uuidv4(),
            type: 'pipelineNode',
            position,
            data: {
              label: 'Load CSV',
              nodeType: 'load_csv',
              config: {
                fileName: file.name,
                delimiter: ',',
                hasHeader: true,
              },
              status: 'idle',
            },
          };
          
          // Store the CSV data
          setCsvData(newNode.id, data);
          setCurrentNodes([...currentNodes, newNode]);
        },
        error: () => {
          alert('Error parsing CSV file');
        },
      });
    },
    [currentNodes, setCurrentNodes, setCsvData, screenToFlowPosition]
  );
  
  const handleCanvasDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  }, []);
  
  const handleCanvasDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

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

      // Use advancedNode type for new transformation nodes
      const isAdvancedNode = ['flatten_json', 'mask_pii', 'ai_extract'].includes(type);
      const nodeType = isAdvancedNode ? 'advancedNode' : 'pipelineNode';

      const newNode: Node = {
        id: uuidv4(),
        type: nodeType,
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
      <div className="relative w-full h-full">
        {/* Drop zone overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-blue-50 border-4 border-dashed border-blue-400 flex items-center justify-center pointer-events-none">
            <div className="bg-white px-8 py-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <Upload className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">Drop CSV file here</p>
                  <p className="text-sm text-gray-500">Your data will be loaded automatically</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
          onDragLeave={handleCanvasDragLeave}
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
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <Workflow size={32} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Build Your Pipeline
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Drag nodes from the left panel onto the canvas and connect them to create your data pipeline
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                <p className="text-xs font-semibold text-blue-700 mb-1">Load your CSV data:</p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Click "Upload CSV" button in the top bar</li>
                  <li>• Drag & drop a CSV file directly onto this canvas</li>
                  <li>• Add a "Load CSV" node and upload in properties panel</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        </ReactFlow>
      </div>
    </div>
  );
}

function FlowCanvas() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure ReactFlowProvider is fully initialized
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);
  
  if (!isReady) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading canvas...</p>
        </div>
      </div>
    );
  }
  
  return <FlowCanvasInner />;
}

export function Canvas() {
  return (
    <ErrorBoundary>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </ErrorBoundary>
  );
}
