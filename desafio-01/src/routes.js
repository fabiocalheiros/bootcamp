import { Router } from 'express';
import Api from './services/api';

import ProjectsController from './app/controllers/ProjectsController';

const routes = new Router();

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const { projects } = Api;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

routes.get('/projects', ProjectsController.index);
routes.post('/projects', ProjectsController.store);
routes.put('/projects/:id', checkProjectExists, ProjectsController.update);
routes.delete('/projects/:id', checkProjectExists, ProjectsController.delete);

routes.post('/projects/:id/tasks', ProjectsController.storeTask);

export default routes;
