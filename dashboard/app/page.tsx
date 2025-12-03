'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { AggregatedDemographics } from '../../shared/types';
import DemographicsCard from './components/DemographicsCard';
import AgeChart from './components/AgeChart';
import GenderChart from './components/GenderChart';
import LocationMap from './components/LocationMap';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
  const [data, setData] = useState<AggregatedDemographics | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkSchoolId, setNetworkSchoolId] = useState<string>('');

  useEffect(() => {
    loadDemographics();
  }, [networkSchoolId]);

  const loadDemographics = async () => {
    setLoading(true);
    try {
      const url = networkSchoolId 
        ? `${API_URL}/api/demographics/${networkSchoolId}`
        : `${API_URL}/api/demographics`;
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error('Error loading demographics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-3 gradient-text">
            NS Demographics Dashboard
          </h1>
          <p className="text-white text-lg opacity-90">
            Privacy-preserving demographic tracking for Network States
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Live Data</span>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Filter by Network School ID (leave empty for all)"
              value={networkSchoolId}
              onChange={(e) => setNetworkSchoolId(e.target.value)}
              className="w-full px-4 py-3 pl-10 glass rounded-xl border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800 placeholder-gray-500"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-6 animate-fade-in">
            <DemographicsCard data={data} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AgeChart data={data.ageDistribution} />
              <GenderChart data={data.genderDistribution} />
            </div>

            <LocationMap locations={data.locationDistribution} />
          </div>
        ) : (
          <div className="text-center py-12 glass rounded-xl">
            <p className="text-gray-600 text-lg">No demographic data available</p>
          </div>
        )}
      </div>
    </main>
  );
}

