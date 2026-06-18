const campusModel = require('../models/campusModel');
const adminModel = require('../models/adminModel');

// Função auxiliar para obter a data atual do servidor em formato AAAA-MM-DD
function obterDataAtual() {
  return new Date().toISOString().split('T')[0];
}

// 1. Exibe as modalidades já inscritas pelo campus logado
function renderInscricoes(req, res) {
  const nomeCampus = req.session?.usuario?.nome || 'IFC Blumenau';
  const config = adminModel.getConfiguracoes();
  const hoje = obterDataAtual();

  const inicioModalidades = config.inicio_inscricao_modalidades;
  const fimModalidades = config.fim_inscricao_modalidades;
  const prazoModalidadesAberto = inicioModalidades && fimModalidades && (hoje >= inicioModalidades && hoje <= fimModalidades);

  const inicioAtletas = config.inicio_inscricao_atletas;
  const fimAtletas = config.fim_inscricao_atletas;
  const prazoAtletasAberto = inicioAtletas && fimAtletas && (hoje >= inicioAtletas && hoje <= fimAtletas);

  res.render('campus/inscrições', {
    title: 'Painel de Inscrições',
    usuarioLogado: req.session?.usuario || null,
    mostrarFiltros: false,
    modalidadesInscritas: campusModel.getInscricoes(nomeCampus),
    atletas: campusModel.getAtletas(nomeCampus),
    nomeCampus,
    prazoModalidadesAberto,
    prazoAtletasAberto,
    prazosModalidades: { inicio: inicioModalidades, fim: fimModalidades },
    prazosAtletas: { inicio: inicioAtletas, fim: fimAtletas }
  });
}

// 2. Salva as modalidades escolhidas no painel do campus
function salvarInscricoes(req, res) {
  const config = adminModel.getConfiguracoes();
  const hoje = obterDataAtual();
  const inicio = config.inicio_inscricao_modalidades;
  const fim = config.fim_inscricao_modalidades;
  const prazoAberto = inicio && fim && (hoje >= inicio && hoje <= fim);

  if (!prazoAberto) {
    return res.status(403).send("Erro: O período de inscrição de modalidades está encerrado.");
  }

  const nomeCampus = req.session?.usuario?.nome || 'IFC Blumenau';
  campusModel.salvarInscricoes(nomeCampus, req.body.modalidades || []);
  res.redirect('/campus/inscricoes');
}

// 3. Mostra a lista de atletas do campus para cadastro ou substituição
function renderAtletas(req, res) {
  const nomeCampus = req.session?.usuario?.nome || 'IFC Blumenau';
  const config = adminModel.getConfiguracoes();
  const hoje = obterDataAtual();

  const inicio = config.inicio_inscricao_atletas;
  const fim = config.fim_inscricao_atletas;
  const prazoAberto = inicio && fim && (hoje >= inicio && hoje <= fim);

  res.render('campus/atletas', {
    title: 'Gerenciar Atletas',
    usuarioLogado: req.session?.usuario || null,
    mostrarFiltros: false,
    faseAtual: 'regular',
    atletas: campusModel.getAtletas(nomeCampus),
    nomeCampus,
    prazoAberto: prazoAberto,
    prazos: { inicio, fim }
  });
}

// 4. Registra um novo atleta na base de dados local
function cadastrarAtleta(req, res) {
  const config = adminModel.getConfiguracoes();
  const hoje = obterDataAtual();
  const inicio = config.inicio_inscricao_atletas;
  const fim = config.fim_inscricao_atletas;
  const prazoAberto = inicio && fim && (hoje >= inicio && hoje <= fim);

  if (!prazoAberto) {
    return res.status(403).send("Erro: O período de inscrição de atletas está encerrado.");
  }

  const nomeCampus = req.session?.usuario?.nome || 'IFC Blumenau';
  campusModel.cadastrarAtleta(nomeCampus, {
    nome: req.body.nome,
    matricula: req.body.matricula,
    modalidade: req.body.modalidade || 'Futsal Masculino',
    genero: req.body.genero || 'Masculino',
    dataNascimento: req.body.dataNascimento
  });
  res.redirect('/campus/atletas');
}

// 5. Registra uma substituição com status pendente de laudo
function substituirAtleta(req, res) {
  const config = adminModel.getConfiguracoes();
  const hoje = obterDataAtual();
  const inicio = config.inicio_inscricao_atletas;
  const fim = config.fim_inscricao_atletas;
  const prazoAberto = inicio && fim && (hoje >= inicio && hoje <= fim);

  if (!prazoAberto) {
    return res.status(403).send("Erro: O período de alteração de atletas está encerrado.");
  }

  const nomeCampus = req.session?.usuario?.nome || 'IFC Blumenau';
  campusModel.substituirAtleta(nomeCampus, {
    nome: req.body.nome,
    matricula: req.body.matricula,
    modalidade: req.body.modalidade || 'Futsal Masculino',
    motivo: req.body.motivo || 'Substituição por laudo'
  });
  res.redirect('/campus/atletas');
}

// 6. Lista os jogos relacionados ao campus autenticado (Mantido intacto)
async function renderJogos(req, res) {
  try {
    const nomeCampus = req.session?.usuario?.nome || 'IFC Blumenau';
    const jogos = await adminModel.getJogos();
    const jogosCampus = jogos.filter((jogo) =>
      jogo.casa === nomeCampus || jogo.fora === nomeCampus
    );
    res.render('campus/jogos', {
      title: 'Jogos do Campus',
      usuarioLogado: req.session?.usuario || null,
      mostrarFiltros: false,
      jogosCampus
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar os jogos do campus.");
  }
}

// Exportações corretas para o campusRoutes.js conseguir mapear
module.exports = {
  renderInscricoes,
  salvarInscricoes,
  renderAtletas,
  cadastrarAtleta,
  substituirAtleta,
  renderJogos
};