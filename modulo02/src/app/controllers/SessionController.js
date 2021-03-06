import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // cria a estrutura base que deve ser informada.
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string().required(),
    });

    // verifica se o schema é valido, (testa se esta faltando algum dado)
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { email, password } = req.body;

    // procura pelo usuario
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    // se o usuario não foi encontrado
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    // verifica se o password está correto
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        error: 'Password does not match',
      });
    }

    const { id, name, avatar, provider } = user;

    // retorna os dados do usuario com o token de autorização
    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
