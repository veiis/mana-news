const bcrypt = require('bcrypt')
const sequelize = require('sequelize')

module.exports = {
  up: (queryInterface) => queryInterface.sequelize.transaction(
    async (transaction) => {
      const password = await bcrypt.hash("Admin@1234", 10)
      const admin = {
        firstName: "Iman",
        lastName: "Veisi",
        mobile: "+989199119911",
        password,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }

      const otherUsers = []

      const usersSeeds = [
        admin,
        ...otherUsers
      ]

      await queryInterface.bulkInsert(
        "users",
        usersSeeds,
        {}
      );
    }
  ),

  down: (queryInterface) => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.bulkDelete("Users", null, {});
    }
  )
};
