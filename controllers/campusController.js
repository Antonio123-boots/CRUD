const campusModel = require('../models/campusModel');
const adminModel = require('../models/adminModel');

function renderInscricoes(req, res) {
  const nomeCampus = req.session?.usuario?.nome || 'IFC Blumenau';
  res.render('campus/inscrições', {
    title: 'Inscrição de Modalidades',
    usuarioLogado: req.session?.usuario || null,
    mostrarFiltros: false,
    modalidadesInscritas: campusModel.getInscricoes(nomeCampus),
    nomeCampus
  });
}

function salvarInscricoes(req, res) {
  const nomeCampus = req.session?.usuario?.nome || 'IFC Blumenau';
  campusModel.salvarInscricoes(nomeCampus, req.body.modalidades || []);
  res.redirect('/campus/inscricoes');
}

function renderAtletas(req, res) {
  const nomeCampus = req.session?.usuario?.nome || 'IFC Blumenau';
  res.render('campus/atletas', {
    title: 'Gerenciar Atletas',
    usuarioLogado: req.session?.usuario || null,
    mostrarFiltros: false,
    faseAtual: 'regular',
    atletas: campusModel.getAtletas(nomeCampus),
    nomeCampus
  });
}

function cadastrarAtleta(req, res) {
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

function substituirAtleta(req, res) {
  const nomeCampus = req.session?.usuario?.nome || 'IFC Blumenau';
  campusModel.substituirAtleta(nomeCampus, {
    nome: req.body.nome,
    matricula: req.body.matricula,
    modalidade: req.body.modalidade || 'Futsal Masculino',
    motivo: req.body.motivo || 'Substituição por laudo'
  });
  res.redirect('/campus/atletas');
}

function renderJogos(req, res) {
  const nomeCampus = req.session?.usuario?.nome || 'IFC Blumenau';
  const jogosCampus = adminModel.getJogos().filter((jogo) =>
    jogo.casa === nomeCampus || jogo.fora === nomeCampus
  );

  res.render('campus/jogos', {
    title: 'Jogos do Campus',
    usuarioLogado: req.session?.usuario || null,
    mostrarFiltros: false,
    nomeCampus,
    jogosCampus
  });
}

module.exports = {
  renderInscricoes,
  salvarInscricoes,
  renderAtletas,
  cadastrarAtleta,
  substituirAtleta,
  renderJogos
};
