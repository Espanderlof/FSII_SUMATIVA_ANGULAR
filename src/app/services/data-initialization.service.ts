import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataInitializationService {
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

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