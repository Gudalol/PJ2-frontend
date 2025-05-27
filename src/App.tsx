import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequisitarHorarioPage from "./pages/aluno/RequisitarHorarioPage";
import { LoginPage } from "./pages/login/LoginPage";
import MinhasMonitoriasPage from "./pages/aluno/MinhasMonitoriasPage";
import IniciarMonitoriaPage from "./pages/aluno/IniciarMonitoriaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/requisitar-horario" element={<RequisitarHorarioPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/minhas-monitorias" element={<MinhasMonitoriasPage />} />
        <Route path="/iniciar-monitoria" element={<IniciarMonitoriaPage/>} />
        <Route path="*" element={<div>404 - Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;