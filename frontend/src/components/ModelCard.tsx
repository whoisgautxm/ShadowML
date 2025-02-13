import React from 'react';
import { Link } from 'react-router-dom';
import { Model } from '../types';
import { Button } from './Button';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ModelCardProps {
  model: Model;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const getStatusIcon = () => {
    switch (model.status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (model.status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{model.name}</h3>
        <div className={`flex items-center px-3 py-1 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="ml-2 text-sm capitalize">{model.status}</span>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{model.description}</p>
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm text-gray-500">Type</span>
          <p className="font-medium text-gray-900">{model.type}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Accuracy</span>
          <p className="font-medium text-gray-900">{model.accuracy}%</p>
        </div>
      </div>
      <Link to={`/model/${model.id}`}>
        <Button variant="primary" className="w-full">
          View Details
        </Button>
      </Link>
    </div>
  );
};