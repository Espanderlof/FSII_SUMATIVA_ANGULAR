import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

/**
 * Configuración principal de la aplicación Angular
 * @description Define los proveedores y configuraciones necesarias para la aplicación
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Proporciona detección de cambios basada en Zone.js con coalescencia de eventos
     * @description Mejora el rendimiento agrupando múltiples cambios en una sola actualización
     */
    provideZoneChangeDetection({ eventCoalescing: true }),
    /**
     * Configura el enrutador de la aplicación
     * @description Utiliza las rutas definidas en app.routes
     */
    provideRouter(routes),
    /**
     * Habilita la hidratación del cliente
     * @description Permite la transición suave del renderizado del lado del servidor al lado del cliente
     */
    provideClientHydration(),
    /**
     * Configura el cliente HTTP para usar Fetch API
     * @description Proporciona una implementación moderna y eficiente para las solicitudes HTTP
     */
    provideHttpClient(withFetch())
  ]
};
