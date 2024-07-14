import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { JsonService } from '../../services/json.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockJsonService: jasmine.SpyObj<JsonService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['getCartItems', 'updateCartItemQuantity', 'removeCartItem', 'clearCart']);
    mockJsonService = jasmine.createSpyObj('JsonService', ['getJsonPedidosData', 'MetodoPedidos']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUsuarioActual']);

    await TestBed.configureTestingModule({
      imports: [CartComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: JsonService, useValue: mockJsonService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    const initialCartItems = [
      { id: 1, nombre: 'Producto 1', precio: 100, cantidad: 2 },
      { id: 2, nombre: 'Producto 2', precio: 200, cantidad: 1 }
    ];
    mockCartService.getCartItems.and.returnValue(initialCartItems);
    mockJsonService.getJsonPedidosData.and.returnValue(of([]));
    mockAuthService.getUsuarioActual.and.returnValue({ email: 'test@example.com' });

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove cart item and update total', () => {
    const updatedCartItems = [
      { id: 2, nombre: 'Producto 2', precio: 200, cantidad: 1 }
    ];
    mockCartService.getCartItems.and.returnValue(updatedCartItems);

    component.removeCartItem(1);

    expect(mockCartService.removeCartItem).toHaveBeenCalledWith(1);
    expect(mockCartService.getCartItems).toHaveBeenCalled();
    expect(component.total).toBe(200); // Only Producto 2 remains
  });
});