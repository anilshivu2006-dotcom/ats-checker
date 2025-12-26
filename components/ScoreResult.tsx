import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreResultProps {
  score: number;
}

const ScoreResult: React.FC<ScoreResultProps> = ({ score }) => {
  const data = [{ value: score }];
  
  // Determine color based on score
  let color = '#ef4444'; // red-500
  if (score >= 80) color = '#22c55e'; // green-500
  else if (score >= 60) color = '#eab308'; // yellow-500

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">ATS Score</h3>
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            innerRadius="80%" 
            outerRadius="100%" 
            barSize={15} 
            data={data} 
            startAngle={90} 
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background
              clockWise
              dataKey="value"
              cornerRadius={10}
              fill={color}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-slate-900">{score}%</span>
          <span className="text-xs text-slate-500 font-medium uppercase mt-1">Match Rate</span>
        </div>
      </div>
      <p className="text-center text-sm text-slate-600 mt-4 px-4">
        {score >= 80 ? "Excellent! Your resume is highly optimized." : 
         score >= 60 ? "Good start, but there's room for improvement." : 
         "Needs attention. Consider adding more relevant keywords."}
      </p>
    </div>
  );
};

export default ScoreResult;
