import * as Yup from 'yup';
import { Op } from 'sequelize';
import {
  startOfHour,
  isBefore,
  startOfDay,
  endOfDay,
  parseISO,
} from 'date-fns';
import Meetup from '../models/Meetups';
import User from '../models/User';
import File from '../models/File';

class MeetupsController {
  async index(req, res) {
    const where = {};
    const { page = 1 } = req.query;

    // verificar se a data de pesquisa é anterior a hoje
    if (isBefore(parseISO(req.query.date), new Date())) {
      return res
        .status(400)
        .json({ error: 'The date you entered has passed.' });
    }

    // verifica se o usario preencheu alguma data
    if (req.query.date) {
      const searchDate = parseISO(req.query.date);
      // procura por todos os eventos daqele dia
      where.date_event = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    } else {
      // procura por eventos que ainda não aconteceram
      where.date_event = {
        [Op.gt]: new Date(),
      };
    }

    const meetups = await Meetup.findAll({
      where,
      order: ['date_event'],
      limit: 10,
      offset: (page - 1) * 10,
      attributes: [
        'id',
        'title',
        'description',
        'location',
        'banner_id',
        'date_event',
      ],
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date_event: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const { title, description, location, date_event, banner_id } = req.body;

    // startOfHour = pega somente o inicio de um horario - ex: (19:30) so pega (19:00)
    // paserISO = transforma uma string em um objeto date em javascript
    const hourStart = startOfHour(parseISO(date_event));

    // verifica de a data atual já passou;
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const new_meetup = await Meetup.create({
      user_id: req.userId,
      title,
      description,
      location,
      date_event,
      banner_id,
    });

    return res.json(new_meetup);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, description, location, date_event, banner_id } = req.body;

    // checa se o meetup existe
    const meetupExists = await Meetup.findOne({ where: { id } });

    if (!meetupExists) {
      return res.status(400).json({ error: 'Meetup not exist' });
    }

    // checa se o usuario é dono daquele meetup
    const checkOwnerMeetup = await Meetup.findOne({
      where: {
        user_id: req.userId,
        id,
      },
    });

    if (!checkOwnerMeetup) {
      return res
        .status(400)
        .json({ error: 'This Meetup does not currently belong to this user.' });
    }

    // verifica se a data marcada no evento ja passou;
    if (isBefore(checkOwnerMeetup.date_event, new Date())) {
      return res.status(400).json({ error: 'This event has already happened' });
    }

    // verifica se a data que o usuario está passando ja passou;
    if (isBefore(parseISO(date_event), new Date())) {
      return res.status(400).json({
        error: 'Date entered is past',
        date_event,
      });
    }

    await Meetup.update(req.body, { where: { id } });

    return res.json({
      id,
      title,
      description,
      location,
      date_event,
      banner_id,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    // checa se o meetup existe
    const meetupExists = await Meetup.findOne({ where: { id } });

    if (!meetupExists) {
      return res.status(400).json({ error: 'Meetup not exist' });
    }

    // checa se o usuario é dono daquele meetup
    const checkOwnerMeetup = await Meetup.findOne({
      where: {
        user_id: req.userId,
        id,
      },
    });

    if (!checkOwnerMeetup) {
      return res
        .status(400)
        .json({ error: 'This Meetup does not currently belong to this user.' });
    }

    // verifica se a data marcada no evento ja passou;
    if (isBefore(checkOwnerMeetup.date_event, new Date())) {
      return res.status(400).json({ error: 'This event has already happened' });
    }

    await Meetup.destroy({
      where: {
        id,
      },
    });

    return res.status(200).json({ sucess: 'Meetup excluded with sucess.' });
  }
}

export default new MeetupsController();
