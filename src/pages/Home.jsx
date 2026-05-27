import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, CalendarCheck, Trophy } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to stadiums page and optionally pass the search query
    navigate(`/stadiums?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-green-700/10 blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-green-700/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center">
            <div className="absolute left-4 text-slate-400">
              <Search size={24} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('home.search_placeholder')}
              className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-full py-4 pl-12 pr-36 focus:outline-none focus:border-green-700 text-lg shadow-lg transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 bg-green-700 hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-full transition-colors flex items-center justify-center"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800 p-8 rounded-2xl text-center border border-slate-700 hover:border-green-700/50 transition-colors shadow-xl">
              <div className="w-16 h-16 bg-green-700/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {t('home.feature1')}
              </h3>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800 p-8 rounded-2xl text-center border border-slate-700 hover:border-green-700/50 transition-colors shadow-xl">
              <div className="w-16 h-16 bg-green-700/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {t('home.feature2')}
              </h3>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800 p-8 rounded-2xl text-center border border-slate-700 hover:border-green-700/50 transition-colors shadow-xl">
              <div className="w-16 h-16 bg-green-700/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {t('home.feature3')}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>GoaLine © 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
