const { randomUUID } = require('crypto');
const logger = require('../logger');

function requestContext(req, res, next) {
  req.requestId = req.header('X-Request-Id') || randomUUID();
  res.setHeader('X-Request-Id', req.requestId);

  const start = Date.now();
  logger.info('Requisição recebida', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
  });

  res.on('finish', () => {
    logger.info('Requisição finalizada', {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });

  next();
}

module.exports = requestContext;
