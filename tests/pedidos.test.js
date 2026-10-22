const request = require('supertest');
const app = require('../src/app');
const repository = require('../src/repositories/pedidoRepository');

describe('API de Pedidos', () => {
  beforeEach(() => repository.clear());

  test('POST /pedidos cria um pedido com status CRIADO e retorna 201', async () => {
    const res = await request(app)
      .post('/pedidos')
      .send({ cliente: 'Maria Silva', descricao: 'Notebook Dell', valor: 4500.9 });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.cliente).toBe('Maria Silva');
    expect(res.body.status).toBe('CRIADO');
    expect(res.headers.location).toBe(`/pedidos/${res.body.id}`);
  });

  test('GET /pedidos/:id retorna o pedido criado', async () => {
    const criado = await request(app)
      .post('/pedidos')
      .send({ cliente: 'João', descricao: 'Mouse', valor: 99.9 });

    const res = await request(app).get(`/pedidos/${criado.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(criado.body);
  });

  test('GET /pedidos/:id com identificador inexistente retorna 404', async () => {
    const res = await request(app).get('/pedidos/id-que-nao-existe');

    expect(res.status).toBe(404);
    expect(res.body.erro).toBe('Pedido não encontrado');
  });

  test('POST /pedidos com dados inválidos retorna 400', async () => {
    const res = await request(app).post('/pedidos').send({ cliente: '', valor: -10 });

    expect(res.status).toBe(400);
    expect(res.body.detalhes.length).toBeGreaterThan(0);
  });
});
