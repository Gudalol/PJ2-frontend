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
    await fetchComToken(
      `${import.meta.env.VITE_API_URL}/monitoring/schedules`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monitoring: nome,
          dayOfWeek: traduzirDiaParaApi(diaSelecionado),
          startTime: horaInicio + ":00",
          endTime: horaFim + ":00",
        }),
      }
    );
    setLoading(false);
    onExpandir();
    window.location.reload();
  }

  return (
    <Card
      className={`w-full border-none mb-8 transition-all duration-300 shadow-[#D9E2EC] ${
        alreadyRequested ? "bg-[#F6FAF7]" : "bg-[#FFFFFF]"
      }`}
    >
      <CardHeader>
        <CardTitle>{nome}</CardTitle>
        <CardDescription>Professor: {professor}</CardDescription>
        <span className={`text-sm font-semibold ${alreadyRequested ? "text-green-600" : "text-gray-500"}`}>
          {alreadyRequested ? "Já foi solicitado" : "Não foi solicitado"}
        </span>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2">
        <Button
          variant={expandido ? "default" : "outline"}
          className={
            alreadyRequested
              ? "self-start bg-[#E6F4EC] text-[#7AC29A] hover:bg-[#E6F4EC] hover:text-[#7AC29A]"
              : expandido
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
              <label className="text-sm font-medium" htmlFor="dia-semana">Dia da semana</label>
              <Select value={diaSelecionado} onValueChange={setDiaSelecionado}>
                <SelectTrigger className="w-full" id="dia-semana">
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
              {/* Hora inicial logo abaixo do dia da semana */}
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="hora-inicio">Hora inicial</label>
                <input
                  id="hora-inicio"
                  type="time"
                  className="w-full border rounded px-3 py-2"
                  value={horaInicio}
                  onChange={e => setHoraInicio(e.target.value)}
                />
              </div>
            </div>

            {/* Coluna 2 (direita) */}
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium" htmlFor="hora-fim">Hora final</label>
              <input
                id="hora-fim"
                type="time"
                className="w-full border rounded px-3 py-2"
                value={horaFim}
                onChange={e => setHoraFim(e.target.value)}
                // Remova a linha abaixo para não mostrar o balão do navegador:
                // min={horaInicio || undefined}
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
                className="ml-auto bg-[#219653] text-white hover:bg-[#1E7A4D] hover:text-white"
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