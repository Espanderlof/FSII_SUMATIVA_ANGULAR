import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { JsonService } from './json.service';
import { map, catchError, switchMap } from 'rxjs/operators';

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
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private jsonService: JsonService
  ) {
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
  // getUsuarioActual(): any {
  //   if (this.isBrowser) {
  //     const sesionUsuarioJSON = localStorage.getItem('sesionUsuario');
  //     return sesionUsuarioJSON ? JSON.parse(sesionUsuarioJSON) : null;
  //   }
  //   return null;
  // }
  getUsuarioActual(): any {
    return this.usuarioActual.value;
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
  login(email: string, password: string): Observable<boolean> {
    return this.jsonService.getJsonUsuariosData().pipe(
      map(usuarios => {
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
          if (this.isBrowser) {
            localStorage.setItem('sesionUsuario', JSON.stringify(usuarioSinContraseña));
          }
          this.usuarioActual.next(usuarioSinContraseña);
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error during login:', error);
        return of(false);
      })
    );
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
  registrarUsuario(nuevoUsuario: any): Observable<boolean> {
    console.log('Iniciando registro de usuario:', nuevoUsuario);
    return this.jsonService.getJsonUsuariosData().pipe(
      switchMap(usuarios => {
        console.log('Usuarios obtenidos:', usuarios);
        const usuarioExistente = usuarios.find((u: any) => u.email === nuevoUsuario.email);
        if (usuarioExistente) {
          console.log('Usuario ya existe:', nuevoUsuario.email);
          return of(false);
        }
        console.log('Añadiendo nuevo usuario a la lista');
        usuarios.push(nuevoUsuario);
        return this.jsonService.MetodoUsuarios(usuarios).pipe(
          map(() => {
            console.log('Usuario registrado exitosamente');
            return true;
          }),
          catchError(error => {
            console.error('Error al guardar usuario en Firebase:', error);
            return of(false);
          })
        );
      }),
      catchError(error => {
        console.error('Error al obtener usuarios:', error);
        return of(false);
      })
    );
  }

  /**
   * Genera un token de recuperación para un email dado
   * @param email Email del usuario
   * @returns El token generado o null si el email no existe
   */
  generarTokenRecuperacion(email: string): Observable<string | null> {
    return this.jsonService.getJsonUsuariosData().pipe(
      map(usuarios => {
        const usuario = usuarios.find((u: any) => u.email === email);
        if (usuario) {
          const token = Math.floor(Math.random() * 900000) + 100000;
          usuario.token = token.toString();
          this.jsonService.MetodoUsuarios(usuarios);
          return token.toString();
        }
        return null;
      }),
      catchError(error => {
        console.error('Error generating recovery token:', error);
        return of(null);
      })
    );
  }

  /**
   * Recupera la contraseña de un usuario
   * @param email Email del usuario
   * @param token Token de recuperación
   * @param newPassword Nueva contraseña
   * @returns true si la recuperación es exitosa, false en caso contrario
   */
  recuperarPassword(email: string, token: string, newPassword: string): Observable<boolean> {
    return this.jsonService.getJsonUsuariosData().pipe(
      map(usuarios => {
        const usuario = usuarios.find((u: any) => u.email === email && u.token === token);
        if (usuario) {
          usuario.password = newPassword;
          usuario.token = '';
          this.jsonService.MetodoUsuarios(usuarios);
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error recovering password:', error);
        return of(false);
      })
    );
  }

  /**
   * Actualiza el perfil del usuario actual
   * @param datosActualizados Nuevos datos del perfil
   * @returns true si la actualización es exitosa, false en caso contrario
   */
  actualizarPerfil(datosActualizados: any): Observable<boolean> {
    return this.jsonService.getJsonUsuariosData().pipe(
      map(usuarios => {
        const sesionUsuario = this.getUsuarioActual();
        if (sesionUsuario) {
          const usuarioIndex = usuarios.findIndex((u: any) => u.email === sesionUsuario.email);
          if (usuarioIndex !== -1) {
            usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], ...datosActualizados };
            const usuarioActualizado = { ...sesionUsuario, ...datosActualizados };
            if (this.isBrowser) {
              localStorage.setItem('sesionUsuario', JSON.stringify(usuarioActualizado));
            }
            this.usuarioActual.next(usuarioActualizado);
            this.jsonService.MetodoUsuarios(usuarios);
            return true;
          }
        }
        return false;
      }),
      catchError(error => {
        console.error('Error updating profile:', error);
        return of(false);
      })
    );
  }

  /**
   * Actualiza la contraseña del usuario actual
   * @param newPassword Nueva contraseña
   * @returns true si la actualización es exitosa, false en caso contrario
   */
  actualizarContraseña(newPassword: string): Observable<boolean> {
    return this.jsonService.getJsonUsuariosData().pipe(
      map(usuarios => {
        const sesionUsuario = this.getUsuarioActual();
        if (sesionUsuario) {
          const usuarioIndex = usuarios.findIndex((u: any) => u.email === sesionUsuario.email);
          if (usuarioIndex !== -1) {
            usuarios[usuarioIndex].password = newPassword;
            this.jsonService.MetodoUsuarios(usuarios);
            return true;
          }
        }
        return false;
      }),
      catchError(error => {
        console.error('Error updating password:', error);
        return of(false);
      })
    );
  }

  /**
   * Obtiene la lista de todos los usuarios
   * @returns Array de usuarios
   */
  getUsuarios(): Observable<any[]> {
    return this.jsonService.getJsonUsuariosData();
  }

  /**
   * Actualiza los datos de un usuario
   * @param usuario Datos actualizados del usuario
   * @returns true si la actualización es exitosa, false en caso contrario
   */
  actualizarUsuario(usuario: any): Observable<boolean> {
    return this.jsonService.getJsonUsuariosData().pipe(
      map(usuarios => {
        const index = usuarios.findIndex((u: any) => u.email === usuario.email);
        if (index !== -1) {
          usuarios[index] = usuario;
          this.jsonService.MetodoUsuarios(usuarios);
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        return of(false);
      })
    );
  }

}