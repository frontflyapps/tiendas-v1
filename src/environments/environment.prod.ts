const packageJson = require('../../package.json');

export const environment = {
  production: true,

  apiUrl: 'https://api.tiendascaracol.com/v1/',
  imageUrl: 'https://api.tiendascaracol.com/v1/',

  defaultLanguage: 'es',
  currencyInternational: 'USD',

  timeToResetSession: 14400000, // Time to reset the session
  timeToResearchProductData: 600000, // Time to research products (ms)
  timeToResearchLandingPageData: 300000, // Time to research products (ms)

  url: 'https://www.tiendascaracol.com',
  urlAboutUs: 'https://www.tiendascaracol.com',

  address: 'Tiendas Caracol',
  localDatabaseUsers: true,

  adminService: 'https://admin.tiendascaracol.com/',
  mainDomain: '.tiendascaracol.com',

  tokenBusiness: '',

  meta: {
    mainPage: {
      title: 'Tiendas Caracol S.A.',
      description: 'Tienda online desarrollada con el framework Angular permite la modelación de negocios B2C and C2C',
      keywords: 'HTML, CSS, JavaScript, Angular, Tienda Online B2B, Sin Cola, comercio online En Cuba',
      shareImg: 'https://www.tiendascaracol.com/assets/images/share-img.png',
      url: 'https://www.tiendascaracol.com/',
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
