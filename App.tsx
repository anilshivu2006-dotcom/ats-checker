import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ResumeUpload from './components/ResumeUpload';
import ScoreResult from './components/ScoreResult';
import KeywordMatch from './components/KeywordMatch';
import { UploadedFile, AtsAnalysisResult } from './types';
import { analyzeResume } from './services/geminiService';
import { Loader2, ArrowLeft, Lightbulb, CheckCheck } from 'lucide-react';

const App: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobRole, setJobRole] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AtsAnalysisResult | null>(null);

  const handleAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const data = await analyzeResume(file.data, file.type, jobDescription, jobRole);
      setResult(data);
    } catch (error) {
      alert("Analysis failed. Please try again.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    // Keep file and JD for easy re-checking if needed
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result ? (
          // Input Section
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded mr-3">STEP 1</span>
                  Upload Resume
                </h2>
                <ResumeUpload onFileUpload={setFile} isLoading={isAnalyzing} />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                   <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded mr-3">STEP 2</span>
                   Job Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Job Role / Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                      placeholder="e.g. Senior Frontend Engineer"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      disabled={isAnalyzing}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full h-48 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all text-sm leading-relaxed"
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      disabled={isAnalyzing}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
               <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white h-full flex flex-col justify-center items-start">
                  <h1 className="text-3xl font-bold mb-4">Optimize your resume for ATS algorithms.</h1>
                  <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                    Get an instant match score, find missing keywords, and receive tailored suggestions to land your dream interview.
                  </p>
                  
                  <div className="w-full">
                    <button
                      onClick={handleAnalysis}
                      disabled={!file || isAnalyzing || jobDescription.length < 50 || jobRole.length < 3}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center ${
                        !file || isAnalyzing || jobDescription.length < 50 || jobRole.length < 3
                          ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                          : 'bg-white text-blue-700 hover:bg-blue-50 active:scale-95'
                      }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Resume"
                      )}
                    </button>
                    {(!file || jobDescription.length < 50 || jobRole.length < 3) && !isAnalyzing && (
                      <p className="text-xs text-blue-200 mt-3 text-center opacity-80">
                        Please complete all fields (Role, Description) and upload a resume.
                      </p>
                    )}
                  </div>
               </div>
            </div>
          </div>
        ) : (
          // Results Section
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={resetAnalysis}
              className="mb-6 flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm group"
            >
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Input
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Score Column */}
              <div className="md:col-span-1">
                <ScoreResult score={result.score} />
              </div>
              
              {/* Keywords Column */}
              <div className="md:col-span-2">
                <KeywordMatch matched={result.matchedKeywords} missing={result.missingKeywords} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <FileTextIcon className="w-5 h-5 mr-2 text-blue-500" />
                    Executive Summary
                 </h3>
                 <p className="text-slate-600 leading-relaxed text-sm">
                    {result.summary}
                 </p>
              </div>

              {/* Suggestions */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Improvement Suggestions
                 </h3>
                 <ul className="space-y-3">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-600">
                         <CheckCheck className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                         <span>{suggestion}</span>
                      </li>
                    ))}
                 </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Simple Icon component for reuse within this file
const FileTextIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
    <line x1="10" x2="8" y1="9" y2="9"/>
  </svg>
);

export default App;