import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

// Componente mock para las rutas
@Component({selector: 'app-mock', template: ''})
class MockComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, 
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: '', component: MockComponent },
          { path: 'registrarme', component: MockComponent },
          { path: 'recuperar-password', component: MockComponent }
        ])
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // "should login successfully with correct credentials":

  // Rellena el formulario con credenciales válidas.
  // Verifica que el formulario sea válido.
  // Simula una respuesta exitosa del servicio de autenticación.
  // Llama al método onSubmit().
  // Verifica que se haya llamado al servicio de login con las credenciales correctas.
  // Comprueba que se haya llamado a la navegación hacia la ruta principal ('/').

  it('should login successfully with correct credentials', () => {
    const form = component.loginForm;
    form.setValue({
      email: 'test@example.com',
      password: 'correctPassword'
    });

    expect(form.valid).toBeTrue();

    authServiceSpy.login.and.returnValue(true);
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'correctPassword');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  // "should not login with incorrect password":

  // Rellena el formulario con un email correcto pero una contraseña incorrecta.
  // Verifica que el formulario sea válido.
  // Simula una respuesta fallida del servicio de autenticación.
  // Espía la función alert del navegador.
  // Llama al método onSubmit().
  // Verifica que se haya llamado al servicio de login con las credenciales proporcionadas.
  // Comprueba que no se haya llamado a la navegación.
  // Verifica que se haya mostrado el mensaje de alerta correcto.

  it('should not login with incorrect password', () => {
    const form = component.loginForm;
    form.setValue({
      email: 'test@example.com',
      password: 'incorrectPassword'
    });

    expect(form.valid).toBeTrue();

    authServiceSpy.login.and.returnValue(false);
    
    spyOn(window, 'alert');
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'incorrectPassword');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Correo electrónico o contraseña incorrectos. Por favor, intenta nuevamente.');
  });
});