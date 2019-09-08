import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class NewSubscribeMail {
  get key() {
    return 'NewSubscribeMail';
  }

  async handle({ data }) {
    const { meetup } = data;

    console.log('a fila executou');

    await Mail.sendMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: 'Novo usuário cadastrado no Meetup',
      text: 'Novo usuário cadastrado no Meetup',
      template: 'newsubscribemail',
      context: {
        name: meetup.organizer.name,
        title: meetup.title,
        user: meetup.userSubscribe.name,
        email: meetup.userSubscribe.email,
        date: format(
          parseISO(meetup.date_event),
          "'dia' dd 'de' MMMM', às' HH:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new NewSubscribeMail();
