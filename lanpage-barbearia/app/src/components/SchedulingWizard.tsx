import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import HoursCarousel from "./HoursCarousel";
import CalendarPicker from "./CalendarPicker";
import BookingSummaryStrip from "./BookingSummaryStrip";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

const steps = [
  { label: "Profissional", icon: "👨‍💈" },
  { label: "Serviço", icon: "✂️" },
  { label: "Dia", icon: "📅" },
  { label: "Horário", icon: "⏰" },
  { label: "Seus Dados", icon: "👤" },
  { label: "+1 Pessoa", icon: "👥" },
  { label: "Pagamento", icon: "💳" },
  { label: "Confirmar", icon: "✅" },
];

const services = [
  { name: "Corte de Cabelo", price: "R$ 35", duration: "30 min" },
  { name: "Barba", price: "R$ 25", duration: "20 min" },
  { name: "Combo", price: "R$ 55", duration: "50 min" },
  { name: "Coloração", price: "R$ 70", duration: "60 min" },
];

const professionals = [
  { 
    name: "Luiz", 
    rating: "5.0", 
    avatar: "👨‍💈",
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20barber%20with%20short%20hair%20wearing%20black%20barber%20uniform%20smiling%20confident%20studio%20portrait&image_size=square",
    description: "Especialista em cortes clássicos e barba tradicional com mais de 10 anos de experiência",
    specialties: ["Corte Clássico", "Barba", "Raspar à Navalha"],
    experience: "10 anos"
  },
  { 
    name: "Carlos", 
    rating: "4.9", 
    avatar: "👨‍💈",
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20barber%20with%20modern%20style%20wearing%20white%20barber%20coat%20confident%20portrait&image_size=square",
    description: "Expert em cortes modernos e tendências, sempre atualizado com as últimas modas",
    specialties: ["Corte Moderno", "Degradê", "Platinado"],
    experience: "8 anos"
  },
  { 
    name: "Ana", 
    rating: "5.0", 
    avatar: "👩‍💈",
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20female%20barber%20with%20elegant%20appearance%20wearing%20black%20uniform%20friendly%20smile%20portrait&image_size=square",
    description: "Especialista em cortes para todos os tipos de cabelo, com foco em precisão e estilo",
    specialties: ["Corte Feminino", "Tintura", "Mechas"],
    experience: "12 anos"
  },
  { 
    name: "João", 
    rating: "4.8", 
    avatar: "👨‍💈",
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20barber%20with%20beard%20wearing%20gray%20uniform%20experienced%20look%20portrait&image_size=square",
    description: "Mestre em barba e cuidados masculinos, tradição e precisão em cada serviço",
    specialties: ["Barba Completa", "Bigode", "Corte Militar"],
    experience: "15 anos"
  },
];

const days = [
  { label: "Hoje", date: "Hoje" },
  { label: "Amanhã", date: "Amanhã" },
  { label: "Segunda", date: "17/11" },
  { label: "Terça", date: "18/11" },
];

const payments = [
  { name: "Pix", icon: "📱", color: "bg-emerald-500" },
  { name: "Cartão", icon: "💳", color: "bg-blue-500" },
  { name: "No local", icon: "💵", color: "bg-amber-500" },
  { name: "Antecipado", icon: "💰", color: "bg-purple-500" },
];

interface SchedulingWizardProps {
  onNavbarBack?: () => void;
  onCancel?: () => void;
}

export interface SchedulingWizardRef {
  handleNavbarBack: () => void;
}

