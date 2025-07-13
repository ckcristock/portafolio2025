// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes'; // Asumiendo que tus rutas están en app.routes.ts o routes.ts
import { ApiInterceptor } from './interceptors/api.interceptor'; // ¡Importa tu interceptor!

export const appConfig: ApplicationConfig = {
  providers: [
    // Proporciona la detección de cambios de Zone.js
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Proporciona el enrutador de Angular con tus rutas definidas
    provideRouter(routes),

    // Proporciona HttpClient y configura los interceptores
    provideHttpClient(
      withInterceptors([
        ApiInterceptor, // Registra tu ApiInterceptor aquí.
      ])
    ),
  ],
};
