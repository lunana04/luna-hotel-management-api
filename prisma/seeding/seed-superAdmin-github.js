import fetch from "node-fetch";
import bcryptjs from "bcryptjs";

import prisma from "../client.js";
import { validatePostUser } from "../../middleware/validation/user.js"; 

const validateUser = (user) => {
  const req = { body: user };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.error("Validation failed:", message.message);
        process.exit(1);
      },
    }),
  };

  validatePostUser(req, res, () => {});
};

const seedSuperAdminsFromGist = async () => {
  try {
    const gistUrl = "https://gist.githubusercontent.com/lunana04/3d6da64d869fc5080523d98ef20fbfba/raw/8fbe6bb5f86f57dcfb6e4200174be6fa1c10abdb/super_admins.json"; 
    const response = await fetch(gistUrl);
    const userData = await response.json();

    const users = await Promise.all(
      userData.map(async (user) => {
        validateUser(user);

        const hashedPassword = await bcryptjs.hash(user.password, 10);
        return {
          ...user,
          password: hashedPassword,
          role: "SUPER_ADMIN",
        };
      })
    );

    for (const user of users) {
      await prisma.user.upsert({
        where: { emailAddress: user.emailAddress },
        update: {},
        create: user,
      });
    }

    console.log("SUPER_ADMIN users successfully seeded from GitHub Gist");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdminsFromGist();
