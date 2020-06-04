// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  marker: {
    airstrip_image: '../../assets/airstrip.png',
    waypoint_image: '../../assets/waypoint.jpg'
  },
  api_keys: {
    openweathermap: '669d6d341ee2ac57f0fe2b2218038297'
  },
  firebase: {
    apiKey: 'AIzaSyAiYFmYvJzvxK3DPzvwvI2CuUEChRFC5O4',
    authDomain: 'wingman-e1de4.firebaseapp.com',
    databaseURL: 'https://wingman-e1de4.firebaseio.com',
    projectId: 'wingman-e1de4',
    storageBucket: 'wingman-e1de4.appspot.com',
    messagingSenderId: '880336818009',
    appId: '1:880336818009:web:b89f08b1123018094b4648',
    measurementId: 'G-91LWD5EJ2F'
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
