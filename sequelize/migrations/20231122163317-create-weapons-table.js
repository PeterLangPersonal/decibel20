module.exports = {
  async up(queryInterface, sequelize) {
    await queryInterface.createTable('weapons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: sequelize.DATE
      },
      name: {
        allowNull: false,
        type: sequelize.STRING,
        unique: true,
      },
      damageType: {
        allowNull: false,
        type: sequelize.STRING,
      },
      ranged: {
        allowNull: false,
        type: sequelize.BOOLEAN,
      }
    });
  },
  async down(queryInterface, sequelize) {
    await queryInterface.dropTable('weapons');
  }
};
