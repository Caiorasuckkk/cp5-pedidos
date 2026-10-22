const pedidos = new Map();

function save(pedido) {
  pedidos.set(pedido.id, pedido);
  return pedido;
}

function findById(id) {
  return pedidos.get(id) || null;
}

function clear() {
  pedidos.clear();
}

module.exports = { save, findById, clear };
