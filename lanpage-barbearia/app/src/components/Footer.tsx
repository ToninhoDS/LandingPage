import { Instagram, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-neutral-800 bg-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">iABarbearia</h3>
            <p className="text-sm text-neutral-400">
              Transformamos seu visual com profissionalismo e estilo.
              Agende seu horário online em segundos.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Contato</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Redes Sociais</h4>
            <div className="flex gap-3">
              <button className="rounded-lg bg-neutral-800 p-2 text-neutral-400 transition-colors hover:bg-amber-500 hover:text-black">
                <Instagram className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-neutral-800 pt-8 text-center">
          <p className="text-sm text-neutral-400">
            © 2024 iABarbearia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;