import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface KeywordMatchProps {
  matched: string[];
  missing: string[];
}

const KeywordMatch: React.FC<KeywordMatchProps> = ({ matched, missing }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Keyword Analysis</h3>
      
      <div className="space-y-6">
        {/* Matched Keywords */}
        <div>
          <div className="flex items-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm font-medium text-slate-700">Matched Keywords ({matched.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matched.length > 0 ? (
              matched.map((keyword, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400 italic">No exact keywords matched.</span>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div>
          <div className="flex items-center mb-3">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-sm font-medium text-slate-700">Missing Keywords ({missing.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.length > 0 ? (
              missing.map((keyword, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400 italic">Great job! No major keywords missing.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordMatch;
