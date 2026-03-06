import bcryptjs from "bcryptjs";
import prisma from "../client.js";
import { validatePostUser } from "../../middleware/validation/user.js";

const validateUser = (user) => {
  const req = { body: user };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.log(message.message);
        process.exit(1);
      },
    }),
  };

  validatePostUser(req, res, () => {});
};

const seedUsers = async () => {
  try {
    await prisma.user.deleteMany();

    const userData = [
      {
        firstName: "Alice",
        lastName: "Smith",
        emailAddress: "alice.smith@example.com",
        password: "121123324",
        role: "ADMIN",
      },
      {
        firstName: "Bob",
        lastName: "Johnson",
        emailAddress: "bob.johnson@example.com",
        password: "12121e2324",
        role: "ADMIN",
      },
      {
        firstName: "Charlie",
        lastName: "Brown",
        emailAddress: "charlie.brown@example.com",
        password: "12efewf1324",
        role: "ADMIN",
      },
      {
        firstName: "Diana",
        lastName: "Prince",
        emailAddress: "diana.prince@example.com",
        password: "121efw324",
        role: "ADMIN",
      },
      {
        firstName: "Ethan",
        lastName: "Hunt",
        emailAddress: "ethan.hunt@example.com",
        password: "12132wer4",
        role: "ADMIN",
      },
    ];

    const data = await Promise.all(
      userData.map(async (user) => {
        validateUser(user);
        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    await prisma.user.createMany({
      data,
      skipDuplicates: true,
    });

    console.log("Users successfully seeded");
  } catch (err) {
    console.log("Seeding failed:", err.message);
  }
};

seedUsers();
