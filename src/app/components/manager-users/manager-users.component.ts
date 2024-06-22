import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-manager-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manager-users.component.html',
  styleUrls: ['./manager-users.component.scss']
})
export class ManagerUsersComponent implements OnInit {
  usuarios: any[] = [];
  editForm!: FormGroup;
  editingUser: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.initForm();
  }

  initForm() {
    this.editForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      fechaNacimiento: ['', [Validators.required, this.edadMinimaValidator]],
      rol: ['', Validators.required]
    });
  }

  loadUsers() {
    this.usuarios = this.authService.getUsuarios();
  }

  editUser(usuario: any) {
    this.editingUser = usuario;
    this.editForm.patchValue(usuario);
  }

  onSubmit() {
    if (this.editForm.valid) {
      const updatedUser = {
        ...this.editingUser,
        ...this.editForm.value
      };
      if (this.authService.actualizarUsuario(updatedUser)) {
        alert('Usuario actualizado correctamente');
        this.loadUsers();
        this.closeModal();
      } else {
        alert('Error al actualizar el usuario');
      }
    } else {
      Object.values(this.editForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  closeModal() {
    this.editingUser = null;
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
}