import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SchedulingWizard, { SchedulingWizardRef } from "../components/SchedulingWizard";
import { useRef } from "react";

const BookingPage = () => {
  const navigate = useNavigate();
  const { slug, tenantId } = useParams();
  const wizardRef = useRef<SchedulingWizardRef>(null);

  const handleCancel = () => {
    // Navigate back to the home page with the slug and tenantId
    navigate(`/${slug}/${tenantId}`);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                // Use wizard's handleNavbarBack to show confirmation modal when appropriate
                if (wizardRef.current?.handleNavbarBack) {
                  wizardRef.current.handleNavbarBack();
                }
              }}
              className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </button>
            <h1 className="text-xl font-semibold text-white">Agendar Horário</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-0">
        <SchedulingWizard ref={wizardRef} onCancel={handleCancel} />
      </main>
    </div>
  );
};

export default BookingPage;