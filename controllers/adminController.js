const adminModel = require('../models/adminModel');

function renderConfigurar(req, res) {
  res.render('adm/configEvento', {
    title: 'Configurar Prazos',
    usuarioLogado: req.session?.usuario || null,
    mostrarFiltros: false,
    configuracoes: adminModel.getConfiguracoes()
  });
}

function salvarConfiguracoes(req, res) {
  adminModel.salvarConfiguracoes({
    inicio_inscricao_modalidades: req.body.inicioInscricoesModalidades,
    fim_inscricao_modalidades: req.body.fimInscricoesModalidades,
    inicio_inscricao_atletas: req.body.inicioInscricoesAtletas,
    fim_inscricao_atletas: req.body.fimInscricoesAtletas,
    inicio_sorteio_chaves: req.body.inicioSorteio,
    fim_sorteio_chaves: req.body.fimSorteio
  });
  res.redirect('/admin/configurar');
}

function renderChaveamento(req, res) {
  res.render('adm/chaveamento', {
    title: 'Chaveamento dos Jogos',
    usuarioLogado: req.session?.usuario || null,
    mostrarFiltros: false,
    modalidades: adminModel.getModalidades(),
    chaves: adminModel.gerarChaveamento(),
    jogos: adminModel.getJogos()
  });
}

function gerarChaveamento(req, res) {
  adminModel.gerarChaveamento();
  res.redirect('/admin/chaveamento');
}

function renderAnalise(req, res) {
  res.render('adm/analiseAtletas', {
    title: 'Análise de Atletas',
    usuarioLogado: req.session?.usuario || null,
    mostrarFiltros: false,
    atletas: adminModel.getAtletasPendentes()
  });
}

function validarAtleta(req, res) {
  adminModel.validarAtleta(req.params.atletaId);
  res.redirect('/admin/laudos');
}

function renderPlacar(req, res) {
  res.render('adm/placares', {
    title: 'Lançar Resultado',
    usuarioLogado: req.session?.usuario || null,
    mostrarFiltros: false,
    jogoId: req.params.jogoId,
    jogo: adminModel.getJogos().find((item) => item.id === Number(req.params.jogoId)) || null
  });
}

function salvarPlacar(req, res) {
  adminModel.salvarPlacar(req.params.jogoId, {
    placar1: req.body.placar1,
    placar2: req.body.placar2,
    time1: req.body.time1,
    time2: req.body.time2,
    status: req.body.status
  });
  res.redirect('/admin/chaveamento');
}

module.exports = {
  renderConfigurar,
  salvarConfiguracoes,
  renderChaveamento,
  gerarChaveamento,
  renderAnalise,
  validarAtleta,
  renderPlacar,
  salvarPlacar
};
