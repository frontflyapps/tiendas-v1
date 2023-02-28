const packageJson = require('../../package.json');
export const PASARELA_BASE = 'peoplegoto';
export const environment = {
  production: true,

  apiUrl: 'https://api.mibulevar.com/v1/',
  imageUrl: 'https://cdn.mibulevar.com/',

  defaultLanguage: 'es',
  currencyInternational: 'USD',

  logo: 'assets/images/logo-navbar.png',
  logoWhite: 'assets/images/logo-navbar.png',
  logoFooter: 'assets/images/logo-navbar.png',

  limitSearch : 42,


  timeToResetSession: 14400000, // (4hrs) Time to reset the session (ms)
  timeToResearchProductData: 300000, // (5min) Time to research products (ms)
  timeToResearchLandingPageData: 1800000, // (30min) Time to research landing-page (ms)
  timeToResearchMenuData: 300000, // (30min) Time to research menu (ms)
  timeToResearchCategoriesData: 600000, // (10min) Time to research categories (ms)

  url: 'https://cupetltu.mibulevar.com',
  urlAboutUs: 'https://cupetltu.mibulevar.com',

  address: 'Cupet Las Tunas | TransferMóvil',
  localDatabaseUsers: true,

  contacts: {
    phone: '(+53) 52879308',
    email: 'pagoelectronico@ecltu.cupet.cu',
    address: 'Carretera Central km4 1/2  San Antonio Las Tunas. Cuba.',
  },

  adminService: 'https://admin.mibulevar.com/',
  mainDomain: '.mibulevar.com',

  tokenBusiness:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IkJ1c2luZXNzSWQiOjY1LCJpZCI6NjUsImRhdGUiOiIyMDIyLTA3LTA0VDE4OjA3OjAwLjM4NloiLCJuYW1lIjoiVGllbmRhIFZpcnR1YWwgQ3VwZXQgbGFzIFR1bmFzIiwiZW1haWwiOiJwYWdvZWxlY3Ryb25pY29AZWNsdHUuY3VwZXQuY3UifSwiaWF0IjoxNjU2OTU4MDIwfQ.N2lmVPgbV_mMaGzksN7e1pkr6rE65Xcg-j6ftWr5obo',

  meta: {
    mainPage: {
      title: 'Cupet Las Tunas | TransferMóvil',
      description: 'Tienda online desarrollada con el framework Angular permite la modelación de negocios B2C and C2C',
      keywords: 'HTML, CSS, JavaScript, Angular, Tienda Online B2B, Sin Cola, comercio online',
      shareImg: 'https://cupetcfg.mibulevar.com/assets/images/share-img.png',
      url: 'https://cupetcfg.mibulevar.com/',
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
