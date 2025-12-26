export interface AtsAnalysisResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  summary: string;
  suggestions: string[];
}

export interface UploadedFile {
  name: string;
  type: string;
  data: string; // Base64
}
