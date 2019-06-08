import { AuthService } from '../services/auth-service';
import { APIRouter } from './api-router';

export class SessionRouter extends APIRouter {
  createOne(req, res) {
    const body = req.body || {};

    if (body.email === undefined || body.password === undefined) {
      const error = new Error('Missing argument(s). Email and password are required.');
      return res.status(400).send({
        'code': 400,
        'error': 'BAD_REQUEST',
        'message': error.message,
      });
    }

    const email = body.email || '';
    const password = body.password || '';

    const authFailedBlock = () => {
      res.status(401).send({
        'code': 401,
        'error': 'UNAUTHORIZED',
        'message': 'Authentication failed. Incorrect email or password.',
      });
    };

    this.dbClient.getOneUser('email', email, true).then((user) => {
      if (user === undefined) {
        return authFailedBlock();
      }

      AuthService.getInstance().validatePassword(password, user['password']).then((result) => {
        if (result === true) {
          delete user['password'];
          const token = AuthService.getInstance().generateToken(user);
          res.send({
            'user': user,
            'token': token,
          });
        } else {
          authFailedBlock();
        }
      });
    }).catch((error) => {
      res.status(401).send({
        'code': 401,
        'error': 'UNAUTHORIZED',
        'message': error.message,
      });
    });
  }
}
