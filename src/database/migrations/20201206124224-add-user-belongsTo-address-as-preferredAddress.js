/* eslint-disable no-unused-vars */
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Users', 'preferredAddressId', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'Addresses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Users', 'preferredAddressId');
  },
};
