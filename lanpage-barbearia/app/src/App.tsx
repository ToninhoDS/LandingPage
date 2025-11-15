import { Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import PublicHome from "./pages/PublicHome";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminSettings from "./pages/admin/Settings";
import AdminServices from "./pages/admin/Services";
import AdminProfessionals from "./pages/admin/Professionals";
import AdminPayments from "./pages/admin/Payments";
import AdminIntegrations from "./pages/admin/Integrations";
import AdminPlans from "./pages/admin/Plans";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminSettings />} />
        <Route path="servicos" element={<AdminServices />} />
        <Route path="profissionais" element={<AdminProfessionals />} />
        <Route path="pagamentos" element={<AdminPayments />} />
        <Route path="integracoes" element={<AdminIntegrations />} />
        <Route path="planos" element={<AdminPlans />} />
      </Route>
      <Route path="/:slug/:tenantId/*" element={<PublicHome />} />
      <Route path="*" element={<AdminLogin />} />
    </Routes>
  );
};

export default App;