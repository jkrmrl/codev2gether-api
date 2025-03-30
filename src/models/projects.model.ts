import { Sequelize, DataTypes, Model } from '@sequelize/core';
import sequelize from '../utils/database';
import User from './users.model';

class Project extends Model {
    declare id: number;
    declare name: string;
    declare description: string;
    declare programming_language: string;
    declare owner_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;
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
            allowNull: true,
        },
        programming_language: {
            type: DataTypes.STRING,
            allowNull: true,
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
    }
);

export default Project;