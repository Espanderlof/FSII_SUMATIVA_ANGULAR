import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PedidosComponent } from './pedidos.component';
import { JsonService } from '../../services/json.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('PedidosComponent', () => {
  let component: PedidosComponent;
  let fixture: ComponentFixture<PedidosComponent>;
  let mockJsonService: jasmine.SpyObj<JsonService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockJsonService = jasmine.createSpyObj('JsonService', ['getJsonPedidosData']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUsuarioActual']);

    await TestBed.configureTestingModule({
      imports: [PedidosComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: JsonService, useValue: mockJsonService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    mockJsonService.getJsonPedidosData.and.returnValue(of([]));
    mockAuthService.getUsuarioActual.and.returnValue({ email: 'test@example.com' });

    fixture = TestBed.createComponent(PedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});