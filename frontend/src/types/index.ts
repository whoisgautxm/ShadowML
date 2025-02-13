export interface Model {
  id: string;
  provider: string;
  name: string;
  description: string;
  inputFormat: string;
  pricePerPrediction: number;
  codeHash: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ProofInput {
  length: number;
  breadth: number;
  height: number;
  width: number;
}

export interface ProofData {
  proof: string;
  timestamp: string;
  status: 'pending' | 'verified';
}

export interface VerificationData {
  isValid: boolean;
  verificationHash: string;
  timestamp: string;
  details: {
    modelName: string;
    inputParameters: ProofInput;
    computationTime: string;
    confidence: number;
  };
}