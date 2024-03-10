'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Borrower extends Model { }
  Borrower.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    modelName: 'Borrower',
    hooks: {
      beforeUpdate: (borrower, _) => {
        borrower.updatedAt = new Date();
      }
    }
  });
  return Borrower;
};