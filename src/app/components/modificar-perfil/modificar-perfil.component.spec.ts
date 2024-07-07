import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarPerfilComponent } from './modificar-perfil.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { JsonService } from '../../services/json.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('ModificarPerfilComponent', () => {
  let component: ModificarPerfilComponent;
  let fixture: ComponentFixture<ModificarPerfilComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getUsuarioActual', 'actualizarPerfil']);
    authSpy.getUsuarioActual.and.returnValue({ email: 'test@example.com', nombre: 'Test User' });

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

});