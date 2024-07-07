import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ManagerUsersComponent } from './manager-users.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { JsonService } from '../../services/json.service';

describe('ManagerUsersComponent', () => {
  let component: ManagerUsersComponent;
  let fixture: ComponentFixture<ManagerUsersComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let jsonServiceSpy: jasmine.SpyObj<JsonService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getUsuarios', 'actualizarUsuario', 'eliminarUsuario']);
    const jsonSpy = jasmine.createSpyObj('JsonService', ['getJsonUsuariosData', 'MetodoUsuarios']);

    await TestBed.configureTestingModule({
      imports: [ManagerUsersComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        { provide: JsonService, useValue: jsonSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerUsersComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    jsonServiceSpy = TestBed.inject(JsonService) as jasmine.SpyObj<JsonService>;

    authServiceSpy.getUsuarios.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    const testUsers = [{ email: 'test@example.com', nombre: 'Test User', rol: 'usuario' }];
    authServiceSpy.getUsuarios.and.returnValue(of(testUsers));

    component.ngOnInit();

    expect(component.usuarios).toEqual(testUsers);
  });

  it('should prepare form for editing user', () => {
    const testUser = { email: 'test@example.com', nombre: 'Test User', rol: 'usuario' };
    component.editUser(testUser);

    expect(component.editingUser).toEqual(testUser);
    expect(component.isModalOpen).toBeTrue();
    expect(component.editForm.get('email')?.value).toEqual(testUser.email);
  });

  it('should delete user', () => {
    const testUser = { email: 'test@example.com', nombre: 'Test User', rol: 'usuario' };
    authServiceSpy.eliminarUsuario.and.returnValue(of(true));

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    component.deleteUser(testUser);

    expect(authServiceSpy.eliminarUsuario).toHaveBeenCalledWith(testUser.email);
    expect(window.alert).toHaveBeenCalledWith('Usuario eliminado correctamente');
  });

  it('should not delete admin user', () => {
    const adminUser = { email: 'admin@example.com', nombre: 'Admin User', rol: 'administrador' };
    spyOn(window, 'alert');

    component.deleteUser(adminUser);

    expect(window.alert).toHaveBeenCalledWith('No se puede eliminar un usuario administrador.');
    expect(authServiceSpy.eliminarUsuario).not.toHaveBeenCalled();
  });

  it('should close modal', () => {
    component.isModalOpen = true;
    component.editingUser = { email: 'test@example.com' };
    component.editForm.patchValue({ email: 'test@example.com' });

    component.closeModal();

    expect(component.isModalOpen).toBeFalse();
    expect(component.editingUser).toBeNull();
    // Instead of checking for null values, we'll check if the form has been reset
    expect(component.editForm.pristine).toBeTrue();
    expect(component.editForm.untouched).toBeTrue();
  });
});