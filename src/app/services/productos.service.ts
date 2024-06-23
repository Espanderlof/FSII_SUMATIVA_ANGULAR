import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @description
 * Servicio para manejar las operaciones relacionadas con los productos
 */
@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los datos de productos desde un archivo JSON
   * @returns Observable con los datos de productos, categorías y usuarios
   */
  getData(): Observable<any> {
    return this.http.get('/assets/db/albavetsDB.json');
  }
}
