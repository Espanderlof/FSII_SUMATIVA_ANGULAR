import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-modificar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modificar-perfil.component.html',
  styleUrls: ['./modificar-perfil.component.scss']
})
export class ModificarPerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  passwordForm!: FormGroup;
  usuarioActual: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

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

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

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