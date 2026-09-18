import { Sidebar as NodePalette } from './Sidebar';
import { PropertiesPanel } from './PropertiesPanel';
import { Canvas } from './Canvas/Canvas';
import { useAppStore } from '../store/appStore';
import { usePipelineStore } from '../store/pipelineStore';
import { Play, Save, ArrowLeft, Upload } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

export function Builder() {
  const { setCurrentTab, selectedPipelineId, setSelectedPipelineId } = useAppStore();
  const {
    currentNodes,
    currentEdges,
    isExecuting,
    executePipeline,
    updatePipeline,
    pipelines,
    createPipeline,
    loadPipeline,
    setCurrentNodes,
    setCsvData,
  } = usePipelineStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If no pipeline selected, auto-create one; otherwise load it
  useEffect(() => {
    if (!selectedPipelineId) {
      const id = createPipeline('New Pipeline');
      setSelectedPipelineId(id);
    } else {
      loadPipeline(selectedPipelineId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPipelineId]);

  const pipeline = pipelines.find((p) => p.id === selectedPipelineId);
  
  // Handle CSV file upload from button
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }
    
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
        
        // Create a Load CSV node with the data
        const newNode = {
          id: uuidv4(),
          type: 'pipelineNode',
          position: { x: 250 + Math.random() * 200, y: 150 + currentNodes.length * 100 },
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
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRun = async () => {
    if (selectedPipelineId) {
      await executePipeline(selectedPipelineId);
    }
  };

  const handleSave = () => {
    if (selectedPipelineId) {
      updatePipeline(selectedPipelineId, {
        canvasJson: { nodes: currentNodes, edges: currentEdges },
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="font-semibold text-gray-800">
              {pipeline?.name || 'Untitled Pipeline'}
            </h2>
            <p className="text-xs text-gray-500">
              {currentNodes.length} nodes · {currentEdges.length} connections
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm font-medium cursor-pointer">
            <Upload size={16} />
            Upload CSV
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            <Save size={16} />
            Save
          </button>
          <button
            onClick={handleRun}
            disabled={isExecuting || currentNodes.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Play size={16} />
            {isExecuting ? 'Running...' : 'Run Pipeline'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}
