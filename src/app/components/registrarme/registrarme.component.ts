import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrarme',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrarme.component.html',
  styleUrls: ['./registrarme.component.scss']
})
export class RegistrarmeComponent implements OnInit {
  registroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

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

  onSubmit() {
    if (this.registroForm.valid) {
      const nuevoUsuario = {
        ...this.registroForm.value,
        rol: 'usuario',
        token: ''
      };

      if (this.authService.registrarUsuario(nuevoUsuario)) {
        alert("¡Usuario registrado correctamente!");
        this.router.navigate(['/login']);
      } else {
        alert("El usuario ya está registrado. Por favor, inicia sesión o utiliza otro correo electrónico.");
      }
    } else {
      Object.values(this.registroForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}