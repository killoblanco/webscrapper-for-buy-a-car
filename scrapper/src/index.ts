import { chromium } from 'playwright';
import autocosmos from './autocosmos';
import carroYa from './carro-ya';
import tuCarro from './tu-carro';
import { saveFile } from './utils';

async function searchCar() {
  const startTime = performance.now();
  console.log('Job started');
  const browser = await chromium.launch({
    headless: false,
    timeout: 0,
  });

  const scrappedData = [];

  console.log('Browser lauched');
  scrappedData.push(...(await carroYa(browser)));
  scrappedData.push(...(await tuCarro(browser)));
  scrappedData.push(...(await autocosmos(browser)));

  await browser.close();
  console.log('Browser closed');
  await saveFile(scrappedData);
  console.log('Job finished.');
  const endTime = performance.now();
  console.log(`Execution time: ${((endTime - startTime) / 1000 / 60).toFixed(2)} minutes`);
}

(async () => {
  await searchCar();
  // setInterval(async () => {
  //   await searchCar();
  // }, 1000 * 60 * 60);
})();
