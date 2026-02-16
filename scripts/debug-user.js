const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: "davidxsteven@gmail.com" }
    });
    console.log("User Debug Info:", JSON.stringify(user, null, 2));
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
