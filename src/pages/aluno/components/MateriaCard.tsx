import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useState } from "react";
import { fetchComToken } from "../../../utils/fetchComToken";

interface Props {
  id: number;
  nome: string;
  professor: string;
  alreadyRequested: boolean;
  expandido: boolean;
  onExpandir: () => void;
}

const diasDaSemana = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
];

export function MateriaCard({ id, nome, professor, alreadyRequested, expandido, onExpandir }: Props) {
  const [diaSelecionado, setDiaSelecionado] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [loading, setLoading] = useState(false);
  const [erroHora, setErroHora] = useState<string | null>(null);

  // Função para converter o dia da semana para o formato da API
  function traduzirDiaParaApi(dia: string) {
    const map: Record<string, string> = {
      "Segunda-feira": "MONDAY",
      "Terça-feira": "TUESDAY",
      "Quarta-feira": "WEDNESDAY",
      "Quinta-feira": "THURSDAY",
      "Sexta-feira": "FRIDAY",
    };
    return map[dia] || "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroHora(null);

    // Validação: todos os campos obrigatórios
    if (!diaSelecionado || !horaInicio || !horaFim) {
      setErroHora("Preencha todos os campos antes de enviar.");
      return;
    }
    // Validação: formato correto dos horários
    if (!/^\d{2}:\d{2}$/.test(horaInicio) || !/^\d{2}:\d{2}$/.test(horaFim)) {
      setErroHora("Horário inválido. Use o formato HH:mm.");
      return;
    }
    // Validação: hora final não pode ser menor ou igual à inicial
    if (horaInicio && horaFim && horaFim <= horaInicio) {
      setErroHora("A hora final deve ser posterior à hora inicial.");
      return;
    }

    // Validação: diferença mínima de 30 minutos
    if (horaInicio && horaFim) {
      const [h1, m1] = horaInicio.split(":").map(Number);
      const [h2, m2] = horaFim.split(":").map(Number);
      const minutosInicio = h1 * 60 + m1;
      const minutosFim = h2 * 60 + m2;
      if (minutosFim - minutosInicio < 30) {
        setErroHora("O intervalo entre o início e o fim deve ser de pelo menos 30 minutos.");
        return;
      }
    }

    setLoading(true);
    // Monta string no formato HH:mm:ss
    function toHoraString(hora: string) {
      return hora.length === 5 ? hora + ":00" : hora;
    }
    const payload = {
      monitoring: nome,
      dayOfWeek: traduzirDiaParaApi(diaSelecionado),
      startTime: toHoraString(horaInicio),
      endTime: toHoraString(horaFim),
    };
    console.log("Enviando payload de agendamento:", payload);
    await fetchComToken(
      `${import.meta.env.VITE_API_URL}/monitoring/schedules/students`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setLoading(false);
    onExpandir();
    window.location.reload();
  }

  return (
    <Card
      className={`w-full mb-8 transition-all duration-300 rounded-xl shadow-md border border-[#b2c9d6] p-0 bg-gradient-to-br from-[#bddae2] via-[#e6f4ec] to-white ${alreadyRequested ? 'opacity-80' : ''}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary drop-shadow-sm">{nome}</CardTitle>
        <CardDescription className="text-gray-700">Professor: {professor}</CardDescription>
        <span className={`text-sm font-semibold ${alreadyRequested ? "text-green-600" : "text-gray-500"}`}>
          {alreadyRequested ? "Já foi solicitado" : "Não foi solicitado"}
        </span>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2 pt-0 pb-4 px-6">
        <Button
          variant={expandido ? "default" : "outline"}
          className={
            expandido
              ? "self-start bg-[#F1F7FA] text-[#219653] hover:bg-[#E0F2E5] hover:text-[#219653]"
              : "self-start bg-[#219653] text-white hover:bg-[#1E7A4D] hover:text-white"
          }
          onClick={onExpandir}
        >
          {expandido ? "Fechar" : "Solicitar Horário"}
        </Button>
        {expandido && (
          <form
            className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            {/* Coluna 1 */}
            <div className="space-y-1 md:row-span-2">
              <label className="text-sm font-medium text-primary" htmlFor="dia-semana">Dia da semana</label>
              <Select value={diaSelecionado} onValueChange={setDiaSelecionado}>
                <SelectTrigger className="w-full bg-white/80 border border-[#b2c9d6] focus:border-primary focus:ring-primary" id="dia-semana">
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {diasDaSemana.map((dia) => (
                    <SelectItem key={dia} value={dia}>
                      {dia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-y-1 mt-2">
                <label className="text-sm font-medium text-primary" htmlFor="hora-inicio">Hora inicial</label>
                <input
                  id="hora-inicio"
                  type="time"
                  className="w-full bg-white/80 border border-[#b2c9d6] rounded px-3 py-2 focus:border-primary focus:ring-primary"
                  value={horaInicio}
                  onChange={e => setHoraInicio(e.target.value)}
                />
              </div>
            </div>
            {/* Coluna 2 (direita) */}
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium text-primary" htmlFor="hora-fim">Hora final</label>
              <input
                id="hora-fim"
                type="time"
                className="w-full bg-white/80 border border-[#b2c9d6] rounded px-3 py-2 focus:border-primary focus:ring-primary"
                value={horaFim}
                onChange={e => setHoraFim(e.target.value)}
              />
            </div>
            {/* Mensagem de erro de horário */}
            {erroHora && (
              <div className="md:col-span-2 text-red-600 text-sm">{erroHora}</div>
            )}
            {/* Botão ocupa a linha toda na grid */}
            <div className="flex md:col-span-2">
              <Button
                type="submit"
                className="ml-auto h-12 text-lg bg-primary text-white hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar solicitação"}
              </Button>
            </div>
          </form>
        )}
      </CardFooter>
    </Card>
  );
}