import { writeFile } from 'fs';

export async function saveFile(data: {}[]) {
  const parsedData = JSON.stringify(data);
  await writeFile(
    `../data/${Date.now()}.json`,
    parsedData,
    (err) => {
      if (err) {
        console.log(err);
      }
    },
  );
}

export function cleanDetailsLinks(links: string[], keywords: string[]) {
  return links
    .filter(link => keywords.some(keyword => link.includes(keyword)))
    .filter((link, index, array) => array.indexOf(link) === index);
}

export function buildCarObj(carData: {
  brand: string | null;
  model: string | null;
  price: string | null;
  km: string | null;
  year: string | null;
  transmission: string | null;
  fuel: string | null;
  cylinderCapacity: string | null;
  color: string | null;
  link: string | null;
}) {
  return carData;
}
