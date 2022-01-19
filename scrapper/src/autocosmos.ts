import { Browser, Page } from 'playwright';
import { buildCarObj, cleanDetailsLinks } from './utils';

async function scrapeDetails(page: Page, url: string, list: string[]) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 0  });
  const items = await page.$$('.listing-card > a');
  for (const item of items) {
    const link = await item.getProperty('href');
    const href = await link.jsonValue();
    list.push(href);
  }
  const [nextLink] = await page.$$('.pagenav a.pagenav.m-next');
  const nextPage = nextLink
    ? await (await nextLink.getProperty('href')).jsonValue()
    : undefined;
  if (nextPage) {
    await scrapeDetails(page, nextPage, list);
  }
}


async function getCarInfo(page: Page, carUrl: string) {
  await page.goto(carUrl, { waitUntil: 'networkidle', timeout: 0  });

  const [sold] = await page.$$('.car-specifics__no-form');

  if (!sold) {
    const [brand] = await page.$$('span.car-specifics__model');
    const [model] = await page.$$('span.car-specifics__version');
    const [price] = await page.$$('strong[itemprop=price]');
    const [km] = await page.$$('.car-specifics__extra-info p span[itemprop=mileageFromOdometer]');
    const [year] = await page.$$('.car-specifics__extra-info span[itemprop=modelDate]');
    // const [city] = await page.$$('strong[itemprop=addressLocality]');

    const [engine, _1, performance] = await page.$$('table.ficha');

    const [_2, transmission] = await performance.$$('tr > td:nth-of-type(2)');
    const [fuel, cylinderCapacity] = await engine.$$('tr > td:nth-of-type(2)');

    return buildCarObj({
      brand: brand ? await brand.textContent() : null,
      model: model ? await model.textContent() : null,
      price: price ? (await price.textContent() ?? '').replace('$', '') : null,
      km: km ? (await km.textContent() ?? '').replace('km', '') : null,
      year: year ? await year.textContent() : null,
      transmission: transmission ? await transmission.textContent() : null,
      fuel: fuel ? await fuel.textContent() : null,
      cylinderCapacity: cylinderCapacity ? (await cylinderCapacity.textContent() ?? '0') : null,
      color: null,
      link: carUrl,
    });
  } else {
    return {};
  }
}

async function autocosmos(browser: Browser) {
  const page = await browser.newPage();
  const baseUrl = 'https://www.autocosmos.com.co/auto/listado';
  const brands = [
    { url: '/nissan?pr=375', keywords: ['kicks'] },
    // { url: '/nissan?pr=375', keywords: ['kicks', 'sentra', 'versa'] },
    // { url: '/chevrolet?pr=375', keywords: ['onix'] },
    // { url: '/toyota?pr=375', keywords: ['corolla'] },
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

export default autocosmos;
