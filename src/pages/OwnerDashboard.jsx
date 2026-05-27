import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Calendar, Clock, Building2, TrendingUp, MapPin } from 'lucide-react';

const OwnerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [stadiums, setStadiums] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get local date string YYYY-MM-DD
  const getLocalDateString = (date = new Date()) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const todayStr = getLocalDateString();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        
        // 1. Fetch stadiums owned by current user
        const { data: stadiumsData, error: stadiumsError } = await supabase
          .from('stadiums')
          .select('*')
          .eq('owner_id', user.id);

        if (stadiumsError) throw stadiumsError;
        setStadiums(stadiumsData || []);

        if (stadiumsData && stadiumsData.length > 0) {
          const stadiumIds = stadiumsData.map(s => s.id);

          // 2. Fetch bookings for these stadiums
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              stadiums (
                name
              )
            `)
            .in('stadium_id', stadiumIds)
            .order('created_at', { ascending: false });

          if (bookingsError) throw bookingsError;

          // 3. Fetch user profiles for the bookings
          const userIds = [...new Set(bookingsData.map(b => b.user_id))];
          let profilesMap = {};
          if (userIds.length > 0) {
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('id, full_name, email')
              .in('id', userIds);
            
            if (profilesError) {
              console.error('Error fetching user profiles:', profilesError.message);
            } else if (profilesData) {
              profilesData.forEach(p => {
                profilesMap[p.id] = p;
              });
            }
          }

          // Enriched bookings with profile details
          const enrichedBookings = bookingsData.map(b => ({
            ...b,
            userProfile: profilesMap[b.user_id] || { full_name: 'Guest User', email: 'guest@goaline.com' }
          }));

          setBookings(enrichedBookings);
        }
      } catch (err) {
        console.error('Error loading owner dashboard data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculations for stats
  const totalStadiums = stadiums.length;
  
  const todayBookings = bookings.filter(b => b.date === todayStr);
  const activeTodayBookingsCount = todayBookings.filter(b => b.status !== 'cancelled').length;

  const thisMonthBookings = bookings.filter(b => {
    const bDate = new Date(b.date);
    return bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear;
  });
  const activeThisMonthBookingsCount = thisMonthBookings.filter(b => b.status !== 'cancelled').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'; // pending
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-slate-400">
        <Loader2 size={48} className="animate-spin text-primary mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            {t('owner.welcome')}, <span className="text-primary">{user?.user_metadata?.full_name || user?.email}</span>
          </h1>
          <p className="text-slate-400 text-lg">
            {t('owner.dashboard_subtitle', 'Manage your stadiums and view incoming reservations.')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Total Stadiums */}
          <div className="bg-surface p-6 rounded-2xl border border-slate-700/50 shadow-xl flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Building2 size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{t('owner.total_stadiums', 'Total Stadiums')}</p>
              <p className="text-3xl font-extrabold text-white mt-1">{totalStadiums}</p>
            </div>
          </div>

          {/* Card 2: Bookings Today */}
          <div className="bg-surface p-6 rounded-2xl border border-slate-700/50 shadow-xl flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Calendar size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{t('owner.bookings_today', 'Bookings Today')}</p>
              <p className="text-3xl font-extrabold text-white mt-1">{activeTodayBookingsCount}</p>
            </div>
          </div>

          {/* Card 3: Bookings This Month */}
          <div className="bg-surface p-6 rounded-2xl border border-slate-700/50 shadow-xl flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{t('owner.bookings_this_month', 'Bookings This Month')}</p>
              <p className="text-3xl font-extrabold text-white mt-1">{activeThisMonthBookingsCount}</p>
            </div>
          </div>
        </div>

        {/* Today's Bookings Table */}
        <div className="bg-surface rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden mb-10">
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/20">
            <h2 className="text-2xl font-bold text-white">{t('owner.today_bookings', "Today's Bookings")}</h2>
          </div>
          
          {todayBookings.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Calendar size={48} className="text-slate-500 mb-4" />
              <p className="text-xl text-slate-400">{t('owner.no_bookings_today', 'No bookings scheduled for today.')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/30 border-b border-slate-700/50">
                    <th className="p-5 font-semibold text-slate-300">{t('owner.stadium_name', 'Stadium')}</th>
                    <th className="p-5 font-semibold text-slate-300">{t('owner.user_info', 'User Info')}</th>
                    <th className="p-5 font-semibold text-slate-300">{t('owner.time_slot', 'Time Slot')}</th>
                    <th className="p-5 font-semibold text-slate-300">{t('owner.status', 'Status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {todayBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-800/10 transition-colors">
                      {/* Stadium info */}
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <MapPin size={16} />
                          </div>
                          <span className="font-bold text-white">{booking.stadiums?.name}</span>
                        </div>
                      </td>
                      {/* User Info */}
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{booking.userProfile?.full_name}</span>
                          <span className="text-xs text-slate-400">{booking.userProfile?.email}</span>
                        </div>
                      </td>
                      {/* Time slot */}
                      <td className="p-5">
                        <div className="flex items-center text-white">
                          <Clock size={15} className="mr-2 text-slate-400" />
                          <span>{booking.time_slot}</span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="p-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                          {t(`dashboard.status.${booking.status}`)}
                        </span>
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

export default OwnerDashboard;
