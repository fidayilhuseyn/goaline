import React from 'react';

const BookingForm = () => {
  return (
    <div className="bg-surface p-6 rounded-xl shadow-lg border border-slate-700/50">
      <h3 className="text-xl font-bold mb-4">Book this Stadium</h3>
      <form className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Date</label>
          <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Time</label>
          <input type="time" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" />
        </div>
        <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
