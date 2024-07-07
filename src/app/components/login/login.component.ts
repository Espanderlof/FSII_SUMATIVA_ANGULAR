import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * @description
 * Componente para manejar el inicio de sesión de usuarios.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /** Formulario de inicio de sesión */
  loginForm!: FormGroup;

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
   * Inicializa el componente y configura el formulario de inicio de sesión
   */
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * Maneja el envío del formulario de inicio de sesión
   */
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe(
        (success) => {
          if (success) {
            alert("¡Inicio de sesión exitoso!");
            this.router.navigate(['/']);
          } else {
            alert("Correo electrónico o contraseña incorrectos. Por favor, intenta nuevamente.");
          }
        },
        (error) => {
          console.error('Error durante el inicio de sesión:', error);
          alert("Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.");
        }
      );
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}