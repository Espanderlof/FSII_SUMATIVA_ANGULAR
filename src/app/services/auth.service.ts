import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

/**
 * Interfaz que define la estructura de un usuario
 */
interface Usuario {
  /** Email del usuario */
  email: string;
  /** Nombre del usuario */
  nombre: string;
  /** Celular del usuario */
  celular: string;
  /** Fecha de nacimiento del usuario */
  fechaNacimiento: string;
  /** Rol del usuario */
  rol: string;
}

/**
 * @description
 * Servicio para manejar la autenticación y gestión de usuarios
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** BehaviorSubject para manejar el usuario actual */
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);
  /** Indica si el código se está ejecutando en un navegador */
  private isBrowser: boolean;

  /**
   * Constructor del servicio
   * @param platformId ID de la plataforma para determinar si es un navegador
   */
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.cargarSesion();
  }

  /**
   * Carga la sesión del usuario desde el almacenamiento local
   */
  cargarSesion() {
    if (this.isBrowser) {
      const sesionUsuario = JSON.parse(localStorage.getItem('sesionUsuario') || 'null');
      this.usuarioActual.next(sesionUsuario);
    }
  }

  /**
   * Obtiene el usuario actual
   * @returns El usuario actual o null si no hay sesión
   */
  getUsuarioActual(): any {
    if (this.isBrowser) {
      const sesionUsuarioJSON = localStorage.getItem('sesionUsuario');
      return sesionUsuarioJSON ? JSON.parse(sesionUsuarioJSON) : null;
    }
    return null;
  }

  /**
   * Obtiene un Observable del usuario actual
   * @returns Observable del usuario actual
   */
  getUsuarioActualObservable(): Observable<Usuario | null> {
    return this.usuarioActual.asObservable();
  }

  /**
   * Realiza el inicio de sesión de un usuario
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns true si el login es exitoso, false en caso contrario
   */
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

  /**
   * Cierra la sesión del usuario actual
   */
  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('sesionUsuario');
    }
    this.usuarioActual.next(null);
  }

  /**
   * Verifica si el usuario actual es administrador
   * @returns true si el usuario es administrador, false en caso contrario
   */
  esAdministrador(): boolean {
    return this.usuarioActual.value?.rol === 'administrador';
  }


  /**
   * Registra un nuevo usuario
   * @param nuevoUsuario Datos del nuevo usuario
   * @returns true si el registro es exitoso, false si el usuario ya existe
   */
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

  /**
   * Genera un token de recuperación para un email dado
   * @param email Email del usuario
   * @returns El token generado o null si el email no existe
   */
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

  /**
   * Recupera la contraseña de un usuario
   * @param email Email del usuario
   * @param token Token de recuperación
   * @param newPassword Nueva contraseña
   * @returns true si la recuperación es exitosa, false en caso contrario
   */
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

  /**
   * Actualiza el perfil del usuario actual
   * @param datosActualizados Nuevos datos del perfil
   * @returns true si la actualización es exitosa, false en caso contrario
   */
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

  /**
   * Actualiza la contraseña del usuario actual
   * @param newPassword Nueva contraseña
   * @returns true si la actualización es exitosa, false en caso contrario
   */
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

  /**
   * Obtiene la lista de todos los usuarios
   * @returns Array de usuarios
   */
  getUsuarios(): any[] {
    if (this.isBrowser) {
      const usuariosJSON = localStorage.getItem('usuarios');
      return usuariosJSON ? JSON.parse(usuariosJSON) : [];
    }
    return [];
  }

  /**
   * Actualiza los datos de un usuario
   * @param usuario Datos actualizados del usuario
   * @returns true si la actualización es exitosa, false en caso contrario
   */
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