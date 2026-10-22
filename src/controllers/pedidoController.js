const express = require('express');
const service = require('../services/pedidoService');
const logger = require('../logger');

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const pedido = service.criarPedido(req.body);
    logger.info('Pedido criado', { requestId: req.requestId, pedidoId: pedido.id, valor: pedido.valor });
    return res.status(201).location(`/pedidos/${pedido.id}`).json(pedido);
  } catch (err) {
    if (err instanceof service.ValidationError) {
      logger.warn('Falha de validação ao criar pedido', { requestId: req.requestId, erros: err.details });
      return res.status(400).json({ erro: err.message, detalhes: err.details, requestId: req.requestId });
    }
    throw err;
  }
});

router.get('/:id', (req, res) => {
  const pedido = service.buscarPedido(req.params.id);
  if (!pedido) {
    logger.error('Pedido não encontrado', { requestId: req.requestId, pedidoId: req.params.id });
    return res.status(404).json({ erro: 'Pedido não encontrado', requestId: req.requestId });
  }
  logger.info('Pedido consultado', { requestId: req.requestId, pedidoId: pedido.id });
  return res.status(200).json(pedido);
});

module.exports = router;
