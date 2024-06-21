import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  categorias: any[] = [];
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categoriaSeleccionada: number = 0;
  cartItemCount: number = 0;

  constructor(
    private productosService: ProductosService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.loadData();
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count || 0;
    });
  }

  loadData() {
    this.productosService.getData().subscribe(data => {
      this.categorias = [...data.categorias];
      this.productos = data.productos;
      this.filterProducts(0);
    });
  }

  updateSelectedCategory(categoryId: number) {
    this.categoriaSeleccionada = categoryId;
    this.filterProducts(categoryId);
  }

  filterProducts(categoryId: number) {
    if (categoryId === 0) {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(producto => producto.categoria === categoryId);
    }
  }
  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert('Producto agregado al carrito');
  }
}
