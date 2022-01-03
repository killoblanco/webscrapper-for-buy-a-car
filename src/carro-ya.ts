import { Browser, Page } from 'playwright';
import { buildCarObj, cleanDetailsLinks } from './utils';

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

async function getCarInfo(page: Page, carUrl: string) {
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

  return buildCarObj({
    brand: brand ? await brand.textContent() : null,
    model: model ? await model.textContent() : null,
    price: price ? (await price.textContent() ?? '').replace('$', '') : null,
    km: km ? (await km.textContent() ?? '').replace('km', '') : null,
    year: year ? await year.textContent() : null,
    status: status ? await status.textContent() : null,
    city: city ? await city.textContent() : null,
    licensePlate: licensePlate ? (await licensePlate.textContent() ?? '0')[2] : null,
    transmission: transmission ? await transmission.textContent() : null,
    fuel: fuel ? await fuel.textContent() : null,
    cylinderCapacity: cylinderCapacity ? (await cylinderCapacity.textContent() ?? '0') : null,
    color: color ? (await color.textContent() ?? '').toLowerCase() : null,
    link: carUrl,
    site: 'carro-ya',
  });
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

  return carsData;
}

export default carroYa;
