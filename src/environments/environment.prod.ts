const packageJson = require('../../package.json');

export const environment = {
  production: true,

  apiUrl: 'https://apitienda.marinasmarlin.com/v1/',
  imageUrl: 'https://apitienda.marinasmarlin.com/v1/',

  defaultLanguage: 'es',
  currencyInternational: 'USD',

  url: 'https://tienda.marinasmarlin.com',
  urlAboutUs: 'https://tienda.marinasmarlin.com',

  address: 'Tiendas Marinas Marlin',
  localDatabaseUsers: true,

  adminService: 'https://admintienda.marinasmarlin.com/',
  mainDomain: '.marinasmarlin.com',

  tokenBusiness: '',

  meta: {
    mainPage: {
      title: 'Tiendas Marinas Marlin',
      description: 'Tienda online desarrollada con el framework Angular permite la modelación de negocios B2C and C2C',
      keywords: 'HTML, CSS, JavaScript, Angular, Tienda Online B2B, Sin Cola, comercio online En Cuba',
      shareImg: 'https://tienda.marinasmarlin.com/assets/images/share-img.png',
      url: 'https://tienda.marinasmarlin.com/',
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
