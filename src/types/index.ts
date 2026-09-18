export type PipelineStatus = 'draft' | 'active' | 'archived';
export type ExecutionStatus = 'pending' | 'running' | 'success' | 'failed';

export interface Pipeline {
  id: string;
  name: string;
  canvasJson: {
    nodes: any[];
    edges: any[];
  };
  status: PipelineStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Execution {
  id: string;
  pipelineId: string;
  pipelineName: string;
  status: ExecutionStatus;
  logs: LogEntry[];
  outputData?: any[];
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

export interface LogEntry {
  timestamp: string;
  nodeId?: string;
  message: string;
  level: 'info' | 'warning' | 'error' | 'success';
}

export type NodeCategory = 'data_sources' | 'transformations' | 'outputs';

export interface NodeDefinition {
  type: string;
  label: string;
  category: NodeCategory;
  icon: string;
  description: string;
  configFields: ConfigField[];
}

export interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'toggle' | 'file' | 'number';
  options?: string[];
  defaultValue?: any;
  placeholder?: string;
}

export interface PipelineNode {
  id: string;
  type: string;
  data: {
    label: string;
    config: Record<string, any>;
    status?: 'idle' | 'running' | 'success' | 'error';
    outputPreview?: any[];
  };
  position: { x: number; y: number };
}
