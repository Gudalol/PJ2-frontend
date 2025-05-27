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

  return (
    <Card className="w-full bg-[#FFFFFF] shadow-[#D9E2EC] border-none mb-8 transition-all duration-300">
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
            onSubmit={e => {
              e.preventDefault();
              onExpandir();
            }}
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
              />
            </div>

            {/* Botão ocupa a linha toda na grid */}
            <div className="flex md:col-span-2">
              <Button
                type="submit"
                className="ml-auto bg-[#219653] text-white hover:bg-[#1E7A4D] hover:text-white"
              >
                Enviar solicitação
              </Button>
            </div>
          </form>
        )}
      </CardFooter>
    </Card>
  );
}