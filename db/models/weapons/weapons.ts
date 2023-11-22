const { sequelize } = require('../../sequelize/sequelize');
const { DataTypes, Model } = require('sequelize');

interface WeaponAttributes {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    damageType: string;
    ranged: boolean;
};

export class Weapon extends Model<WeaponAttributes> implements WeaponAttributes {
    name!: string;
    damageType!: string;
    ranged!: boolean;
};

Weapon.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
    },
    damageType: {
        type: DataTypes.STRING,
    },
    ranged: {
        type: DataTypes.BOOLEAN,
    }
}, {
    sequelize, modelName: 'weapons',
});