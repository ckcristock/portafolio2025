// src/app/environments/environment.development.ts
export const environment = {
  production: false,
  reverb: {
    app_key: 'TU_REVERB_APP_KEY', // Reemplaza con la APP_KEY de tu .env de Laravel
    ws_host: 'localhost', // Reemplaza con REVERB_HOST de tu .env de Laravel
    ws_port: 8080, // Reemplaza con REVERB_PORT de tu .env de Laravel
    wss_port: 8080, // Generalmente el mismo que ws_port si usas SSL
    forceTLS: false, // true si REVERB_SCHEME es https en tu .env de Laravel
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
  },
};
