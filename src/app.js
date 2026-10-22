const express = require('express');
const requestContext = require('./middlewares/requestContext');
const pedidoController = require('./controllers/pedidoController');
const logger = require('./logger');

const app = express();

app.use(requestContext);
app.use(express.json());

app.use('/pedidos', pedidoController);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada', requestId: req.requestId });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    logger.warn('JSON inválido na requisição', { requestId: req.requestId });
    return res.status(400).json({ erro: 'JSON inválido', requestId: req.requestId });
  }
  logger.error('Erro inesperado', { requestId: req.requestId, erro: err.message });
  return res.status(500).json({ erro: 'Erro interno do servidor', requestId: req.requestId });
});

module.exports = app;
