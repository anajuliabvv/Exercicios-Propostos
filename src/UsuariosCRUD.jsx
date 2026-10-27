import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from './Api';

export function UsuariosCRUD() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [idEditando, setIdEditando] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function carregarUsuarios() {
      try {
        setErro('');
        const dados = await apiGet('/users', { signal });
        setUsuarios(dados);
      } catch (err) {
        if (err.name === 'AbortError') {
          return; 
        }

        if (err instanceof ApiError) {
          if (err.status === 404) {
            setErro('Recurso não encontrado');
          } else if (err.status === 500) {
            setErro('Erro no servidor');
          } else {
            setErro(`Erro inesperado: ${err.status}`);
          }
        } else if (err instanceof TypeError) {
          setErro('Falha de rede');
        } else {
          setErro('Ocorreu um erro desconhecido');
        }
      }
    }

    carregarUsuarios();

    return () => controller.abort();
  }, []);

  async function salvarUsuario(e) {
    e.preventDefault();
    if (!nome.trim()) return;

    try {
      if (idEditando) {
        const usuarioAtualizado = await apiPut(`/users/${idEditando}`, { nome }, {
          headers: { 'X-Custom': 'aula07' } 
        });
        setUsuarios(usuarios.map(u => u.id === idEditando ? usuarioAtualizado : u));
        setIdEditando(null);
      } else {
        const novoUsuario = await apiPost('/users', { nome });
        setUsuarios([...usuarios, novoUsuario]);
      }
      setNome('');
    } catch (err) {
      alert('Erro ao salvar usuário.');
    }
  }

  async function excluirUsuario(id) {
    try {
      await apiDelete(`/users/${id}`);
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (err) {
      alert('Erro ao excluir usuário.');
    }
  }

  function iniciarEdicao(usuario) {
    setIdEditando(usuario.id);
    setNome(usuario.nome);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>CRUD de Usuários</h2>

      {erro && <p style={{ color: 'red', fontWeight: 'bold' }}>{erro}</p>}

      <form onSubmit={salvarUsuario}>
        <input 
          type="text" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          placeholder="Nome do usuário"
        />
        <button type="submit">{idEditando ? 'Atualizar' : 'Cadastrar'}</button>
        {idEditando && <button type="button" onClick={() => { setIdEditando(null); setNome(''); }}>Cancelar</button>}
      </form>

      <ul>
        {usuarios.map(u => (
          <li key={u.id} style={{ margin: '10px 0' }}>
            {u.nome} {' '}
            <button onClick={() => iniciarEdicao(u)}>Editar</button>
            <button onClick={() => excluirUsuario(u.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
