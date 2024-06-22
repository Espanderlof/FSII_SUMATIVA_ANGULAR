import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  getUsuarioActual(): any {
    if (this.isBrowser) {
      const sesionUsuarioJSON = localStorage.getItem('sesionUsuario');
      return sesionUsuarioJSON ? JSON.parse(sesionUsuarioJSON) : null;
    }
    return null;
  }

  getUsuarioActualObservable(): Observable<Usuario | null> {
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

  generarTokenRecuperacion(email: string): string | null {
    if (this.isBrowser) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuario = usuarios.find((u: any) => u.email === email);
      if (usuario) {
        const token = Math.floor(Math.random() * 900000) + 100000;
        usuario.token = token.toString();
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return token.toString();
      }
    }
    return null;
  }

  recuperarPassword(email: string, token: string, newPassword: string): boolean {
    if (this.isBrowser) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuario = usuarios.find((u: any) => u.email === email && u.token === token);
      if (usuario) {
        usuario.password = newPassword;
        usuario.token = '';
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return true;
      }
    }
    return false;
  }

  actualizarPerfil(datosActualizados: any): boolean {
    if (this.isBrowser) {
      const usuariosJSON = localStorage.getItem('usuarios');
      if (usuariosJSON) {
        let usuarios = JSON.parse(usuariosJSON);
        const sesionUsuario = this.getUsuarioActual();

        if (sesionUsuario) {
          // Actualizar el usuario en el array de usuarios
          usuarios = usuarios.map((usuario: any) => {
            if (usuario.email === sesionUsuario.email) {
              return { ...usuario, ...datosActualizados };
            }
            return usuario;
          });

          // Actualizar el localStorage
          localStorage.setItem('usuarios', JSON.stringify(usuarios));

          // Actualizar la sesión del usuario
          const usuarioActualizado = { ...sesionUsuario, ...datosActualizados };
          localStorage.setItem('sesionUsuario', JSON.stringify(usuarioActualizado));

          return true;
        }
      }
    }
    return false;
  }

  actualizarContraseña(newPassword: string): boolean {
    if (this.isBrowser) {
      const usuariosJSON = localStorage.getItem('usuarios');
      if (usuariosJSON) {
        let usuarios = JSON.parse(usuariosJSON);
        const sesionUsuario = this.getUsuarioActual();

        if (sesionUsuario) {
          // Actualizar la contraseña del usuario en el array de usuarios
          usuarios = usuarios.map((usuario: any) => {
            if (usuario.email === sesionUsuario.email) {
              return { ...usuario, password: newPassword };
            }
            return usuario;
          });

          // Actualizar el localStorage
          localStorage.setItem('usuarios', JSON.stringify(usuarios));

          return true;
        }
      }
    }
    return false;
  }

  getUsuarios(): any[] {
    if (this.isBrowser) {
      const usuariosJSON = localStorage.getItem('usuarios');
      return usuariosJSON ? JSON.parse(usuariosJSON) : [];
    }
    return [];
  }

  actualizarUsuario(usuario: any): boolean {
    if (this.isBrowser) {
      let usuarios = this.getUsuarios();
      const index = usuarios.findIndex(u => u.email === usuario.email);
      if (index !== -1) {
        usuarios[index] = usuario;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return true;
      }
    }
    return false;
  }

}