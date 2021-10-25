const packageJson = require('../../package.json');

export const environment = {
  production: true,

  apiUrl: 'https://api.mibulevar.com/v1/',
  imageUrl: 'https://api.mibulevar.com/v1/',

  defaultLanguage: 'es',
  currencyInternational: 'USD',

  timeToResetSession: 14400000, // Time to reset the session
  timeToResearchProductData: 600000, // Time to research products (ms)
  timeToResearchLandingPageData: 300000, // Time to research products (ms)
  timeToResearchMenuData: 900000, // Time to research products (ms)
  timeToResearchCategoriesData: 1200000, // Time to research categories (ms)

  url: 'https://www.mibulevar.com',
  urlAboutUs: 'https://www.mibulevar.com',

  address: 'MiBulevar | TransferMóvil',
  localDatabaseUsers: true,

  contacts: {
    phone: '(+53) 7202 1381',
    email: 'tienda@marinasmarlin.com',
    address: 'Calle 2, esq 7ma, Miramar, Playa',
  },

  adminService: 'https://admin.mibulevar.com/',
  mainDomain: '.mibulevar.com',

  tokenBusiness: '',

  meta: {
    mainPage: {
      title: 'MiBulevar | TransferMóvil',
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
