import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/**
 * @description
 * Componente para gestionar usuarios.
 */
@Component({
  selector: 'app-manager-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manager-users.component.html',
  styleUrls: ['./manager-users.component.scss']
})
export class ManagerUsersComponent implements OnInit {
  /** Lista de usuarios */
  usuarios: any[] = [];
  /** Formulario para editar usuarios */
  editForm!: FormGroup;
  /** Usuario actualmente en edición */
  editingUser: any = null;
  /** control visibilidad del modal */
  isModalOpen: boolean = false;

  /**
   * Constructor del componente
   * @param fb FormBuilder para crear el formulario reactivo
   * @param authService Servicio de autenticación
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  /**
   * Inicializa el componente, carga los usuarios y configura el formulario
   */
  ngOnInit() {
    this.loadUsers();
    this.initForm();
  }

  /**
   * Inicializa el formulario de edición
   */
  initForm() {
    this.editForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      fechaNacimiento: ['', [Validators.required, this.edadMinimaValidator]],
      rol: ['', Validators.required]
    });
  }

  /**
   * Carga la lista de usuarios
   */
  loadUsers() {
    this.authService.getUsuarios().subscribe(
      (users) => {
        this.usuarios = users;
      },
      (error) => {
        console.error('Error loading users:', error);
        alert('Error al cargar los usuarios. Por favor, intenta nuevamente.');
      }
    );
  }

  /**
   * Prepara el formulario para editar un usuario
   * @param usuario Usuario a editar
   */
  editUser(usuario: any) {
    this.editingUser = usuario;
    this.editForm.patchValue(usuario);
    this.isModalOpen = true;
  }

  /**
   * Maneja el envío del formulario de edición
   */
  onSubmit() {
    if (this.editForm.valid) {
      const updatedUser = {
        ...this.editingUser,
        ...this.editForm.value
      };
      this.authService.actualizarUsuario(updatedUser).subscribe(
        (success) => {
          if (success) {
            alert('Usuario actualizado correctamente');
            this.loadUsers();
            this.closeModal();
          } else {
            alert('Error al actualizar el usuario. Por favor, intenta nuevamente.');
          }
        },
        (error) => {
          console.error('Error updating user:', error);
          alert('Error al actualizar el usuario. Por favor, intenta nuevamente.');
        }
      );
    } else {
      Object.values(this.editForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  /**
   * Maneja la eliminacion de un usuario
   */
  deleteUser(usuario: any) {
    if (usuario.rol === 'administrador') {
      alert('No se puede eliminar un usuario administrador.');
      return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${usuario.nombre}?`)) {
      this.authService.eliminarUsuario(usuario.email).subscribe(
        (success) => {
          if (success) {
            alert('Usuario eliminado correctamente');
            this.loadUsers();
          } else {
            alert('Error al eliminar el usuario');
          }
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Error al eliminar el usuario');
        }
      );
    }
  }

  /**
   * Cierra el modal de edición
   */
  closeModal() {
    this.isModalOpen = false;
    this.editingUser = null;
    this.editForm.reset();
  }

  /**
   * Validador personalizado para verificar la edad mínima
   * @param control Control del formulario a validar
   * @returns Objeto con error si la edad es menor a 14, null si es válida
   */
  edadMinimaValidator(control: any) {
    const hoy = new Date();
    const fechaNac = new Date(control.value);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad >= 14 ? null : { 'edadMinima': true };
  }
}