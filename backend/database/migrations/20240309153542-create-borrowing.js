'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Borrowings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      bookId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Books',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      borrowerId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Borrowers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      borrowedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      returnedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.sequelize.query(`
    CREATE UNIQUE INDEX "bookId_borrowerId_unique_constraint" 
    ON "Borrowings" ("bookId", "borrowerId")
    WHERE "returnedAt" IS NULL;
  `);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Borrowings');
  }
};
