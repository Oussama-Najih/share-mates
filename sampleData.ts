import { Role } from "@prisma/client";
import { hashSync } from "bcrypt-ts-edge";

const sampleData = {
  users: [
    {
      name: "Jean Dupont",
      password: hashSync("MotDePasse123!", 10),
      role: "USER" as keyof typeof Role,
    },
    {
      name: "Marie Martin",
      password: hashSync("MotDePasse123!", 10),
      role: "USER" as keyof typeof Role,
    },
    {
      name: "Pierre Durand",
      password: hashSync("MotDePasse123!", 10),
      role: "USER" as keyof typeof Role,
    },
  ],
};

export default sampleData;

export const images = [
  {
    src: "/test/p1-1.jpg",
    alt: "Random image",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Sunset over mountains",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Forest with sunlight",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "City skyline at night",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Snow-covered mountains",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Lake reflecting the sky",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Desert landscape",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Ocean waves crashing",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Path through the forest",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Hot air balloons in the sky",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Aerial view of a city",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Starry night sky",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Beautiful waterfall",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Colorful flowers in a field",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Ancient ruins",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Cozy wooden cabin",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Golden hour at the beach",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Vibrant autumn leaves",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Mountain peak covered in mist",
    width: 250,
    height: 250,
  },
  {
    src: "/test/p1-1.jpg",
    alt: "Serene lake with reflections",
    width: 250,
    height: 250,
  },
];

export const announcements = [
  {
    id: "1",
    title: "New Feature Release",
    createdAt: new Date(),
    image: "/test/p1-1.jpg",
    authorId: "1",
  },
  {
    id: "2",
    title: "Scheduled Maintenance",
    createdAt: new Date(),
    image: "/test/p1-1.jpg",
    authorId: "1",
  },
  {
    id: "3",
    title: "Welcome to Our Platform!",
    createdAt: new Date(),
    image: "/test/p1-1.jpg",
    authorId: "1",
  },
];