const SchedulingWizard = forwardRef<SchedulingWizardRef, SchedulingWizardProps>(({ onNavbarBack, onCancel }, ref) => {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [selectedProfessional, setSelectedProfessional] = useState<string | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedPayment, setSelectedPayment] = useState<string | undefined>(undefined);
  const [addPerson, setAddPerson] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [isSecondPerson, setIsSecondPerson] = useState(false);
  const [bookingCount, setBookingCount] = useState(1);
  const [cameFromAddPerson, setCameFromAddPerson] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userWhatsApp, setUserWhatsApp] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);
  const progress = Math.round(((step + 1) / steps.length) * 100);
  
  const getProfessionalData = (name: string | undefined) => {
    return professionals.find(p => p.name === name);
  };
  
  const [holdUntil, setHoldUntil] = useState<number | undefined>(undefined);
  const [holdRemaining, setHoldRemaining] = useState<number>(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReservationWarning, setShowReservationWarning] = useState(false);
  const [selectedProfessionalDetails, setSelectedProfessionalDetails] = useState<typeof professionals[0] | null>(null);
  const [bookings, setBookings] = useState<Array<{name: string; whatsapp: string; professional?: string; service?: string; day?: Date; time?: string; payment?: string}>>([]);
  const [showBookedModal, setShowBookedModal] = useState(false);
  const [openBookingIndex, setOpenBookingIndex] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const jumpToStep = (target: number) => {
    if (target < 0 || target >= steps.length) return;
    if (target < 4) setShowSummary(false);
    simulateLoading();
    setStep(target);
  };

  const formatShortName = (full: string) => {
    const parts = full.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    const lastInitial = (parts[parts.length - 1][0] || "").toUpperCase();
    return `${parts[0]} ${lastInitial}.`;
  };

  // Expose handleNavbarBack to parent component
  useImperativeHandle(ref, () => ({
    handleNavbarBack
  }));

  useEffect(() => {
    if (!holdUntil) return;
    const id = setInterval(() => {
      const r = Math.max(0, Math.floor((holdUntil - Date.now()) / 1000));
      setHoldRemaining(r);
      if (r === 0) {
        setHoldUntil(undefined);
        setSelectedTime(undefined);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [holdUntil]);

  // Show reservation warning when time is selected
  useEffect(() => {
    if (selectedTime && holdUntil) {
      setShowReservationWarning(true);
      // Hide warning after 5 seconds
      const timer = setTimeout(() => {
        setShowReservationWarning(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedTime, holdUntil]);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  };

  const next = () => {
    // Special logic for step 4 (User Data) - validate name and WhatsApp
    if (step === 4) {
      if (!userName.trim() || !userWhatsApp.trim()) return;
    }
    
    // Special logic for step 5 (+1 Pessoa)
    if (step === 5) {
      // When user clicks Avançar at step 5, proceed to payment regardless
      // Reset flags related to adding person so flow continues
      setAddPerson(undefined);
      setCameFromAddPerson(false);
      setIsSecondPerson(false);
    }
    
    // Validação para garantir que o usuário não pule etapas
    if (step === 0 && !selectedProfessional) return;
    if (step === 1 && !selectedService) return;
    if (step === 2 && !selectedDay) return;
    if (step === 3 && !selectedTime) return;
    
    // Start reservation timer when time is selected
    if (step === 3 && selectedTime && !holdUntil) {
      setHoldUntil(Date.now() + 5 * 60 * 1000);
    }
    
    // Show summary when advancing from step 3 (after selecting time)
    if (step === 3 && selectedTime) {
      setShowSummary(true);
    }
    
    simulateLoading();
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };
  const prev = () => {
    // Hide summary when going back from step 4
    if (step === 4) {
      setShowSummary(false);
    }
    
    // Clear subsequent selections when going back
    if (step === 7) {
      // Going back from confirmation - clear payment selection
      setSelectedPayment(undefined);
    } else if (step === 6) {
      // Going back from payment - clear add person selection if needed
      if (bookingCount === 1) {
        setAddPerson(undefined);
        setIsSecondPerson(false);
      }
    } else if (step === 5) {
      // Going back from add person - clear user data if second person
      if (isSecondPerson) {
        setUserName("");
        setUserWhatsApp("");
        setIsSecondPerson(false);
      }
    } else if (step === 4) {
      // Going back from user data - clear time selection
      setSelectedTime(undefined);
      setHoldUntil(undefined);
      setHoldRemaining(0);
    } else if (step === 3) {
      // Going back from time selection - clear day selection
      setSelectedTime(undefined);
      setHoldUntil(undefined);
      setHoldRemaining(0);
    } else if (step === 2) {
      // Going back from calendar - clear service selection
      setSelectedDay(undefined);
    } else if (step === 1) {
      // Going back from service - clear professional selection
      setSelectedService(undefined);
    }
    
    // Special logic: if we came from add person and are at step 0, go back to step 5 (add person)
    if (step === 0 && cameFromAddPerson) {
      setCameFromAddPerson(false);
      setAddPerson(undefined); // Reset the add person selection
      simulateLoading();
      setStep(5);
      return;
    }
    
    // If user is at step 0 and has added people, go back to step 5 (add person screen)
    if (step === 0 && !cameFromAddPerson && bookingCount > 1) {
      simulateLoading();
      setStep(5);
      return;
    }
    
    // Regular back navigation (no cancel modal for internal back button)
    simulateLoading();
    setStep((s) => Math.max(0, s - 1));
  };

  const handleNavbarBack = () => {
    // If user is at step 0 and hasn't added any person yet, show confirmation modal to cancel
    if (step === 0 && !cameFromAddPerson && bookingCount === 1) {
      setShowCancelModal(true);
      return;
    }
    
    // If onNavbarBack prop is provided, use it
    if (onNavbarBack) {
      onNavbarBack();
      return;
    }
    
    // Otherwise, use regular back navigation
    prev();
  };

  return (
    <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6 md:p-8 max-w-full">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-300">Passo {step + 1} de {steps.length}</span>
          </div>
          <div className="w-32 h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-700 ease-out delay-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {showBookedModal && bookings.length > 0 && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl border border-neutral-700 bg-neutral-900 p-6">
            <h4 className="text-white font-semibold mb-4">Agendamento de <span className="text-amber-400 font-semibold">{formatShortName(openBookingIndex !== null ? bookings[openBookingIndex].name : bookings[0].name)}</span></h4>
            <div className="space-y-2 text-sm text-neutral-300">
              <div className="flex justify-between"><span>Profissional</span><span className="text-white">{(openBookingIndex !== null ? bookings[openBookingIndex].professional : bookings[0].professional) || "—"}</span></div>
              <div className="flex justify-between"><span>Serviço</span><span className="text-white">{(openBookingIndex !== null ? bookings[openBookingIndex].service : bookings[0].service) || "—"}</span></div>
              <div className="flex justify-between"><span>Data</span><span className="text-white">{(openBookingIndex !== null ? bookings[openBookingIndex].day : bookings[0].day) ? ((openBookingIndex !== null ? bookings[openBookingIndex].day : bookings[0].day) as Date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : "—"}</span></div>
              <div className="flex justify-between"><span>Horário</span><span className="text-white">{(openBookingIndex !== null ? bookings[openBookingIndex].time : bookings[0].time) || "—"}</span></div>
              <div className="flex justify-between"><span>Pagamento</span><span className="text-white">{(openBookingIndex !== null ? bookings[openBookingIndex].payment : bookings[0].payment) || "No local"}</span></div>
              <div className="flex justify-between"><span>Nome</span><span className="text-white">{(openBookingIndex !== null ? bookings[openBookingIndex].name : bookings[0].name) || "—"}</span></div>
              <div className="flex justify-between"><span>WhatsApp</span><span className="text-white">{(openBookingIndex !== null ? bookings[openBookingIndex].whatsapp : bookings[0].whatsapp) || "—"}</span></div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="flex-1 rounded-lg bg-neutral-800 text-white px-4 py-3" onClick={() => setShowBookedModal(false)}>Fechar</button>
              <button className="flex-1 rounded-lg bg-red-600 text-white px-4 py-3" onClick={() => setShowDeleteConfirm(true)}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-sm rounded-xl border border-neutral-700 bg-neutral-900 p-5 text-center">
            <p className="text-neutral-200 mb-4">Excluir este agendamento?</p>
            <div className="flex gap-3">
              <button className="flex-1 rounded-lg bg-neutral-800 text-white px-4 py-3" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
              <button className="flex-1 rounded-lg bg-red-600 text-white px-4 py-3" onClick={() => { setBookings(prev => prev.filter((_, i) => i !== (openBookingIndex ?? -1))); setShowDeleteConfirm(false); setShowBookedModal(false); setOpenBookingIndex(null); }}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="mb-4 space-y-2">
          {bookings.map((b, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-between cursor-pointer" onClick={() => { setOpenBookingIndex(idx); setShowBookedModal(true); }}>
              <span className="text-sm text-neutral-400">Agendado <span className="text-amber-400 font-semibold">{formatShortName(b.name)}</span></span>
              <span className="text-white text-lg">+</span>
            </div>
          ))}
        </div>
      )}

      {showSummary && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700">
          <h3 className="text-sm font-medium text-neutral-400 mb-3">{step === 5 ? (<span>Agendado <span className="text-amber-400 font-semibold">{formatShortName(userName)}</span></span>) : 'RESUMO DO AGENDAMENTO'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {selectedProfessional && (
              <div className="flex items-center gap-3 cursor-pointer hover:bg-neutral-700/40 rounded-lg px-2 py-2 transition hover:ring-1 hover:ring-amber-500/40" onClick={() => jumpToStep(0)}>
                <img 
                  src={getProfessionalData(selectedProfessional)?.image || "👨‍💈"} 
                  alt={selectedProfessional}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-400">PROFISSIONAL</p>
                  <p className="text-sm font-semibold text-amber-400 truncate">{selectedProfessional}</p>
                </div>
              </div>
            )}
            
            {selectedService && (
              <div className="flex items-center gap-3 cursor-pointer hover:bg-neutral-700/40 rounded-lg px-2 py-2 transition hover:ring-1 hover:ring-amber-500/40" onClick={() => jumpToStep(1)}>
                <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">✂️</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-400">SERVIÇO</p>
                  <p className="text-sm font-semibold text-amber-400 truncate">{selectedService}</p>
                </div>
              </div>
            )}
            
            {selectedDay && (
              <div className="flex items-center gap-3 cursor-pointer hover:bg-neutral-700/40 rounded-lg px-2 py-2 transition hover:ring-1 hover:ring-amber-500/40" onClick={() => jumpToStep(2)}>
                <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📅</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-400">DATA</p>
                  <p className="text-sm font-semibold text-amber-400 truncate">
                    {selectedDay.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            )}
            
            {selectedTime && (
              <div className="flex items-center gap-3 cursor-pointer hover:bg-neutral-700/40 rounded-lg px-2 py-2 transition hover:ring-1 hover:ring-amber-500/40" onClick={() => jumpToStep(3)}>
                <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">⏰</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-400">HORÁRIO</p>
                  <p className="text-sm font-semibold text-amber-400 truncate">{selectedTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="min-h-48 md:min-h-56 relative">
        {loading && (
          <div className="absolute inset-0 z-10 rounded-xl bg-neutral-900/80 backdrop-blur-sm">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
                <p className="text-neutral-300">Carregando...</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Basic info strip somente nas etapas iniciais (1–3) e quando o resumo unificado não está visível */}
        {step >= 1 && step <= 3 && !showSummary && (
          <BookingSummaryStrip
            selectedProfessional={selectedProfessional}
            selectedService={selectedService}
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            compact={true}
            onJump={jumpToStep}
          />
        )}
        
        {step === 0 && (
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Selecione Escolha o profissional</h3>
              <p className="text-sm text-neutral-300"></p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {professionals.map((p) => (
                <div
                  key={p.name}
                  className={`rounded-xl border p-4 transition hover:scale-[1.02] ${selectedProfessional === p.name ? "border-amber-500 bg-amber-500/10" : "border-neutral-700 bg-neutral-800"}`}
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={p.image} 
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-white text-lg">{p.name}</div>
                          <div className="text-sm text-neutral-300 flex items-center gap-1">
                            <span className="text-amber-400">★</span> {p.rating}
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">{p.experience} de experiência</div>
                        </div>
                        <button
                          onClick={() => setSelectedProfessionalDetails(p)}
                          className="text-neutral-400 hover:text-white transition-colors flex-shrink-0 ml-2"
                          title="Ver detalhes"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProfessional(p.name)}
                    disabled={loading}
                    className={`w-full mt-3 rounded-lg py-2 text-sm font-medium transition-colors ${
                      selectedProfessional === p.name 
                        ? 'bg-amber-500 text-black' 
                        : 'bg-neutral-700 text-white hover:bg-neutral-600'
                    } disabled:opacity-50`}
                  >
                    {selectedProfessional === p.name ? 'Selecionado' : 'Selecionar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Selecione Escolha o serviço</h3>
              <p className="text-sm text-neutral-300"></p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSelectedService(s.name)}
                  className={`rounded-xl border p-4 text-left transition hover:scale-[1.02] ${selectedService === s.name ? "border-amber-500 bg-amber-500/10" : "border-neutral-700 bg-neutral-800"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{s.name}</div>
                      <div className="text-sm text-neutral-300">{s.duration}</div>
                    </div>
                    <div className="text-amber-400 font-bold">{s.price}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Selecione o dia Escolha a data</h3>
              <p className="text-sm text-neutral-300"></p>
            </div>
            <CalendarPicker 
              selectedDate={selectedDay}
              onDateSelect={(date) => setSelectedDay(date)}
            />
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Selecione Escolha o horário</h3>
              <p className="text-sm text-neutral-300"></p>
            </div>

            {selectedTime && holdUntil && (
              <div className="hidden">
                {/* Console logging for reservation status */}
                {console.log(`Horário reservado por 5 minutos. Tempo restante: ${String(Math.floor(holdRemaining / 60)).padStart(2, "0")}:${String(holdRemaining % 60).padStart(2, "0")}`)}
              </div>
            )}
            <HoursCarousel
              selected={selectedTime}
              selectedDate={selectedDay}
              startHour={9}
              endHour={19}
              stepMinutes={30}
              onSelect={(t) => {
                setSelectedTime(t);
                if (!holdUntil) {
                  setHoldUntil(Date.now() + 5 * 60 * 1000);
                }
              }}
            />
          </div>
        )}
        {step === 4 && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Por favor, Confirme seus dados</h3>
              <p className="text-sm text-neutral-300"></p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Nome completo</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">WhatsApp</label>
                <input
                  type="tel"
                  value={userWhatsApp}
                  onChange={(e) => setUserWhatsApp(e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Deseja agendar para mais alguém?</h3>
              <p className="text-sm text-neutral-300">Você pode agendar para outra pessoa e depois continuar com seu próprio agendamento</p>
            </div>
            <button
              onClick={() => {
                const current = { name: userName, whatsapp: userWhatsApp, professional: selectedProfessional, service: selectedService, day: selectedDay, time: selectedTime, payment: selectedPayment };
                setBookings(prev => [...prev, current]);
                setAddPerson(true);
                setCameFromAddPerson(true);
                setIsSecondPerson(true);
                setBookingCount(prev => prev + 1);
                setSelectedProfessional(undefined);
                setSelectedService(undefined);
                setSelectedDay(undefined);
                setSelectedTime(undefined);
                setSelectedPayment(undefined);
                setUserName("");
                setUserWhatsApp("");
                setHoldUntil(undefined);
                setShowSummary(false);
                simulateLoading();
                setStep(0);
              }}
              className={`w-full rounded-xl border p-6 text-center transition-all duration-200 hover:scale-[1.02] ${
                cameFromAddPerson && addPerson === true 
                  ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20" 
                  : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
              }`}
            >
              <div className="text-4xl mb-3">👥</div>
              <div className="font-semibold text-white text-lg mb-1">Sim, adicionar 1 pessoa</div>
              <div className="text-sm text-neutral-300">Agendar para outra pessoa e depois fazer meu agendamento</div>
            </button>
            <div className="mt-4 text-center">
              <p className="text-xs text-neutral-400">Clique acima se quiser agendar para outra pessoa, ou simplesmente clique em "Avançar" para continuar</p>
            </div>
          </div>
        )}
        {step === 6 && (
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {payments.map((p) => (
              <button
                key={p.name}
                onClick={() => { setSelectedPayment(p.name); next(); }}
                className={`rounded-xl border p-6 text-center transition-all hover:scale-[1.02] hover:shadow-lg ${selectedPayment === p.name ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20" : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"}`}
              >
                <div className="text-4xl mb-3">{p.icon}</div>
                <div className="font-semibold text-white text-lg">{p.name}</div>
              </button>
            ))}
          </div>
        )}
        {step === 7 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">Resumo do agendamento</h4>
                {bookingCount > 1 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                    {bookingCount} pessoas
                  </span>
                )}
              </div>
              <div className="space-y-3 text-sm text-neutral-300">
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">Seus dados</span>
                    <span className="text-xs text-neutral-400">Principal</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Nome</span><span className="text-white">{userName || "—"}</span></div>
                    <div className="flex justify-between"><span>WhatsApp</span><span className="text-white">{userWhatsApp || "—"}</span></div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">Agendamento</span>
                    {isSecondPerson && <span className="text-xs text-purple-400">Pessoa adicional</span>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Profissional</span><span className="text-white">{selectedProfessional || "—"}</span></div>
                    <div className="flex justify-between"><span>Serviço</span><span className="text-white">{selectedService || "—"}</span></div>
                    <div className="flex justify-between"><span>Data</span><span className="text-white">{selectedDay ? selectedDay.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : "—"}</span></div>
                    <div className="flex justify-between"><span>Horário</span><span className="text-white">{selectedTime || "—"}</span></div>
                  </div>
                </div>
                {bookingCount > 1 && (
                  <div className="p-3 rounded-lg bg-purple-900/20 border border-purple-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-purple-300">Pessoas adicionais</span>
                      <span className="text-xs text-purple-400">{bookingCount - 1} pessoa(s)</span>
                    </div>
                    <div className="text-sm text-purple-300">Você agendou para outras pessoas antes deste agendamento</div>
                  </div>
                )}
                <div className="flex justify-between"><span>Forma de pagamento</span><span className="text-white">{selectedPayment || "No local"}</span></div>
              </div>
            </div>
            <button 
              onClick={() => {
                // Se nenhum pagamento foi selecionado, define como "No local"
                if (!selectedPayment) {
                  setSelectedPayment("No local");
                }
                // Aqui você pode adicionar a lógica de confirmação final
                console.log("Agendamento confirmado:", {
                  profissional: selectedProfessional,
                  servico: selectedService,
                  dia: selectedDay,
                  horario: selectedTime,
                  maisPessoa: addPerson,
                  pagamento: selectedPayment || "No local",
                  pessoa: bookingCount,
                  ehSegundaPessoa: isSecondPerson,
                  nome: userName,
                  whatsapp: userWhatsApp
                });
              }}
              className="w-full rounded-xl bg-amber-500 p-4 font-semibold text-black hover:bg-amber-400 transition flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Confirmar agendamento
            </button>
          </div>
        )}
      </div>

      {/* Floating Navigation Buttons Section - Full Width */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="w-full mx-auto">
          {/* Glass morphism container - Full width */}
          <div className="relative bg-neutral-900/90 backdrop-blur-xl border-t border-neutral-700/60 shadow-2xl p-4">
            <div className="grid grid-cols-12 gap-4">
              {/* Internal back button - hidden on step 0 unless coming from add person */}
              {(step !== 0 || cameFromAddPerson) && (
                <button
                  className="col-span-4 rounded-xl bg-neutral-800 px-6 py-4 text-white hover:bg-neutral-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2 justify-center border border-neutral-700 shadow-lg"
                  onClick={prev}
                  disabled={loading}
                >
                  <ChevronLeft size={18} />
                  Voltar
                </button>
              )}
              <button
                className={`${(step !== 0 || cameFromAddPerson) ? 'col-span-8' : 'col-span-12'} rounded-xl px-6 py-4 font-semibold text-black transition-all duration-300 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border ${
                  (step === 0 && selectedProfessional) ||
                  (step === 1 && selectedService) ||
                  (step === 2 && selectedDay) ||
                  (step === 3 && selectedTime) ||
                  (step === 4 && userName.trim() && userWhatsApp.trim()) || // User data validation
                  step === 5 || // Add person step is always active
                  (step === 6 && selectedPayment) ||
                  step === 7
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-500/50 ring-2 ring-amber-300/70 hover:shadow-xl hover:shadow-amber-500/60 hover:from-amber-300 brightness-110'
                    : 'bg-amber-500 hover:bg-amber-400 hover:brightness-105'
                }`}
                onClick={next}
                disabled={loading || 
                  (step === 0 && !selectedProfessional) ||
                  (step === 1 && !selectedService) ||
                  (step === 2 && !selectedDay) ||
                  (step === 3 && !selectedTime) ||
                  (step === 4 && (!userName.trim() || !userWhatsApp.trim()))
                }
              >
                {step === steps.length - 1 ? 'Confirmar Agendamento' : 'Avançar'}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind floating buttons */}
      <div className="h-24"></div>

      {/* Professional Details Modal */}
      {selectedProfessionalDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl border border-neutral-700 bg-neutral-800 p-8 max-w-lg mx-4 shadow-2xl">
            <div className="flex items-start gap-6 mb-6">
              <img 
                src={selectedProfessionalDetails.image} 
                alt={selectedProfessionalDetails.name}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl font-bold text-white">{selectedProfessionalDetails.name}</h3>
                  <button
                    onClick={() => setSelectedProfessionalDetails(null)}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-neutral-300 flex items-center gap-2 mb-1">
                  <span className="text-amber-400">★</span> {selectedProfessionalDetails.rating}
                  <span className="text-neutral-500">•</span>
                  <span>{selectedProfessionalDetails.experience} de experiência</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2">Sobre</h4>
              <p className="text-neutral-300 leading-relaxed">{selectedProfessionalDetails.description}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Especialidades</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProfessionalDetails.specialties.map((specialty, index) => (
                  <span key={index} className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedProfessionalDetails(null)}
                className="flex-1 rounded-xl bg-neutral-700 px-4 py-3 text-white hover:bg-neutral-600 transition-all duration-200 font-medium"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setSelectedProfessional(selectedProfessionalDetails.name);
                  setSelectedProfessionalDetails(null);
                }}
                className="flex-1 rounded-xl bg-amber-500 px-4 py-3 text-black hover:bg-amber-400 transition-all duration-200 font-medium"
              >
                Selecionar Profissional
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl border border-neutral-700 bg-neutral-800 p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cancelar Agendamento</h3>
              <p className="text-neutral-300 mb-8 text-sm leading-relaxed">Deseja cancelar o agendamento do serviço na iABarbearia?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 rounded-xl bg-neutral-700 px-6 py-3 text-white hover:bg-neutral-600 transition-all duration-200 font-medium"
                >
                  Continuar Agendando
                </button>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    
                    // If onCancel prop is provided, use it
                    if (onCancel) {
                      onCancel();
                      return;
                    }
                    
                    // Otherwise, reset all selections and go back to initial state
                    simulateLoading();
                    setSelectedProfessional(undefined);
                    setSelectedService(undefined);
                    setSelectedDay(undefined);
                    setSelectedTime(undefined);
                    setSelectedPayment(undefined);
                    setUserName('');
                    setUserWhatsApp('');
                    setHoldUntil(undefined);
                    setStep(0);
                  }}
                  className="flex-1 rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-500 transition-all duration-200 font-medium"
                >
                  Sim, Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Balloon Notification */}
      {showReservationWarning && (
        <div className="fixed top-4 right-4 z-50 bg-amber-500 text-black px-4 py-3 rounded-lg shadow-lg border border-amber-400">
          <div className="flex items-center gap-2">
            <span>⏰</span>
            <span className="text-sm font-medium">Horário reservado por 5 minutos até concluir o agendamento</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default SchedulingWizard;