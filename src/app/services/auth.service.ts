import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface Usuario {
  email: string;
  nombre: string;
  celular: string;
  fechaNacimiento: string;
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

  login(email: string, password: string): boolean {
    if (this.isBrowser) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioEncontrado = usuarios.find(
        (usuario: any) => usuario.email === email && usuario.password === password
      );

      if (usuarioEncontrado) {
        const usuarioSinContraseña: Usuario = {
          email: usuarioEncontrado.email,
          nombre: usuarioEncontrado.nombre,
          celular: usuarioEncontrado.celular,
          fechaNacimiento: usuarioEncontrado.fechaNacimiento,
          rol: usuarioEncontrado.rol,
        };

        localStorage.setItem('sesionUsuario', JSON.stringify(usuarioSinContraseña));
        this.usuarioActual.next(usuarioSinContraseña);
        return true;
      }
    }
    return false;
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