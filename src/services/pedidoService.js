const { randomUUID } = require('crypto');
const repository = require('../repositories/pedidoRepository');

class ValidationError extends Error {
  constructor(details) {
    super('Dados do pedido inválidos');
    this.details = details;
  }
}

function validar(dados) {
  const erros = [];
  if (!dados || typeof dados !== 'object') {
    return ['Corpo da requisição deve ser um objeto JSON'];
  }
  if (typeof dados.cliente !== 'string' || dados.cliente.trim() === '') {
    erros.push('cliente é obrigatório e deve ser texto');
  }
  if (typeof dados.descricao !== 'string' || dados.descricao.trim() === '') {
    erros.push('descricao é obrigatória e deve ser texto');
  }
  if (typeof dados.valor !== 'number' || !Number.isFinite(dados.valor) || dados.valor <= 0) {
    erros.push('valor é obrigatório e deve ser um número maior que zero');
  }
  return erros;
}

function criarPedido(dados) {
  const erros = validar(dados);
  if (erros.length > 0) {
    throw new ValidationError(erros);
  }

  const pedido = {
    id: randomUUID(),
    cliente: dados.cliente.trim(),
    descricao: dados.descricao.trim(),
    valor: dados.valor,
    status: 'CRIADO',
    criadoEm: new Date().toISOString(),
  };
  return repository.save(pedido);
}

function buscarPedido(id) {
  return repository.findById(id);
}

module.exports = { criarPedido, buscarPedido, ValidationError };
