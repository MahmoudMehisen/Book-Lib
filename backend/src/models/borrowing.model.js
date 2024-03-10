'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Borrowings extends Model {
        static associate(models) {
            Borrowings.belongsTo(models.Book, {
                foreignKey: 'bookId',
                as: 'book'
            });
            Borrowings.belongsTo(models.Borrower, {
                foreignKey: 'borrowerId',
                as: 'borrower'
            });
        }
    }
    Borrowings.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        bookId: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        borrowerId: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        borrowedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        returnedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Borrowings',
        tableName: 'Borrowings',
        hooks: {
            beforeUpdate: (borrowing, _) => {
                borrowing.updatedAt = new Date();
            }
        }
    });
    return Borrowings;
};
