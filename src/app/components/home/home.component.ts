import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { CartService } from '../../services/cart.service';

/**
 * @description
 * Componente principal para la página de inicio.
 * Muestra productos y categorías, permitiendo filtrar y añadir al carrito.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  /** Lista de categorías de productos */
  categorias: any[] = [];
  /** Lista completa de productos */
  productos: any[] = [];
  /** Lista de productos filtrados según la categoría seleccionada */
  productosFiltrados: any[] = [];
  /** ID de la categoría actualmente seleccionada */
  categoriaSeleccionada: number = 0;
  /** Número de items en el carrito */
  cartItemCount: number = 0;

  /**
   * Constructor del componente
   * @param productosService Servicio para obtener datos de productos
   * @param cartService Servicio para manejar operaciones del carrito
   */
  constructor(
    private productosService: ProductosService,
    private cartService: CartService
  ) { }

  /**
   * Inicializa el componente cargando los datos y suscribiéndose al contador del carrito
   */
  ngOnInit() {
    this.loadData();
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count || 0;
    });
  }

  /**
   * Carga los datos de productos y categorías desde el servicio
   */
  loadData() {
    this.productosService.getData().subscribe({
      next: (data) => {
        if (data && Array.isArray(data.categorias) && Array.isArray(data.productos)) {
          this.categorias = [...data.categorias];
          this.productos = data.productos;
          this.filterProducts(0);
        } else {
          console.error('Data structure is not as expected:', data);
        }
      },
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }

  /**
   * Actualiza la categoría seleccionada y filtra los productos
   * @param categoryId ID de la categoría seleccionada
   */
  updateSelectedCategory(categoryId: number) {
    this.categoriaSeleccionada = categoryId;
    this.filterProducts(categoryId);
  }

  /**
   * Filtra los productos según la categoría seleccionada
   * @param categoryId ID de la categoría para filtrar (0 para mostrar todos)
   */
  filterProducts(categoryId: number) {
    if (categoryId === 0) {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(producto => producto.categoria === categoryId);
    }
  }

  /**
   * Añade un producto al carrito
   * @param product Producto a añadir al carrito
   */
  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert('Producto agregado al carrito');
  }
}
