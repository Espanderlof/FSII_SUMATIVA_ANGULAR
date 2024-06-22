import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemCount = new BehaviorSubject<number>(0);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.updateCartItemCount();
    }
  }

  getCartItems(): CartItem[] {
    if (this.isBrowser) {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    }
    return [];
  }  

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

  removeCartItem(productId: number) {
    if (this.isBrowser) {
      let cart = this.getCartItems();
      cart = cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.updateCartItemCount();
    }
  }

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

  private updateCartItemCount() {
    if (this.isBrowser) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total: number, item: any) => total + item.cantidad, 0);
      this.cartItemCount.next(count);
    }
  }

  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }
}
