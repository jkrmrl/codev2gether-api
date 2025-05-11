import { Sequelize, DataTypes, Model } from "@sequelize/core";
import sequelize from "../config/db.config";

class User extends Model {
  declare id: number;
  declare name: string;
  declare username: string;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
  }
);

export default User;
