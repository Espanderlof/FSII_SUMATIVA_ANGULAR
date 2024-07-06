import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  httpOptionsCategorias = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 80759020-58e2-44d2-b8b7-c4770cc93d76'
    })
  }
  private jsonCategoriasUrl = '/api/v0/b/fsii-sumativa-angular.appspot.com/o/categorias.json?alt=media&token=80759020-58e2-44d2-b8b7-c4770cc93d76'; 

  httpOptionsProductos = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer fd5435c0-e522-4ae8-a7eb-e977e471cce7'
    })
  }
  private jsonProductosUrl = '/api/v0/b/fsii-sumativa-angular.appspot.com/o/productos.json?alt=media&token=fd5435c0-e522-4ae8-a7eb-e977e471cce7';

  httpOptionsUsuarios = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer f11c237d-cda1-41f9-924e-02cfbe260069'
    })
  }
  private jsonUsuariosUrl = '/api/v0/b/fsii-sumativa-angular.appspot.com/o/usuarios.json?alt=media&token=f11c237d-cda1-41f9-924e-02cfbe260069';

  constructor(private http: HttpClient) { }

  getJsonCategoriasData(): Observable<any> {
    return this.http.get(this.jsonCategoriasUrl);
  }
  MetodoCategorias(listaCategorias:any) {
    console.log(listaCategorias);
    this.http.post(this.jsonCategoriasUrl, listaCategorias, this.httpOptionsCategorias).subscribe(
      response => {
        console.log('Archivo JSON sobrescrito con exito', response);
      },
      error => {
        console.error('Error al sobrescribir el archivo JSON', error);
      })
  }

  getJsonProductosData(): Observable<any> {
    return this.http.get(this.jsonProductosUrl);
  }
  MetodoProductos(listaProductos:any) {
    console.log(listaProductos);
    this.http.post(this.jsonProductosUrl, listaProductos, this.httpOptionsProductos).subscribe(
      response => {
        console.log('Archivo JSON sobrescrito con exito', response);
      },
      error => {
        console.error('Error al sobrescribir el archivo JSON', error);
      })
  }

  getJsonUsuariosData(): Observable<any> {
    return this.http.get(this.jsonUsuariosUrl);
  }
  MetodoUsuarios(listaUsuarios: any): Observable<any> {
    return this.http.post(this.jsonUsuariosUrl, listaUsuarios, this.httpOptionsUsuarios);
  }
}
