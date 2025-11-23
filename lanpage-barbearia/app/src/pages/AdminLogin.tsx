import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm rounded-lg bg-neutral-900 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-white">iABarbearia</h1>
        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-md bg-neutral-800 p-3 text-white outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full rounded-md bg-neutral-800 p-3 text-white outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-amber-500"
          />
          <button
            className="w-full rounded-md bg-amber-500 p-3 font-medium text-black hover:bg-amber-400 transition"
            onClick={() => navigate("/admin/configuracoes")}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;