const packageJson = require('../../package.json');
export const PASARELA_BASE = 'peoplegoto';
export const environment = {
  production: true,

  apiUrl: 'https://api.guajiritos.com/v1/',
  imageUrl: 'https://cdn.guajiritos.com/',

  defaultLanguage: 'es',
  currencyInternational: 'USD',
  logo: 'assets/images/guajiritos/guajiritos-Logo-blanco.png',
  logoWhite: 'assets/images/guajiritos/guajiritos-Logo-blanco.png',
  logoFooter: 'assets/images/guajiritos/guajiritos-Logo-blanco.png',

  timeToResetSession: 14400000, // (4hrs) Time to reset the session (ms)
  timeToResearchProductData: 300000, // (5min) Time to research products (ms)
  timeToResearchLandingPageData: 1800000, // (30min) Time to research landing-page (ms)
  timeToResearchMenuData: 300000, // (30min) Time to research menu (ms)
  timeToResearchCategoriesData: 600000, // (10min) Time to research categories (ms)

  url: 'https://tienda.guajiritos.com',
  urlAboutUs: 'https://tienda.guajiritos.com',

  address: 'Tienda Guajiritos',
  localDatabaseUsers: true,

  contacts: {
    email: 'cto@guajiritos.cu',
    address: 'Zulueta #658, e/ Gloria y Apodaca',
  },

  adminService: 'https://admin.guajiritos.com/',
  mainDomain: '.tienda.guajiritos.com',

  tokenBusiness:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IkJ1c2luZXNzSWQiOjEsImlkIjoxLCJkYXRlIjoiMjAyMS0wOS0xM1QwMTo0NToxOC4wMDBaIiwibmFtZSI6IlRpZW5kYSIsImVtYWlsIjoidGllbmRhQGxvY2FsaG9zdC5jb20ifSwiaWF0IjoxNjMxNDk3NTkxfQ.FF5-276rI9SJmtebVo0spV8Y2wdOZPok7LlUxtTDwh0',

  meta: {
    mainPage: {
      title: 'Tienda Guajiritos',
      description: 'Tienda online desarrollada con el framework Angular permite la modelación de negocios B2C and C2C',
      keywords: 'HTML, CSS, JavaScript, Angular, Tienda Online B2B, Sin Cola, comercio online',
      shareImg: 'https://www.guajiritos.com/assets/icons/icon-384x384.png',
      url: 'https://www.tienda.guajiritos.com/',
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
