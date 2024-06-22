import { PrismaClient } from "@prisma/client";
import { Role } from "../src/types/auth";
const prisma = new PrismaClient();

async function main() {
  let currentDate = new Date();
  const ste = await prisma.user.upsert({
    where: { email: "michal.stehlik@pslib.cz" },
    update: {},
    create: {
      name: "Michal Stehlík",
      email: "michal.stehlik@pslib.cz",
      givenName: "Michal",
      surname: "Stehlík",
      role: Role.ADMIN,
      emailVerified: currentDate.toISOString(),
      department: "PZAM",
      phone: "607177971",
      image:
        "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAwADADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3huv4elVry7hsLKa7uXWOCFS7sewFWm615t8XPtV5YaTokL7Le/uwLkg8sqkHb+NKTsrlRXM7GLrvxQ1a750HT0W3J4muOd49QB2qKz+J3iLSrUy6ppcN9ap8zvA22RF78Hg0l7p8SXJRUIjAAUKOBjtVqx0qK5gaGSM+XIpVge4NcTxElqemsHCx3+g+INP8T6RHqemSmSB+CGXayn0I7VefP+RXg/gW41Lwb4vbTrcPLZTT+S8BGSwzgEf7Q6j8q94k+8R1612RlzI8yceV2NFuv4VxnxD0iTVLLTXikaJra7DiWMfMpIP6HpXZt1/Cs/Wonl0i4CbBtXeS3oOf6UTTcXYdNpTVzxGazv2vdsl20aKwBfkNz69eKvWNneNq8jfvoWACqlu5UA9yTn+lUbxLuK6uLxbkksw8vbnP+FbukLcW+uw3Cyh45oyZRyfnHrnvz+lcDvY9hRgldEEWiy2fjZdRnnnuGhuYWiQoCWB4LMRjofbmvVmPzfnXO6RFdT6/fXE6xC1gCJbgffLMoLMfboB+Nb+efwrroJ8mp5eIcXP3SLUvEtpZA+WrTN046ZrnLrV7jWrO6tpn8uOaEoUQ9A4IBrMulkuEQKD++mO3Pp0qu9vKlzcMoYEsPKYdgBjB9qHJsSikchPY6gunQRwhvMtwsUqAZwy8ZHsRzXYeHI51tllvT5UUa5aST5eO9LHMI3a4uI2gZFGW2FhIO445yOOaiaCXU/LWZHS3ZshGzhhn+VYOEtjqVSNr3Oi0y8ln0ya+yYWupWa345EQwqE/ULn8ami8QqtwIJwCTn5lFVX86WcBE2wqNsa5HAHFUJo2jZrkIxzIqKfYZyfxOfyraN4qxzTtJ3P/2Q==",
      municipality: "Liberec",
      postalCode: 46010,
      accounts: {
        create: {
          type: "oauth",
          provider: "microsoft-entra-id",
          providerAccountId: "c8e7821e-aa80-4d56-9339-fea29ef3f81d",
        },
      },
    },
  });
  console.log(ste);
  const it = await prisma.tag.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      text: "Informační technologie",
      type: 1,
      background: "#3cab68",
      color: "#ffffff",
    },
  });
  const el = await prisma.tag.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      text: "Elektrotechnika",
      type: 1,
      background: "#e34242",
      color: "#ffffff",
    },
  });
  const st = await prisma.tag.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      text: "Strojírenství",
      type: 1,
      background: "#429fe3",
      color: "#ffffff",
    },
  });
  const ly = await prisma.tag.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      text: "Technické lyceum",
      type: 1,
      background: "#e3a342",
      color: "#ffffff",
    },
  });
  const od = await prisma.tag.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      text: "Oděvnictví",
      type: 1,
      background: "#9c42e3",
      color: "#ffffff",
    },
  });
  const tx = await prisma.tag.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6,
      text: "Textilnictví",
      type: 1,
      background: "#e3428f",
      color: "#ffffff",
    },
  });
  console.log(it, el, st, ly, od, tx);
  const x1 = await prisma.tag.upsert({
    where: { id: 7 },
    update: {},
    create: {
      id: 7,
      text: "IT",
      type: 3,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x2 = await prisma.tag.upsert({
    where: { id: 8 },
    update: {},
    create: {
      id: 8,
      text: "C#",
      type: 2,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x3 = await prisma.tag.upsert({
    where: { id: 9 },
    update: {},
    create: {
      id: 9,
      text: "Typescript",
      type: 2,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x4 = await prisma.tag.upsert({
    where: { id: 10 },
    update: {},
    create: {
      id: 10,
      text: "Angličtina",
      type: 4,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x5 = await prisma.tag.upsert({
    where: { id: 11 },
    update: {},
    create: {
      id: 11,
      text: "Němčina",
      type: 4,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x6 = await prisma.tag.upsert({
    where: { id: 12 },
    update: {},
    create: {
      id: 12,
      text: "React",
      type: 2,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x7 = await prisma.tag.upsert({
    where: { id: 13 },
    update: {},
    create: {
      id: 13,
      text: "PHP",
      type: 2,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x8 = await prisma.tag.upsert({
    where: { id: 13 },
    update: {},
    create: {
      id: 13,
      text: "Webdesign",
      type: 3,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x9 = await prisma.tag.upsert({
    where: { id: 14 },
    update: {},
    create: {
      id: 14,
      text: "Internet věcí",
      type: 3,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x10 = await prisma.tag.upsert({
    where: { id: 15 },
    update: {},
    create: {
      id: 15,
      text: "Python",
      type: 2,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x11 = await prisma.tag.upsert({
    where: { id: 16 },
    update: {},
    create: {
      id: 16,
      text: "Javascript",
      type: 2,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x12 = await prisma.tag.upsert({
    where: { id: 17 },
    update: {},
    create: {
      id: 17,
      text: "Elektrotechnika",
      type: 3,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x13 = await prisma.tag.upsert({
    where: { id: 18 },
    update: {},
    create: {
      id: 18,
      text: "Databáze",
      type: 3,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x14 = await prisma.tag.upsert({
    where: { id: 19 },
    update: {},
    create: {
      id: 18,
      text: "Prodej",
      type: 3,
      background: "#dddddd",
      color: "#333333",
    },
  });
  const x15 = await prisma.tag.upsert({
    where: { id: 20 },
    update: {},
    create: {
      id: 18,
      text: "Marketing",
      type: 3,
      background: "#dddddd",
      color: "#333333",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
