import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ProductosService } from '../../services/productos.service';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockProductosService: jasmine.SpyObj<ProductosService>;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    mockProductosService = jasmine.createSpyObj('ProductosService', ['getData']);
    mockCartService = jasmine.createSpyObj('CartService', ['getCartItemCount', 'addToCart']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ProductosService, useValue: mockProductosService },
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    mockProductosService.getData.and.returnValue(of({
      categorias: [
        { id: 0, nombre: 'Todas' },
        { id: 1, nombre: 'Categoría 1' }
      ],
      productos: [
        { id: 1, nombre: 'Producto 1', categoria: 1 },
        { id: 2, nombre: 'Producto 2', categoria: 1 }
      ]
    }));

    mockCartService.getCartItemCount.and.returnValue(of(0));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', () => {
    expect(mockProductosService.getData).toHaveBeenCalled();
    expect(component.categorias.length).toBe(2);
    expect(component.productos.length).toBe(2);
    expect(component.productosFiltrados.length).toBe(2);
  });

  it('should update selected category and filter products', () => {
    component.updateSelectedCategory(1);
    expect(component.categoriaSeleccionada).toBe(1);
    expect(component.productosFiltrados.length).toBe(2);

    component.updateSelectedCategory(0);
    expect(component.categoriaSeleccionada).toBe(0);
    expect(component.productosFiltrados.length).toBe(2);
  });

  it('should filter products correctly', () => {
    component.productos = [
      { id: 1, nombre: 'Producto 1', categoria: 1 },
      { id: 2, nombre: 'Producto 2', categoria: 2 }
    ];

    component.filterProducts(1);
    expect(component.productosFiltrados.length).toBe(1);
    expect(component.productosFiltrados[0].nombre).toBe('Producto 1');

    component.filterProducts(0);
    expect(component.productosFiltrados.length).toBe(2);
  });

  it('should add product to cart', () => {
    const product = { id: 1, nombre: 'Producto 1', categoria: 1 };
    spyOn(window, 'alert');

    component.addToCart(product);

    expect(mockCartService.addToCart).toHaveBeenCalledWith(product);
    expect(window.alert).toHaveBeenCalledWith('Producto agregado al carrito');
  });

  it('should update cart item count', () => {
    mockCartService.getCartItemCount.and.returnValue(of(3));
    component.ngOnInit();
    expect(component.cartItemCount).toBe(3);
  });
});