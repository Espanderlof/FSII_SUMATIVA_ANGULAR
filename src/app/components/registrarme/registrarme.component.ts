import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * @description
 * Componente para manejar el registro de nuevos usuarios
 */
@Component({
  selector: 'app-registrarme',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrarme.component.html',
  styleUrls: ['./registrarme.component.scss']
})
export class RegistrarmeComponent implements OnInit {
  /** Formulario de registro de usuario */
  registroForm!: FormGroup;

  /**
   * Constructor del componente
   * @param fb FormBuilder para crear el formulario reactivo
   * @param authService Servicio de autenticación
   * @param router Router para la navegación
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Inicializa el componente y configura el formulario de registro
   */
  ngOnInit() {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      fechaNacimiento: ['', [Validators.required, this.edadMinimaValidator]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,15}$/)]],
      repetirPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   * @param control AbstractControl que contiene los campos de contraseña
   * @returns Objeto con error si las contraseñas no coinciden, null si son iguales
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const repetirPassword = control.get('repetirPassword');

    if (password && repetirPassword && password.value !== repetirPassword.value) {
      repetirPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      repetirPassword?.setErrors(null);
      return null;
    }
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

  /**
   * Maneja el envío del formulario de registro
   */
  onSubmit() {
    if (this.registroForm.valid) {
      const nuevoUsuario = {
        ...this.registroForm.value,
        rol: 'usuario',
        token: ''
      };

      this.authService.registrarUsuario(nuevoUsuario).subscribe(
        (success) => {
          if (success) {
            alert("¡Usuario registrado correctamente!");
            this.router.navigate(['/login']);
          } else {
            alert("El usuario ya está registrado. Por favor, inicia sesión o utiliza otro correo electrónico.");
          }
        },
        (error) => {
          console.error('Error durante el registro:', error);
          alert("Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.");
        }
      );
    } else {
      Object.values(this.registroForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}