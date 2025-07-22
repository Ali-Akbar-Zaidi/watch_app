'use client';

import { useState } from 'react';
import { saveWatch, Watch, WatchCategory } from '../lib/auth';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

export default function AddWatchForm() {
  const router = useRouter();
  const [watch, setWatch] = useState<Omit<Watch, 'id'>>({
    name: '',
    price: 0,
    description: '',
    features: [],
    category: 'Simple',
    image: ''
  });
  const [currentFeature, setCurrentFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    details?: string[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);
    
    try {
      const result = await saveWatch({
        ...watch,
        id: Date.now().toString()
      });

      if (!result.success) {
        throw new Error('Failed to save watch');
      }

      let message = 'Watch added successfully!';
      const details: string[] = [];

      if (result.emailResults) {
        if (result.emailResults.successCount > 0) {
          details.push(`Notified ${result.emailResults.successCount} users`);
        }
        if (result.emailResults.errors.length > 0) {
          details.push(...result.emailResults.errors);
        }
      }

      setNotification({
        message,
        type: details.length ? (result.emailResults?.errors.length ? 'warning' : 'success') : 'success',
        details: details.length ? details : undefined
      });

      setTimeout(() => router.push('/admin/products'), 3000);
    } catch (error) {
      setNotification({
        message: 'Failed to add watch. Please try again.',
        type: 'error',
        details: error instanceof Error ? [error.message] : undefined
      });
      console.error('Error adding watch:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setWatch(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setWatch(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add New Watch</h1>
      
      {notification && (
        <div className={`mb-4 p-3 rounded border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : notification.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="font-medium">{notification.message}</div>
          {notification.details && (
            <ul className="mt-2 text-sm list-disc list-inside">
              {notification.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name*</label>
          <input
            type="text"
            value={watch.name}
            onChange={(e) => setWatch({...watch, name: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price (PKR)*</label>
          <input
            type="number"
            value={watch.price || ''}
            onChange={(e) => setWatch({...watch, price: Number(e.target.value) || 0})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="0"
            step="1000"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description*</label>
          <textarea
            value={watch.description}
            onChange={(e) => setWatch({...watch, description: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category*</label>
          <select
            value={watch.category}
            onChange={(e) => setWatch({...watch, category: e.target.value as WatchCategory})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="Simple">Simple</option>
            <option value="Luxury">Luxury</option>
            <option value="Vintage">Vintage</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Image URL*</label>
          <ImageUpload
            currentImage={watch.image}
            onImageChange={(url) => setWatch({...watch, image: url})}
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Features</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a feature"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
          <ul className="space-y-1">
            {watch.features.map((feature, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSubmitting
                ? 'bg-gray-400 focus:ring-gray-300'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Watch'}
          </button>
        </div>
      </form>
    </div>
  );
}