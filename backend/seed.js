require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@immihire.com';
  const password = 'SuperSecurePassword123!';
  
  const existingUser = await prisma.adminUser.findUnique({ where: { email } });
  
  if (existingUser) {
    console.log('Superadmin already exists. Skipping seed.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const superadmin = await prisma.adminUser.create({
    data: {
      email,
      password: hashedPassword,
      role: 'SUPERADMIN',
      isActive: true,
    }
  });

  console.log(`Successfully created Superadmin: ${superadmin.email}`);
  console.log(`Password: ${password}`);
  console.log('IMPORTANT: Please change this password immediately after logging in.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
