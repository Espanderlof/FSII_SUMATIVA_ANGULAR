import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

/**
 * Interfaz que define la estructura de un ítem del carrito
 */
interface CartItem {
  /** ID del producto */
  id: number;
  /** Nombre del producto */
  nombre: string;
  /** Precio del producto */
  precio: number;
  /** Cantidad de producto */
  cantidad: number;
}

/**
 * @description
 * Servicio para manejar las operaciones del carrito de compras
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  /** BehaviorSubject para manejar el contador de ítems en el carrito */
  private cartItemCount = new BehaviorSubject<number>(0);
  /** Indica si el código se está ejecutando en un navegador */
  private isBrowser: boolean;

  /**
   * Constructor del servicio
   * @param platformId ID de la plataforma para determinar si es un navegador
   */
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.updateCartItemCount();
    }
  }

  /**
   * Obtiene los ítems del carrito
   * @returns Array de ítems del carrito
   */
  getCartItems(): CartItem[] {
    if (this.isBrowser) {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    }
    return [];
  }  

  /**
   * Actualiza la cantidad de un ítem en el carrito
   * @param productId ID del producto a actualizar
   * @param quantity Nueva cantidad
   */
  updateCartItemQuantity(productId: number, quantity: number) {
    if (this.isBrowser) {
      let cart = this.getCartItems();
      const item = cart.find(item => item.id === productId);
      if (item) {
        item.cantidad = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartItemCount();
      }
    }
  }

 /**
   * Elimina un ítem del carrito
   * @param productId ID del producto a eliminar
   */
  removeCartItem(productId: number) {
    if (this.isBrowser) {
      let cart = this.getCartItems();
      cart = cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.updateCartItemCount();
    }
  }

  /**
   * Añade un producto al carrito
   * @param product Producto a añadir
   */
  addToCart(product: any) {
    if (this.isBrowser) {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');

      const existingProduct = cart.find((item: any) => item.id === product.id);

      if (existingProduct) {
        existingProduct.cantidad++;
      } else {
        cart.push({ ...product, cantidad: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      this.updateCartItemCount();
    }
  }

  /**
   * Actualiza el contador de ítems en el carrito
   * @private
   */
  private updateCartItemCount() {
    if (this.isBrowser) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total: number, item: any) => total + item.cantidad, 0);
      this.cartItemCount.next(count);
    }
  }

  /**
   * Obtiene un Observable del contador de ítems en el carrito
   * @returns Observable del contador de ítems
   */
  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }

  clearCart() {
    if (this.isBrowser) {
      localStorage.removeItem('cart');
      this.cartItemCount.next(0);
    }
  }
}
