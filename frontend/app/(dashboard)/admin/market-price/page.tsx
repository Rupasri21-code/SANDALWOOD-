'use client';

import React, { useState, useEffect } from 'react';
import { IndianRupee, Save, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketPriceAdminPage() {
  const [formData, setFormData] = useState({
    marketPrice: 15000000,
    grade: 'A-Grade Indian Red Sandalwood',
    unit: 'Ton',
    source: 'Government Auction & Verified Industry Reports',
    lastUpdated: new Date().toISOString(),
    verified: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMarketPrice();
  }, []);

  const fetchMarketPrice = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
      const response = await fetch(`${apiUrl}/market-price`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          marketPrice: data.marketPrice || 15000000,
          grade: data.grade || 'A-Grade Indian Red Sandalwood',
          unit: data.unit || 'Ton',
          source: data.source || 'Government Auction & Verified Industry Reports',
          lastUpdated: data.lastUpdated || new Date().toISOString(),
          verified: data.verified !== undefined ? data.verified : true
        });
      }
    } catch (error) {
      console.error('Error fetching market price:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
      // Use token if available in local storage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/market-price/admin/market-price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...formData,
          lastUpdated: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update market price');
      }

      setMessage('Market price updated successfully.');
      setFormData(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
    } catch (error: any) {
      setMessage(error.message || 'Error updating market price.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8A14A]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <IndianRupee className="w-6 h-6 text-[#C8A14A]" />
          Market Price Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Update the global market price for Indian Sandalwood. This value will be immediately reflected on the public Investment Calculator widget.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#0B241C] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#C49A5A]/20"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Market Price (₹)</label>
              <input 
                type="number" 
                value={formData.marketPrice}
                onChange={(e) => setFormData({...formData, marketPrice: parseFloat(e.target.value) || 0})}
                className="w-full h-[44px] bg-gray-50 dark:bg-[#0A1A14] border border-gray-200 dark:border-[#C49A5A]/30 text-gray-900 dark:text-[#F7F0E4] rounded-xl px-4 focus:outline-none focus:border-[#C8A14A]"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Grade</label>
              <input 
                type="text" 
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                className="w-full h-[44px] bg-gray-50 dark:bg-[#0A1A14] border border-gray-200 dark:border-[#C49A5A]/30 text-gray-900 dark:text-[#F7F0E4] rounded-xl px-4 focus:outline-none focus:border-[#C8A14A]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unit</label>
              <input 
                type="text" 
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-full h-[44px] bg-gray-50 dark:bg-[#0A1A14] border border-gray-200 dark:border-[#C49A5A]/30 text-gray-900 dark:text-[#F7F0E4] rounded-xl px-4 focus:outline-none focus:border-[#C8A14A]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Source</label>
              <input 
                type="text" 
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                className="w-full h-[44px] bg-gray-50 dark:bg-[#0A1A14] border border-gray-200 dark:border-[#C49A5A]/30 text-gray-900 dark:text-[#F7F0E4] rounded-xl px-4 focus:outline-none focus:border-[#C8A14A]"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input 
              type="checkbox" 
              id="verified"
              checked={formData.verified}
              onChange={(e) => setFormData({...formData, verified: e.target.checked})}
              className="w-5 h-5 accent-[#C8A14A] rounded cursor-pointer"
            />
            <label htmlFor="verified" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Mark as Officially Verified
            </label>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-[#C49A5A]/20 pt-6">
            <span className="text-xs text-gray-500">Last Updated: {new Date(formData.lastUpdated).toLocaleString()}</span>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm ${message.includes('success') ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#C8A14A] hover:bg-[#b08d40] text-white px-6 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Update Market Price'}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
