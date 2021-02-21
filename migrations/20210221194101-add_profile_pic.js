'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("abouts", "pictureShow", {
      type: Sequelize.BOOLEAN,
  });

  await queryInterface.addColumn("abouts", "pictureId", {
      type: Sequelize.STRING,
  });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("abouts", "pictureShow");
    await queryInterface.removeColumn("abouts", "pictureId");
  }
};
