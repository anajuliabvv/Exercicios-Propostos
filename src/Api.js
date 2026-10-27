export class ApiError extends Error {
  constructor(status, statusText) {
    super(`Erro ${status}: ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

const BASE_URL = 'http://localhost:3001';

export async function requisicao(endpoint, opcoes = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const { headers: headersExtras, ...outrasOpcoes } = opcoes;

  const headersPadrao = {
    'Content-Type': 'application/json',
    ...headersExtras,
  };

  const configuracao = {
    ...outrasOpcoes,
    headers: headersPadrao,
  };

  const resposta = await fetch(url, configuracao);

  if (!resposta.ok) {
    throw new ApiError(resposta.status, resposta.statusText);
  }

  if (resposta.status === 204) return null;
  return await resposta.json();
}

export async function apiGet(endpoint, opcoes = {}) {
  return requisicao(endpoint, { ...opcoes, method: 'GET' });
}

export async function apiPost(endpoint, dados, opcoes = {}) {
  return requisicao(endpoint, {
    ...outrasOpcoes => ({ ...outrasOpcoes, method: 'POST', body: JSON.stringify(dados) }),
    ...opcoes,
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export async function apiPut(endpoint, dados, opcoes = {}) {
  return requisicao(endpoint, {
    ...opcoes,
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

export async function apiDelete(endpoint, opcoes = {}) {
  return requisicao(endpoint, { ...opcoes, method: 'DELETE' });
}
