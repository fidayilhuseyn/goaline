import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, MapPin } from 'lucide-react';

const StadiumCard = ({ stadium }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-surface rounded-2xl overflow-hidden shadow-lg border border-slate-700/50 hover:border-primary/50 transition-all group flex flex-col h-full">
      <div className="h-48 relative overflow-hidden">
        <img 
          src={stadium.image_url} 
          alt={stadium.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-slate-700/50">
          <Star size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-white">{stadium.rating}</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors line-clamp-1">
          {stadium.name}
        </h3>
        <div className="flex items-center text-slate-400 text-sm mb-4">
          <MapPin size={16} className="mr-1" />
          <span>{stadium.city}</span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
          <div className="text-white flex items-baseline">
            <span className="text-2xl font-bold text-primary">{stadium.price_per_hour} AZN</span>
            <span className="text-slate-400 text-sm ml-1">{t('stadiums.per_hour')}</span>
          </div>
          <Link 
            to={`/stadiums/${stadium.id}`} 
            className="bg-slate-700 hover:bg-primary text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {t('stadiums.book_now')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StadiumCard;
