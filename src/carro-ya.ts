import { Browser, Page } from 'playwright';
import saveFile from './save-file';

async function getPageLinks(baseUrl: string, searchUrl: string, page: Page) {
  const fullUrl = baseUrl + searchUrl;
  await page.goto(fullUrl, { waitUntil: 'networkidle' });

  const [totalPages] = await page.$$('ul.ant-pagination li:nth-last-child(2) a');
  const totalPagesNumber = await totalPages.textContent() ?? '1';

  return Array.from(Array(+totalPagesNumber).keys()).map(i => `${fullUrl}?page=${i + 1}`);
}

async function getDetailsLinks(page: Page, link: string) {
  const details = [];
  await page.goto(link, { waitUntil: 'networkidle' });
  const items = await page.$$('.contentCurrentCard a:not(#whatsappLink)');

  for (const item of items) {
    const link = await item.getProperty('href');
    const href = await link.jsonValue();
    details.push(href);
  }
  return details;
}

function cleanDetailsLinks(links: string[], keywords: string[]) {
  return links
    .filter(link => keywords.some(keyword => link.includes(keyword)))
    .filter((link, index, array) => array.indexOf(link) === index);
}

async function getCarInfo(page: Page, carUrl: string) {
  const info = {
    brand: '',
    model: '',
    price: 0,
    km: 0,
    year: 0,
    status: '',
    city: '',
    licensePlate: 0,
    transmission: '',
    fuel: '',
    cylinderCapacity: 0,
    color: '',
    link: carUrl,
  };

  await page.goto(carUrl, { waitUntil: 'networkidle' });

  const [brand] = await page.$$('h1.title');
  const [model] = await page.$$('h3.h3P');
  const [price] = await page.$$('h1#priceInfo');
  const [km] = await page.$$('h3.kilometers');
  const [year] = await page.$$('h3.year');

  const [
    status, city, licensePlate, transmission,
    fuel, cylinderCapacity, color,
  ] = await page.$$('h4.description');

  info.brand = await brand.textContent() ?? '';
  info.model = await model.textContent() ?? '';
  info.price = +(await price.textContent() ?? '')
    .replace('$', '')
    .replaceAll('.', '')
    .trim();
  info.km = +(await km.textContent() ?? '')
    .replace('km', '')
    .replaceAll('.', '')
    .trim();
  info.year = +(await year.textContent() ?? '0');
  info.status = await status.textContent() ?? '';
  info.city = await city.textContent() ?? '';
  info.licensePlate = +(await licensePlate.textContent() ?? '0')[2];
  info.transmission = await transmission.textContent() ?? '';
  info.fuel = await fuel.textContent() ?? '';
  info.cylinderCapacity = +(await cylinderCapacity.textContent() ?? '0')
    .replaceAll('.', '')
    .trim();
  info.color = (await color.textContent() ?? '').toLowerCase();

  return info;
}

async function carroYa(browser: Browser) {
  const page = await browser.newPage();
  const baseUrl = 'https://www.carroya.com';
  const brands = [
    {
      url: '/resultados/automoviles-y-camionetas/nissan/bogota',
      keywords: ['kicks', 'sentra', 'versa'],
    },
    {
      url: '/resultados/automoviles-y-camionetas/chevrolet/bogota',
      keywords: ['onix'],
    },
    {
      url: '/resultados/automoviles-y-camionetas/toyota/bogota',
      keywords: ['corolla'],
    },
  ];

  const validLinks: string[] = [];

  for (const brand of brands) {
    const links = await getPageLinks(baseUrl, brand.url, page);
    const carList = [];
    for (const link of links) {
      const details = await getDetailsLinks(page, link);
      carList.push(...details);
    }
    validLinks.push(...cleanDetailsLinks(carList, brand.keywords));
  }

  const carsData = [];

  for (const link of validLinks) {
    const car = await getCarInfo(page, link);
    carsData.push(car);
  }

  await saveFile(carsData);
}

export default carroYa;
