import { Sequelize, DataTypes, Model } from "@sequelize/core";
import sequelize from "../config/db.config";
import Project from "./projects.model";
import User from "./users.model";

class Collaborator extends Model {
  declare project_id: number;
  declare user_id: number;
  declare access_level: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare project?: Project;
  declare user?: User;

  static associate: (models: {
    Project: typeof Project;
    User: typeof User;
  }) => void;
}

Collaborator.init(
  {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Project,
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
    },
    access_level: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "Collaborator",
  }
);

Collaborator.associate = (models) => {
  Collaborator.belongsTo(models.Project, {
    foreignKey: "project_id",
    as: "project",
  });
  Collaborator.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });
};

export default Collaborator;
