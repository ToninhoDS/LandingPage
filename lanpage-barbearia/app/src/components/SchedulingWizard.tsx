import { useState } from "react";
import HoursCarousel from "./HoursCarousel";

const steps = [
  "Serviço",
  "Profissional",
  "Dia",
  "Horário",
  "+1 Pessoa",
  "Pagamento",
  "Confirmar",
];

const SchedulingWizard = () => {
  const [step, setStep] = useState(0);
  const progress = Math.round(((step + 1) / steps.length) * 100);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  return (
    <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-neutral-300">Passo {step + 1} de {steps.length}</span>
          <span className="text-sm font-medium text-amber-500">{progress}%</span>
        </div>
        <div className="h-2 w-full rounded bg-neutral-800">
          <div className="h-2 rounded bg-amber-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="min-h-24">
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">Corte de Cabelo</button>
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">Barba</button>
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">Combo</button>
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">Coloração</button>
          </div>
        )}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">Luiz</button>
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">Carlos</button>
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">Ana</button>
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">João</button>
          </div>
        )}
        {step === 2 && (
          <div className="flex gap-2">
            <button className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700">Hoje</button>
            <button className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700">Amanhã</button>
            <button className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700">Próxima semana</button>
          </div>
        )}
        {step === 3 && (
          <HoursCarousel selected={selectedTime} onSelect={setSelectedTime} />
        )}
        {step === 4 && (
          <div className="flex gap-2">
            <button className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700">Adicionar 1 pessoa</button>
            <button className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700">Continuar sozinho</button>
          </div>
        )}
        {step === 5 && (
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">Pix</button>
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">Cartão</button>
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">No local</button>
            <button className="rounded-md bg-neutral-800 p-3 text-white hover:bg-neutral-700">Antecipado</button>
          </div>
        )}
        {step === 6 && (
          <div className="space-y-3">
            <div className="rounded-md bg-neutral-800 p-4 text-white">Revise seus dados e confirme o agendamento.</div>
            <button className="w-full rounded-md bg-amber-500 p-3 font-medium text-black hover:bg-amber-400 transition">Confirmar</button>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700 disabled:opacity-50"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Voltar
        </button>
        <button
          className="rounded-md bg-amber-500 px-4 py-2 font-medium text-black hover:bg-amber-400"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
        >
          Avançar
        </button>
      </div>
    </div>
  );
};

export default SchedulingWizard;