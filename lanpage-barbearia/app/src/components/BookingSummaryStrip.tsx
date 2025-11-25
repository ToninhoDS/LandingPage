const professionalImages: Record<string, string> = {
  "Luiz": "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20barber%20with%20short%20hair%20wearing%20black%20barber%20uniform%20smiling%20confident%20studio%20portrait&image_size=square",
  "Carlos": "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20barber%20with%20modern%20style%20wearing%20white%20barber%20coat%20confident%20portrait&image_size=square",
  "Ana": "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20female%20barber%20with%20elegant%20appearance%20wearing%20black%20uniform%20friendly%20smile%20portrait&image_size=square",
  "João": "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20barber%20with%20beard%20wearing%20gray%20uniform%20experienced%20look%20portrait&image_size=square"
};

const getProfessionalImage = (name: string | undefined) => {
  return name ? professionalImages[name] || "👨‍💈" : "👨‍💈";
};

interface BookingSummaryStripProps {
  selectedProfessional?: string;
  selectedService?: string;
  selectedDay?: Date;
  selectedTime?: string;
  compact?: boolean;
  onJump?: (stepIndex: number) => void;
}

const BookingSummaryStrip = ({ 
  selectedProfessional, 
  selectedService, 
  selectedDay, 
  selectedTime,
  compact = false,
  onJump
}: BookingSummaryStripProps) => {
  if (!selectedProfessional && !selectedService && !selectedDay && !selectedTime) {
    return null;
  }

  return (
    <div className={`mb-4 p-3 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700 ${compact ? 'scale-90' : ''}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {selectedProfessional && (
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-neutral-700/40 rounded-lg px-2 py-2 transition hover:ring-1 hover:ring-amber-500/40"
            onClick={() => onJump && onJump(0)}
          >
            <img 
              src={getProfessionalImage(selectedProfessional)} 
              alt={selectedProfessional}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs text-neutral-400">Profissional</p>
              <p className="text-sm font-semibold text-amber-400 truncate">{selectedProfessional}</p>
            </div>
          </div>
        )}
        
        {selectedService && (
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-neutral-700/40 rounded-lg px-2 py-2 transition hover:ring-1 hover:ring-amber-500/40"
            onClick={() => onJump && onJump(1)}
          >
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">✂️</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-400">Serviço</p>
              <p className="text-sm font-semibold text-amber-400 truncate">{selectedService}</p>
            </div>
          </div>
        )}
        
        {selectedDay && (
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-neutral-700/40 rounded-lg px-2 py-2 transition hover:ring-1 hover:ring-amber-500/40"
            onClick={() => onJump && onJump(2)}
          >
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📅</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-400">Data</p>
              <p className="text-sm font-semibold text-amber-400 truncate">
                {selectedDay.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
        )}
        
        {selectedTime && (
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-neutral-700/40 rounded-lg px-2 py-2 transition hover:ring-1 hover:ring-amber-500/40"
            onClick={() => onJump && onJump(3)}
          >
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">⏰</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-400">Horário</p>
              <p className="text-sm font-semibold text-amber-400 truncate">{selectedTime}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSummaryStrip;