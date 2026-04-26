import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;
