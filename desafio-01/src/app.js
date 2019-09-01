import express from 'express';

import routes from './routes';

let numberOfRequests = 0;

class App {
  constructor() {
    this.server = express();

    this.numberOfRequests = 0;

    this.middlewares();
    this.routes();
  }

  logRequests(req, res, next) {
    numberOfRequests += 1;
    console.log(`Número de requisições: ${numberOfRequests}`);
    return next();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(this.logRequests);
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
