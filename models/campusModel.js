// Base de dados local em memória para modalidades e atletas dos campus.
const inscricoesCampus = {
  'IFC Blumenau': ['Futsal Masculino', 'Voleibol Masculino'],
  'IFC Camboriú': ['Basquete Masculino'],
  'IFC Brusque': ['Futsal Masculino']
};

const atletasCampus = [
  { id: 1, nome: 'Lucas Mendes', campus: 'IFC Blumenau', matricula: '20250001', modalidade: 'Futsal Masculino', dataNascimento: '2007-02-10', status: 'Regular' },
  { id: 2, nome: 'Camila Nunes', campus: 'IFC Blumenau', matricula: '20250002', modalidade: 'Basquete Masculino', dataNascimento: '2006-08-12', status: 'Irregular' },
  { id: 3, nome: 'Bruno Alves', campus: 'IFC Camboriú', matricula: '20250003', modalidade: 'Vôlei Masculino', dataNascimento: '2008-01-20', status: 'Regular' }
];

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

function determinarStatusAtleta(dados, excluirId = null) {
  const anoNascimento = obterAnoNascimento(dados.dataNascimento);
  const anoLimite = obterAnoAtual() - 19;
  const matriculaNormalizada = normalizarMatricula(dados.matricula);

  if (!matriculaNormalizada || anoNascimento === null) {
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

  return anoNascimento >= anoLimite ? 'Regular' : 'Irregular';
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
  return atletasCampus.filter((item) => item.campus === campusNome).map((item) => ({ ...item }));
}

function getAtletaPorId(atletaId) {
  const atleta = localizarAtletaPorId(atletaId);
  return atleta ? { ...atleta } : null;
}

function getQuantidadeRegulares(campusNome) {
  return atletasCampus.filter((item) => item.campus === campusNome && item.status === 'Regular').length;
}

// Cria um novo atleta com status regular.
function cadastrarAtleta(campusNome, dados) {
  const matriculaNormalizada = normalizarMatricula(dados.matricula);
  const matriculaExistente = atletasCampus.some((atleta) => atleta.campus === campusNome && normalizarMatricula(atleta.matricula) === matriculaNormalizada);

  if (matriculaExistente) {
    const erro = new Error('Já existe um atleta cadastrado com esta matrícula neste campus.');
    erro.code = 'MATRICULA_DUPLICADA';
    throw erro;
  }

  const atleta = {
    id: Date.now(),
    nome: dados.nome,
    matricula: matriculaNormalizada,
    modalidade: dados.modalidade,
    genero: dados.genero,
    dataNascimento: dados.dataNascimento,
    campus: campusNome,
    status: determinarStatusAtleta(dados)
  };
  atletasCampus.push(atleta);
  return atleta;
}

function atualizarAtleta(atletaId, campusNome, dados) {
  const atleta = localizarAtletaPorId(atletaId);
  if (!atleta || atleta.campus !== campusNome) {
    return null;
  }

  const matriculaNormalizada = normalizarMatricula(dados.matricula);
  const matriculaExistente = atletasCampus.some((item) => item.campus === campusNome && item.id !== Number(atletaId) && normalizarMatricula(item.matricula) === matriculaNormalizada);

  if (matriculaExistente) {
    const erro = new Error('Já existe um atleta cadastrado com esta matrícula neste campus.');
    erro.code = 'MATRICULA_DUPLICADA';
    throw erro;
  }

  atleta.nome = dados.nome;
  atleta.matricula = matriculaNormalizada;
  atleta.modalidade = dados.modalidade;
  atleta.genero = dados.genero;
  atleta.dataNascimento = dados.dataNascimento;
  atleta.status = determinarStatusAtleta(dados, atletaId);

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
  const atleta = { id: Date.now(), ...dados, campus: campusNome, status: 'Pendente_Laudo' };
  atletasCampus.push(atleta);
  return atleta;
}

module.exports = {
  getInscricoes,
  salvarInscricoes,
  getAtletas,
  getAtletaPorId,
  getQuantidadeRegulares,
  cadastrarAtleta,
  atualizarAtleta,
  excluirAtleta,
  substituirAtleta
};
