import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import StadiumCard from '../components/StadiumCard';
import MapView from '../components/MapView';
import { Loader2, MapPin } from 'lucide-react';

const Stadiums = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetchStadiums();
  }, []);

  const fetchStadiums = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stadiums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setStadiums(data || []);
      
      // Extract unique cities for the filter dropdown
      const uniqueCities = [...new Set((data || []).map(s => s.city))];
      setCities(uniqueCities);
      
    } catch (error) {
      console.error('Error fetching stadiums:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter stadiums based on selected city and query
  const filteredStadiums = stadiums.filter(stadium => {
    const matchesCity = selectedCity === '' || stadium.city === selectedCity;
    const matchesQuery = initialQuery === '' || 
                         stadium.name.toLowerCase().includes(initialQuery.toLowerCase()) || 
                         stadium.city.toLowerCase().includes(initialQuery.toLowerCase());
    return matchesCity && matchesQuery;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">{t('stadiums.title')}</h1>
            {initialQuery && (
              <p className="text-slate-400">Search results for: "<span className="text-white">{initialQuery}</span>"</p>
            )}
          </div>
          
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label htmlFor="city-filter" className="text-sm font-medium text-slate-400">
              {t('stadiums.filter')}
            </label>
            <div className="relative">
              <select
                id="city-filter"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <Loader2 size={48} className="animate-spin text-primary mb-4" />
            <p>Loading stadiums...</p>
          </div>
        ) : filteredStadiums.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredStadiums.map((stadium) => (
                <StadiumCard key={stadium.id} stadium={stadium} />
              ))}
            </div>
            
            {/* Map View */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6">Stadiums on Map</h2>
              <MapView stadiums={filteredStadiums} />
            </div>
          </>
        ) : (
          <div className="bg-surface border border-slate-800 rounded-2xl p-16 text-center shadow-xl">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin size={32} className="text-slate-500" />
            </div>
            <p className="text-2xl font-bold text-white mb-2">{t('stadiums.no_results')}</p>
            <p className="text-slate-400">Try adjusting your filters or search query.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Stadiums;
