import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class JsonService {
  private apiUrl = environment.apiUrl;
  /**
   * Opciones de cabecera para las peticiones HTTP a la API de categorias
   */
  httpOptionsCategorias = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 80759020-58e2-44d2-b8b7-c4770cc93d76'
    })
  }
  /**
   * URL de la API de categorias
   */
  private jsonCategoriasUrl = `${this.apiUrl}/v0/b/fsii-sumativa-angular.appspot.com/o/categorias.json?alt=media&token=80759020-58e2-44d2-b8b7-c4770cc93d76`; 

  /**
   * Opciones de cabecera para las peticiones HTTP a la API de productos
   */
  httpOptionsProductos = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer fd5435c0-e522-4ae8-a7eb-e977e471cce7'
    })
  }
  /**
   * URL de la API de productos
   */
  private jsonProductosUrl = `${this.apiUrl}/v0/b/fsii-sumativa-angular.appspot.com/o/productos.json?alt=media&token=fd5435c0-e522-4ae8-a7eb-e977e471cce7`;

  /**
   * Opciones de cabecera para las peticiones HTTP a la API de usuarios
   */
  httpOptionsUsuarios = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer f11c237d-cda1-41f9-924e-02cfbe260069'
    })
  }
  /**
   * URL de la API de usuarios
   */
  private jsonUsuariosUrl = `${this.apiUrl}/v0/b/fsii-sumativa-angular.appspot.com/o/usuarios.json?alt=media&token=f11c237d-cda1-41f9-924e-02cfbe260069`;

  /**
   * Opciones de cabecera para las peticiones HTTP a la API de pedidos
   */
  httpOptionsPedidos = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer f1ea3b95-e90d-46f8-b31f-9e5879b90a31'
    })
  }
  /**
   * URL de la API de pedidos
   */
  private jsonPedidosUrl = `${this.apiUrl}/v0/b/fsii-sumativa-angular.appspot.com/o/pedidos.json?alt=media&token=f1ea3b95-e90d-46f8-b31f-9e5879b90a31`;

  constructor(private http: HttpClient) { }

  /**
   * Trae todas las categorias del archivo JSON
   */
  getJsonCategoriasData(): Observable<any> {
    return this.http.get(this.jsonCategoriasUrl);
  }

  /**
   * Sobrescribe el archivo JSON de categorias con la lista de categorias proporcionada
   */
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

  /**
   * Trae todos los productos del archivo JSON
   */
  getJsonProductosData(): Observable<any> {
    return this.http.get(this.jsonProductosUrl);
  }

  /**
   * Sobrescribe el archivo JSON de productos con la lista de productos proporcionada
   */
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

  /**
   * Trae todos los usuarios del archivo JSON
   */
  getJsonUsuariosData(): Observable<any> {
    return this.http.get(this.jsonUsuariosUrl);
  }

  /**
   * Sobrescribe el archivo JSON de usuarios con la lista de usuarios proporcionada
   */  
  MetodoUsuarios(listaUsuarios: any): Observable<any> {
    return this.http.post(this.jsonUsuariosUrl, listaUsuarios, this.httpOptionsUsuarios);
  }

  /**
 * Sobrescribe el archivo JSON de pedidos
 */
  MetodoPedidos(listaPedidos: any): Observable<any> {
    return this.http.post(this.jsonPedidosUrl, listaPedidos, this.httpOptionsPedidos);
  }

  /**
   * Trae todos los pedidos del archivo JSON
   */
  getJsonPedidosData(): Observable<any> {
    return this.http.get(this.jsonPedidosUrl);
  }
}
