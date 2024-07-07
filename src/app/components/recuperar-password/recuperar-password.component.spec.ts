import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarPasswordComponent } from './recuperar-password.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { JsonService } from '../../services/json.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('RecuperarPasswordComponent', () => {
  let component: RecuperarPasswordComponent;
  let fixture: ComponentFixture<RecuperarPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['generarTokenRecuperacion', 'recuperarPassword']);

    await TestBed.configureTestingModule({
      imports: [RecuperarPasswordComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: JsonService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPasswordComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});