import { useMemo, useState } from "react";

type Props = {
  startHour?: number;
  endHour?: number;
  stepMinutes?: number;
  selected?: string;
  onSelect?: (value: string) => void;
  selectedDate?: Date;
};

const HoursCarousel = ({ 
  startHour = 9, 
  endHour = 19, 
  stepMinutes = 30, 
  selected, 
  onSelect, 
  selectedDate 
}: Props) => {
  const [showWarning, setShowWarning] = useState(false);
  
  const slots = useMemo(() => {
    const res: { time: string; disabled: boolean }[] = [];
    const now = new Date();
    const isToday = selectedDate && 
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear();
    
    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += stepMinutes) {
        const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        
        // Check if this time slot is in the past for today's date
        let disabled = false;
        if (isToday) {
          const slotTime = new Date(now);
          slotTime.setHours(h, m, 0, 0);
          disabled = slotTime < now;
        }
        
        res.push({ time: label, disabled });
      }
    }
    return res;
  }, [startHour, endHour, stepMinutes, selectedDate]);

  const handleTimeClick = (time: string, disabled: boolean) => {
    if (disabled) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000); // Hide warning after 3 seconds
      return;
    }
    onSelect && onSelect(time);
  };

  return (
    <div className="mt-4 w-full">
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2 max-w-full">
        {slots.map(({ time, disabled }) => {
          const active = time === selected;
          return (
            <button
              key={time}
              onClick={() => handleTimeClick(time, disabled)}
              disabled={disabled}
              className={`rounded-lg px-2 py-2 md:px-3 md:py-3 text-xs md:text-sm font-medium transition-all duration-200 will-change-transform ${
                disabled
                  ? "bg-neutral-700 text-neutral-500 cursor-not-allowed opacity-50"
                  : active
                  ? "bg-amber-500 text-black scale-105 shadow-lg shadow-amber-500/20"
                  : "bg-neutral-800 text-white hover:bg-neutral-700 hover:scale-105 active:scale-95"
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
      
      {/* Warning message for past time slots */}
      {showWarning && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span>⏰</span>
            <span className="text-sm">Este horário já passou!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoursCarousel;