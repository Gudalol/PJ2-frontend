import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";

type Monitoria = {
  id: number;
  monitor: string;
  discipline: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

interface MonitoriaCardProps {
  monitoria: Monitoria;
}

export function MonitoriaCard({ monitoria }: MonitoriaCardProps) {
  const diasSemana: Record<string, string> = {
    MONDAY: "Segunda-feira",
    TUESDAY: "Terça-feira",
    WEDNESDAY: "Quarta-feira",
    THURSDAY: "Quinta-feira",
    FRIDAY: "Sexta-feira",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
  };

  return (
    <Card className="w-full bg-[#FFFFFF] shadow-[#D9E2EC] border-none transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-base md:text-lg font-semibold text-gray-900">
          {monitoria.discipline}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Matrícula do monitor: <span className="font-medium">{monitoria.monitor}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-800">
          <span className="font-medium">Dia:</span> {diasSemana[monitoria.dayOfWeek] || monitoria.dayOfWeek}
        </div>
        <div className="text-sm text-gray-800">
          <span className="font-medium">Horário:</span> {monitoria.startTime.slice(0,5)} - {monitoria.endTime.slice(0,5)}
        </div>
      </CardContent>
    </Card>
  );
}