require('dotenv').config();
const { sequelize, User, Leave_Balance } = require('./models');
const bcrypt = require('bcrypt');


const seed = async () => {
  try {
    await sequelize.sync({ alter: true });
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword, // hash in production
      role: 'admin',
    });

    const manager = await User.create({
      name: 'Manager One',
      email: 'manager1@example.com',
      password: hashedPassword,
      role: 'manager',
    });

    const employee = await User.create({
      name: 'Employee One',
      email: 'employee1@example.com',
      password: hashedPassword,
      role: 'employee',
    });

    // Create Leave Balances for the employee
    const currentYear = new Date().getFullYear();

    await Leave_Balance.bulkCreate([
      {
        user_id: employee.id,
        type: 'casual',
        balance: 6,
        year: currentYear,
      },
      {
        user_id: employee.id,
        type: 'sick',
        balance: 4,
        year: currentYear,
      },
    ]);

    console.log('✅ Seeded database with users and leave balances!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
};

seed();
