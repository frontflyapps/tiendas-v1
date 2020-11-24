// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://192.168.1.14:8998/v1/',
  // imageUrl: 'http://192.168.1.14:8998/v1/',
  apiUrl: 'https://api.sinkoola.com/v1/',
  imageUrl: 'https://api.sinkoola.com/v1/',
  apiUrlRepositoy: 'http://192.168.1.14:8998/v1/',
  defaultLanguage: 'es',
  version: '1.2.0',
  url: 'http://localhost:4200',
  urlAboutUs: 'http://localhost:4200',
  address: 'Sin Cola SA / Quinta Avenida,18204, Playa, La Habana.',
  localDatabaseUsers: true,
  uploadDigitalProduct: false,
  uploadServicesProduct: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
