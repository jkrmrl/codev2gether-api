import { Sequelize, DataTypes, Model } from "@sequelize/core";
import sequelize from "../config/db.config";
import User from "./users.model";
import Collaborator from "./collaborators.model";
import Code from "./code.model";

class Project extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare programming_language: string;
  declare owner_id: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare collaborators?: Collaborator[];
  declare codes?: Code[];
  declare owner?: User;

  static associate: (models: {
    Collaborator: typeof Collaborator;
    User: typeof User;
    Code: typeof Code;
  }) => void;
}

Project.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    programming_language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: "Project",
  }
);

Project.associate = (models) => {
  Project.hasMany(models.Code, {
    foreignKey: "project_id",
    as: "codes",
  });
  Project.hasMany(models.Collaborator, {
    foreignKey: "project_id",
    as: "collaborators",
  });
  Project.belongsTo(models.User, {
    foreignKey: "owner_id",
    as: "owner",
  });
};

export default Project;
