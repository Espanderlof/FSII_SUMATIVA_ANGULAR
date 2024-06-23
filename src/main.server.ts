import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

/**
 * Función de arranque de la aplicación Angular para el entorno de servidor
 * @description Inicializa la aplicación con la configuración específica del servidor
 * @returns Una promesa que se resuelve cuando la aplicación se ha inicializado
 */
const bootstrap = () => bootstrapApplication(AppComponent, config);

/**
 * Exportación por defecto de la función de arranque
 * @description Esta exportación es utilizada por el servidor para iniciar la aplicación Angular
 */
export default bootstrap;
