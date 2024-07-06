import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * @description
 * Componente para manejar el proceso de recuperación de contraseña
 */
@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.scss']
})
export class RecuperarPasswordComponent implements OnInit {
  /** Formulario para ingresar el correo electrónico */
  emailForm!: FormGroup;
  /** Formulario para ingresar el token y la nueva contraseña */
  passwordForm!: FormGroup;

  /**
   * Constructor del componente
   * @param fb FormBuilder para crear los formularios reactivos
   * @param authService Servicio de autenticación
   * @param router Router para la navegación
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Inicializa el componente y configura los formularios
   */
  ngOnInit() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      token: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,15}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   * @param control AbstractControl que contiene los campos de contraseña
   * @returns Objeto con error si las contraseñas no coinciden, null si son iguales
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      confirmPassword?.setErrors(null);
      return null;
    }
  }
  /**
   * Genera y envía un token de recuperación al correo electrónico proporcionado
   */
  generarToken() {
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email')?.value;
      this.authService.generarTokenRecuperacion(email).subscribe(
        (token) => {
          if (token) {
            alert(`Tu token de recuperación es: ${token}`);
          } else {
            alert("El correo electrónico ingresado no está registrado.");
          }
        },
        (error) => {
          console.error('Error al generar el token:', error);
          alert("Ocurrió un error al generar el token. Por favor, inténtalo de nuevo.");
        }
      );
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  /**
   * Maneja el envío del formulario de recuperación de contraseña
   */
  onSubmit() {
    if (this.passwordForm.valid) {
      const email = this.emailForm.get('email')?.value;
      const token = this.passwordForm.get('token')?.value;
      const newPassword = this.passwordForm.get('newPassword')?.value;

      this.authService.recuperarPassword(email, token, newPassword).subscribe(
        (success) => {
          if (success) {
            alert("La contraseña ha sido actualizada correctamente.");
            this.router.navigate(['/login']);
          } else {
            alert("El correo electrónico o el token ingresados no son válidos. Por favor, verifica nuevamente.");
          }
        },
        (error) => {
          console.error('Error al recuperar la contraseña:', error);
          alert("Ocurrió un error al actualizar la contraseña. Por favor, inténtalo de nuevo.");
        }
      );
    } else {
      Object.values(this.passwordForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}