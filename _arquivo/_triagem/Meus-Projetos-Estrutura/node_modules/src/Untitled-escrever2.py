with open('src/App.tsx', 'w') as f:
    f.write("""import { useState } from 'react';

const d = {
  nome: 'Fazenda Sao Joao',
  proprietario: 'Gustavo Paula dos Santos',
  area: '1.000 alqueires',
  local: 'Mato Grosso, Brasil',
  plantios: [
    { cultura: 'Soja', area: '400 alq', status: 'Em crescimento', progresso: 65 },
    { cultura: 'Milho', area: '300 alq', status: 'Colheita proxima', progresso: 90 },
    { cultura: 'Algodao', area: '200 alq', status: 'Plantio recente', progresso: 20 },
    { cultura: 'Cana', area: '100 alq', status: 'Em crescimento', progresso: 50 },
  ],
  financeiro: [
    { mes: 'Abril', receita: 85000, despesa: 32000 },
    { mes: 'Maio', receita: 92000, despesa: 28000 },
    { mes: 'Junho', receita: 110000, despesa: 35000 },
    { mes: 'Julho', receita: 78000, despesa: 30000 },
  ],
  alertas: [
    { tipo: 'warning', msg: 'Proxima irrigacao em 2h - Talhao Norte' },
    { tipo: 'info', msg: 'Previsao de chuva amanha: 18mm' },
    { tipo: 'success', msg: 'Colheita do milho: condicoes favoraveis' },
  ],
};

export default function App() {
  const [logado, setLogado] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [secao, setSecao] = useState('dashboard');

  const menu = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'plantios', label: 'Plantios' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'alertas', label: 'Alertas' },
    { id: 'fazenda', label: 'Minha Fazenda' },
  ];

  if (!logado) return (
    <div className="login-bg">
      <div className="login-box">
        <div className="login-logo"><h1>AgroDigital</h1><p>Gestao inteligente do campo</p></div>
        <div className="login-form">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="fazenda@agrodigital.com" />
          <label>Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)}placeholder="123456" />
          <button className="btn-login" onClick={() => { if(email==='fazenda@agrodigital.com'&&senha==='123456') setLogado(true); }}>Entrar</button>
          <p className="login-hint">Demo: fazenda@agrodigital.com / 123456</p>
        </div></div></div>
  );

  return (
    <div className="app-layout">
      <aside className="sidebar aberto">
        <div className="sidebar-header"><span className="logo-texto">AgroDigital</span></div>
        <nav className="sidebar-nav">
          {menu.map(m => (
            <button key={m.id} className={"nav-item " + (secao === m.id ? 'ativo' : '')} onClick={() => setSecao(m.id)}>{m.label}</button>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div><h2 className="topbar-titulo">{menu.find(m => m.id === secao)?.label}</h2><p className="topbar-sub">{d.nome} - {d.local}</p></div>
          <div className="topbar-usuario">{d.proprietario}</div>
        </header>
        <div className="conteudo">
          {secao === 'dashboard' && (<div className="secao"><div className="cards-grid">
            <div className="card card-up"><div className="card-info"><p className="card-label">Temperatura C</p><strong className="card-value">26</strong></div></div>
            <div className="card card-down"><div className="card-info"><p className="card-label">Humidade %</p><strong className="card-value">74</strong></div></div>
            <div className="card card-stable"><div className="card-info"><p className="card-label">PH do Solo</p><strong className="card-value">6.8</strong></div></div>
            <div className="card card-up"><div className="card-info"><p className="card-label">Umidade Solo %</p><strong className="card-value">52</strong></div></div>
          </div></div>)}
          {secao === 'plantios' && (<div className="secao"><div className="painel"><h3>Plantios</h3><table className="tabela"><thead><tr><th>Cultura</th><th>Area</th><th>Status</th></tr></thead><tbody>{d.plantios.map(p => (<tr key={p.cultura}><td>{p.cultura}</td><td>{p.area}</td><td>{p.status}</td></tr>))}</tbody></table></div></div>)}
          {secao === 'financeiro' && (<div className="secao"><div className="painel"><h3>Financeiro</h3><table className="tabela"><thead><tr><th>Mes</th><th>Receita</th><th>Despesa</th></tr></thead><tbody>{d.financeiro.map(m => (<tr key={m.mes}><td>{m.mes}</td><td className="verde">R$ {m.receita.toLocaleString()}</td><td className="vermelho">R$ {m.despesa.toLocaleString()}</td></tr>))}</tbody></table></div></div>)}
          {secao === 'alertas' && (<div className="secao"><div className="painel"><h3>Alertas</h3>{d.alertas.map((a,i) => (<div key={i} className={"alerta alerta-"+a.tipo}><p>{a.msg}</p></div>))}</div></div>)}
          {secao === 'fazenda' && (<div className="secao"><div className="painel"><h3>Dados da Fazenda</h3><div className="fazenda-info"><div className="info-row"><span>Nome</span><strong>{d.nome}</strong></div><div className="info-row"><span>Proprietario</span><strong>{d.proprietario}</strong></div><div className="info-row"><span>Area</span><strong>{d.area}</strong></div></div></div></div>)}
        </div>
      </main>
    </div>
  );
}
""")
print('ok')
