import React, { useState, useEffect } from 'react';

export default function App() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/produtos') 
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar dados da API.');
        return res.json();
      })
      .then((data) => {
        setItens(data);
        setCarregando(false);
      })
      .catch((err) => {
        setErro(err.message);
        setCarregando(false);
      });
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p style={{ color: 'red' }}>Erro: {erro}</p>;
  if (itens.length === 0) return <p>Lista vazia.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Produtos</h1>
      <ul>
        {itens.map((item) => (
          <li key={item._id ?? item.id}>
            {item.produto || item.nome} - R$ {item.preco}
          </li>
        ))}
      </ul>
    </div>
  );
}
