import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

/**
 * @description
 * Servicio para inicializar datos de la aplicación desde un archivo JSON
 */
@Injectable({
  providedIn: 'root'
})
export class DataInitializationService {
  /** Indica si el código se está ejecutando en un navegador */
  private isBrowser: boolean;

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones
   * @param platformId ID de la plataforma para determinar si es un navegador
   */
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Inicializa los datos de la aplicación
   * @returns Una promesa que se resuelve cuando los datos se han inicializado
   */
  initializeData() {
    return new Promise<void>((resolve, reject) => {
      this.http.get('assets/db/albavetsDB.json').subscribe({
        next: (data: any) => {
          if (this.isBrowser) {
            if (!localStorage.getItem('usuarios')) {
              localStorage.setItem('usuarios', JSON.stringify(data.usuarios));
            }
            if (!localStorage.getItem('categorias')) {
              localStorage.setItem('categorias', JSON.stringify(data.categorias));
            }
            if (!localStorage.getItem('productos')) {
              localStorage.setItem('productos', JSON.stringify(data.productos));
            }
          }
          resolve();
        },
        error: (err) => {
          console.error('Error initializing data', err);
          reject(err);
        }
      });
    });
  }
}