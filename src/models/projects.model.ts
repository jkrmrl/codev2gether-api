import { Sequelize, DataTypes, Model } from '@sequelize/core';
import sequelize from '../utils/database';
import User from './users.model';
import Collaborator from './collaborators.model'; // Import the Collaborator model

class Project extends Model {
    declare id: number;
    declare name: string;
    declare description: string;
    declare programming_language: string;
    declare owner_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare collaborators?: Collaborator[]; 
    static associate: (models: { Collaborator: typeof Collaborator }) => void;
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
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Project',
    }
);

Project.associate = (models) => {
    Project.hasMany(models.Collaborator, {
        foreignKey: 'project_id',
        as: 'collaborators',
    });
    Project.belongsTo(User, {
        foreignKey: 'owner_id',
        as: 'owner',
    });
};

export default Project;