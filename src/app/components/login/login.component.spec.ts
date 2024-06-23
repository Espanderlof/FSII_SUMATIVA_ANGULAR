import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

/** Componente mock para las rutas */
@Component({selector: 'app-mock', template: ''})
class MockComponent {}

/** @description Suite de pruebas para LoginComponent */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  /** Configuración antes de cada prueba */
  beforeEach(async () => {
    /** Crea un spy para AuthService */
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    /** Configura el módulo de pruebas */
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

    /** Obtiene una instancia del Router y espía su método navigate */
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    /** Crea el componente y detecta los cambios */
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Prueba: Debería crear el componente */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description Prueba: Debería iniciar sesión correctamente con credenciales válidas
   * @usageNotes 
   * Esta prueba verifica el flujo completo de inicio de sesión exitoso
   * 
   * 1. Rellena el formulario con credenciales válidas.
   * 2. Verifica que el formulario sea válido.
   * 3. Simula una respuesta exitosa del servicio de autenticación.
   * 4. Llama al método onSubmit().
   * 5. Verifica que se haya llamado al servicio de login con las credenciales correctas.
   * 6. Comprueba que se haya llamado a la navegación hacia la ruta principal ('/').
  */
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

  /**
   * @description Prueba: No debería iniciar sesión con una contraseña incorrecta
   * @usageNotes 
   * Esta prueba verifica el manejo de credenciales inválidas
   * 
   * 1. Rellena el formulario con un email correcto pero una contraseña incorrecta.
   * 2. Verifica que el formulario sea válido.
   * 3. Simula una respuesta fallida del servicio de autenticación.
   * 4. Espía la función alert del navegador.
   * 5. Llama al método onSubmit().
   * 6. Verifica que se haya llamado al servicio de login con las credenciales proporcionadas.
   * 7. Comprueba que no se haya llamado a la navegación.
   * 8. Verifica que se haya mostrado el mensaje de alerta correcto.
  */
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