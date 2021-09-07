// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const packageJson = require('../../package.json');

export const environment = {
  production: false,

  apiUrl: 'http://192.168.1.12:8998/v1/',
  imageUrl: 'http://192.168.1.12:8998/v1/',
  //
  // apiUrl: 'https://apitienda.marinasmarlin.com/v1/',
  // imageUrl: 'https://apitienda.marinasmarlin.com/v1/',

  defaultLanguage: 'es',
  currencyInternational: 'USD',
  timeToResetSession: 14400000, // Time to reset the session (ms)

  url: 'http://tienda.tiendalocal.com:4308',
  urlAboutUs: 'http://tienda.tiendalocal.com:4308',

  address: 'Tiendas Marinas Marlin',
  localDatabaseUsers: true,

  adminService: 'http://admintienda.marinasmarlin.com/',
  mainDomain: 'tiendalocal.com',

  tokenBusiness: '',

  meta: {
    mainPage: {
      title: 'Tiendas Marinas Marlin',
      description: 'Tienda online desarrollada con el framework Angular permite la modelación de negocios B2C and C2C',
      keywords: 'HTML, CSS, JavaScript, Angular, Tienda Online B2B, comercio online',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

/**
 * Esto es la tienda Online B2b De Jose Alejandro Concepcion
 */
