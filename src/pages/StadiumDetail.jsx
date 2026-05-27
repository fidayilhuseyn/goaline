import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Star, MapPin, Loader2, CheckCircle2 } from 'lucide-react';

const TIME_SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

const StadiumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Generate today + next 7 days
  useEffect(() => {
    const generatedDates = [];
    for (let i = 0; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split('T')[0]; // YYYY-MM-DD
      generatedDates.push({
        value: dateString,
        display: d.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
    setDates(generatedDates);
    setSelectedDate(generatedDates[0].value);
  }, []);

  // Fetch Stadium Data
  useEffect(() => {
    const fetchStadium = async () => {
      try {
        const { data, error } = await supabase
          .from('stadiums')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setStadium(data);
      } catch (err) {
        console.error('Error fetching stadium:', err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchStadium();
  }, [id]);

  // Fetch Bookings for Selected Date
  useEffect(() => {
    const fetchBookings = async () => {
      if (!id || !selectedDate) return;
      
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('time_slot')
          .eq('stadium_id', id)
          .eq('date', selectedDate);
          
        if (error) throw error;
        setBookedSlots(data.map(b => b.time_slot));
        setSelectedSlot(''); // Reset selection when date changes
      } catch (err) {
        console.error('Error fetching bookings:', err.message);
      }
    };
    
    fetchBookings();
  }, [id, selectedDate]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!selectedSlot) return;

    try {
      setBookingLoading(true);
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            stadium_id: id,
            date: selectedDate,
            time_slot: selectedSlot,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      
      setBookingSuccess(true);
      setBookedSlots(prev => [...prev, selectedSlot]);
      setSelectedSlot('');
      
      // Hide success message after 3 seconds
      setTimeout(() => setBookingSuccess(false), 3000);
      
    } catch (err) {
      console.error('Error creating booking:', err.message);
      alert('Error creating booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-slate-400">
        <Loader2 size={48} className="animate-spin text-primary mb-4" />
      </div>
    );
  }

  if (!stadium) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-xl text-slate-400">{t('stadiums.no_results')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-surface rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col lg:flex-row">
          
          {/* Left Column: Image & Details */}
          <div className="lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-700/50">
            <div className="h-64 sm:h-80 lg:h-96 relative">
              <img 
                src={stadium.image_url} 
                alt={stadium.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-slate-700/50">
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-white text-lg">{stadium.rating}</span>
              </div>
            </div>
            
            <div className="p-8">
              <h1 className="text-4xl font-extrabold text-white mb-4">{stadium.name}</h1>
              
              <div className="flex flex-col gap-3 text-slate-300">
                <div className="flex items-center text-lg">
                  <MapPin size={20} className="text-primary mr-3" />
                  <span>{stadium.address}, {stadium.city}</span>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-700/50 flex items-baseline">
                <span className="text-4xl font-black text-primary">{stadium.price_per_hour} AZN</span>
                <span className="text-slate-400 ml-2">{t('stadiums.per_hour')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Interface */}
          <div className="lg:w-1/2 p-8 bg-slate-800/30 flex flex-col">
            
            {/* Success Message */}
            {bookingSuccess && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-xl flex items-center gap-3 mb-8 animate-pulse">
                <CheckCircle2 size={24} />
                <p className="font-medium text-lg">{t('detail.success')}</p>
              </div>
            )}
          
            {/* Date Picker */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">{t('detail.select_date')}</h3>
              <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar">
                {dates.map((dateObj) => (
                  <button
                    key={dateObj.value}
                    onClick={() => setSelectedDate(dateObj.value)}
                    className={`flex-shrink-0 px-5 py-3 rounded-xl border font-medium transition-colors ${
                      selectedDate === dateObj.value
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {dateObj.display}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-white mb-4">{t('detail.available_slots')}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;
                  
                  return (
                    <button
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-xl border font-bold text-center transition-all ${
                        isBooked
                          ? 'bg-slate-800/50 border-slate-800 text-slate-600 cursor-not-allowed'
                          : isSelected
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-105'
                            : 'bg-surface border-slate-700 text-slate-200 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {slot}
                      {isBooked && (
                        <span className="block text-[10px] uppercase mt-1 opacity-70">
                          {t('detail.booked')}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Book Button */}
            <div className="mt-10 pt-6 border-t border-slate-700/50">
              <button
                onClick={handleBooking}
                disabled={!selectedSlot || bookingLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white text-xl font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:hover:bg-primary disabled:hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {bookingLoading && <Loader2 size={24} className="animate-spin" />}
                {!bookingLoading && t('detail.book_button')}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default StadiumDetail;
