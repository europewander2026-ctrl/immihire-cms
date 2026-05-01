require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Remove old admin if it exists
  const oldEmail = 'admin@immihire.com';
  const oldUser = await prisma.adminUser.findUnique({ where: { email: oldEmail } });
  if (oldUser) {
    await prisma.adminUser.delete({ where: { email: oldEmail } });
    console.log(`Deleted old admin: ${oldEmail}`);
  }

  // 2. Create new superadmin
  const email = 'europe.wander2026@gmail.com';
  const password = 'C@rdlm4283@2026';
  
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
