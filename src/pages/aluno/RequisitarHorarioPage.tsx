import { AppSidebarAluno } from "../../components/app-sidebaraluno"
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { MateriaCard } from "./components/MateriaCard";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { fetchComToken } from "../../utils/fetchComToken";

export default function RequisitarHorarioPage() {
  const [cardExpandido, setCardExpandido] = useState<number | null>(null);
  const [materias, setMaterias] = useState<any[]>([]);

  useEffect(() => {
    fetchComToken(`${import.meta.env.VITE_API_URL}/monitoring/me`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMaterias(data);
        else setMaterias([]);
      })
      .catch(() => setMaterias([]));
  }, []);

  return (
    <div className="flex h-full w-full bg-[#F1F7FA]">
      <SidebarProvider>
        <AppSidebarAluno />
        <SidebarTrigger className="md:hidden fixed top-4 left-4 z-50" />
        <main className="flex-1 p-8">
          <div className="mb-12">
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-extrabold text-primary drop-shadow-sm">
                Requisitar Horário
              </h1>
            </div>
            <p className="text-gray-500 mt-2 ml-12">
              Solicite um horário de monitoria ao professor.
            </p>
            <div className="h-1 w-24 bg-primary/20 rounded mt-4 ml-12" />
          </div>
          <div className="flex flex-col w-full px-4 py-8 gap-4">
            {materias.map((materia) => (
              <MateriaCard
                key={materia.id}
                id={materia.id}
                nome={materia.name}
                professor={materia.teacher}
                alreadyRequested={materia.alreadyRequested}
                expandido={cardExpandido === materia.id}
                onExpandir={() =>
                  setCardExpandido(cardExpandido === materia.id ? null : materia.id)
                }
              />
            ))}
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}