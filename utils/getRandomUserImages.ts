import { Spider } from "@/db/database";

export const getRandomUserImages = (spiders: Spider[]) => {
  const userImages = spiders
    .map((spider) => spider.imageUri)
    .filter((uri): uri is string => !!uri);

  const shuffled = shuffleArray(userImages);
  const selected = shuffled.slice(0, 3);

  return selected.map((uri) => ({ uri }));
};

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
