import React, { useEffect, useState } from "react";
import { AppSidebarAluno } from "../../components/app-sidebaraluno";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { MonitoriaCard } from "./components/MonitoriaCard";
import { Calendar } from "lucide-react";
import { fetchComToken } from "../../utils/fetchComToken";

// Tipagem para os dados de monitoria
type Monitoria = {
  id: number;
  monitor: string;
  discipline: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

export default function MinhasMonitoriasPage() {
  const [monitorias, setMonitorias] = useState<Monitoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetchComToken(`${import.meta.env.VITE_API_URL}/monitoring/schedules/students/me`)
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          setErro(msg || "Erro ao buscar monitorias");
          console.error("Erro monitorias:", msg);
          return [];
        }
        const data = await res.json();
        console.log("Monitorias recebidas:", data);
        return data;
      })
      .then(setMonitorias)
      .catch((err) => {
        setErro(err.message);
        console.error("Erro monitorias:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (erro) return <div className="text-red-600 p-4">{erro}</div>;

  return (
    <div className="flex h-full w-full bg-[#F1F7FA]">
      <SidebarProvider>
        <AppSidebarAluno />
        <SidebarTrigger className="md:hidden fixed top-4 left-4 z-50" />
        <main className="flex-1 p-8">
          {/* Título e descrição no mesmo padrão da tela de requisitar horário */}
          <div className="mb-12">
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-extrabold text-primary drop-shadow-sm">
                Minhas Monitorias
              </h1>
            </div>
            <p className="text-gray-500 mt-2 ml-12">
              Veja os horários de monitoria que você já possui.
            </p>
            <div className="h-1 w-24 bg-primary/20 rounded mt-4 ml-12" />
          </div>
          {/* Cards das monitorias */}
          <div className="flex flex-col w-full px-4 py-8 gap-4">
            {loading ? (
              <div className="text-blue-700 text-center">Carregando suas monitorias...</div>
            ) : monitorias.length === 0 ? (
              <div className="text-gray-500 text-center">Nenhuma monitoria encontrada.</div>
            ) : (
              monitorias.map((m) => (
                <MonitoriaCard key={m.id} monitoria={m} />
              ))
            )}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}