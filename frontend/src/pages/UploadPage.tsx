import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    provider: '',
    name: '',
    description: '',
    inputFormat: '',
    pricePerPrediction: '',
    codeHash: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate proof generation
    setTimeout(() => {
      setIsGenerating(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Model</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload your AI model and generate a zero-knowledge proof
            </p>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Provider Address
                </label>
                {address ? (
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={address}
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="0x..."
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Input Format
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.inputFormat}
                  onChange={(e) => setFormData({ ...formData, inputFormat: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price Per Prediction (ETH)
                </label>
                <input
                  type="number"
                  required
                  step="0.000000000000000001"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.pricePerPrediction}
                  onChange={(e) => setFormData({ ...formData, pricePerPrediction: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code Hash
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.codeHash}
                  onChange={(e) => setFormData({ ...formData, codeHash: e.target.value })}
                  placeholder="0x..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="min-w-[120px]"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Onchain on Arbitrum'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};