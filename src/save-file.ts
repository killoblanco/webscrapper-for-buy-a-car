import { writeFile } from 'fs';

async function saveFile(data: {}[]) {
  const parsedData = JSON.stringify(data);
  await writeFile(
    `./data/${Date.now()}.json`,
    parsedData,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

export default saveFile;
