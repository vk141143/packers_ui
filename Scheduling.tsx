import React, { useState, useEffect } from 'react';

interface SchedulingProps {
  quoteId: string;
  onScheduleConfirmed: (scheduleData: any) => void;
}

export const Scheduling: React.FC<SchedulingProps> = ({
  quoteId,
  onScheduleConfirmed
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    const response = await fetch(`/api/scheduling/available/${quoteId}`);
    const slots = await response.json();
    setAvailableSlots(slots);
  };

  const confirmSchedule = async () => {
    const scheduleData = {
      quoteId,
      date: selectedDate,
      time: selectedTime
    };

    await fetch('/api/scheduling/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleData)
    });

    onScheduleConfirmed(scheduleData);
  };

  return (
    <div className="scheduling">
      <h3>Schedule Your Move</h3>
      
      <div className="date-selection">
        <label>Select Date:</label>
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          <option value="">Choose date...</option>
          {availableSlots.map((slot: any) => (
            <option key={slot.date} value={slot.date}>
              {slot.date}
            </option>
          ))}
        </select>
      </div>

      <div className="time-selection">
        <label>Select Time:</label>
        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
          <option value="">Choose time...</option>
          {availableSlots
            .find((slot: any) => slot.date === selectedDate)
            ?.times?.map((time: string) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
        </select>
      </div>

      <button 
        onClick={confirmSchedule}
        disabled={!selectedDate || !selectedTime}
        className="confirm-schedule-btn"
      >
        Confirm Schedule
      </button>
    </div>
  );
};