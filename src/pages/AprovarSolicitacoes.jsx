import React from 'react';
import '../style.css';

function AprovarSolicitacoes() {
  return (
    <div className="main-content">
      <h1>Aprovar Requisições de Monitoria</h1>

      <table>
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Disciplina</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>João Silva</td>
            <td>Matemática</td>
            <td>10/05/2025</td>
            <td>14:00</td>
            <td>
              <div className="action-buttons">
                <button className="edit-button">✔️ Aprovar</button>
                <button className="delete-button">❌ Recusar</button>
                <button className="edit-button">➡️ Ver Detalhes</button>
              </div>
            </td>
          </tr>
          {/* Outros pedidos aqui */}
        </tbody>
      </table>
    </div>
  );
}

export default AprovarSolicitacoes;