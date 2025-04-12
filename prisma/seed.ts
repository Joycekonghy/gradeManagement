import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
;

const prisma = new PrismaClient();

async function main() {
  // Seed the teacher
  const teacherPassword = await bcrypt.hash('1234', 10);
  await prisma.user.create({
    data: {
      email: 'teacher@school.com',
      password: teacherPassword,
      name: 'Mr. Smith',
      role: 'TEACHER',
    },
  });

  // Seed multiple students
  const students = [
    { email: 'student1@school.com', name: 'Alice' },
    { email: 'student2@school.com', name: 'Bob' },
    { email: 'student3@school.com', name: 'Charlie' },
  ];

  const studentPassword = await bcrypt.hash('123', 10);

  for (const student of students) {
    await prisma.user.create({
      data: {
        email: student.email,
        password: studentPassword,
        name: student.name,
        role: 'STUDENT',
      },
    });
  }

  console.log('✅ Seeded teacher and students!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
