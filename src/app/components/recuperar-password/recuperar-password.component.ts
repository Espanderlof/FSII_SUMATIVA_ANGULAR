import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.scss']
})
export class RecuperarPasswordComponent implements OnInit {
  emailForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

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

  generarToken() {
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email')?.value;
      const token = this.authService.generarTokenRecuperacion(email);
      if (token) {
        alert(`Tu token de recuperación es: ${token}`);
      } else {
        alert("El correo electrónico ingresado no está registrado.");
      }
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const email = this.emailForm.get('email')?.value;
      const token = this.passwordForm.get('token')?.value;
      const newPassword = this.passwordForm.get('newPassword')?.value;

      if (this.authService.recuperarPassword(email, token, newPassword)) {
        alert("La contraseña ha sido actualizada correctamente.");
        this.router.navigate(['/login']);
      } else {
        alert("El correo electrónico o el token ingresados no son válidos. Por favor, verifica nuevamente.");
      }
    } else {
      Object.values(this.passwordForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}