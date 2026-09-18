import { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';

interface CsvUploaderProps {
  nodeId: string;
}

export function CsvUploader({ nodeId }: CsvUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setCsvData, csvDataStore } = usePipelineStore();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const existingData = csvDataStore[nodeId];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setStatus('error');
      setMessage('Please upload a CSV file');
      return;
    }

    setStatus('loading');
    setFileName(file.name);
    setMessage('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setStatus('error');
          setMessage(`Parse error: ${results.errors[0].message}`);
          return;
        }

        const data = results.data as any[];
        if (data.length === 0) {
          setStatus('error');
          setMessage('CSV file is empty');
          return;
        }

        setCsvData(nodeId, data);
        setStatus('success');
        setMessage(`Loaded ${data.length} rows, ${Object.keys(data[0]).length} columns`);
      },
      error: (error) => {
        setStatus('error');
        setMessage(`Error: ${error.message}`);
      },
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Upload size={14} className="text-gray-500" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Upload CSV File
        </span>
      </div>

      <div className="space-y-2">
        {/* File Input */}
        <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg cursor-pointer transition-all group">
          <Upload size={18} className="text-gray-400 group-hover:text-blue-500" />
          <span className="text-sm text-gray-500 group-hover:text-blue-600 font-medium">
            Choose CSV file or drag here
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Status */}
        {status === 'loading' && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
            <Loader2 size={14} className="animate-spin" />
            <span>Parsing {fileName}...</span>
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
            <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">{fileName}</div>
              <div className="text-xs text-green-600 mt-0.5">{message}</div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-md">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">{fileName || 'Error'}</div>
              <div className="text-xs text-red-600 mt-0.5">{message}</div>
            </div>
          </div>
        )}

        {/* Existing data info */}
        {existingData && existingData.length > 0 && status === 'idle' && (
          <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
            <FileText size={14} className="flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Data loaded</div>
              <div className="text-xs text-green-600 mt-0.5">
                {existingData.length} rows, {Object.keys(existingData[0]).length} columns
              </div>
              <div className="text-xs text-green-600 mt-0.5">
                Columns: {Object.keys(existingData[0]).join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Data Preview */}
        {existingData && existingData.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-medium text-gray-600 mb-1.5">
              Preview (first 5 rows):
            </div>
            <div className="overflow-x-auto border border-gray-200 rounded-md max-h-48">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {Object.keys(existingData[0]).map((key) => (
                      <th key={key} className="px-2 py-1.5 text-left font-medium text-gray-600 border-b whitespace-nowrap">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {existingData.slice(0, 5).map((row: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      {Object.values(row).map((val: any, j: number) => (
                        <td key={j} className="px-2 py-1 text-gray-700 whitespace-nowrap">
                          {val === null || val === undefined ? (
                            <span className="text-gray-400 italic">null</span>
                          ) : (
                            String(val)
                          )}
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
