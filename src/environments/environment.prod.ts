const packageJson = require('../../package.json');

export const environment = {
  production: true,

  apiUrl: 'https://api.mibulevar.com/v1/',
  imageUrl: 'https://api.mibulevar.com/v1/',

  defaultLanguage: 'es',
  currencyInternational: 'USD',

  timeToResetSession: 14400000, // (4hrs) Time to reset the session (ms)
  timeToResearchProductData: 300000, // (5min) Time to research products (ms)
  timeToResearchLandingPageData: 1800000, // (30min) Time to research landing-page (ms)
  timeToResearchMenuData: 300000, // (30min) Time to research menu (ms)
  timeToResearchCategoriesData: 600000, // (10min) Time to research categories (ms)

  url: 'https://www.mibulevar.com',
  urlAboutUs: 'https://www.mibulevar.com',

  address: 'MiBulevar | Transfermóvil',
  localDatabaseUsers: true,

  contacts: {
    phone: '(+53) 7000 0000',
    email: 'info@transfermovil.com',
    address: 'Miramar Trade Center, Edificio Beijing, Miramar, Playa',
  },

  adminService: 'https://admin.mibulevar.com/',
  mainDomain: '.mibulevar.com',

  tokenBusiness:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IkJ1c2luZXNzSWQiOjEsImlkIjoxLCJkYXRlIjoiMjAyMS0wOS0xM1QwMTo0NToxOC4wMDBaIiwibmFtZSI6IlRpZW5kYSIsImVtYWlsIjoidGllbmRhQGxvY2FsaG9zdC5jb20ifSwiaWF0IjoxNjMxNDk3NTkxfQ.FF5-276rI9SJmtebVo0spV8Y2wdOZPok7LlUxtTDwh0',

  meta: {
    mainPage: {
      title: 'MiBulevar | Transfermóvil',
      description: 'Tienda online desarrollada con el framework Angular permite la modelación de negocios B2C and C2C',
      keywords: 'HTML, CSS, JavaScript, Angular, Tienda Online B2B, Sin Cola, comercio online',
      shareImg: 'https://www.mibulevar.com/assets/images/share-img.png',
      url: 'https://www.mibulevar.com/',
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
