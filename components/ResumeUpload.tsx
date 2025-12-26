import React, { useCallback, useState } from 'react';
import { UploadCloud, File as FileIcon, X, AlertCircle } from 'lucide-react';
import { UploadedFile } from '../types';

interface ResumeUploadProps {
  onFileUpload: (file: UploadedFile | null) => void;
  isLoading: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setError(null);
    if (file.type !== 'application/pdf') {
      setError("Only PDF files are supported currently.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Data = result.split(',')[1];
      
      setFileName(file.name);
      onFileUpload({
        name: file.name,
        type: file.type,
        data: base64Data
      });
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  }, [onFileUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const removeFile = useCallback(() => {
    setFileName(null);
    onFileUpload(null);
    setError(null);
  }, [onFileUpload]);

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out text-center ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-slate-300 hover:border-slate-400 bg-slate-50'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="resume-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleChange}
          accept=".pdf"
          disabled={isLoading || !!fileName}
        />

        {fileName ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">{fileName}</p>
              <p className="text-xs text-slate-500">Ready for analysis</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent input trigger
                removeFile();
              }}
              className="z-20 flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-3 h-3 mr-1" /> Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-200' : 'bg-slate-200'}`}>
              <UploadCloud className={`w-8 h-8 ${dragActive ? 'text-blue-600' : 'text-slate-500'}`} />
            </div>
            <div>
              <p className="text-base font-medium text-slate-700">
                Drag & drop your resume here
              </p>
              <p className="text-sm text-slate-500 mt-1">
                or click to browse files (PDF only)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center text-sm text-red-600 bg-red-50 p-2 rounded-md">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
