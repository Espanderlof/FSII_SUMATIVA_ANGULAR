import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface Usuario {
  email: string;
  nombre: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.cargarSesion();
  }

  cargarSesion() {
    if (this.isBrowser) {
      const sesionUsuario = JSON.parse(localStorage.getItem('sesionUsuario') || 'null');
      this.usuarioActual.next(sesionUsuario);
    }
  }

  getUsuarioActual() {
    return this.usuarioActual.asObservable();
  }

  login(usuario: Usuario) {
    if (this.isBrowser) {
      localStorage.setItem('sesionUsuario', JSON.stringify(usuario));
    }
    this.usuarioActual.next(usuario);
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('sesionUsuario');
    }
    this.usuarioActual.next(null);
  }

  esAdministrador(): boolean {
    return this.usuarioActual.value?.rol === 'administrador';
  }

  registrarUsuario(nuevoUsuario: any): boolean {
    if (this.isBrowser) {
      let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioExistente = usuarios.find((u: any) => u.email === nuevoUsuario.email);
      if (usuarioExistente) {
        return false;
      }
      usuarios.push(nuevoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      return true;
    }
    return false;
  }
}