// Base de dados local em memória para modalidades e atletas dos campus.
const { listarCampi } = require('./campiCatalog');

const campusBase = listarCampi();
const modalidadesBase = [
  'Futsal Masculino',
  'Futsal Feminino',
  'Voleibol Masculino',
  'Voleibol Feminino',
  'Basquete Masculino',
  'Basquete Feminino'
];

const inscricoesCampus = campusBase.reduce((acumulador, campus, index) => {
  const primeiraModalidade = modalidadesBase[index % modalidadesBase.length];
  const segundaModalidade = modalidadesBase[(index + 2) % modalidadesBase.length];

  acumulador[campus.nome] = [primeiraModalidade, segundaModalidade].filter((modalidade, posicao, lista) => lista.indexOf(modalidade) === posicao);
  return acumulador;
}, {});

const nomesAtletas = [
  'Lucas Mendes', 'Camila Nunes', 'Bruno Alves', 'Ana Souza', 'Pedro Henrique',
  'Mariana Silva', 'João Victor', 'Luiza Costa', 'Gabriel Martins', 'Bianca Rocha',
  'Rafael Oliveira', 'Nina Pereira', 'Caio Santos', 'Aline Freitas', 'Thiago Cardoso'
];

const atletasCampus = campusBase.map((campus, index) => ({
  id: index + 1,
  nome: nomesAtletas[index],
  campus: campus.nome,
  matricula: `2026${String(index + 1).padStart(4, '0')}`,
  modalidade: inscricoesCampus[campus.nome][0],
  dataNascimento: `200${index % 3 === 0 ? 6 : 7}-${String((index % 9) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
  status: 'Regular'
}));

function normalizarMatricula(matricula) {
  return String(matricula || '').trim();
}

function obterAnoAtual() {
  return new Date().getFullYear();
}

function obterAnoNascimento(dataNascimento) {
  const data = new Date(dataNascimento);
  return Number.isNaN(data.getTime()) ? null : data.getFullYear();
}

function obterAnoEvento(opcoes = {}) {
  const anoEvento = Number(opcoes.anoEvento || new Date().getFullYear());
  return Number.isFinite(anoEvento) ? anoEvento : new Date().getFullYear();
}

function normalizarStatusSolicitado(status) {
  const statusNormalizado = String(status || 'Regular').trim().toLowerCase();
  return statusNormalizado.startsWith('pend') ? 'Pendente' : 'Regular';
}

function normalizarModalidades(valor) {
  const lista = Array.isArray(valor) ? valor : [valor];
  const modalidades = lista
    .map((item) => String(item || '').trim())
    .filter(Boolean);

  return [...new Set(modalidades)].slice(0, 3);
}

function atletaEhSub19(dados, opcoes = {}) {
  const anoNascimento = obterAnoNascimento(dados.dataNascimento);
  const anoEvento = obterAnoEvento(opcoes);
  const anoLimite = anoEvento - 19;

  return anoNascimento !== null && anoNascimento >= anoLimite;
}

function obterModalidadesSalvas(dados) {
  const modalidades = normalizarModalidades(dados.modalidades || dados.modalidade);
  return modalidades.length ? modalidades : [];
}

function determinarStatusAtleta(dados, excluirId = null, statusSolicitado = 'Regular', opcoes = {}) {
  const matriculaNormalizada = normalizarMatricula(dados.matricula);
  const statusBase = normalizarStatusSolicitado(statusSolicitado);

  if (!matriculaNormalizada || obterAnoNascimento(dados.dataNascimento) === null) {
    return 'Irregular';
  }

  const matriculaRepetida = atletasCampus.some((atleta) => {
    if (excluirId && atleta.id === Number(excluirId)) {
      return false;
    }

    return normalizarMatricula(atleta.matricula) === matriculaNormalizada;
  });

  if (matriculaRepetida) {
    return 'Irregular';
  }

  if (!atletaEhSub19(dados, opcoes)) {
    return 'Irregular';
  }

  return statusBase;
}

function localizarAtletaPorId(atletaId) {
  return atletasCampus.find((item) => item.id === Number(atletaId)) || null;
}

// Retorna as modalidades cadastradas para o campus informado.
function getInscricoes(campusNome) {
  return (inscricoesCampus[campusNome] || []).slice();
}

// Salva a lista de modalidades escolhidas por um campus.
function salvarInscricoes(campusNome, modalidades) {
  inscricoesCampus[campusNome] = Array.isArray(modalidades) ? modalidades : [modalidades].filter(Boolean);
  return getInscricoes(campusNome);
}

// Busca os atletas pertencentes a um campus específico.
function getAtletas(campusNome) {
  return atletasCampus.filter((item) => item.campus === campusNome).map((item) => ({
    ...item,
    modalidades: normalizarModalidades(item.modalidades || item.modalidade),
    modalidade: Array.isArray(item.modalidades) ? item.modalidades.join(', ') : item.modalidade
  }));
}

function getAtletasParaAnalise(campusNome = null) {
  const base = campusNome ? atletasCampus.filter((item) => item.campus === campusNome) : atletasCampus;
  return base.map((item) => ({
    ...item,
    modalidades: normalizarModalidades(item.modalidades || item.modalidade),
    modalidade: Array.isArray(item.modalidades) ? item.modalidades.join(', ') : item.modalidade
  })).sort((a, b) => a.campus.localeCompare(b.campus) || a.nome.localeCompare(b.nome));
}

function getAtletaPorId(atletaId) {
  const atleta = localizarAtletaPorId(atletaId);
  return atleta ? {
    ...atleta,
    modalidades: normalizarModalidades(atleta.modalidades || atleta.modalidade),
    modalidade: Array.isArray(atleta.modalidades) ? atleta.modalidades.join(', ') : atleta.modalidade
  } : null;
}

function getQuantidadeRegulares(campusNome) {
  return atletasCampus.filter((item) => item.campus === campusNome && item.status === 'Regular').length;
}

function getQuantidadePendentes(campusNome) {
  return atletasCampus.filter((item) => item.campus === campusNome && (item.status === 'Pendente' || item.status === 'Pendente_Laudo')).length;
}

function getQuantidadeTotal(campusNome) {
  return atletasCampus.filter((item) => item.campus === campusNome).length;
}

function getQuantidadeDisponivelRegular(campusNome, limiteRegularTotalCampus) {
  const limite = Number(limiteRegularTotalCampus);

  if (!Number.isFinite(limite) || limite <= 0) {
    return Infinity;
  }

  return Math.max(limite - getQuantidadeRegulares(campusNome), 0);
}

// Cria um novo atleta com status regular ou pendente.
function cadastrarAtleta(campusNome, dados, opcoes = {}) {
  const matriculaNormalizada = normalizarMatricula(dados.matricula);
  const matriculaExistente = atletasCampus.some((atleta) => atleta.campus === campusNome && normalizarMatricula(atleta.matricula) === matriculaNormalizada);
  const statusSolicitado = normalizarStatusSolicitado(dados.status);
  const limiteRegularTotalCampus = Number(opcoes.limiteRegularTotalCampus || 0);
  const modalidadesSelecionadas = obterModalidadesSalvas(dados);

  if (matriculaExistente) {
    const erro = new Error('Já existe um atleta cadastrado com esta matrícula neste campus.');
    erro.code = 'MATRICULA_DUPLICADA';
    throw erro;
  }

  if (obterAnoNascimento(dados.dataNascimento) === null) {
    const erro = new Error('Data de nascimento inválida.');
    erro.code = 'DATA_INVALIDA';
    throw erro;
  }

  if (!atletaEhSub19(dados, opcoes)) {
    const erro = new Error('A idade do atleta excede o limite permitido para esta categoria');
    erro.code = 'IDADE_LIMITE_EXCEDIDO';
    throw erro;
  }

  if (!modalidadesSelecionadas.length) {
    const erro = new Error('Selecione ao menos uma modalidade para este atleta.');
    erro.code = 'MODALIDADES_OBRIGATORIAS';
    throw erro;
  }

  if (modalidadesSelecionadas.length > 3) {
    const erro = new Error('O atleta pode participar de no máximo 3 esportes.');
    erro.code = 'MODALIDADES_EXCEDIDAS';
    throw erro;
  }

  if (statusSolicitado === 'Regular' && limiteRegularTotalCampus > 0 && getQuantidadeRegulares(campusNome) >= limiteRegularTotalCampus) {
    const erro = new Error('O campus atingiu o limite de atletas regulares. Selecione Pendente para criar uma reserva.');
    erro.code = 'LIMITE_REGULAR_EXCEDIDO';
    throw erro;
  }

  const atleta = {
    id: Date.now(),
    nome: dados.nome,
    matricula: matriculaNormalizada,
    modalidade: modalidadesSelecionadas.join(', '),
    modalidades: modalidadesSelecionadas,
    dataNascimento: dados.dataNascimento,
    campus: campusNome,
    status: statusSolicitado
  };
  atletasCampus.push(atleta);
  return atleta;
}

function atualizarAtleta(atletaId, campusNome, dados, opcoes = {}) {
  const atleta = localizarAtletaPorId(atletaId);
  if (!atleta || atleta.campus !== campusNome) {
    return null;
  }

  const matriculaNormalizada = normalizarMatricula(dados.matricula);
  const matriculaExistente = atletasCampus.some((item) => item.campus === campusNome && item.id !== Number(atletaId) && normalizarMatricula(item.matricula) === matriculaNormalizada);
  const statusSolicitado = normalizarStatusSolicitado(dados.status || atleta.status);
  const limiteRegularTotalCampus = Number(opcoes.limiteRegularTotalCampus || 0);
  const modalidadesSelecionadas = obterModalidadesSalvas(dados);

  if (matriculaExistente) {
    const erro = new Error('Já existe um atleta cadastrado com esta matrícula neste campus.');
    erro.code = 'MATRICULA_DUPLICADA';
    throw erro;
  }

  if (obterAnoNascimento(dados.dataNascimento) === null) {
    const erro = new Error('Data de nascimento inválida.');
    erro.code = 'DATA_INVALIDA';
    throw erro;
  }

  if (!atletaEhSub19(dados, opcoes)) {
    const erro = new Error('A idade do atleta excede o limite permitido para esta categoria');
    erro.code = 'IDADE_LIMITE_EXCEDIDO';
    throw erro;
  }

  if (!modalidadesSelecionadas.length) {
    const erro = new Error('Selecione ao menos uma modalidade para este atleta.');
    erro.code = 'MODALIDADES_OBRIGATORIAS';
    throw erro;
  }

  if (modalidadesSelecionadas.length > 3) {
    const erro = new Error('O atleta pode participar de no máximo 3 esportes.');
    erro.code = 'MODALIDADES_EXCEDIDAS';
    throw erro;
  }

  if (statusSolicitado === 'Regular') {
    const regularesSemAtletaAtual = atletasCampus.filter((item) => item.campus === campusNome && item.status === 'Regular' && item.id !== Number(atletaId)).length;
    if (limiteRegularTotalCampus > 0 && regularesSemAtletaAtual >= limiteRegularTotalCampus) {
      const erro = new Error('O campus atingiu o limite de atletas regulares. Selecione Pendente para esta inscrição.');
      erro.code = 'LIMITE_REGULAR_EXCEDIDO';
      throw erro;
    }
  }

  atleta.nome = dados.nome;
  atleta.matricula = matriculaNormalizada;
  atleta.modalidade = modalidadesSelecionadas.join(', ');
  atleta.modalidades = modalidadesSelecionadas;
  atleta.dataNascimento = dados.dataNascimento;
  atleta.status = statusSolicitado;

  return { ...atleta };
}

function atualizarStatusAtleta(atletaId, novoStatus) {
  const atleta = localizarAtletaPorId(atletaId);

  if (!atleta) {
    return null;
  }

  const statusNormalizado = normalizarStatusSolicitado(novoStatus);
  if (statusNormalizado === 'Regular' && !atletaEhSub19(atleta)) {
    return null;
  }

  atleta.status = statusNormalizado;
  return { ...atleta };
}

function excluirAtleta(atletaId, campusNome) {
  const indice = atletasCampus.findIndex((item) => item.id === Number(atletaId) && item.campus === campusNome);
  if (indice === -1) {
    return false;
  }

  atletasCampus.splice(indice, 1);
  return true;
}

// Cria uma substituição com status pendente de laudo.
function substituirAtleta(campusNome, dados) {
  const atleta = { id: Date.now(), ...dados, campus: campusNome, modalidades: normalizarModalidades(dados.modalidades || dados.modalidade), status: 'Pendente' };
  atleta.modalidade = Array.isArray(atleta.modalidades) ? atleta.modalidades.join(', ') : dados.modalidade;
  atletasCampus.push(atleta);
  return atleta;
}

module.exports = {
  getInscricoes,
  salvarInscricoes,
  getAtletas,
  getAtletasParaAnalise,
  getAtletaPorId,
  getQuantidadeRegulares,
  getQuantidadePendentes,
  getQuantidadeTotal,
  getQuantidadeDisponivelRegular,
  cadastrarAtleta,
  atualizarAtleta,
  atualizarStatusAtleta,
  excluirAtleta,
  substituirAtleta
};
