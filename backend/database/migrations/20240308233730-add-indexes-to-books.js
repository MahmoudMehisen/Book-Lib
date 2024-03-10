'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('Books', ['title']);
    await queryInterface.addIndex('Books', ['author']);
    await queryInterface.addIndex('Books', ['ISBN']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Books', ['title']);
    await queryInterface.removeIndex('Books', ['author']);
    await queryInterface.removeIndex('Books', ['ISBN']);
  }
};

