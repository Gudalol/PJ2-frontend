import React, { useState } from 'react';
import editarIcon from '../assets/editar.png';
import deletarIcon from '../assets/deletar.png';
import '../style.css';

function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState([
    { id: 1, nome: 'Matemática', descricao: 'Matemática Básica para Engenharia', professor: 'Professor A' }, 
    
  ]);
  const [novaDisciplina, setNovaDisciplina] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [nomeEditado, setNomeEditado] = useState('');
  const [descricaoEditada, setDescricaoEditada] = useState('');

  const handleAdd = () => {
    if (novaDisciplina && novaDescricao) {
      const nova = {
        id: Date.now(),
        nome: novaDisciplina,
        descricao: novaDescricao,
        professor: 'A Definir' 
      };
      setDisciplinas([...disciplinas, nova]);
      setNovaDisciplina('');
      setNovaDescricao('');
    }
  };

  const handleDelete = (id) => {
    setDisciplinas(disciplinas.filter(d => d.id !== id));
  };

  const handleEdit = (id, nomeAtual, descricaoAtual) => {
    setEditandoId(id);
    setNomeEditado(nomeAtual);
    setDescricaoEditada(descricaoAtual);
  };

  const handleSaveEdit = (id) => {
    const atualizadas = disciplinas.map(d =>
      d.id === id ? { ...d, nome: nomeEditado, descricao: descricaoEditada } : d
    );
    setDisciplinas(atualizadas);
    setEditandoId(null);
    setNomeEditado('');
    setDescricaoEditada('');
  };

  return (
    <div className="main-content"> {}
      <h1>Minhas Disciplinas</h1>

      <table>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {disciplinas.map(disciplina => (
            <tr key={disciplina.id}>
              <td>
                {editandoId === disciplina.id ? (
                  <input
                    type="text"
                    value={nomeEditado}
                    onChange={(e) => setNomeEditado(e.target.value)}
                  />
                ) : (
                  disciplina.nome
                )}
              </td>
              <td>
                {editandoId === disciplina.id ? (
                  <input
                    type="text"
                    value={descricaoEditada}
                    onChange={(e) => setDescricaoEditada(e.target.value)}
                  />
                ) : (
                  disciplina.descricao
                )}
              </td>
              <td>
                <div className="action-buttons"> {}
                  {editandoId === disciplina.id ? (
                    <>
                      <button className="edit-button" onClick={() => handleSaveEdit(disciplina.id)}>Salvar</button>
                      <button className="delete-button" onClick={() => setEditandoId(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <img src={editarIcon} alt="Editar" className="icon edit-button" onClick={() => handleEdit(disciplina.id, disciplina.nome, disciplina.descricao)} />
                      <img src={deletarIcon} alt="Deletar" className="icon delete-button" onClick={() => handleDelete(disciplina.id)} />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-add"> {}
        <h2>Adicionar Nova Disciplina</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}> {/* Evita o reload padrão do form */}
          <label htmlFor="nomeDisciplina">Nome da Disciplina</label>
          <input
            type="text"
            id="nomeDisciplina"
            name="nomeDisciplina"
            placeholder="Digite o nome"
            value={novaDisciplina}
            onChange={(e) => setNovaDisciplina(e.target.value)}
            required
          />

          <label htmlFor="descricaoDisciplina">Descrição</label>
          <input
            type="text"
            id="descricaoDisciplina"
            name="descricaoDisciplina"
            placeholder="Digite a descrição"
            value={novaDescricao}
            onChange={(e) => setNovaDescricao(e.target.value)}
            required
          />

          <button type="submit">Adicionar</button>
        </form>
      </div>
    </div>
  );
}

export default Disciplinas;