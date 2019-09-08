import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupsController from './app/controllers/MeetupsController';
import OrganizerController from './app/controllers/OrganizerController';
import SubscriptionController from './app/controllers/SubscriptionController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);
routes.put('/users', UserController.update);

routes.get('/meetups/user/:id', OrganizerController.index);

routes.get('/meetups', MeetupsController.index);
routes.post('/meetups', MeetupsController.store);
routes.put('/meetups/:id', MeetupsController.update);
routes.delete('/meetups/:id', MeetupsController.delete);

routes.post('/subscription/:id', SubscriptionController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
