import { useState, useEffect } from "react";
import { AppSidebarProfessor } from "../../components/ui/app-sidebarprofessor";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { Pencil, Trash, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import { fetchComToken } from "../../utils/fetchComToken";

type Disciplina = {
  id: number;
  nome: string;
  monitores: number;
  professor: string;
  topicos: string[];
  permiteMesmoHorario: boolean;
  schedules?: any[]; // Agendamentos da disciplina
};

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaDisciplina, setNovaDisciplina] = useState({ nome: "", permiteMesmoHorario: false, topicos: [] as string[] });
  const [topicoInput, setTopicoInput] = useState("");
  const [filtro, setFiltro] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAddMonitor, setShowAddMonitor] = useState<number | null>(null);
  const [novoMonitor, setNovoMonitor] = useState<{ nome: string; matricula: string }>({ nome: "", matricula: "" });
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<null | number>(null);
  const [editDisciplina, setEditDisciplina] = useState<{ nome: string; permiteMesmoHorario: boolean; topicos: string[] }>({ nome: "", permiteMesmoHorario: false, topicos: [] });
  const [editTopicoInput, setEditTopicoInput] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchComToken(`${import.meta.env.VITE_API_URL}/monitoring/teachers/me`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDisciplinas(data.map((d: any) => ({
            id: d.id,
            nome: d.name,
            professor: d.teacher,
            permiteMesmoHorario: d.allowMonitorsSameTime,
            topicos: d.topics || [],
            monitores: d.schedules ? d.schedules.length : 0,
            schedules: d.schedules || [],
          })));
        } else {
          setDisciplinas([]);
        }
      })
      .catch(() => setDisciplinas([]))
      .finally(() => setLoading(false));
  }, []);

  // Função para mostrar feedback ao usuário
  function showToast(message: string, type: 'success' | 'error' = 'success') {
    if (type === 'success') {
      window.alert(message); // Substitua por um toast se houver um componente de toast
    } else {
      window.alert(message);
    }
  }

  function handleCriarDisciplina(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    fetchComToken(`${import.meta.env.VITE_API_URL}/monitoring/teachers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: novaDisciplina.nome,
        allowMonitorsSameTime: novaDisciplina.permiteMesmoHorario,
        topics: novaDisciplina.topicos,
      }),
    })
      .then(async res => {
        if (!res.ok) {
          const msg = await res.text();
          showToast(msg || 'Erro ao criar disciplina', 'error');
          throw new Error(msg || 'Erro ao criar disciplina');
        }
        return res.json();
      })
      .then((data) => {
        setDisciplinas(prev => [
          ...prev,
          {
            id: data.id,
            nome: data.name,
            monitores: data.monitors?.length || 0,
            professor: data.teacher,
            topicos: data.topics || [],
            permiteMesmoHorario: data.allowMonitorsSameTime || false,
          },
        ]);
        setNovaDisciplina({ nome: "", permiteMesmoHorario: false, topicos: [] });
        setTopicoInput("");
        setModalAberto(false);
        showToast('Disciplina criada com sucesso!', 'success');
      })
      .catch((err) => {
        // Erro já exibido acima, mas pode logar para debug
        if (err.message && (err.message.includes('duplicate key value') || err.message.includes('violates unique constraint'))) {
          showToast('Já existe uma disciplina/monitoria com esse nome ou identificador. Tente outro nome.', 'error');
        } else {
          showToast('Erro ao criar monitoria: ' + (err.message || 'Erro desconhecido'), 'error');
        }
        console.error('Erro ao criar monitoria:', err);
      })
      .finally(() => setLoading(false));
  }

  function handleAddMonitor(discId: number) {
    if (!novoMonitor.nome.trim() || !novoMonitor.matricula.trim()) return;
    setLoading(true);
    const disciplina = disciplinas.find(d => d.id === discId);
    if (!disciplina) return;
    fetchComToken(`${import.meta.env.VITE_API_URL}/monitoring/students/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentRegistration: novoMonitor.matricula,
        monitoringName: disciplina.nome,
      }),
    })
      .then(async res => {
        if (res.status === 201) {
          setNovoMonitor({ nome: "", matricula: "" });
          setShowAddMonitor(null);
          showToast('Monitor adicionado com sucesso!', 'success');
          return;
        }
        if (!res.ok) {
          const msg = await res.text();
          showToast(msg || 'Erro ao adicionar monitor', 'error');
          throw new Error(msg || 'Erro ao adicionar monitor');
        }
        return res.json();
      })
      .catch((err) => {
        if (err.message && !err.message.toLowerCase().includes('sucesso')) {
          showToast('Erro ao adicionar monitor: ' + (err.message || 'Erro desconhecido'), 'error');
        }
      })
      .finally(() => setLoading(false));
  }

  function handleDeleteDisciplina(id: number) {
    setLoading(true);
    fetchComToken(`${import.meta.env.VITE_API_URL}/monitoring/${id}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then(msg => { throw new Error(msg); });
        }
        setDisciplinas(disciplinas => disciplinas.filter(d => d.id !== id));
        showToast('Disciplina removida com sucesso!', 'success');
      })
      .catch(() => {
        showToast("Não é possível remover esta disciplina/monitoria pois existem monitorias agendadas ou dependências associadas a ela.", 'error');
      })
      .finally(() => setLoading(false));
  }

  // Função para abrir modal de edição
  function abrirEdicao(disc: any) {
    setEditando(disc.id);
    setEditDisciplina({
      nome: disc.nome,
      permiteMesmoHorario: disc.permiteMesmoHorario,
      topicos: disc.topicos || [],
    });
    setEditTopicoInput("");
  }

  function handleEditarDisciplina(e: React.FormEvent) {
    e.preventDefault();
    if (editando == null) return;
    setLoading(true);
    fetchComToken(`${import.meta.env.VITE_API_URL}/monitoring/${editando}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editDisciplina.nome,
        allowMonitorsSameTime: editDisciplina.permiteMesmoHorario,
        topics: editDisciplina.topicos,
      }),
    })
      .then(res => res.json())
      .then((data) => {
        setDisciplinas(disciplinas => disciplinas.map(d =>
          d.id === editando
            ? {
                ...d,
                nome: data.name,
                permiteMesmoHorario: data.allowMonitorsSameTime,
                topicos: data.topics || [],
              }
            : d
        ));
        setEditando(null);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="flex h-full w-full bg-[#F1F7FA]">
      <SidebarProvider>
        <SidebarTrigger className="md:hidden fixed top-4 left-4 z-50" />
        <AppSidebarProfessor />
        <main className="flex-1 p-4 md:p-8 bg-gradient-to-br from-[#bddae2] via-[#e6f4ec] to-white min-h-screen">
          <div className="mb-8 text-left w-full">
            <h1 className="text-3xl font-semibold mb-1 text-primary drop-shadow-sm">Disciplinas</h1>
            <p className="text-gray-700 text-base text-left">Gerencie as suas disciplinas cadastradas.</p>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6 w-full">
              <div className="flex-1">
                <Input
                  placeholder="Buscar disciplina..."
                  value={filtro}
                  onChange={e => setFiltro(e.target.value)}
                  className="w-full max-w-md bg-white/80 border border-[#b2c9d6] focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="flex justify-end w-full md:w-auto">
                <Button variant="ghost" size="icon" onClick={() => setModalAberto(true)} aria-label="Adicionar disciplina" className="bg-primary text-white hover:bg-green-700">
                  <Plus className="w-7 h-7" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 w-full">
            {loading ? (
              <div className="text-center text-gray-400 py-8">Carregando...</div>
            ) : disciplinas
              .filter(d =>
                !filtro ||
                d.nome.toLowerCase().includes(filtro.toLowerCase())
              )
              .length === 0 && (
              <div className="text-center text-gray-400 py-8">Nenhuma disciplina encontrada.</div>
            )}
            {disciplinas
              .filter(d =>
                !filtro ||
                d.nome.toLowerCase().includes(filtro.toLowerCase())
              )
              .map((disc) => (
                <Card key={disc.id} className="bg-gradient-to-br from-[#bddae2] via-[#e6f4ec] to-white w-full rounded-2xl shadow-lg p-7 flex flex-col border border-[#b2c9d6] transition-all hover:scale-[1.01]">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 flex-1">
                    <div>
                      <div className="font-bold text-2xl text-primary drop-shadow-sm mb-1">{disc.nome}</div>
                    </div>
                  </div>
                  {/* Botão de expandir centralizado na parte inferior, usando ChevronDown/ChevronUp */}
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={expanded === disc.id ? "Recolher detalhes" : "Expandir detalhes"}
                      onClick={() => {
                        setExpanded(expanded === disc.id ? null : disc.id);
                        setShowAddMonitor(null);
                      }}
                      className="rounded-full border-2 border-primary bg-white shadow p-2 hover:bg-primary/10 transition-all"
                    >
                      {expanded === disc.id ? (
                        <ChevronUp className="w-7 h-7 text-primary" />
                      ) : (
                        <ChevronDown className="w-7 h-7 text-primary" />
                      )}
                    </Button>
                  </div>
                  {expanded === disc.id && (
                    <div className="w-full mt-6 border-t pt-4 flex flex-col gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-fit border-primary text-primary font-semibold hover:bg-primary/10"
                        onClick={() => setShowAddMonitor(showAddMonitor === disc.id ? null : disc.id)}
                      >Adicionar Monitor</Button>
                      {showAddMonitor === disc.id && (
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                          <Input
                            placeholder="Nome do monitor"
                            value={novoMonitor.nome}
                            onChange={e => setNovoMonitor({ ...novoMonitor, nome: e.target.value })}
                            className="max-w-xs bg-white/80 border border-[#b2c9d6] focus:border-primary focus:ring-primary rounded-xl h-12 text-base"
                          />
                          <Input
                            placeholder="Matrícula"
                            value={novoMonitor.matricula}
                            onChange={e => setNovoMonitor({ ...novoMonitor, matricula: e.target.value })}
                            className="max-w-xs bg-white/80 border border-[#b2c9d6] focus:border-primary focus:ring-primary rounded-xl h-12 text-base"
                          />
                          <Button
                            type="button"
                            onClick={() => handleAddMonitor(disc.id)}
                            className="h-12 text-lg bg-primary text-white hover:bg-green-700 rounded-xl px-6"
                          >Confirmar</Button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
          </div>

          {/* Modal de criação de disciplina */}
          <Dialog open={modalAberto} onOpenChange={setModalAberto}>
            <DialogContent className="max-w-2xl p-8 bg-gradient-to-br from-[#bddae2] via-[#e6f4ec] to-white border border-[#b2c9d6]">
              <DialogHeader>
                <DialogTitle className="text-2xl mb-2 text-primary drop-shadow-sm">Nova Disciplina</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCriarDisciplina} className="space-y-6 mt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nome" className="text-primary">Nome da monitoria</Label>
                  <Input
                    id="nome"
                    value={novaDisciplina.nome}
                    onChange={e => setNovaDisciplina({ ...novaDisciplina, nome: e.target.value })}
                    required
                    className="h-12 text-lg bg-white/80 border border-[#b2c9d6] focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Checkbox
                    id="permiteMesmoHorario"
                    checked={novaDisciplina.permiteMesmoHorario}
                    onCheckedChange={checked => setNovaDisciplina({ ...novaDisciplina, permiteMesmoHorario: !!checked })}
                  />
                  <Label htmlFor="permiteMesmoHorario" className="cursor-pointer text-base text-primary">Permitir monitores no mesmo horário</Label>
                </div>
                {/* Campo de tópicos */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="topicos" className="text-primary">Tópicos</Label>
                  <div className="flex gap-2">
                    <Input
                      id="topicos"
                      placeholder="Digite um tópico e pressione Enter"
                      value={topicoInput}
                      onChange={e => setTopicoInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && topicoInput.trim()) {
                          e.preventDefault();
                          if (!novaDisciplina.topicos.includes(topicoInput.trim())) {
                            setNovaDisciplina({ ...novaDisciplina, topicos: [...novaDisciplina.topicos, topicoInput.trim()] });
                          }
                          setTopicoInput("");
                        }
                      }}
                      className="h-12 text-lg flex-1 bg-white/80 border border-[#b2c9d6] focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {novaDisciplina.topicos.map((topico, idx) => (
                      <span key={idx} className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium shadow">
                        {topico}
                        <button
                          type="button"
                          className="ml-2 text-primary hover:text-red-500 focus:outline-none"
                          onClick={() => setNovaDisciplina({ ...novaDisciplina, topicos: novaDisciplina.topicos.filter((_, i) => i !== idx) })}
                          aria-label={`Remover tópico ${topico}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full h-12 text-lg bg-primary text-white hover:bg-green-700">Criar disciplina</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal de edição de disciplina */}
          <Dialog open={!!editando} onOpenChange={v => { if (!v) setEditando(null); }}>
            <DialogContent className="max-w-2xl p-8 bg-gradient-to-br from-[#bddae2] via-[#e6f4ec] to-white border border-[#b2c9d6]">
              <DialogHeader>
                <DialogTitle className="text-2xl mb-2 text-primary drop-shadow-sm">Editar Disciplina</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditarDisciplina} className="space-y-6 mt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-nome" className="text-primary">Nome da monitoria</Label>
                  <Input
                    id="edit-nome"
                    value={editDisciplina.nome}
                    onChange={e => setEditDisciplina({ ...editDisciplina, nome: e.target.value })}
                    required
                    className="h-12 text-lg bg-white/80 border border-[#b2c9d6] focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Checkbox
                    id="edit-permiteMesmoHorario"
                    checked={editDisciplina.permiteMesmoHorario}
                    onCheckedChange={checked => setEditDisciplina({ ...editDisciplina, permiteMesmoHorario: !!checked })}
                  />
                  <Label htmlFor="edit-permiteMesmoHorario" className="cursor-pointer text-base text-primary">Permitir monitores no mesmo horário</Label>
                </div>
                {/* Campo de tópicos */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-topicos" className="text-primary">Tópicos</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-topicos"
                      placeholder="Digite um tópico e pressione Enter"
                      value={editTopicoInput}
                      onChange={e => setEditTopicoInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && editTopicoInput.trim()) {
                          e.preventDefault();
                          if (!editDisciplina.topicos.includes(editTopicoInput.trim())) {
                            setEditDisciplina({ ...editDisciplina, topicos: [...editDisciplina.topicos, editTopicoInput.trim()] });
                          }
                          setEditTopicoInput("");
                        }
                      }}
                      className="h-12 text-lg flex-1 bg-white/80 border border-[#b2c9d6] focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editDisciplina.topicos.map((topico, idx) => (
                      <span key={idx} className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium shadow">
                        {topico}
                        <button
                          type="button"
                          className="ml-2 text-primary hover:text-red-500 focus:outline-none"
                          onClick={() => setEditDisciplina({ ...editDisciplina, topicos: editDisciplina.topicos.filter((_, i) => i !== idx) })}
                          aria-label={`Remover tópico ${topico}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full h-12 text-lg bg-primary text-white hover:bg-green-700">Salvar alterações</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </SidebarProvider>
    </div>
  );
}
