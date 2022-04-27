const packageJson = require('../../package.json');

export const environment = {
  production: true,

  apiUrl: 'https://api.pymesbulevar.com/v1/',
  imageUrl: 'https://api.pymesbulevar.com/v1/',

  defaultLanguage: 'es',
  currencyInternational: 'USD',

  timeToResetSession: 14400000, // (4hrs) Time to reset the session (ms)
  timeToResearchProductData: 300000, // (5min) Time to research products (ms)
  timeToResearchLandingPageData: 1800000, // (30min) Time to research landing-page (ms)
  timeToResearchMenuData: 300000, // (30min) Time to research menu (ms)
  timeToResearchCategoriesData: 600000, // (10min) Time to research categories (ms)

  url: 'https://www.pymesbulevar.com',
  urlAboutUs: 'https://www.pymesbulevar.com',

  address: 'Pymes Bulevar',
  localDatabaseUsers: true,

  contacts: {
    phone: '(+53) 7XXX XXXX',
    email: ' notifications@pymesbulevar.com',
    address: 'Calle X, entre D y F. Direccion',
  },

  adminService: 'https://admin.pymesbulevar.com/',
  mainDomain: '.pymesbulevar.com',

  tokenBusiness:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IkJ1c2luZXNzSWQiOjEsImlkIjoxLCJkYXRlIjoiMjAyMi0wMS0zMVQwNDo1NDowMC4wMDBaIiwibmFtZSI6IlRpZW5kYSIsImVtYWlsIjoidGllbmRhQGxvY2FsaG9zdC5jb20ifSwiaWF0IjoxNjQzNjQ2Njg3fQ.-pIQscQih10E1-UbtTlyiV3mj_uaxilPMpvLLN-GzSo',

  meta: {
    mainPage: {
      title: 'Pymes Bulevar',
      description: 'Tienda online desarrollada con el framework Angular permite la modelación de negocios B2C and C2C',
      keywords: 'HTML, CSS, JavaScript, Angular, Tienda Online B2B, comercio online',
      shareImg: 'https://www.pymesbulevar.com/assets/images/share-img.png',
      url: 'https://www.pymesbulevar.com/',
    },
  },

  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    material: packageJson.dependencies['@angular/material'],
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript'],
    tslint: packageJson.devDependencies['tslint'],
  },
};
