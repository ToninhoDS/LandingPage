import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferred, setDeferred] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible || !deferred) return null;

  return (
    <button
      className="mt-4 rounded-md bg-amber-500 px-4 py-2 font-medium text-black hover:bg-amber-400"
      onClick={async () => {
        try {
          await deferred.prompt();
          setVisible(false);
          setDeferred(null);
        } catch {}
      }}
    >Instalar App</button>
  );
};

export default InstallPrompt;