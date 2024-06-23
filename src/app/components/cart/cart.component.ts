import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

/**  
 * Interfaz que define la estructura de un ítem del carrito 
 */
interface CartItem {
  /** ID único del producto */
  id: number;
  /** Nombre del producto */
  nombre: string;
  /** Precio unitario del producto */
  precio: number;
   /** Cantidad del producto en el carrito */
  cantidad: number;
}


/**
 * @description 
 * Componente para manejar la funcionalidad del carrito de compras
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent implements OnInit {
  /** Array que contiene los ítems del carrito */
  cartItems: CartItem[] = [];
  /** Total del carrito */
  total: number = 0;

  /**
   * Constructor del componente
   * @param cartService Servicio para manejar las operaciones del carrito
   */
  constructor(private cartService: CartService) { }

  /** Método de inicialización del componente */
  ngOnInit() {
    this.loadCartItems();
  }

  /** Carga los ítems del carrito desde el servicio */
  loadCartItems() {
    this.cartItems = this.cartService.getCartItems();
    this.updateTotal();
  }

  /**
   * Actualiza la cantidad de un ítem en el carrito
   * @param item El ítem del carrito a actualizar
   */
  updateCartItemQuantity(item: CartItem) {
    this.cartService.updateCartItemQuantity(item.id, item.cantidad);
    this.updateTotal();
  }

  /**
   * Elimina un ítem del carrito
   * @param productId ID del producto a eliminar
   */
  removeCartItem(productId: number) {
    this.cartService.removeCartItem(productId);
    this.loadCartItems();
  }

  /** Actualiza el total del carrito */
  private updateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }
}
