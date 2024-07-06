import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { JsonService } from './json.service'; // Asegúrese de que la ruta de importación sea correcta

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  constructor(private jsonService: JsonService) { }

  getData(): Observable<any> {
    return forkJoin({
      categorias: this.jsonService.getJsonCategoriasData(),
      productos: this.jsonService.getJsonProductosData()
    }).pipe(
      map(result => ({
        categorias: result.categorias,
        productos: result.productos
      }))
    );
  }
}