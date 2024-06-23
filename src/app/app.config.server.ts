import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

/**
 * Configuración específica para el servidor de la aplicación Angular
 * @description Define los proveedores necesarios para el renderizado del lado del servidor
 */
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

/**
 * Configuración final de la aplicación para el entorno de servidor
 * @description Combina la configuración base de la aplicación con la configuración específica del servidor
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
