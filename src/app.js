/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable no-return-assign */
import express from 'express';
import cors from 'cors';
import { uuid } from 'uuidv4';

const app = express();

app.use(express.json());
app.use(cors());

const products = [];

app.get('/products', (request, response) => response.json(products));

app.post('/products', (request, response) => {
  const product = request.body;

  const prevLovers = products.find((el) => el.lovers == product.lovers);

  const newProduct = { ...product, lovers: prevLovers == undefined || prevLovers == null ? 0 : prevLovers.lovers, id: uuid() };

  products.push(newProduct);
  response.status(201).json(newProduct);
});

app.put('/products/:id', (request, response) => {
  const { id } = request.params;
  const findProduct = products.find((value) => value.id == id);

  const {
    code, description, buyPrice, sellPrice, tags,
  } = request.body;


  if (findProduct == undefined) {
    response.status(400).send('Não existem produtos cadastrados.');
  } else {
    findProduct.code = code;
    findProduct.description = description;
    findProduct.buyPrice = buyPrice;
    findProduct.sellPrice = sellPrice;
    findProduct.tags = tags;
    response.status(200).send(findProduct);
  }
});

app.delete('/products/:code', (request, response) => {
  const { code } = request.params;

  const index = products.findIndex((el) => el.code == code);

  if (index == -1) {
    response.status(400).send('Produto inexistente.');
  } else {
    products.splice(index, 1); response.status(204).send('Produtos com o código especificado removidos com sucesso.');
  }
});

app.get('/products/:code', (request, response) => {
  const { code } = request.params;

  const filtered = products.filter((el) => el.code == code);

  filtered == -1 ? response.status(204).send('Código de produto não encontrado.') : response.status(201).json(filtered);
});

app.post('/products/:code/love', (request, response) => {
  const { code } = request.params;

  const loved = products.filter((el) => el.code = code).map((el) => el.lovers += 1);

  loved == -1 ? response.status(400).send('Nenhum loved nesta categoria') : response.status(201).send(loved);
});

export default app;
