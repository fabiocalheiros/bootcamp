import Sequelize, { Model } from 'sequelize';

class Subscriptions extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.INTEGER,
        meetup_id: Sequelize.INTEGER,
        date_event: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Subscriptions;
