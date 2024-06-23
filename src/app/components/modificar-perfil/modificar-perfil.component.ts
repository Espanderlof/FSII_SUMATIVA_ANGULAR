import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/**
 * @description
 * Componente para modificar el perfil del usuario y cambiar la contraseña
 */
@Component({
  selector: 'app-modificar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modificar-perfil.component.html',
  styleUrls: ['./modificar-perfil.component.scss']
})
export class ModificarPerfilComponent implements OnInit {
  /** Formulario para modificar datos del perfil */
  perfilForm!: FormGroup;
  /** Formulario para cambiar la contraseña */
  passwordForm!: FormGroup;
  /** Datos del usuario actual */
  usuarioActual: any;

  /**
   * Constructor del componente
   * @param fb FormBuilder para crear los formularios reactivos
   * @param authService Servicio de autenticación
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  /**
   * Inicializa el componente, carga los datos del usuario y configura los formularios
   */
  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();

    this.perfilForm = this.fb.group({
      nombre: [this.usuarioActual?.nombre || '', Validators.required],
      celular: [this.usuarioActual?.celular || '', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      fechaNacimiento: [this.usuarioActual?.fechaNacimiento || '', [Validators.required, this.edadMinimaValidator]]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,15}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validador personalizado para verificar la edad mínima
   * @param control Control del formulario a validar
   * @returns Objeto con error si la edad es menor a 14, null si es válida
   */
  edadMinimaValidator(control: AbstractControl): ValidationErrors | null {
    const hoy = new Date();
    const fechaNac = new Date(control.value);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad >= 14 ? null : { 'edadMinima': true };
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   * @param g FormGroup que contiene los campos de contraseña
   * @returns Objeto con error si las contraseñas no coinciden, null si son iguales
   */
  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  /**
   * Maneja el envío del formulario de perfil
   */
  onSubmitPerfil() {
    if (this.perfilForm.valid) {
      const datosActualizados = this.perfilForm.value;
      if (this.authService.actualizarPerfil(datosActualizados)) {
        alert("Información personal actualizada correctamente.");
      } else {
        alert("Hubo un error al actualizar la información.");
      }
    }
  }

  /**
   * Maneja el envío del formulario de cambio de contraseña
   */
  onSubmitPassword() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('newPassword')?.value;
      if (this.authService.actualizarContraseña(newPassword)) {
        alert("Contraseña actualizada correctamente.");
        this.passwordForm.reset();
      } else {
        alert("Hubo un error al actualizar la contraseña.");
      }
    }
  }
}