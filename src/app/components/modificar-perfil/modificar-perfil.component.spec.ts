import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarPerfilComponent } from './modificar-perfil.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { JsonService } from '../../services/json.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('ModificarPerfilComponent', () => {
  let component: ModificarPerfilComponent;
  let fixture: ComponentFixture<ModificarPerfilComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getUsuarioActual', 'actualizarPerfil', 'actualizarContraseña']);
    authSpy.getUsuarioActual.and.returnValue({ 
      email: 'test@example.com', 
      nombre: 'Test User', 
      celular: '123456789', 
      fechaNacimiento: '1990-01-01' 
    });

    await TestBed.configureTestingModule({
      imports: [ModificarPerfilComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: JsonService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarPerfilComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms with user data', () => {
    expect(component.perfilForm.get('nombre')?.value).toBe('Test User');
    expect(component.perfilForm.get('celular')?.value).toBe('123456789');
    expect(component.perfilForm.get('fechaNacimiento')?.value).toBe('1990-01-01');
  });

  it('should validate profile form', () => {
    const form = component.perfilForm;
    form.patchValue({
      nombre: '',
      celular: '12345',
      fechaNacimiento: '2020-01-01'
    });
    expect(form.valid).toBeFalsy();

    form.patchValue({
      nombre: 'Valid Name',
      celular: '123456789',
      fechaNacimiento: '1990-01-01'
    });
    expect(form.valid).toBeTruthy();
  });

  it('should validate password form', () => {
    const form = component.passwordForm;
    form.patchValue({
      newPassword: 'weak',
      confirmPassword: 'weak'
    });
    expect(form.valid).toBeFalsy();

    form.patchValue({
      newPassword: 'StrongPass1!',
      confirmPassword: 'StrongPass1!'
    });
    expect(form.valid).toBeTruthy();
  });

  it('should update profile successfully', () => {
    authServiceSpy.actualizarPerfil.and.returnValue(of(true));
    spyOn(window, 'alert');
    
    component.perfilForm.patchValue({
      nombre: 'New Name',
      celular: '987654321',
      fechaNacimiento: '1995-05-05'
    });
    
    component.onSubmitPerfil();
    
    expect(authServiceSpy.actualizarPerfil).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Información personal actualizada correctamente.');
  });

  it('should handle profile update error', () => {
    authServiceSpy.actualizarPerfil.and.returnValue(throwError('Error'));
    spyOn(window, 'alert');
    spyOn(console, 'error');
    
    component.onSubmitPerfil();
    
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al actualizar la información. Por favor, inténtalo de nuevo.');
  });

  it('should update password successfully', () => {
    authServiceSpy.actualizarContraseña.and.returnValue(of(true));
    spyOn(window, 'alert');
    
    component.passwordForm.patchValue({
      newPassword: 'NewStrongPass1!',
      confirmPassword: 'NewStrongPass1!'
    });
    
    component.onSubmitPassword();
    
    expect(authServiceSpy.actualizarContraseña).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Contraseña actualizada correctamente.');
  });

  it('should handle password update error', () => {
    authServiceSpy.actualizarContraseña.and.returnValue(throwError('Error'));
    spyOn(window, 'alert');
    spyOn(console, 'error');
    
    component.passwordForm.patchValue({
      newPassword: 'NewStrongPass1!',
      confirmPassword: 'NewStrongPass1!'
    });
    
    component.onSubmitPassword();
    
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al actualizar la contraseña. Por favor, inténtalo de nuevo.');
  });
});