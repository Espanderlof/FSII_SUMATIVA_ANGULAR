import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { JsonService } from './json.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataInitializationService {
  private isBrowser: boolean;

  constructor(
    private jsonService: JsonService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  initializeData() {
    return new Promise<void>((resolve, reject) => {
      forkJoin({
        usuarios: this.jsonService.getJsonUsuariosData(),
        categorias: this.jsonService.getJsonCategoriasData(),
        productos: this.jsonService.getJsonProductosData()
      }).subscribe({
        next: (data: any) => {
          if (this.isBrowser) {
            // if (!localStorage.getItem('usuarios')) {
            //   localStorage.setItem('usuarios', JSON.stringify(data.usuarios));
            // }
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