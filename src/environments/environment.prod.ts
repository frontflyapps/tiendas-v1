const packageJson = require('../../package.json');
export const PASARELA_BASE = 'peoplegoto';
export const environment = {
  production: true,

  apiUrl: 'https://api.pymesbulevar.com/v1/',
  imageUrl: 'https://cdntienda.pymesbulevar.com/',

  defaultLanguage: 'es',
  currencyInternational: 'USD',
  logo: 'assets/images/guajiritos-Logo-blanco.png',
  logoWhite: 'assets/images/guajiritos-Logo-blanco.png',
  logoFooter: 'assets/images/guajiritos-Logo-blanco.png',

  limitSearch : 42,


  timeToResetSession: 14400000, // (4hrs) Time to reset the session (ms)
  timeToResearchProductData: 300000, // (5min) Time to research products (ms)
  timeToResearchLandingPageData: 1800000, // (30min) Time to research landing-page (ms)
  timeToResearchMenuData: 300000, // (30min) Time to research menu (ms)
  timeToResearchCategoriesData: 600000, // (10min) Time to research categories (ms)

  url: 'https://tienda.guajiritos.com',
  urlAboutUs: 'https://tienda.guajiritos.com',

  address: 'Tienda GuajiTech DEV',
  localDatabaseUsers: true,

  contacts: {
    phone: '',
    email: '',
    address: '',
  },

  adminService: 'https://admintienda.guajiritos.com/',
  mainDomain: '.tienda.guajiritos.com',

  tokenBusiness:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IkJ1c2luZXNzSWQiOjY2LCJpZCI6NjYsImRhdGUiOiIyMDIzLTAxLTI2VDE3OjI3OjU2LjE1N1oiLCJuYW1lIjoiQkMgU3VtaW5pc3Ryb3MgSW5kdXN0cmlhbGVzIFNSTCIsImVtYWlsIjoiYmNzdW1pbmQyMDIyQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NzQ3NTQwNzZ9.5O9K559cBl_Cxk_Fdl_28V9kC99kf3x0oCbhQ5Dm38g',

  meta: {
    mainPage: {
      title: 'Tienda Guajitech DEV',
      description: 'Tienda online desarrollada con el framework Angular permite la modelación de negocios B2C and C2C',
      keywords: 'HTML, CSS, JavaScript, Angular, Tienda Online B2B, comercio online',
      shareImg: 'https://tienda.guajiritos.com/assets/images/share-img.png',
      url: 'https://tienda.guajiritos.com/',
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
