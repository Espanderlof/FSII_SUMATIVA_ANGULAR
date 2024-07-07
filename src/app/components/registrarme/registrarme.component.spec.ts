import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarmeComponent } from './registrarme.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('RegistrarmeComponent', () => {
  let component: RegistrarmeComponent;
  let fixture: ComponentFixture<RegistrarmeComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['registrarUsuario']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegistrarmeComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // La primera prueba, "should allow registration when form is valid", hace lo siguiente:
  // - Rellena el formulario con datos válidos.
  // - Verifica que el formulario sea válido.
  // - Simula una respuesta exitosa del servicio de autenticación.
  // - Llama al método onSubmit().
  // - Verifica que se haya llamado al servicio de registro y a la navegación.

  it('should allow registration when form is valid', () => {
    const form = component.registroForm;
    form.patchValue({
      email: 'test@example.com',
      nombre: 'Test User',
      celular: '123456789',
      fechaNacimiento: '2000-01-01',
      password: 'Test123!',
      repetirPassword: 'Test123!'
    });

    expect(form.valid).toBeTrue();

    authServiceSpy.registrarUsuario.and.returnValue(of(true));
    component.onSubmit();

    expect(authServiceSpy.registrarUsuario).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  // La segunda prueba, "should not allow registration when form is invalid", hace lo siguiente:

  // - Rellena el formulario con algunos datos inválidos.
  // - Verifica que el formulario sea inválido.
  // - Llama al método onSubmit().
  // - Verifica que no se haya llamado al servicio de registro ni a la navegación.
  // - Comprueba que se muestren mensajes de error en el formulario.

  it('should not allow registration when form is invalid', () => {
    const form = component.registroForm;
    form.patchValue({
      email: 'invalid-email',
      nombre: 'Test User',
      celular: '12345', // numero de celular invalido
      fechaNacimiento: '2020-01-01', // usaurio muy joven
      password: 'weakpassword',
      repetirPassword: 'differentpassword'
    });

    expect(form.valid).toBeFalse();

    component.onSubmit();

    expect(authServiceSpy.registrarUsuario).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();

    // Check that error messages are displayed
    fixture.detectChanges();
    const errorMessages = fixture.debugElement.queryAll(By.css('.invalid-feedback'));
    expect(errorMessages.length).toBeGreaterThan(0);
  });
});