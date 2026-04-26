import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Book extends Model {
  declare id: number;
  declare bookName: string;
  declare author: string;
  declare isbn: string;
  declare publishDate: Date;
  declare age: number;
  declare bookType: string;
  declare pageNo: number;
  declare ebookSize: string;
  declare genre: string;
  declare price: number;
  declare discount: number;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bookName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    publishDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bookType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pageNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ebookSize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Book',
  }
);

export default Book;
