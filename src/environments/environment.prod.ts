const packageJson = require('../../package.json');

export const environment = {
  production: true,

  apiUrl: 'https://api.tiendascaracol.com/v1/',
  imageUrl: 'https://api.tiendascaracol.com/v1/',

  defaultLanguage: 'es',
  currencyInternational: 'USD',

  timeToResetSession: 14400000, // (4hrs) Time to reset the session (ms)
  timeToResearchProductData: 900000, // (15min) Time to research products (ms)
  timeToResearchLandingPageData: 1200000, // (20min) Time to research products (ms)
  timeToResearchMenuData: 1500000, // (25min) Time to research products (ms)
  timeToResearchCategoriesData: 1500000, // (25min) Time to research categories (ms)

  url: 'https://www.tiendascaracol.com',
  urlAboutUs: 'https://www.tiendascaracol.com',

  address: 'Tiendas Caracol',
  localDatabaseUsers: true,

  contacts: {
    phone: '(+53) 7202 1381',
    email: 'tienda@marinasmarlin.com',
    address: 'Calle 2, esq 7ma, Miramar, Playa',
  },

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
