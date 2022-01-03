import { chromium } from 'playwright';
import carroYa from './carro-ya';

async function searchCar() {
  console.log('Job started');
  const browser = await chromium.launch({
    headless: false,
    timeout: 0,
  });

  console.log('Browser lauched');
  await carroYa(browser);

  // await browser.close();
  // console.log('Browser closed');
  // // await sendEmail(stocks);
  // console.log('Job finished.');
}

searchCar();

// (async () => {
//   await searchCar();
//   setInterval(async () => {
//     await searchCar();
//   }, 1000 * 60 * 60);
// })();
