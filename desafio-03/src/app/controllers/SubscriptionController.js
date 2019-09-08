import { isBefore } from 'date-fns';
import Subscription from '../models/Subscriptions';
import Meetups from '../models/Meetups';
import User from '../models/User';

import NewSubscribeMail from '../jobs/NewSubscribeMail';
import Queue from '../../lib/Queue';

class SubscriptionController {
  async store(req, res) {
    let sendDate = '';

    const meetup = await Meetups.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['name', 'email'],
        },
      ],
    });

    // verifica se o meetup existe
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not exist' });
    }

    // se o usuario for dono daquele meetup
    if (meetup.user_id === req.userId) {
      return res.status(400).json({ error: 'You own this event' });
    }

    // verifica se a data marcada no evento ja passou;
    if (isBefore(meetup.date_event, new Date())) {
      return res.status(400).json({ error: 'This event has already happened' });
    }

    // verifica se o usuario ja esta inscrito no meetup
    const checkUserSubscription = await Subscription.findOne({
      where: { meetup_id: req.params.id, user_id: req.userId },
    });

    if (checkUserSubscription) {
      return res.status(400).json({ error: 'Already subscribed' });
    }

    const checkUserSubscriptionHour = await Subscription.findOne({
      where: { date_event: meetup.date_event, user_id: req.userId },
    });

    if (checkUserSubscriptionHour) {
      return res
        .status(400)
        .json({ error: 'Você ja marcou um evento neste horario' });
    }

    if (req.query.date) {
      sendDate = req.query.date;
    } else {
      sendDate = meetup.date_event;
    }

    const new_subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: req.params.id,
      date_event: sendDate,
    });

    const getUserData = await User.findByPk(req.userId);

    const dataUser = {
      name: getUserData.name,
      email: getUserData.email,
    };

    meetup.dataValues.userSubscribe = dataUser;

    await Queue.add(NewSubscribeMail.key, {
      meetup,
    });

    return res.json(new_subscription);
  }
}

export default new SubscriptionController();
