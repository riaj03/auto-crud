export const migrationsSnipets: any = {
  migrationsStart: `
  'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('@{MODEL}s', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
  `,
  migrationsEnd: `
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
});
},
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('@{MODEL}s');
  }
};
  `
};
