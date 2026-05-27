import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!user && !loading) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchBookings();
    }
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          date,
          time_slot,
          status,
          stadiums (
            name,
            city
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      // Update local state
      setBookings(prev => 
        prev.map(b => 
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );
    } catch (err) {
      console.error('Error cancelling booking:', err.message);
      alert('Error cancelling booking. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'; // pending
    }
  };

  if (!user || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-slate-400">
        <Loader2 size={48} className="animate-spin text-primary mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            {t('dashboard.welcome')}, <span className="text-primary">{user.user_metadata?.full_name || user.email}</span>!
          </h1>
          <p className="text-slate-400 text-lg">
            {t('dashboard.my_bookings')}
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Calendar size={48} className="text-slate-500 mb-4" />
              <p className="text-xl text-slate-400">You don't have any bookings yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-700/50">
                    <th className="p-5 font-semibold text-slate-300">Stadium</th>
                    <th className="p-5 font-semibold text-slate-300">Date & Time</th>
                    <th className="p-5 font-semibold text-slate-300">Status</th>
                    <th className="p-5 font-semibold text-slate-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                            <MapPin size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{booking.stadiums?.name}</p>
                            <p className="text-sm text-slate-400">{booking.stadiums?.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <div className="flex items-center text-white mb-1">
                            <Calendar size={14} className="mr-2 text-slate-400" />
                            {booking.date}
                          </div>
                          <div className="flex items-center text-slate-400 text-sm">
                            <Clock size={14} className="mr-2" />
                            {booking.time_slot}
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                          {t(`dashboard.status.${booking.status}`)}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                          >
                            {t('dashboard.cancel')}
                          </button>
                        )}
                        {booking.status !== 'pending' && (
                          <span className="text-slate-500 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
