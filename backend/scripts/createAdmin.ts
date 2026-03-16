import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const targetEmail = process.env.ADMIN_EMAIL;

if (!targetEmail) {
  console.error('Error: ADMIN_EMAIL environment variable is required.');
  console.error('Usage: ADMIN_EMAIL=you@example.com npm run promote-admin');
  process.exit(1);
}

const promoteAdmin = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL');

    const user = await prisma.user.findUnique({ where: { email: targetEmail.toLowerCase() } });
    if (!user) {
      console.error(`No user found with email: ${targetEmail}`);
      process.exit(1);
    }
    if (user.role === 'admin') {
      console.log(`User ${targetEmail} is already an admin.`);
      process.exit(0);
    }

    const updated = await prisma.user.update({ where: { id: user.id }, data: { role: 'admin' } });
    console.log(`Successfully promoted ${targetEmail} to admin. Clerk ID: ${updated.clerkId}`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', (err as Error).message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

promoteAdmin();
