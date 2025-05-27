import { useEffect, useState } from "react";
import { AppSidebarAluno } from "../../components/app-sidebaraluno";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { PlayCircle, StopCircle, Clock } from "lucide-react";
import { fetchComToken } from "../../utils/fetchComToken";

// Função utilitária para traduzir o dia da semana
function traduzirDia(dayOfWeek: string) {
  const dias: Record<string, string> = {
    MONDAY: "Segunda-feira",
    TUESDAY: "Terça-feira",
    WEDNESDAY: "Quarta-feira",
    THURSDAY: "Quinta-feira",
    FRIDAY: "Sexta-feira",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
  };
  return dias[dayOfWeek] || dayOfWeek;
}

// Função utilitária para formatar horário (08:00:00 -> 08:00)
function formatarHora(hora: string) {
  if (!hora) return "";
  return hora.slice(0, 5);
}

export default function IniciarMonitoriaPage() {
  const [monitoriaAtiva, setMonitoriaAtiva] = useState(false);
  const [inicio, setInicio] = useState<Date | null>(null);
  const [monitorias, setMonitorias] = useState<any[]>([]);
  const [monitoriaSelecionada, setMonitoriaSelecionada] = useState<string>("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  // Adiciona monitoria mock automaticamente para testes
  useEffect(() => {
    fetchComToken(`${import.meta.env.VITE_API_URL}/monitoring/schedules/me`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMonitorias(data);
        } else {
          // Adiciona mock só se a API não retornar nada
          setMonitorias([
            {
              id: String(Date.now()),
              discipline: "Matemática",
              dayOfWeek: "MONDAY",
              startTime: "14:00:00",
              endTime: "16:00:00",
            },
          ]);
        }
      })
      .catch(() => {
        // Em caso de erro, adiciona mock para teste
        setMonitorias([
          {
            id: String(Date.now()),
            discipline: "Matemática",
            dayOfWeek: "MONDAY",
            startTime: "14:00:00",
            endTime: "16:00:00",
          },
        ]);
      });
  }, []);

  function handleStart() {
    if (!monitoriaSelecionada) return;
    setLoading(true);
    fetchComToken(`${import.meta.env.VITE_API_URL}/monitoring/sessions/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scheduleId: monitoriaSelecionada }),
    })
      .then((res) => {
        if (res.ok) {
          setMonitoriaAtiva(true);
          setInicio(new Date());
        }
      })
      .finally(() => setLoading(false));
  }

  function handleStop() {
    if (!monitoriaSelecionada) return;
    setLoading(true);
    fetchComToken(`${import.meta.env.VITE_API_URL}/monitoring/sessions/finish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scheduleId: monitoriaSelecionada,
        description: descricao,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setMonitoriaAtiva(false);
          setDescricao("");
        }
      })
      .finally(() => setLoading(false));
  }

  // Busca a monitoria selecionada (garante comparação por string)
  const monitoria = monitorias.find((m) => String(m.id) === String(monitoriaSelecionada));

  return (
    <div className="flex h-full w-full bg-[#F1F7FA]">
      <SidebarProvider>
        <AppSidebarAluno />
        <SidebarTrigger className="md:hidden fixed top-4 left-4 z-50" />
        <main className="flex-1 p-8">
          {/* Título e descrição */}
          <div className="mb-12">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-extrabold text-primary drop-shadow-sm">
                Iniciar Monitoria
              </h1>
            </div>
            <p className="text-gray-500 mt-2 ml-12">
              Inicie ou finalize sua sessão de monitoria.
            </p>
            <div className="h-1 w-24 bg-primary/20 rounded mt-4 ml-12" />
          </div>

          {/* Card central minimalista */}
          <div className="flex flex-col items-center justify-center gap-6 bg-white rounded-xl shadow-md w-full p-8">
            <Badge variant={monitoriaAtiva ? "success" : "secondary"} className="mb-2">
              {monitoriaAtiva ? "Monitoria em andamento" : "Monitoria não iniciada"}
            </Badge>

            {/* Nome da monitoria selecionada, dia e horário */}
            {monitoriaSelecionada && monitoria && (
              <div className="text-lg font-semibold text-primary text-center w-full">
                {monitoria.discipline}
                <div className="text-base text-gray-700 font-normal">
                  {traduzirDia(monitoria.dayOfWeek)}
                  <br />
                  {formatarHora(monitoria.startTime)} às {formatarHora(monitoria.endTime)}
                </div>
              </div>
            )}

            {!monitoriaAtiva && (
              <div className="w-full flex">
                <select
                  className="w-72 border rounded p-2"
                  value={monitoriaSelecionada}
                  onChange={(e) => setMonitoriaSelecionada(e.target.value)}
                >
                  <option value="">Selecione uma monitoria</option>
                  {monitorias.map((m) => (
                    <option key={m.id} value={String(m.id)}>
                      {m.discipline +
                        " - " +
                        traduzirDia(m.dayOfWeek) +
                        " " +
                        formatarHora(m.startTime) +
                        " às " +
                        formatarHora(m.endTime)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {monitoriaAtiva && inicio && (
              <Alert className="w-full">
                <AlertTitle>Monitoria iniciada</AlertTitle>
                <AlertDescription>
                  Início: {inicio.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </AlertDescription>
              </Alert>
            )}

            {monitoriaAtiva && (
              <textarea
                className="w-full border rounded p-2"
                placeholder="Descreva o que foi feito nesta sessão..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
              />
            )}

            <div className="flex w-full">
              <Button
                size="lg"
                className={`w-72 flex items-center gap-2 justify-center ${!monitoriaAtiva ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                variant={monitoriaAtiva ? "destructive" : "default"}
                onClick={monitoriaAtiva ? handleStop : handleStart}
                disabled={loading || (!monitoriaAtiva && !monitoriaSelecionada)}
              >
                {monitoriaAtiva ? (
                  <>
                    <StopCircle className="w-5 h-5" /> Finalizar Monitoria
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" /> Iniciar Monitoria
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}