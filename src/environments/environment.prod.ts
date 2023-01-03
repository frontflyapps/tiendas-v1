const packageJson = require('../../package.json');
export const PASARELA_BASE = 'peoplegoto';
export const environment = {
  production: true,

  apiUrl: 'https://api.pymesbulevar.com/v1/',
  imageUrl: 'https://cdn.lapolimita.com/',

  defaultLanguage: 'es',
  currencyInternational: 'USD',
  logo: 'assets/images/polimita/polimita-logo.png',
  logoWhite: 'assets/images/polimita/polimita-logo.png',
  logoFooter: 'assets/images/polimita/polimita-logo.png',

  limitSearch : 21,


  timeToResetSession: 14400000, // (4hrs) Time to reset the session (ms)
  timeToResearchProductData: 300000, // (5min) Time to research products (ms)
  timeToResearchLandingPageData: 1800000, // (30min) Time to research landing-page (ms)
  timeToResearchMenuData: 300000, // (30min) Time to research menu (ms)
  timeToResearchCategoriesData: 600000, // (10min) Time to research categories (ms)

  url: 'https://lapolimita.com',
  urlAboutUs: 'https://lapolimita.com',

  address: 'La Polimita',
  localDatabaseUsers: true,

  contacts: {
    phone: '23422181 / 59878320',
    email: 'venta@grupobrizg.com',
    address: 'Bayamo, Granma. Cuba',
  },

  adminService: 'https://admin.pymesbulevar.com/',
  mainDomain: '.lapolimita.com',

  tokenBusiness:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IkJ1c2luZXNzSWQiOjUsImlkIjo1LCJkYXRlIjoiMjAyMi0wMy0yNFQwNDo0MDo0Mi44NjdaIiwibmFtZSI6IkJ1c3NpbmVzc0NhcmxvcyIsImVtYWlsIjoiY2FybG9zQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDgwOTY4NDJ9.ERZS6ghCEhAe4JSYSbu7Zi6O_F-5YE_BaHliESjNSe0',

  meta: {
    mainPage: {
      title: 'La Polimita | Tienda Online',
      description: 'Tienda online desarrollada con el framework Angular permite la modelación de negocios B2C and C2C',
      keywords: 'HTML, CSS, JavaScript, Angular, Tienda Online B2B, comercio online',
      shareImg: 'https://www.lapolimita.com/assets/images/share-img.png',
      url: 'https://www.lapolimita.com/',
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
