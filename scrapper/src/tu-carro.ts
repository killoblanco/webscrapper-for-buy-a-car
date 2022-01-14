import { Browser, Page } from 'playwright';
import { buildCarObj, cleanDetailsLinks } from './utils';

async function scrapeDetails(page: Page, url: string, list: string[]) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 0  });
  const items = await page.$$('a.ui-search-result__content');
  for (const item of items) {
    const link = await item.getProperty('href');
    const href = await link.jsonValue();
    list.push(href);
  }
  const [nextLink] = await page.$$('ul.ui-search-pagination li:last-of-type a');
  const nextPage = nextLink ? await nextLink.getAttribute('href') : undefined;
  if (nextPage) {
    await scrapeDetails(page, nextPage, list);
  }
}

async function getCarInfo(page: Page, carUrl: string) {
  await page.goto(carUrl, { waitUntil: 'networkidle', timeout: 0  });

  const [price] = await page.$$('.ui-pdp-price__second-line .price-tag-fraction');
  const [model] = await page.$$('h1.ui-pdp-title');
  const [city] = await page.$$('.ui-seller-info__status-info:nth-child(2) p');

  const [
    brand, _, year, color, fuel, cylinderCapacity, transmission, km,
  ] = await page.$$('table td span');

  return buildCarObj({
    brand: brand ? await brand.textContent() : null,
    model: model ? await model.textContent() : null,
    price: price ? (await price.textContent() ?? '') : null,
    km: km ? (await km.textContent() ?? '').replace('km', '') : null,
    year: year ? await year.textContent() : null,
    status: 'usado',
    city: city ? await city.textContent() : null,
    licensePlate: null,
    transmission: transmission ? await transmission.textContent() : null,
    fuel: fuel ? await fuel.textContent() : null,
    cylinderCapacity: cylinderCapacity ? (await cylinderCapacity.textContent() ?? '0') : null,
    color: color ? (await color.textContent() ?? '').toLowerCase() : null,
    link: carUrl,
    site: 'tu-carro',
  });
}

async function tuCarro(browser: Browser) {
  const page = await browser.newPage();
  const baseUrl = 'https://carros.tucarro.com.co';
  const brands = [
    { url: '/nissan/bogota-dc', keywords: ['kicks', 'sentra', 'versa'] },
    { url: '/chevrolet/bogota-dc', keywords: ['onix'] },
    { url: '/toyota/bogota-dc', keywords: ['corolla'] },
  ];

  const validLinks: string[] = [];

  for (const brand of brands) {
    const details: string[] = [];
    await scrapeDetails(page, baseUrl + brand.url, details);
    validLinks.push(...cleanDetailsLinks(details, brand.keywords));
  }

  const carsData = [];

  for (const link of validLinks) {
    const car = await getCarInfo(page, link);
    carsData.push(car);
  }

  return carsData;
}

export default tuCarro;
