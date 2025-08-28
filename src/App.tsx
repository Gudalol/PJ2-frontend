import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequisitarHorarioPage from "./pages/aluno/RequisitarHorarioPage";
import { LoginPage } from "./pages/login/LoginPage";
import MinhasMonitoriasPage from "./pages/aluno/MinhasMonitoriasPage";
import IniciarMonitoriaPage from "./pages/aluno/IniciarMonitoriaPage";
import RequisicoesDeMonitoriaPage from "./pages/professor/RequisiçõesDeMonitoriaPage";
import DisciplinasPage from "./pages/professor/DisciplinasPage";
import EstatisticasDisciplinasPage from "./pages/professor/EstatisticasDisciplinasPage";
import PdfMonthWorkloadsPage from "./pages/aluno/PdfMonthWorkloadsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/requisitar-horario" element={<RequisitarHorarioPage />} />
        <Route path="/minhas-monitorias" element={<MinhasMonitoriasPage />} />
        <Route path="/iniciar-monitoria" element={<IniciarMonitoriaPage />} />
        <Route path="/professor/requisicoes-monitoria" element={<RequisicoesDeMonitoriaPage />} />
        <Route path="/professor/disciplinas" element={<DisciplinasPage />} />
        <Route path="/professor/estatisticas-disciplinas" element={<EstatisticasDisciplinasPage />} />
        <Route path="/aluno/pdf-carga-horaria" element={<PdfMonthWorkloadsPage />} />
        <Route path="*" element={<div>404 - Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;