import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
prisma.$use(async (params, next) => {
  const before = Date.now();

  const result = await next(params);

  const after = Date.now();
  console.log(params);

  console.log(`Query ${params.model}.${params.action} took ${after - before}ms `);

  return result;
});

// seed();

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: 'Road worker',
      content:
        'I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.',
    },
    {
      name: 'Frisbee',
      content: 'I was wondering why the frisbee was getting bigger, then it hit me.',
    },
    {
      name: 'Trees',
      content: "Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.",
    },
    {
      name: 'Skeletons',
      content: "Why don't skeletons ride roller coasters? They don't have the stomach for it.",
    },
    {
      name: 'Hippos',
      content: "Why don't you find hippopotamuses hiding in trees? They're really good at it.",
    },
    {
      name: 'Dinner',
      content: 'What did one plate say to the other plate? Dinner is on me!',
    },
    {
      name: 'Elevator',
      content:
        'My first time using an elevator was an uplifting experience. The second time let me down.',
    },
  ];
}
async function seed() {
  const kody = await prisma.user.create({
    data: {
      username: 'kody',
      // this is a hashed version of "twixrox"
      passwordHash: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
    },
  });
  await Promise.all(
    getJokes().map((joke) => {
      const data = { jokesterId: kody.id, ...joke };
      return prisma.joke.create({ data });
    }),
  );
}

(async () => {
  const data = await prisma.user.findMany({ include: { roles: true, jokes: true } });
  console.log(data);
  const data1 = await prisma.$queryRaw`SELECT * FROM Joke`;
  console.log(data1);
  const data2 = await prisma.role.findMany();
  console.log(data2);
})();
