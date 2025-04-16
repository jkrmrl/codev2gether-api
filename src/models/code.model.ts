import { Sequelize, DataTypes, Model } from '@sequelize/core';
import sequelize from '../utils/database';
import Project from './projects.model';
import User from './users.model';

class Code extends Model {
  declare id: number;
  declare project_id: number;
  declare user_id: number;
  declare code_value: string;
  declare execution_result: string | null;
  declare error_message: string | null;
  declare last_edited_by: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare user?: User;
  declare project?: Project;

  static associate: (models: { User: typeof User; Project: typeof Project }) => void;
}

Code.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    code_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    execution_result: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    last_edited_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'code',
    modelName: 'Code',
  }
);

Code.associate = (models) => {
  Code.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
  });
  Code.belongsTo(models.Project, {
    foreignKey: 'project_id',
    as: 'project',
  });
};

export default Code;