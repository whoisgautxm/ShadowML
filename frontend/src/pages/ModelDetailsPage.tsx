import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Flag, ArrowLeft, Loader } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { useStore } from '../store';
import { ProofInput, ProofData, VerificationData } from '../types';

export const ModelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const models = useStore((state) => state.models);
  const model = models.find((m) => m.id === id);
  const proofSectionRef = useRef<HTMLDivElement>(null);
  const verificationSectionRef = useRef<HTMLDivElement>(null);

  const [showProofModal, setShowProofModal] = useState(false);
  const [proofInput, setProofInput] = useState<ProofInput>({
    length: 0,
    breadth: 0,
    height: 0,
    width: 0,
  });
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proofData, setProofData] = useState<ProofData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);

  const handleGenerateProof = async () => {
    setIsGeneratingProof(true);
    // Simulate API call
    setTimeout(() => {
      const mockProofData = {
        proof: {
          hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7',
          inputs: proofInput,
          timestamp: new Date().toISOString(),
          modelId: id,
          status: 'pending',
          metadata: {
            algorithm: 'zk-SNARK',
            protocol: 'Groth16',
            curve: 'BN254'
          }
        },
        signature: '0xabc123def456...',
        nonce: '987654321'
      };
      setProofData(mockProofData);
      setIsGeneratingProof(false);
      setShowProofModal(false);
      setTimeout(() => {
        proofSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2000);
  };

  const handleVerifyProof = async () => {
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setVerificationData({
        isValid: true,
        verificationHash: '0xabcdef1234567890',
        timestamp: new Date().toISOString(),
        details: {
          modelName: model?.name || '',
          inputParameters: proofInput,
          computationTime: '1.23s',
          confidence: 0.985
        }
      });
      setIsVerifying(false);
      setTimeout(() => {
        verificationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2000);
  };

  if (!model) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Model not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{model.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{model.description}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Model Information</h3>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Provider Address</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{model.provider}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Input Format</dt>
                <dd className="mt-1 text-sm text-gray-900">{model.inputFormat}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Price Per Prediction</dt>
                <dd className="mt-1 text-sm text-gray-900">{model.pricePerPrediction} ETH</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Details</h3>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Code Hash</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{model.codeHash}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {model.isActive ? 'Active' : 'Inactive'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              <Flag className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
            <Button onClick={() => setShowProofModal(true)}>
              Generate Proof
            </Button>
          </div>
        </div>

        {proofData && (
          <div ref={proofSectionRef} className="px-6 py-5 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Proof</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm font-mono overflow-auto whitespace-pre-wrap">
                {JSON.stringify(proofData, null, 2)}
              </pre>
              <div className="mt-4">
                <Button onClick={handleVerifyProof} disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Verifying Proof
                    </>
                  ) : (
                    'Verify Proof'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {verificationData && (
          <div ref={verificationSectionRef} className="px-6 py-5 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Results</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm font-mono overflow-auto whitespace-pre-wrap">
                {JSON.stringify(verificationData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {showProofModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Proof</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Length</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={proofInput.length}
                  onChange={(e) => setProofInput({ ...proofInput, length: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Breadth</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={proofInput.breadth}
                  onChange={(e) => setProofInput({ ...proofInput, breadth: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={proofInput.height}
                  onChange={(e) => setProofInput({ ...proofInput, height: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Width</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={proofInput.width}
                  onChange={(e) => setProofInput({ ...proofInput, width: Number(e.target.value) })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowProofModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateProof}
                  disabled={isGeneratingProof}
                >
                  {isGeneratingProof ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Generating Proof
                    </>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};