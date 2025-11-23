import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarPickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const CalendarPicker = ({ selectedDate, onDateSelect }: CalendarPickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Dias vazios no início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };
  
  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const formatDateLabel = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return "Hoje";
    if (date.toDateString() === tomorrow.toDateString()) return "Amanhã";
    
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[date.getDay()];
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const days = getDaysInMonth(currentMonth);
  
  return (
    <div className="w-full">
      {/* Header do calendário */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-neutral-400" />
        </button>
        <h3 className="text-lg font-semibold text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </button>
      </div>
      
      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs text-neutral-400 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Dias do mês */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="aspect-square">
            {date && (
              <button
                onClick={() => !isPast(date) && onDateSelect(date)}
                disabled={isPast(date)}
                className={`
                  w-full h-full rounded-lg text-sm font-medium transition-all
                  ${isSelected(date) 
                    ? 'bg-amber-500 text-black font-semibold' 
                    : isToday(date)
                    ? 'bg-amber-500/20 text-amber-400'
                    : isPast(date)
                    ? 'text-neutral-600 cursor-not-allowed'
                    : 'text-neutral-300 hover:bg-neutral-800'
                  }
                `}
              >
                <div className="flex flex-col items-center justify-center">
                  <span>{date.getDate()}</span>
                  {isToday(date) && (
                    <span className="text-xs">Hoje</span>
                  )}
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Data selecionada */}
      {selectedDate && (
        <div className="mt-4 p-3 rounded-lg bg-neutral-800 border border-neutral-700">
          <p className="text-sm text-neutral-300">
            Data selecionada: <span className="text-amber-400 font-medium">
              {formatDateLabel(selectedDate)}, {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;