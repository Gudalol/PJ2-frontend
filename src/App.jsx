import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Disciplinas from './pages/Disciplinas';
import AprovarSolicitacoes from './pages/AprovarSolicitacoes';
import './style.css';
import perfilIcon from './assets/perfil.png'; // Importe os ícones
import disciplinasIcon from './assets/icone-disciplinas.png';
import aprovarIcon from './assets/icone-aprovar.png';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="sidebar">
          <Link to="/"><img src={perfilIcon} alt="Perfil" className="perfil" /></Link>
          <Link to="/disciplinas"><img src={disciplinasIcon} alt="Disciplinas" /></Link>
          <Link to="/aprovar"><img src={aprovarIcon} alt="Aprovar" /></Link>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/disciplinas" element={<Disciplinas />} />
            <Route path="/aprovar" element={<AprovarSolicitacoes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}


export default App;