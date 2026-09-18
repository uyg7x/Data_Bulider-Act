import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Pipeline, Execution, LogEntry, NodeDefinition } from '../types';

// Node definitions - using Lucide icon names and colors instead of emojis
export const NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'load_csv',
    label: 'Load CSV',
    category: 'data_sources',
    iconName: 'FileUp',
    color: 'bg-blue-500',
    description: 'Load data from a CSV file',
    configFields: [
      { name: 'fileName', label: 'File Name', type: 'text', placeholder: 'data.csv' },
      { name: 'delimiter', label: 'Delimiter', type: 'select', options: [',', ';', '\\t', '|'], defaultValue: ',' },
      { name: 'hasHeader', label: 'Has Header Row', type: 'toggle', defaultValue: true },
    ],
  },
  {
    type: 'load_db',
    label: 'Load Database',
    category: 'data_sources',
    iconName: 'Database',
    color: 'bg-indigo-500',
    description: 'Load data from a database query',
    configFields: [
      { name: 'query', label: 'SQL Query', type: 'text', placeholder: 'SELECT * FROM table' },
      { name: 'connection', label: 'Connection', type: 'select', options: ['PostgreSQL', 'MySQL', 'SQLite'], defaultValue: 'PostgreSQL' },
    ],
  },
  {
    type: 'filter_nulls',
    label: 'Filter Nulls',
    category: 'transformations',
    iconName: 'Eraser',
    color: 'bg-amber-500',
    description: 'Remove or fill null values',
    configFields: [
      { name: 'column', label: 'Target Column', type: 'text', placeholder: 'column_name' },
      { name: 'action', label: 'Action', type: 'select', options: ['drop_rows', 'fill_zero', 'fill_mean', 'fill_median'], defaultValue: 'drop_rows' },
    ],
  },
  {
    type: 'rename_columns',
    label: 'Rename Columns',
    category: 'transformations',
    iconName: 'Type',
    color: 'bg-purple-500',
    description: 'Rename data columns',
    configFields: [
      { name: 'oldName', label: 'Old Name', type: 'text', placeholder: 'old_column' },
      { name: 'newName', label: 'New Name', type: 'text', placeholder: 'new_column' },
    ],
  },
  {
    type: 'math_operation',
    label: 'Math Operation',
    category: 'transformations',
    iconName: 'Calculator',
    color: 'bg-pink-500',
    description: 'Perform mathematical operations',
    configFields: [
      { name: 'operation', label: 'Operation', type: 'select', options: ['add', 'subtract', 'multiply', 'divide'], defaultValue: 'add' },
      { name: 'columnA', label: 'Column A', type: 'text', placeholder: 'column_a' },
      { name: 'columnB', label: 'Column B', type: 'text', placeholder: 'column_b' },
      { name: 'resultColumn', label: 'Result Column', type: 'text', placeholder: 'result' },
    ],
  },
  {
    type: 'filter_rows',
    label: 'Filter Rows',
    category: 'transformations',
    iconName: 'Filter',
    color: 'bg-orange-500',
    description: 'Filter rows based on conditions',
    configFields: [
      { name: 'column', label: 'Column', type: 'text', placeholder: 'column_name' },
      { name: 'operator', label: 'Operator', type: 'select', options: ['>', '<', '==', '!=', '>=', '<='], defaultValue: '>' },
      { name: 'value', label: 'Value', type: 'text', placeholder: '0' },
    ],
  },
  {
    type: 'sort_data',
    label: 'Sort Data',
    category: 'transformations',
    iconName: 'ArrowUpDown',
    color: 'bg-teal-500',
    description: 'Sort data by column',
    configFields: [
      { name: 'column', label: 'Sort Column', type: 'text', placeholder: 'column_name' },
      { name: 'order', label: 'Order', type: 'select', options: ['ascending', 'descending'], defaultValue: 'ascending' },
    ],
  },
  {
    type: 'generate_chart',
    label: 'Generate Chart',
    category: 'outputs',
    iconName: 'BarChart3',
    color: 'bg-emerald-500',
    description: 'Create a visualization chart',
    configFields: [
      { name: 'chartType', label: 'Chart Type', type: 'select', options: ['bar', 'line', 'pie', 'scatter', 'area'], defaultValue: 'bar' },
      { name: 'xAxis', label: 'X-Axis Column', type: 'text', placeholder: 'x_column' },
      { name: 'yAxis', label: 'Y-Axis Column', type: 'text', placeholder: 'y_column' },
      { name: 'title', label: 'Chart Title', type: 'text', placeholder: 'My Chart' },
    ],
  },
  {
    type: 'export_csv',
    label: 'Export CSV',
    category: 'outputs',
    iconName: 'Download',
    color: 'bg-cyan-500',
    description: 'Export data as CSV file',
    configFields: [
      { name: 'fileName', label: 'Output File Name', type: 'text', placeholder: 'output.csv' },
      { name: 'includeHeader', label: 'Include Header', type: 'toggle', defaultValue: true },
    ],
  },
  {
    type: 'export_json',
    label: 'Export JSON',
    category: 'outputs',
    iconName: 'FileJson',
    color: 'bg-slate-500',
    description: 'Export data as JSON file',
    configFields: [
      { name: 'fileName', label: 'Output File Name', type: 'text', placeholder: 'output.json' },
      { name: 'prettyPrint', label: 'Pretty Print', type: 'toggle', defaultValue: true },
    ],
  },
];

