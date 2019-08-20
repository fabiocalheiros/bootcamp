const express = require("express");

// inicia o servidor
const server = express();

// declara ao express que todas as respostas serão em formato json
server.use(express.json());

const users = ["Diego", "Cláudio", "Fábio"];

// middleare que é chamado toda vez que uma rota é chamada
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

// middleare local, é passado como parametro nas requisiçoes POST e PUT
function checkUsersExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

// middleare local, é passado como parametro nas GET PUT E DELETE
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  // se o usuario for encontrado guarda no req um novo parametro user. Que podera ser acessado posteriopemte nas outras funções
  req.user = user;
  return next();
}

// CRUD
///// CREATE
server.post("/users", checkUsersExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

///// READ

// Query params = ?teste=1
// Routes params = /users/1
// Request body = POST E PUT { "name": "Fabio", "email": "fabio.calheiros@gmail.com" }

// cria uma rota que retorna todos os usuarios:
// http://localhost:3000/users
server.get("/users", (req, res) => {
  return res.json(users);
});

// cria uma rota para teste acessando os dados via query params
// http://localhost:3000/teste?nome=fabio
server.get("/teste", (req, res) => {
  const nome = req.query.nome;
  return res.json({
    message: `Hello ${nome}`
  });
});

// cria uma rora para users acessando a rota via params
// http://localhost:3000/users/1
server.get("/users/:index", checkUserInArray, (req, res) => {
  //const { index } = req.params;
  //return res.json(users[index]);
  return res.json(req.user);
});

///// UPTADED
server.put("/users/:index", checkUsersExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

///// DELETE
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

// adiciona um listem na porta 3000
server.listen(3000);
