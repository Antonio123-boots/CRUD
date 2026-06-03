const configuracoesEvento = {
  ano_evento: 2026,
  inicio_inscricao_modalidades: '',
  fim_inscricao_modalidades: '',
  inicio_inscricao_atletas: '',
  fim_inscricao_atletas: '',
  inicio_sorteio_chaves: '',
  fim_sorteio_chaves: ''
};

const modalidadesBase = [
  { id: 1, nome: 'Futsal Masculino', genero: 'Masculino', tipo: 'Coletivo', formato: 'Grupos + Mata-Mata' },
  { id: 2, nome: 'Vôlei Masculino', genero: 'Masculino', tipo: 'Coletivo', formato: 'Grupos + Mata-Mata' },
  { id: 3, nome: 'Basquete Masculino', genero: 'Masculino', tipo: 'Coletivo', formato: 'Grupos + Mata-Mata' }
];

const campusCadastrados = [
  { id: 1, nome: 'IFC Blumenau' },
  { id: 2, nome: 'IFC Camboriú' },
  { id: 3, nome: 'IFC Brusque' }
];

const atletasPendentes = [
  { id: 1, nome: 'João Silva', campus: 'IFC Blumenau', modalidade: 'Futsal Masculino', status: 'Pendente' },
  { id: 2, nome: 'Maria Souza', campus: 'IFC Camboriú', modalidade: 'Vôlei Masculino', status: 'Pendente' },
  { id: 3, nome: 'Pedro Lima', campus: 'IFC Brusque', modalidade: 'Basquete Masculino', status: 'Pendente' }
];

const jogosBase = [
  { id: 1, modalidade: 'Futsal Masculino', casa: 'IFC Blumenau', fora: 'IFC Camboriú', data: '24/06', horario: '09:00', placar: '2 x 1', status: 'Encerrado' },
  { id: 2, modalidade: 'Vôlei Masculino', casa: 'IFC Brusque', fora: 'IFC Blumenau', data: '24/06', horario: '11:00', placar: '3 x 1', status: 'Agendado' },
  { id: 3, modalidade: 'Basquete Masculino', casa: 'IFC Camboriú', fora: 'IFC Brusque', data: '25/06', horario: '16:00', placar: '1 x 1', status: 'Agendado' }
];

function getConfiguracoes() {
  return { ...configuracoesEvento };
}

function salvarConfiguracoes(novosDados) {
  Object.assign(configuracoesEvento, novosDados);
  return getConfiguracoes();
}

function getModalidades() {
  return modalidadesBase.map((item) => ({ ...item }));
}

function getCampusCadastrados() {
  return campusCadastrados.map((item) => ({ ...item }));
}

function getAtletasPendentes() {
  return atletasPendentes.map((item) => ({ ...item }));
}

function validarAtleta(atletaId) {
  const atleta = atletasPendentes.find((item) => item.id === Number(atletaId));
  if (atleta) atleta.status = 'Regular';
  return atleta;
}

function getJogos() {
  return jogosBase.map((item) => ({ ...item }));
}

function salvarPlacar(jogoId, dados) {
  const jogo = jogosBase.find((item) => item.id === Number(jogoId));
  if (!jogo) return null;

  jogo.placar = `${dados.placar1} x ${dados.placar2}`;
  jogo.status = dados.status || 'Encerrado';
  jogo.casa = dados.time1 || jogo.casa;
  jogo.fora = dados.time2 || jogo.fora;
  return { ...jogo };
}

function gerarChaveamento() {
  return getCampusCadastrados().map((campus, index) => ({
    id: campus.id,
    nome: campus.nome,
    chave: String.fromCharCode(65 + (index % 3)),
    grupo: `Grupo ${String.fromCharCode(65 + (index % 3))}`
  }));
}

module.exports = {
  getConfiguracoes,
  salvarConfiguracoes,
  getModalidades,
  getCampusCadastrados,
  getAtletasPendentes,
  validarAtleta,
  getJogos,
  salvarPlacar,
  gerarChaveamento
};