// Sample data for demo
const generateSampleData = () => {
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney'];
  return names.map((name, i) => ({
    id: i + 1,
    name,
    age: 20 + Math.floor(Math.random() * 40),
    salary: 30000 + Math.floor(Math.random() * 70000),
    city: cities[Math.floor(Math.random() * cities.length)],
    department: ['Engineering', 'Marketing', 'Sales', 'HR'][Math.floor(Math.random() * 4)],
    score: Math.floor(Math.random() * 100),
  }));
};

// Generate chart data from sample data
const generateChartData = (chartType: string, xAxis: string, yAxis: string) => {
  const data = generateSampleData();
  const xCol = xAxis || 'name';
  const yCol = yAxis || 'salary';

  if (chartType === 'pie') {
    // Aggregate for pie chart
    const grouped: Record<string, number> = {};
    data.forEach((row: any) => {
      const key = String(row[xCol] || 'Unknown');
      grouped[key] = (grouped[key] || 0) + Number(row[yCol] || 0);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }

  return data.map((row: any) => ({
    name: String(row[xCol] || row.name),
    value: Number(row[yCol] || row.salary),
    ...row,
  }));
};

interface PipelineState {
  pipelines: Pipeline[];
  executions: Execution[];
  currentNodes: any[];
  currentEdges: any[];
  selectedNodeId: string | null;
  isExecuting: boolean;
  chartData: any[] | null;
  chartType: string | null;
  csvDataStore: Record<string, any[]>; // nodeId -> parsed CSV data
  
  // Actions
  createPipeline: (name: string) => string;
  deletePipeline: (id: string) => void;
  updatePipeline: (id: string, updates: Partial<Pipeline>) => void;
  setCurrentNodes: (nodes: any[]) => void;
  setCurrentEdges: (edges: any[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, any>) => void;
  executePipeline: (pipelineId: string) => Promise<void>;
  loadPipeline: (id: string) => void;
  setChartData: (data: any[] | null, type: string | null) => void;
  setCsvData: (nodeId: string, data: any[]) => void;
  getCsvData: (nodeId: string) => any[] | null;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  pipelines: [
    {
      id: 'demo-1',
      name: 'Employee Data Cleanup',
      canvasJson: { nodes: [], edges: [] },
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:22:00Z',
    },
    {
      id: 'demo-2',
      name: 'Sales Report Generator',
      canvasJson: { nodes: [], edges: [] },
      status: 'draft',
      createdAt: '2024-01-18T09:00:00Z',
      updatedAt: '2024-01-19T16:45:00Z',
    },
    {
      id: 'demo-3',
      name: 'Customer Segmentation',
      canvasJson: { nodes: [], edges: [] },
      status: 'archived',
      createdAt: '2024-01-10T11:00:00Z',
      updatedAt: '2024-01-12T08:30:00Z',
    },
  ],
  executions: [
    {
      id: 'exec-1',
      pipelineId: 'demo-1',
      pipelineName: 'Employee Data Cleanup',
      status: 'success',
      logs: [
        { timestamp: '2024-01-20T14:22:00Z', nodeId: '1', message: 'Loaded CSV: 1,247 rows', level: 'success' },
        { timestamp: '2024-01-20T14:22:01Z', nodeId: '2', message: 'Filtered nulls: removed 23 rows', level: 'info' },
        { timestamp: '2024-01-20T14:22:02Z', nodeId: '3', message: 'Exported CSV: 1,224 rows', level: 'success' },
      ],
      startedAt: '2024-01-20T14:22:00Z',
      completedAt: '2024-01-20T14:22:02Z',
      duration: 2.3,
    },
    {
      id: 'exec-2',
      pipelineId: 'demo-2',
      pipelineName: 'Sales Report Generator',
      status: 'failed',
      logs: [
        { timestamp: '2024-01-19T16:45:00Z', nodeId: '1', message: 'Loaded CSV: 856 rows', level: 'success' },
        { timestamp: '2024-01-19T16:45:01Z', nodeId: '2', message: 'Error: Column "revenue" not found', level: 'error' },
      ],
      startedAt: '2024-01-19T16:45:00Z',
      completedAt: '2024-01-19T16:45:01Z',
      duration: 1.1,
    },
  ],
  currentNodes: [],
  currentEdges: [],
  selectedNodeId: null,
  isExecuting: false,
  chartData: null,
  chartType: null,
  csvDataStore: {},

  createPipeline: (name: string) => {
    const id = uuidv4();
    const newPipeline: Pipeline = {
      id,
      name,
      canvasJson: { nodes: [], edges: [] },
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ pipelines: [...state.pipelines, newPipeline] }));
    return id;
  },

  deletePipeline: (id: string) => {
    set((state) => ({
      pipelines: state.pipelines.filter((p) => p.id !== id),
    }));
  },

  updatePipeline: (id: string, updates: Partial<Pipeline>) => {
    set((state) => ({
      pipelines: state.pipelines.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  setCurrentNodes: (nodes: any[]) => set({ currentNodes: nodes }),
  setCurrentEdges: (edges: any[]) => set({ currentEdges: edges }),
  setSelectedNodeId: (id: string | null) => set({ selectedNodeId: id }),
  setChartData: (data, type) => set({ chartData: data, chartType: type }),
  
  setCsvData: (nodeId: string, data: any[]) => {
    set((state) => ({
      csvDataStore: { ...state.csvDataStore, [nodeId]: data },
    }));
  },
  
  getCsvData: (nodeId: string) => {
    return get().csvDataStore[nodeId] || null;
  },

  updateNodeConfig: (nodeId: string, config: Record<string, any>) => {
    set((state) => ({
      currentNodes: state.currentNodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } }
          : node
      ),
    }));
  },

  loadPipeline: (id: string) => {
    const pipeline = get().pipelines.find((p) => p.id === id);
    if (pipeline) {
      set({
        currentNodes: pipeline.canvasJson.nodes,
        currentEdges: pipeline.canvasJson.edges,
      });
    }
  },

  executePipeline: async (pipelineId: string) => {
    const { currentNodes } = get();
    
    if (currentNodes.length === 0) return;

    set({ isExecuting: true, chartData: null, chartType: null });

    // Reset all node statuses
    set((state) => ({
      currentNodes: state.currentNodes.map((node) => ({
        ...node,
        data: { ...node.data, status: 'idle' as const },
      })),
    }));

    const logs: LogEntry[] = [];
    const sampleData = generateSampleData();
    let currentData = [...sampleData];

    // Topological sort - simple version for linear pipelines
    const sortedNodes = [...currentNodes];
    
    // Simulate execution
    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      const nodeDef = NODE_DEFINITIONS.find((n) => n.type === node.data?.nodeType);
      
      // Set node to running
      set((state) => ({
        currentNodes: state.currentNodes.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, status: 'running' as const } } : n
        ),
      }));

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

      // Process based on node type
      let message = '';
      let success = true;
      const nodeType = node.data?.nodeType;

      switch (nodeType) {
        case 'load_csv': {
          // Use actual uploaded CSV data if available, otherwise use sample data
          const csvData = get().csvDataStore[node.id];
          if (csvData && csvData.length > 0) {
            currentData = [...csvData];
            message = `Loaded CSV: ${currentData.length} rows, ${Object.keys(currentData[0]).length} columns`;
          } else {
            currentData = [...sampleData];
            message = `Loaded CSV (sample): ${currentData.length} rows, ${Object.keys(currentData[0]).length} columns. Upload a CSV file to use real data.`;
          }
          break;
        }
        case 'load_db':
          currentData = [...sampleData];
          message = `Database query returned ${currentData.length} rows`;
          break;
        case 'filter_nulls':
          const beforeCount = currentData.length;
          const colName = node.data.config?.column;
          currentData = currentData.filter((row: any) => row[colName] != null);
          const removed = beforeCount - currentData.length;
          message = `Filtered nulls: removed ${removed} rows, ${currentData.length} remaining`;
          break;
        case 'rename_columns':
          message = `Renamed column "${node.data.config?.oldName}" to "${node.data.config?.newName}"`;
          break;
        case 'math_operation':
          message = `Applied ${node.data.config?.operation} on ${node.data.config?.columnA} and ${node.data.config?.columnB}`;
          break;
        case 'filter_rows':
          const filteredCount = currentData.length;
          currentData = currentData.filter(() => Math.random() > 0.2);
          message = `Filtered rows: ${filteredCount} to ${currentData.length} rows`;
          break;
        case 'sort_data':
          message = `Sorted by "${node.data.config?.column}" (${node.data.config?.order || 'ascending'})`;
          break;
        case 'generate_chart': {
          const chartType = node.data.config?.chartType || 'bar';
          const firstRow = currentData[0] as any;
          const xAxis = node.data.config?.xAxis || (firstRow ? Object.keys(firstRow)[0] : 'name');
          const yAxis = node.data.config?.yAxis || (firstRow ? Object.keys(firstRow).find(k => typeof firstRow[k] === 'number') : 'value') || 'value';
          
          // Generate chart data from currentData
          let chartData: any[];
          if (chartType === 'pie') {
            const grouped: Record<string, number> = {};
            currentData.forEach((row: any) => {
              const key = String(row[xAxis] || 'Unknown');
              grouped[key] = (grouped[key] || 0) + Number(row[yAxis] || 0);
            });
            chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));
          } else {
            chartData = currentData.map((row: any) => ({
              name: String(row[xAxis] || ''),
              value: Number(row[yAxis] || 0),
              ...row,
            }));
          }
          
          set({ chartData, chartType });
          message = `Generated ${chartType} chart with ${chartData.length} data points`;
          break;
        }
        case 'export_csv':
          message = `Exported CSV: ${currentData.length} rows to ${node.data.config?.fileName || 'output.csv'}`;
          break;
        case 'export_json':
          message = `Exported JSON: ${currentData.length} rows to ${node.data.config?.fileName || 'output.json'}`;
          break;
        default:
          message = `Processed node: ${nodeDef?.label || nodeType}`;
      }

      // Random failure simulation (5% chance)
      if (Math.random() < 0.05 && i > 0) {
        success = false;
        message = `Error processing node: Unexpected data type mismatch`;
      }

      logs.push({
        timestamp: new Date().toISOString(),
        nodeId: node.id,
        message,
        level: success ? (nodeType.startsWith('export') || nodeType.startsWith('load') ? 'success' : 'info') : 'error',
      });

      // Update node status
      set((state) => ({
        currentNodes: state.currentNodes.map((n) =>
          n.id === node.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  status: success ? ('success' as const) : ('error' as const),
                  outputPreview: currentData.slice(0, 5),
                },
              }
            : n
        ),
      }));

      if (!success) break;
    }

    // Create execution record
    const allSuccess = get().currentNodes.every((n) => n.data.status === 'success');
    const execution: Execution = {
      id: uuidv4(),
      pipelineId,
      pipelineName: get().pipelines.find((p) => p.id === pipelineId)?.name || 'Unknown',
      status: allSuccess ? 'success' : 'failed',
      logs,
      outputData: allSuccess ? currentData.slice(0, 10) : undefined,
      startedAt: new Date(Date.now() - logs.length * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      duration: logs.length * 1.2,
    };

    set((state) => ({
      executions: [execution, ...state.executions],
      isExecuting: false,
    }));

    // Update pipeline status
    get().updatePipeline(pipelineId, { status: allSuccess ? 'active' : 'draft' });
  },
}));
