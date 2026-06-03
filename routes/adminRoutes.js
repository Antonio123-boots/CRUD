const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/configurar', adminController.renderConfigurar);
router.post('/configurar/salvar', adminController.salvarConfiguracoes);

router.get('/chaveamento', adminController.renderChaveamento);
router.post('/chaveamento/gerar/:modalidadeId', adminController.gerarChaveamento);

router.get('/laudos', adminController.renderAnalise);
router.post('/laudos/validar/:atletaId', adminController.validarAtleta);

router.get('/jogos/placar/:jogoId', adminController.renderPlacar);
router.post('/jogos/placar/:jogoId/salvar', adminController.salvarPlacar);

module.exports = router;